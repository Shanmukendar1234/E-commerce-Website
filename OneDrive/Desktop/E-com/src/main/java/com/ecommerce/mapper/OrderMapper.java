package com.ecommerce.mapper;

import com.ecommerce.dto.OrderDTO;
import com.ecommerce.model.Order;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {
    
    public OrderDTO toDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setUserId(order.getUser().getId());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        return dto;
    }
    
    public Order toEntity(OrderDTO dto) {
        Order order = new Order();
        order.setId(dto.getId());
        order.setTotalAmount(dto.getTotalAmount());
        order.setStatus(dto.getStatus());
        return order;
    }
}