package com.airtel.java21.controller;

import net.bytebuddy.build.BuildLogger;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
public class ZgcController
{
    @RequestMapping("/zgc")

        public String generateMemoryLoad() {
            List<Object> objects = new ArrayList<>();
            for (int i = 0; i < 1000000; i++) {
                objects.add(new Object());
            }
//        log.info("Thread info {} ", Thread.currentThread());
            return "Generated " + objects.size() + " objects.";
        }
    }

