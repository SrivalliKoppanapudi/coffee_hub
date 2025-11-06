package com.javabite.code.coffeehub.repo;
import com.javabite.code.coffeehub.entity.FoodOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;
public interface FoodOrderRepository extends JpaRepository<FoodOrder, Long> {
    List<FoodOrder> findByBooking_Id(Long bookingId);

    List<FoodOrder> findByBookingId(Long bookingId);

    List<FoodOrder> findByBooking_CustomerId(Long customerId);


}
