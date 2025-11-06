package com.javabite.code.coffeehub.repo;



import com.javabite.code.coffeehub.entity.FoodOrder;
import com.javabite.code.coffeehub.entity.Order;
import com.javabite.code.coffeehub.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {}

