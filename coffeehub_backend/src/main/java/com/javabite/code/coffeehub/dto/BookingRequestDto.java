package com.javabite.code.coffeehub.dto;
import lombok.Data;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
public class BookingRequestDto {
    private Long tableId;
    private LocalDateTime bookingDatetime;
    private Integer durationHours;
    private Integer partySize;
    private String specialRequests;

}
