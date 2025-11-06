package com.javabite.code.coffeehub.service;

import com.javabite.code.coffeehub.dto.OrderDetailDto;
import com.javabite.code.coffeehub.dto.OrderItemResponse;
import com.javabite.code.coffeehub.entity.FoodOrder;
import com.javabite.code.coffeehub.entity.OrderItem;
import com.javabite.code.coffeehub.repo.FoodOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.javabite.code.coffeehub.enums.OrderStatus; // enum
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChefOrderService {

    private final FoodOrderRepository orderRepository;

    /**
     * Fetch order details by ID
     */
    public OrderDetailDto getOrderDetails(Long orderId) {
        FoodOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        return mapToDto(order);
    }

    /**
     * Fetch recent orders (you can adjust criteria, e.g., by date or status)
     */
    public List<OrderDetailDto> listRecentOrders() {
        List<FoodOrder> orders = orderRepository.findAll(); // Or add custom query for "recent"

        return orders.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Convert FoodOrder entity → OrderDetailDto
     */
    private OrderDetailDto mapToDto(FoodOrder order) {
        List<OrderItemResponse> itemDtos = order.getItems().stream()
                .map(this::mapToItemDto)
                .collect(Collectors.toList());

        return new OrderDetailDto(
                order.getId(),
                order.getPlacedBy(),
                order.getPlacedAt(),
                order.getStatus().name(),
                order.getTotalAmount(),
                order.getNotes(),
                itemDtos
        );
    }

    private OrderItemResponse mapToItemDto(OrderItem item) {
        return new OrderItemResponse(
                item.getMenuItem().getName(),
                item.getQuantity(),
                item.getMenuItem().getCurrentPrice(),
                item.getPrice(),
                item.getSpecialRequest()
        );
    }

    public void updateOrderStatus(Long orderId, String status) {
        FoodOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        OrderStatus newStatus = OrderStatus.valueOf(status.toUpperCase());
        order.setStatus(newStatus);
        orderRepository.save(order);
    }
}
