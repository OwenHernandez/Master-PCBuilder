package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IBuildService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/v2/builds")
public class BuildRestControllerV2 {

    @Autowired
    IBuildService buildService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<Build> all = buildService.findAll();

        if (all != null) {
            return ResponseEntity.ok(all);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No hay nada que mostrar");
        }
    }
}
