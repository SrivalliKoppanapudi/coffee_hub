package com.javabite.code.coffeehub.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Entity
@Table(name = "menu_price_history")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MenuPriceHistory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "menu_item_id")
    private MenuItem menuItem;
    private BigDecimal price;
    private LocalDateTime effectiveFrom = LocalDateTime.now();
    private LocalDateTime effectiveTo;
    private LocalDateTime createdAt = LocalDateTime.now();
}
