package com.mosqueteros_inc.dto;

import java.time.LocalDate;

public class EventoDTO {

    private int id;
    private String nombre;
    private LocalDate fecha;
    private String lugar;
    private int capacidad;
    private String categoria;

    public EventoDTO() {}

    public EventoDTO(int id, String nombre, LocalDate fecha, String lugar, int capacidad, String categoria) {
        this.id = id;
        this.nombre = nombre;
        this.fecha = fecha;
        this.lugar = lugar;
        this.capacidad = capacidad;
        this.categoria = categoria;
    }

    public int getId() { return id; }
    public String getNombre() { return nombre; }
    public LocalDate getFecha() { return fecha; }
    public String getLugar() { return lugar; }
    public int getCapacidad() { return capacidad; }
    public String getCategoria() { return categoria; }

    public void setId(int id) { this.id = id; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
    public void setLugar(String lugar) { this.lugar = lugar; }
    public void setCapacidad(int capacidad) { this.capacidad = capacidad; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
}
