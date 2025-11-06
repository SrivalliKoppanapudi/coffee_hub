package com.javabite.code.coffeehub.controllers;


import com.javabite.code.coffeehub.service.PaymentService;
import com.javabite.code.coffeehub.entity.FoodOrder;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;



@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final com.javabite.code.coffeehub.repo.FoodOrderRepository orderRepository;


    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping
    public Map<String, Object> makePayment(@RequestBody Map<String, Object> request) {
        Long orderId = Long.valueOf(request.get("orderId").toString());
        String method = "STRIPE";

        FoodOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        var payment = paymentService.createPaymentForOrder(order, method);

        return Map.of(
                "status", payment.getStatus(),
                "clientSecret", payment.getClientSecret(),
                "paymentId", payment.getId(),
                "amount", payment.getAmount()
        );
    }
}
