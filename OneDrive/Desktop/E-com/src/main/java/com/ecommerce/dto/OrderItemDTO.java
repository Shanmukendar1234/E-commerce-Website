package com.ecommerce.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderItemDTO {
    private Long id;
    private String productId;
    private String productName;
    private Integer quantity;
    private BigDecimal price;
}