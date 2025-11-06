package com.javabite.code.coffeehub.dto;
import lombok.Data;
@Data
public class TableDto {
    private Integer tableNumber;
    private Integer seatingCapacity;
    private String locationZone;
    private Boolean isAvailable;
    private String tableType;
}
