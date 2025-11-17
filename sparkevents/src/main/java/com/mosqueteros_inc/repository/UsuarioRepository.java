package com.mosqueteros_inc.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mosqueteros_inc.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Usuario findByEmail(String email);
    
}