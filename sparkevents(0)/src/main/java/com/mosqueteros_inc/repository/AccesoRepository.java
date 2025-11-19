package com.mosqueteros_inc.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mosqueteros_inc.model.Acceso;

public interface AccesoRepository extends JpaRepository<Acceso, Integer> {
    Acceso findByDispositivo(String dispositivo);
    
}

