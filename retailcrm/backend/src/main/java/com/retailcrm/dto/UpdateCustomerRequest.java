package com.retailcrm.dto;

import com.retailcrm.model.enums.CustomerTag;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateCustomerRequest {
    private String fullName;
    private String phone;
    private String email;
    private LocalDate birthday;
    private CustomerTag tag;
    private String notes;
}
