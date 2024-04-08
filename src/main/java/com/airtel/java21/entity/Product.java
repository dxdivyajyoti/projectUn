package com.airtel.java21.entity;


import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "emp")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Long salary;
}