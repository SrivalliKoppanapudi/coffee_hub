package com.javabite.code.coffeehub.repository;
import com.javabite.code.coffeehub.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
public interface OrderItemRepository extends JpaRepository<OrderItem, Long>
{}
