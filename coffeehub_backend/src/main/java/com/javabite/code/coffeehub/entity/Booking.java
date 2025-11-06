package com.javabite.code.coffeehub.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.Instant;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Table(name = "bookings")
public class Booking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id", nullable = false) private Long customerId;
    @Column(name = "table_id", nullable = false) private Long tableId;

    @Column(name = "booking_datetime", nullable = false)
    private LocalDateTime bookingDatetime;

    @Column(name = "duration_hours", nullable = false)
    private Integer durationHours;

    @Column(name = "party_size") private Integer partySize;

    @Column(name = "status") private String status = "CONFIRMED";
    @Column(name = "special_requests", columnDefinition = "TEXT") private String specialRequests;
    @Column(name = "booking_fee") private java.math.BigDecimal bookingFee;

    private Instant createdAt = Instant.now();
}
