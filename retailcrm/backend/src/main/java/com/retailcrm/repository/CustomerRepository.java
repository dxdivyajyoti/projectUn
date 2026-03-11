package com.retailcrm.repository;

import com.retailcrm.model.Customer;
import com.retailcrm.model.enums.CustomerTag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID> {

    Page<Customer> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    Page<Customer> findByUserIdAndTag(UUID userId, CustomerTag tag, Pageable pageable);

    @Query("SELECT c FROM Customer c WHERE c.user.id = :uid " +
           "AND (LOWER(c.fullName) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "OR c.phone LIKE CONCAT('%', :q, '%'))")
    List<Customer> search(@Param("uid") UUID uid, @Param("q") String query);

    long countByUserIdAndCreatedAtAfter(UUID userId, LocalDateTime since);

    long countByUserId(UUID userId);

    long countByUserIdAndTag(UUID userId, CustomerTag tag);

    Optional<Customer> findByIdAndUserId(UUID id, UUID userId);
}
