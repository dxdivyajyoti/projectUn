package com.retailcrm.dto;

import com.retailcrm.model.enums.CustomerTag;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateCustomerRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String phone;
    private String email;
    private LocalDate birthday;
    private CustomerTag tag;
    private String notes;
}
