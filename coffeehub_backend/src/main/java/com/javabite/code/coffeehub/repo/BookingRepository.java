package com.javabite.code.coffeehub.repo;
import com.javabite.code.coffeehub.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerIdOrderByBookingDatetimeDesc(Long customerId);

    // check overlaps: returns bookings for same table where requested start < existing end and requested end > existing start
    default boolean existsOverlapForTable(Long tableId, LocalDateTime reqStart, LocalDateTime reqEnd){
        // We'll use a derived query in service instead (this method as helper).
        return false;
    }

    Optional<Booking> findFirstByCustomerIdAndStatus(Long customerId, String status);
    Optional<Booking> findTopByCustomerIdOrderByBookingDatetimeDesc(Long customerId);

    List<Booking> findByTableIdAndBookingDatetimeBetween(Long tableId, LocalDateTime from, LocalDateTime to);
}
