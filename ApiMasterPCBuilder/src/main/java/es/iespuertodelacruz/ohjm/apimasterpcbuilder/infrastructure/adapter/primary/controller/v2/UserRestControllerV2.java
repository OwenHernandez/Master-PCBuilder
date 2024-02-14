package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v2;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.UserDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.UserDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/v2/users")
public class UserRestControllerV2 {

    @Autowired
    IUserService userService;

    UserDTOMapper mapper;

    @GetMapping
    public ResponseEntity<?> getByNick(@RequestParam("nick") String nick) {
        mapper = new UserDTOMapper();
        if (nick == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The nick parameter is required");
        } else {
            User byNick = userService.findByNick(nick);
            UserDTO userDTO = mapper.toDTO(byNick);
            return ResponseEntity.ok(userDTO);
        }
    }
}
