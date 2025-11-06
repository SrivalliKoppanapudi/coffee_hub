package com.javabite.code.coffeehub.controllers;

import com.javabite.code.coffeehub.dto.CreateOrderRequest;
import com.javabite.code.coffeehub.dto.OrderDetailDto;
import com.javabite.code.coffeehub.dto.OrderResponse;
import com.javabite.code.coffeehub.dto.Revenue;
import com.javabite.code.coffeehub.entity.Customer;
import com.javabite.code.coffeehub.entity.FoodOrder;
import com.javabite.code.coffeehub.entity.MenuItem;
import com.javabite.code.coffeehub.entity.OrderItem;
import com.javabite.code.coffeehub.enums.OrderStatus;
import com.javabite.code.coffeehub.repo.CustomerRepository;
import com.javabite.code.coffeehub.repo.FoodOrderRepository;
import com.javabite.code.coffeehub.repo.OrderRepository;
import com.javabite.code.coffeehub.service.OrderService;
import com.javabite.code.coffeehub.repo.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final MenuItemRepository menuItemRepository;
    private final FoodOrderRepository orderRepository;
    private final CustomerRepository customerRepository;

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/place")
    public FoodOrder placeOrder(@RequestBody CreateOrderRequest request,
                                @RequestParam(required = false) Long userId) {

        // Convert DTO items into OrderItem entities
        List<OrderItem> orderItems = request.getItems().stream().map(i -> {
            MenuItem menuItem = menuItemRepository.findById(i.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("MenuItem not found: " + i.getMenuItemId()));
            OrderItem oi = new OrderItem();
            oi.setMenuItem(menuItem);
            oi.setQuantity(i.getQuantity());
            oi.setSpecialRequest(i.getSpecialRequest());
            return oi;
        }).toList();

        // delegate to service
        return orderService.placeOrder(
                request.getBookingId(),    // may be null
                request.getPlacedBy(),
                orderItems,
                request.getNotes(),        // allow notes from request
                userId
        );
    }


    @PreAuthorize("hasAnyRole('WAITER','CHEF')")
    @PutMapping("/{orderId}/status")
    public FoodOrder updateOrderStatus(@PathVariable Long orderId, @RequestParam String status) {
        return orderService.updateOrderStatus(orderId, Enum.valueOf(com.javabite.code.coffeehub.enums.OrderStatus.class, status));
    }


    //get orders related to the booked table
    @GetMapping("/booking/{bookingId}")
    public List<FoodOrder> getOrdersForBooking(@PathVariable Long bookingId) {
        return orderService.getOrdersForBooking(bookingId);
    }



    @GetMapping("/{orderId}")
    public OrderResponse getOrderById(@PathVariable Long orderId) {
        return orderService.getOrderDtoById(orderId);
    }




//
//
//    @PreAuthorize("hasRole('CUSTOMER')")
//    @PostMapping("/{orderId}/markPaid")
//    public ResponseEntity<?> markOrderPaid(
//            @PathVariable Long orderId,
//            @RequestBody String paymentIntentId
//    ) {
//        return orderRepository.findById(orderId)
//                .map(order -> {
//                    order.setPaymentId(paymentIntentId);
//                    order.setStatus(OrderStatus.IN_PREPARATION); // after payment
//                    orderRepository.save(order);
//                    return ResponseEntity.ok("✅ Order marked as paid");
//                })
//                .orElse(ResponseEntity.badRequest().body("⚠️ Order not found"));
//    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<OrderDetailDto> getMyOrders(Authentication authentication) {
        String email = authentication.getName(); // logged-in user's email

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Long customerId = customer.getId();

        return orderService.getOrdersForCustomer(customerId);
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/revenue")
    public ResponseEntity<List<Revenue>> getRevenueData(
            @RequestParam(defaultValue = "DAILY") String period) {
        List<FoodOrder> orders = orderRepository.findAll();

        Map<String, BigDecimal> revenueMap = new TreeMap<>();

        for (FoodOrder order : orders) {
            if (order.getPlacedAt() == null) {
                continue; // skip orders without placedAt
            }

            String key;
            if ("MONTHLY".equalsIgnoreCase(period)) {
                key = order.getPlacedAt().toLocalDate().getYear() + "-" + order.getPlacedAt().toLocalDate().getMonthValue();
            } else {
                key = order.getPlacedAt().toLocalDate().toString();
            }

            BigDecimal current = revenueMap.getOrDefault(key, BigDecimal.ZERO);
            revenueMap.put(key, current.add(order.getTotalAmount()));
        }


        List<Revenue> revenueData = revenueMap.entrySet().stream()
                .map(e -> new Revenue(e.getKey(), e.getValue().doubleValue()))
                .toList();

        return ResponseEntity.ok(revenueData);
    }



}
