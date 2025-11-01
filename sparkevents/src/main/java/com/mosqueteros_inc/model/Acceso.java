package com.mosqueteros_inc.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "accesos")
public class Acceso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String dispositivo;

    @Column(name = "fecha_hora")
    private LocalDateTime fecha_hora;

    @Column(name = "id_ticket")
    private Integer idTicket;

}
