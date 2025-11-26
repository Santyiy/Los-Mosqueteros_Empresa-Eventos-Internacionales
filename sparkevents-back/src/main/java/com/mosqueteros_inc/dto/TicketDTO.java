package com.mosqueteros_inc.dto;

public class TicketDTO {

    private int id;
    private String codigoQR;
    private String estado;
    private Integer idUsuario;
    private Integer idEvento;

    public TicketDTO() {}

    public TicketDTO(int id, String codigoQR, String estado, Integer idUsuario, Integer idEvento) {
        this.id = id;
        this.codigoQR = codigoQR;
        this.estado = estado;
        this.idUsuario = idUsuario;
        this.idEvento = idEvento;
    }

    public int getId() { return id; }
    public String getCodigoQR() { return codigoQR; }
    public String getEstado() { return estado; }
    public Integer getIdUsuario() { return idUsuario; }
    public Integer getIdEvento() { return idEvento; }

    public void setId(int id) { this.id = id; }
    public void setCodigoQR(String codigoQR) { this.codigoQR = codigoQR; }
    public void setEstado(String estado) { this.estado = estado; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }
    public void setIdEvento(Integer idEvento) { this.idEvento = idEvento; }
}
