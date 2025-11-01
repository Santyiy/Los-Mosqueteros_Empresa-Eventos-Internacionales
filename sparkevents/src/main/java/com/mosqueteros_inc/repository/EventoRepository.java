package com.mosqueteros_inc.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mosqueteros_inc.model.Evento;

public interface EventoRepository extends JpaRepository<Evento, Integer> {
    Evento findBynombre(String nombre);
    
}

