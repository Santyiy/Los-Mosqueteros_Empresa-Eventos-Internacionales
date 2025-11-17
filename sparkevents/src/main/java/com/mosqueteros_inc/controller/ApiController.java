package com.mosqueteros_inc.controller;



import java.util.Optional;



import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.web.bind.annotation.RestController;

import com.mosqueteros_inc.dto.TicketDTO;
import com.mosqueteros_inc.dto.TicketRequestDTO;
import com.mosqueteros_inc.model.Acceso;

import com.mosqueteros_inc.model.Evento;

import com.mosqueteros_inc.model.Ticket;

import com.mosqueteros_inc.repository.AccesoRepository;

import com.mosqueteros_inc.repository.EventoRepository;

import com.mosqueteros_inc.repository.TicketRepository;



@RestController

@RequestMapping("/api")

@CrossOrigin(origins = "*")

public class ApiController {



    private final EventoRepository eventoRepo;

    private final TicketRepository ticketRepo;

    private final AccesoRepository accesoRepo;



    public ApiController(EventoRepository eventoRepo, TicketRepository ticketRepo, AccesoRepository accesoRepo) {

        this.eventoRepo = eventoRepo;

        this.ticketRepo = ticketRepo;

        this.accesoRepo = accesoRepo;

    }



   

    @PostMapping("/tickets")
    public TicketDTO comprarTicket(@RequestBody TicketRequestDTO dto) {

    Optional<Evento> evento = eventoRepo.findById(dto.getIdEvento());
    if (evento.isEmpty()) {
        throw new RuntimeException("Evento no encontrado");
    }

    Ticket t = new Ticket();
    t.setIdEvento(dto.getIdEvento());
    t.setIdUsuario(dto.getIdUsuario());
    t.setCodigoQR("QR-" + System.currentTimeMillis());
    t.setEstado("Activo");

    ticketRepo.save(t);

    return new TicketDTO(
        t.getId(),
        t.getCodigoQR(),
        t.getEstado(),
        t.getIdUsuario(),
        t.getIdEvento()
    );
  }



   

    @GetMapping("/events/{id}")

    public Optional<Evento> getEvento(@PathVariable int id) {

        return eventoRepo.findById(id);

    }



   

    @GetMapping("/tickets/{code}")

    public String validarTicket(@PathVariable String code) {

        Ticket ticket = ticketRepo.findByCodigoQR(code);

        if (ticket == null) return "Código no válido";

        if (ticket.getEstado().equalsIgnoreCase("Usado"))

            return "El ticket ya fue validado";

        return "Ticket válido";

    }



   

    @PostMapping("/access")

    public String registrarIngreso(@RequestParam String codigoQR, @RequestParam String dispositivo) {

        Ticket ticket = ticketRepo.findByCodigoQR(codigoQR);

        if (ticket == null) return "Ticket no encontrado";



        if (ticket.getEstado().equalsIgnoreCase("Usado"))

            return "El ticket ya fue utilizado";



        Acceso a = new Acceso();

        a.setDispositivo(dispositivo);

        a.setIdTicket(ticket.getId());

        accesoRepo.save(a);



        ticket.setEstado("Usado");

        ticketRepo.save(ticket);



        return "Ingreso registrado correctamente";

    }

}