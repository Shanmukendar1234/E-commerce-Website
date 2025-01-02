package com.ecommerce.service;

import com.ecommerce.model.Order;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {
    
    @Value("${stripe.api.key}")
    private String stripeApiKey;
    
    public PaymentIntent createPaymentIntent(Order order) throws Exception {
        Stripe.apiKey = stripeApiKey;
        
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
            .setAmount(order.getTotalAmount().longValue() * 100) // Convert to cents
            .setCurrency("usd")
            .setAutomaticPaymentMethods(
                PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                    .setEnabled(true)
                    .build()
            )
            .build();
            
        return PaymentIntent.create(params);
    }
}