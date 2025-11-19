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

    @Column(name = "codigoqr")
    private String codigoQR;

    @Column(name = "estado")
    private String estado;

    @Column(name = "lugar")
    private String lugar;

    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(name = "id_evento")
    private Integer idEvento;

    public Ticket() {}

    public Ticket(String codigoQR, String estado, String lugar, Integer idUsuario, Integer idEvento) {
        this.codigoQR = codigoQR;
        this.estado = estado;
        this.lugar = lugar;
        this.idUsuario = idUsuario;
        this.idEvento = idEvento;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getCodigoQR() { return codigoQR; }
    public void setCodigoQR(String codigoQR) { this.codigoQR = codigoQR; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getLugar() { return lugar; }
    public void setLugar(String lugar) { this.lugar = lugar; }

    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }

    public Integer getIdEvento() { return idEvento; }
    public void setIdEvento(Integer idEvento) { this.idEvento = idEvento; }
}
