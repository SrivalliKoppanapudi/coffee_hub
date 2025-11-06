package com.javabite.code.coffeehub.entity;

import jakarta.persistence.*;
import lombok.*;


import java.time.Instant;

@Entity
@Table(name = "customers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ Only keep the relationship
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserEnitiy user;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "contact_number")
    private String contactNumber;

    @Column(name = "email")
    private String email;

    @Column(name = "address")
    private String address;

    @Column(name = "loyalty_points")
    private Integer loyaltyPoints = 0;

    @Column(name = "preferred_table")
    private Integer preferredTable;

    @Column(name= "username")
    private String username;

    private Instant createdAt = Instant.now();

}
