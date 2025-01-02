package com.ecommerce.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderDTO {
    private Long id;
    private Long userId;
    private List<OrderItemDTO> items;
    private BigDecimal totalAmount;
    private String status;
}