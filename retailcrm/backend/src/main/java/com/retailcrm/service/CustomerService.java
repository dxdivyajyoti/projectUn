package com.retailcrm.service;

import com.retailcrm.dto.CreateCustomerRequest;
import com.retailcrm.dto.CustomerDTO;
import com.retailcrm.dto.UpdateCustomerRequest;
import com.retailcrm.model.Customer;
import com.retailcrm.model.User;
import com.retailcrm.model.enums.CustomerTag;
import com.retailcrm.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    private static final int PAGE_SIZE = 20;

    public Page<CustomerDTO> list(User user, int page, String tag) {
        log.debug("Listing customers for user={}, page={}, tag={}", user.getEmail(), page, tag);
        Pageable pageable = PageRequest.of(page, PAGE_SIZE);

        Page<Customer> customers;
        if (tag != null && !tag.isEmpty()) {
            CustomerTag customerTag = CustomerTag.valueOf(tag.toUpperCase());
            customers = customerRepository.findByUserIdAndTag(user.getId(), customerTag, pageable);
        } else {
            customers = customerRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);
        }

        return customers.map(this::toDTO);
    }

    public CustomerDTO get(User user, UUID id) {
        Customer customer = findByIdAndUser(id, user.getId());
        return toDTO(customer);
    }

    @Transactional
    public CustomerDTO create(User user, CreateCustomerRequest req) {
        log.info("Creating customer '{}' for user={}", req.getFullName(), user.getEmail());
        Customer customer = Customer.builder()
                .user(user)
                .fullName(req.getFullName())
                .phone(req.getPhone())
                .email(req.getEmail())
                .birthday(req.getBirthday())
                .tag(req.getTag() != null ? req.getTag() : CustomerTag.NEW)
                .notes(req.getNotes())
                .build();

        customer = customerRepository.save(customer);
        log.info("Customer created: id={}, name='{}'", customer.getId(), customer.getFullName());
        return toDTO(customer);
    }

    @Transactional
    public CustomerDTO update(User user, UUID id, UpdateCustomerRequest req) {
        log.info("Updating customer id={} for user={}", id, user.getEmail());
        Customer customer = findByIdAndUser(id, user.getId());

        if (req.getFullName() != null) customer.setFullName(req.getFullName());
        if (req.getPhone() != null) customer.setPhone(req.getPhone());
        if (req.getEmail() != null) customer.setEmail(req.getEmail());
        if (req.getBirthday() != null) customer.setBirthday(req.getBirthday());
        if (req.getTag() != null) customer.setTag(req.getTag());
        if (req.getNotes() != null) customer.setNotes(req.getNotes());

        customer = customerRepository.save(customer);
        return toDTO(customer);
    }

    @Transactional
    public void delete(User user, UUID id) {
        log.info("Deleting customer id={} for user={}", id, user.getEmail());
        Customer customer = findByIdAndUser(id, user.getId());
        customerRepository.delete(customer);
        log.info("Customer deleted: id={}", id);
    }

    public List<CustomerDTO> search(User user, String query) {
        log.debug("Searching customers for user={}, query='{}'", user.getEmail(), query);
        return customerRepository.search(user.getId(), query.toLowerCase())
                .stream()
                .map(this::toDTO)
                .toList();
    }

    private Customer findByIdAndUser(UUID id, UUID userId) {
        return customerRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
    }

    private CustomerDTO toDTO(Customer c) {
        return CustomerDTO.builder()
                .id(c.getId())
                .fullName(c.getFullName())
                .phone(c.getPhone())
                .email(c.getEmail())
                .birthday(c.getBirthday())
                .tag(c.getTag())
                .notes(c.getNotes())
                .lastVisited(c.getLastVisited())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
