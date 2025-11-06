
package com.javabite.code.coffeehub.dto;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Data
@Getter
@Setter
public class CreateOrderRequest {
    private String bookingId;
    private String placedBy;
    private List<OrderItemRequest> items;
    private boolean payNow;
    private String paymentMethod; // STRIPE, RAZORPAY, CASH
    private String notes;

}