package com.mosqueteros_inc.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String codigoQR;
    private String estado;
    private String lugar;

    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(name = "id_evento")
    private Integer idEvento;

}
