package com.airtel.java21.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class ZgcController
{
    @RequestMapping("/zgc")
        public String generateMemoryLoad() {
            List<Object> objects = new ArrayList<>();
            for (int i = 0; i < 1000000; i++) {
                objects.add(new Object());
            }
            return "Generated " + objects.size() + " objects.";
        }
    }

