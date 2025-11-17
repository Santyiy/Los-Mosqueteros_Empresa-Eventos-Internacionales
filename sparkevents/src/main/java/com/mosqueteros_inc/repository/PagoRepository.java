package com.mosqueteros_inc.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mosqueteros_inc.model.Pago;

public interface PagoRepository extends JpaRepository<Pago, Integer> {
    Pago findByMetodo(String metodo);

}


