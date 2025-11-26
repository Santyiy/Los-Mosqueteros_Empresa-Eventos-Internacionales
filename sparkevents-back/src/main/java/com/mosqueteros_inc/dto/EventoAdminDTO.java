package com.mosqueteros_inc.dto;

import java.time.LocalDate;

public class EventoAdminDTO {

    private Long id; 
    private String nombre;
    private String descripcion; 
    private LocalDate fecha; 
    private String lugar;
    private Integer capacidad;
    private Double precio;

    
    public EventoAdminDTO() {
    }

    
    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public String getLugar() {
        return lugar;
    }

    public Integer getCapacidad() {
        return capacidad;
    }

    public Double getPrecio() {
        return precio;
    }

    public String getCategoria() {
        return categoria;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }



    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public void setLugar(String lugar) {
        this.lugar = lugar;
    }

    public void setCapacidad(Integer capacidad) {
        this.capacidad = capacidad;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

}