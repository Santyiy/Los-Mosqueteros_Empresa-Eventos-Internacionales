package com.mosqueteros_inc.dto;

public class TicketRequestDTO {

    private Integer idEvento;
    private Integer idUsuario;

    public TicketRequestDTO() {}

    public TicketRequestDTO(Integer idEvento, Integer idUsuario) {
        this.idEvento = idEvento;
        this.idUsuario = idUsuario;
    }

    public Integer getIdEvento() { return idEvento; }
    public Integer getIdUsuario() { return idUsuario; }

    public void setIdEvento(Integer idEvento) { this.idEvento = idEvento; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }
}
