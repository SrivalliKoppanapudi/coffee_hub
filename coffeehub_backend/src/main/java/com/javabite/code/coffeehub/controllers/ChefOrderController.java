package com.javabite.code.coffeehub.controllers;

import com.javabite.code.coffeehub.dto.OrderDetailDto;
import com.javabite.code.coffeehub.service.ChefOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chef/orders")
@RequiredArgsConstructor
public class ChefOrderController {
    private final ChefOrderService chefOrderService;


    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDetailDto> getOrder(@PathVariable Long orderId) {
        OrderDetailDto dto = chefOrderService.getOrderDetails(orderId);
        return ResponseEntity.ok(dto);
    }


    @GetMapping("/")
    public ResponseEntity<List<OrderDetailDto>> listOrders() {
        List<OrderDetailDto> dtos = chefOrderService.listRecentOrders();
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<String> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status // PENDING, IN_PREPARATION, SERVED, CANCELLED
    ) {
        chefOrderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok("Order status updated successfully");
    }

}
