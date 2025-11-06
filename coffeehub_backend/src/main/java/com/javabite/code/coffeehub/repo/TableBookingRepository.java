package com.javabite.code.coffeehub.repo;
import com.javabite.code.coffeehub.entity.Booking;
import com.javabite.code.coffeehub.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface TableBookingRepository extends JpaRepository<Booking,
        Long> {
    Optional<Booking> findByIdAndStatus(Long id, BookingStatus status);
}
