package com.mosqueteros_inc.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mosqueteros_inc.model.Ticket;

public interface TicketRepository extends JpaRepository<Ticket, Integer> {
    Ticket findByCodigoQR(String codigoQR);
}
