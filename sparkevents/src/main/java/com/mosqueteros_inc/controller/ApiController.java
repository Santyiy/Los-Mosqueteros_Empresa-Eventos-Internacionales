package com.mosqueteros_inc.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;
import com.mosqueteros_inc.model.*;
import com.mosqueteros_inc.repository.*;

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
    public String comprarTicket(@RequestParam int idEvento, @RequestParam int idUsuario) {
        Optional<Evento> evento = eventoRepo.findById(idEvento);
        if (evento.isEmpty()) return "Evento no encontrado";

        Ticket t = new Ticket();
        t.setIdEvento(idEvento);
        t.setIdUsuario(idUsuario);
        t.setCodigoQR("QR-" + System.currentTimeMillis());
        t.setEstado("Activo");
        ticketRepo.save(t);

        return "Ticket generado con código: " + t.getCodigoQR();
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
