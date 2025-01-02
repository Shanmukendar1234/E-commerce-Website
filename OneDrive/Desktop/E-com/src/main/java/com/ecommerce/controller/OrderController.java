package com.ecommerce.controller;

import com.ecommerce.dto.OrderDTO;
import com.ecommerce.mapper.OrderMapper;
import com.ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    
    private final OrderService orderService;
    private final OrderMapper orderMapper;
    
    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderMapper.toDTO(orderService.getOrder(id)));
    }
}