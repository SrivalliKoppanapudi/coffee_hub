package com.javabite.code.coffeehub.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Table(name = "staff")
public class Staff {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false) private Long userId;

    private String firstName;
    private String lastName;
    private String staffType; // CHEF or WAITER
    private String contactNumber;
    private java.time.LocalTime shiftStart;
    private java.time.LocalTime shiftEnd;
    private Integer experienceYears;
}
