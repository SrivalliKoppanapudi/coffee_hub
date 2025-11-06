package com.javabite.code.coffeehub.repo;
import com.javabite.code.coffeehub.entity.Customer;
import com.javabite.code.coffeehub.entity.UserEnitiy;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByUserId(Long userId);
    Optional<Customer> findByEmail(String email);
    Optional<Customer> findByUser(UserEnitiy user);

}
