package com.javabite.code.coffeehub.service;

import com.javabite.code.coffeehub.dto.OrderDetailDto;
import com.javabite.code.coffeehub.dto.OrderItemResponse;
import com.javabite.code.coffeehub.dto.OrderResponse;
import com.javabite.code.coffeehub.entity.*;
import com.javabite.code.coffeehub.enums.OrderStatus;
import com.javabite.code.coffeehub.repo.*;
import com.stripe.model.PaymentIntent;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final FoodOrderRepository orderRepository;
    private final com.javabite.code.coffeehub.repository.OrderItemRepository orderItemRepository;
    private final MenuItemRepository menuItemRepository;
    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepo;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final ModelMapper modelMapper;

    public FoodOrder placeOrder(String bookingId,
                                String placedBy,
                                List<OrderItem> items,
                                String notes,
                                Long userId) {

        Booking booking = null;

        // Case 1: bookingId explicitly provided
        if (bookingId != null) {
            booking = bookingRepository.findById(Long.valueOf(bookingId))
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
        }
        // Case 2: no bookingId, but userId provided → fetch customer booking
        else if (userId != null) {
            // find customer from userId
            Customer customer = customerRepo.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Customer not found for user"));

            // fetch latest booking for this customer
            booking = bookingRepository.findTopByCustomerIdOrderByBookingDatetimeDesc(customer.getId())
                    .orElse(null); // optional – may be null if no booking
        }

        // Case 3: takeaway/online order → booking stays null

        FoodOrder order = FoodOrder.builder()
                .booking(booking) // can be null for takeaway
                .placedBy(placedBy)
                .notes(notes)
                .status(OrderStatus.PENDING)
                .placedAt(LocalDateTime.now()) // ✅ ensure saved
                .build();

        BigDecimal total = BigDecimal.ZERO;
        for (OrderItem item : items) {
            MenuItem menuItem = menuItemRepository.findById(item.getMenuItem().getId())
                    .orElseThrow(() -> new RuntimeException("Menu item not found"));

            item.setOrder(order);
            item.setMenuItem(menuItem);
            item.setSpecialRequest(item.getSpecialRequest());

            item.setPrice(menuItem.getCurrentPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            total = total.add(item.getPrice());
        }

        order.setTotalAmount(total);
        order = orderRepository.save(order);
        orderItemRepository.saveAll(items);

        return order;
    }


    public FoodOrder updateOrderStatus(Long orderId, OrderStatus status) {
        FoodOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public List<FoodOrder> getOrdersForBooking(Long bookingId) {
        return orderRepository.findByBookingId(bookingId);
    }

    public OrderResponse getOrderDtoById(Long orderId) {
        FoodOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        List<OrderItemResponse> items = order.getItems().stream()
                .map(i -> new OrderItemResponse(
                        i.getMenuItem().getName(),
                        i.getQuantity(),
                        i.getMenuItem().getCurrentPrice(),
                        i.getPrice(),
                        i.getSpecialRequest()
                ))
                .collect(Collectors.toList());

        return new OrderResponse(
                order.getId(),
                order.getTotalAmount(),
                order.getPlacedBy(),
                order.getStatus().name(),
                items
        );
    }


    @Transactional
    public FoodOrder confirmOrder(Long orderId, String paymentIntentId) {
        try {
            // 1. Verify PaymentIntent from Stripe
            PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId);
            if (!"succeeded".equals(intent.getStatus())) {
                throw new RuntimeException("Payment not successful");
            }

            // 2. Update order status
            FoodOrder order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));
            order.setPaymentId(paymentIntentId);
            order.setStatus(OrderStatus.IN_PREPARATION); // after payment
            orderRepository.save(order);

            // 3. Update payment transaction
            PaymentTransaction tx = paymentTransactionRepository
                    .findByProviderPaymentId(paymentIntentId)
                    .orElseThrow(() -> new RuntimeException("Payment transaction not found"));
            tx.setStatus("SUCCESS");
            paymentTransactionRepository.save(tx);

            return order;
        } catch (Exception e) {
            throw new RuntimeException("Order confirmation failed: " + e.getMessage());
        }
    }


    public List<OrderDetailDto> getOrdersForCustomer(Long customerId) {
        return orderRepository.findByBooking_CustomerId(customerId)
                .stream()
                .map(order -> {
                    // Map each OrderItem to OrderItemResponse
                    List<OrderItemResponse> itemDtos = order.getItems().stream()
                            .map(item -> {
                                OrderItemResponse itemDto = new OrderItemResponse();
                                itemDto.setMenuItemName(item.getMenuItem().getName());
                                itemDto.setQuantity(item.getQuantity());
                                itemDto.setUnitPrice(item.getPrice());
                                itemDto.setTotalPrice(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
                                itemDto.setSpecialRequest(item.getSpecialRequest());
                                return itemDto;
                            })
                            .collect(Collectors.toList());

                    // Map FoodOrder to OrderDetailDto (still a record, so use constructor)
                    return new OrderDetailDto(
                            order.getId(),
                            order.getPlacedBy(),
                            order.getPlacedAt(),
                            order.getStatus().name(),
                            order.getTotalAmount(),
                            order.getNotes(),
                            itemDtos
                    );
                })
                .collect(Collectors.toList());
    }




}
