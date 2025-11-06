package com.javabite.code.coffeehub.repo;
import com.javabite.code.coffeehub.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface PaymentTransactionRepository extends
        JpaRepository<PaymentTransaction, Long> {
    Optional<PaymentTransaction> findByProviderPaymentId(String
                                                                 providerPaymentId);
}
