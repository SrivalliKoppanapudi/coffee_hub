package com.javabite.code.coffeehub.service;

import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripePaymentService {
    public StripePaymentService(@Value("${stripe.api.key}") String apiKey){
        Stripe.apiKey = apiKey;
    }
    public PaymentIntent createPaymentIntent(long amountCents, String currency, String metadataJson) throws Exception {
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountCents)
                .setCurrency(currency)
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build()
                )
                .putMetadata("meta", metadataJson)
                .build();
        return PaymentIntent.create(params);
    }
}
