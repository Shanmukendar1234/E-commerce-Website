package com.ecommerce.service.impl;

import com.ecommerce.model.Order;
import com.ecommerce.service.PaymentService;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService {
    
    @Override
    public PaymentIntent createPaymentIntent(Order order) throws Exception {
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
            .setAmount(order.getTotalAmount().longValue() * 100)
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