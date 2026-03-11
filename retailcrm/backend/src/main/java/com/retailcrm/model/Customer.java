package com.retailcrm.model;

import com.retailcrm.model.enums.CustomerTag;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "customers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @NotBlank
    private String fullName;

    private String phone;

    private String email;

    private LocalDate birthday;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private CustomerTag tag = CustomerTag.NEW;

    private String notes;

    private LocalDateTime lastVisited;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
