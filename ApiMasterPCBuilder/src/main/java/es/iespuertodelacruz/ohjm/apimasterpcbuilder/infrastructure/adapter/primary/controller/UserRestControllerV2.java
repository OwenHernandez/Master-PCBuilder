package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/v2/users")
public class UserRestControllerV2 {

    @Autowired
    IUserService userService;

    @GetMapping
    public ResponseEntity<?> getAllOrByNick(@RequestParam(name = "nick", required = false) String nick) {
        if (nick == null) {
            List<User> all = userService.findAll();
            return ResponseEntity.ok(all);
        } else {
            User byNick = userService.findByNick(nick);
            return ResponseEntity.ok(byNick);
        }
    }
}
