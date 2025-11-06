package com.javabite.code.coffeehub.dto;


import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class OrderItemRequest {
    private Long menuItemId;
    private Integer quantity;
    private String specialRequest;
}