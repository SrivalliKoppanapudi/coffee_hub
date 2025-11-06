package com.javabite.code.coffeehub.service;
import com.javabite.code.coffeehub.entity.FoodOrder;
import com.javabite.code.coffeehub.entity.PaymentTransaction;
import com.javabite.code.coffeehub.repo.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentTransactionRepository paymentTransactionRepository;
// NOTE: These methods are stubs. Integrate provider SDK (Stripe/Razorpay/PayPal) here.

    @Transactional
    public PaymentTransaction createPaymentForOrder(FoodOrder order, String method){
        PaymentTransaction p = PaymentTransaction.builder()
                .provider(method)
                .amount(order.getTotalAmount())
                .currency("INR")
                .status("INITIATED")
                .type("ORDER_PAYMENT")
                .build();
        p = paymentTransactionRepository.save(p);

        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(order.getTotalAmount().multiply(BigDecimal.valueOf(100)).longValue()) // in paise
                    .setCurrency("inr")
                    .putMetadata("order_id", order.getId().toString())
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);

            p.setProviderPaymentId(intent.getId());
            p.setClientSecret(intent.getClientSecret());
            p.setStatus("CREATED");
            paymentTransactionRepository.save(p);
        } catch (Exception e) {
            p.setStatus("FAILED");
            paymentTransactionRepository.save(p);
            throw new RuntimeException("Stripe PaymentIntent creation failed: " + e.getMessage());
        }

        return p;
    }

    @Transactional
    public PaymentTransaction refundPayment(Long paymentId, BigDecimal
            amount){
        PaymentTransaction original =
                paymentTransactionRepository.findById(paymentId).orElseThrow(() -> new
                        RuntimeException("Payment not found"));
        PaymentTransaction refund = PaymentTransaction.builder()
                .provider(original.getProvider())
                .amount(amount)
                .currency(original.getCurrency())
                .status("INITIATED")
                .type("REFUND")
                .build();
        refund = paymentTransactionRepository.save(refund);
// TODO: call provider refund API
// On success: set refund.status = SUCCESS and original.status =PARTIAL_REFUND or REFUNDED
        refund.setStatus("SUCCESS");
        paymentTransactionRepository.save(refund);
        original.setStatus("REFUNDED");
        paymentTransactionRepository.save(original);
        return refund;
    }
}