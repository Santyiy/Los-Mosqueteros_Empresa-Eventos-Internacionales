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
    private LocalDateTime fechaHora; 

    @Column(name = "id_ticket")
    private Integer idTicket;

    public Acceso() {
    }

    public Acceso(String dispositivo, LocalDateTime fechaHora, Integer idTicket) {
        this.dispositivo = dispositivo;
        this.fechaHora = fechaHora;
        this.idTicket = idTicket;
    }

    
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDispositivo() {
        return dispositivo;
    }

    public void setDispositivo(String dispositivo) {
        this.dispositivo = dispositivo;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    public Integer getIdTicket() {
        return idTicket;
    }

    public void setIdTicket(Integer idTicket) {
        this.idTicket = idTicket;
    }

    
}