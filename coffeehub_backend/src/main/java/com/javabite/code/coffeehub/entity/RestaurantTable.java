package com.javabite.code.coffeehub.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Table(name = "restaurant_tables")
public class RestaurantTable {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "table_number", unique = true, nullable = false)
    private Integer tableNumber;

    @Column(name = "seating_capacity") private Integer seatingCapacity;
    @Column(name = "location_zone") private String locationZone;
    @Column(name = "is_available") private Boolean isAvailable = true;
    @Column(name = "table_type") private String tableType; // REGULAR, VIP, OUTDOOR
}
