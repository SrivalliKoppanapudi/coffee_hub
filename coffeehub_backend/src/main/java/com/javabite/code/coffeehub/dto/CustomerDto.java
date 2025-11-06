package com.javabite.code.coffeehub.dto;
import lombok.Data;
@Data
public class CustomerDto {
    private Long userId;
    private String firstName;
    private String lastName;
    private String contactNumber;
    private String email;
    private String address;
    private Integer loyaltyPoints;
    private Integer preferredTable;
    private String userName;
}
