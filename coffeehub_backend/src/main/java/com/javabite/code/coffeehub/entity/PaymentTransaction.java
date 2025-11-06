package com.javabite.code.coffeehub.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Entity
@Table(name = "payment_transactions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PaymentTransaction {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String provider;
    private String providerPaymentId;
    private BigDecimal amount;
    private String currency = "INR";
    private String status = "INITIATED";
    private String type; // BOOKING_FEE, ORDER_PAYMENT, REFUND
    @Column(columnDefinition = "TEXT")
    private String metadata;

    @Column(length = 255) // store client secret returned by Stripe
    private String clientSecret;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
    @PreUpdate
    public void preUpdate(){ this.updatedAt = LocalDateTime.now(); }
}