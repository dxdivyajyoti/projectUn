package com.retailcrm.service;

import com.retailcrm.dto.InteractionDTO;
import com.retailcrm.model.Customer;
import com.retailcrm.model.Interaction;
import com.retailcrm.model.User;
import com.retailcrm.repository.CustomerRepository;
import com.retailcrm.repository.InteractionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InteractionService {

    private final InteractionRepository interactionRepository;
    private final CustomerRepository customerRepository;

    @Transactional
    public InteractionDTO create(User user, UUID customerId, InteractionDTO dto) {
        Customer customer = customerRepository.findByIdAndUserId(customerId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        Interaction interaction = Interaction.builder()
                .customer(customer)
                .type(dto.getType())
                .note(dto.getNote())
                .amount(dto.getAmount())
                .build();

        interaction = interactionRepository.save(interaction);

        // Update last visited timestamp on customer
        customer.setLastVisited(LocalDateTime.now());
        customerRepository.save(customer);

        return toDTO(interaction);
    }

    public Page<InteractionDTO> listByCustomer(User user, UUID customerId, int page) {
        // Verify ownership
        customerRepository.findByIdAndUserId(customerId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        return interactionRepository
                .findByCustomerIdOrderByCreatedAtDesc(customerId, PageRequest.of(page, 20))
                .map(this::toDTO);
    }

    private InteractionDTO toDTO(Interaction i) {
        return InteractionDTO.builder()
                .id(i.getId())
                .type(i.getType())
                .note(i.getNote())
                .amount(i.getAmount())
                .customerId(i.getCustomer().getId())
                .createdAt(i.getCreatedAt())
                .build();
    }
}
