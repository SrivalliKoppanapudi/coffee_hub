package com.javabite.code.coffeehub.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderDetailDto(
        Long orderId,
        String placedBy,
        LocalDateTime placedAt,
        String status,
        BigDecimal totalAmount,
        String notes,
        List<OrderItemResponse> items
) {}
