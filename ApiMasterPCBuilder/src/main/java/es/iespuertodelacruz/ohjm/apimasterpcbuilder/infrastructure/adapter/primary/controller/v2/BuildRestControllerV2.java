package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v2;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IBuildService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

class BuildDTO {
    private String name;

    private String notes;

    private double totalPrice;

    private String userNick;

    //private List<BuildComponent> buildsComponents;

    public BuildDTO() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getUserNick() {
        return userNick;
    }

    public void setUserNick(String userNick) {
        this.userNick = userNick;
    }
}

class BuildDTOMapper {

    public Build toDomain(BuildDTO buildDTO) {
        Build build = new Build();
        build.setName(buildDTO.getName());
        build.setNotes(buildDTO.getNotes());
        build.setTotalPrice(build.getTotalPrice());

        return build;
    }

    public BuildDTO toDTO(Build build) {
        BuildDTO buildDTO = new BuildDTO();
        buildDTO.setName(build.getName());
        buildDTO.setNotes(build.getNotes());
        buildDTO.setTotalPrice(build.getTotalPrice());

        if (build.getUser() != null) {
            buildDTO.setUserNick(build.getUser().getNick());
        }

        return buildDTO;
    }
}

@RestController
@CrossOrigin
@RequestMapping("/api/v2/builds")
public class BuildRestControllerV2 {

    @Autowired
    IBuildService buildService;

    @Autowired
    IUserService userService;

    BuildDTOMapper mapper;

    @GetMapping
    public ResponseEntity<?> getByUserId() {
        mapper = new BuildDTOMapper();
        Object principal =
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails)principal).getUsername();
        User byNick = userService.findByNick(username);

        if (byNick != null) {
            List<Build> byUserId = buildService.findByUserId(byNick.getId());

            if (byUserId != null) {
                List<BuildDTO> res = new ArrayList<>();

                for (Build b : byUserId) {
                    BuildDTO bdto = mapper.toDTO(b);
                    res.add(bdto);
                }
                return ResponseEntity.ok(res);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("There is nothing to show");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
        }
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody BuildDTO buildDTO) {
        mapper = new BuildDTOMapper();
        if (buildDTO != null) {
            Object principal =
                    SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username = ((UserDetails) principal).getUsername();
            User byNick = userService.findByNick(username);

            if (byNick != null) {
                Build build = mapper.toDomain(buildDTO);
                build.setUser(byNick);

                Build save = buildService.save(build);
                if (save != null) {
                    BuildDTO bdto = mapper.toDTO(save);
                    return ResponseEntity.ok(bdto);
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The body must not be null");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable("id") Long id) {

        if (id != null) {
            Object principal =
                    SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username = ((UserDetails) principal).getUsername();
            User byNick = userService.findByNick(username);

            if (byNick != null) {
                Build buildById = buildService.findById(id);
                if (buildById != null) {
                    if (buildById.getUser().getId() == byNick.getId()) {
                        boolean ok = buildService.deleteById(id);

                        if (ok) {
                            return ResponseEntity.ok("Build Successfully Deleted");
                        } else {
                            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
                        }
                    }
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("build not found");
                }
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("The build with the provided id was not found");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The id must not be null");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestBody BuildDTO buildDTO, @PathVariable("id") Long id) {
        if (buildDTO != null && id != null) {
            Object principal =
                    SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username = ((UserDetails) principal).getUsername();
            User userByNick = userService.findByNick(username);

            if (userByNick != null) {
                Build buildById = buildService.findById(id);
                if (buildById != null) {
                    if (buildById.getUser().getId() == userByNick.getId()) {
                        buildById.setName(buildDTO.getName());
                        buildById.setNotes(buildDTO.getNotes());
                        buildById.setTotalPrice(buildDTO.getTotalPrice());
                        boolean ok = buildService.update(buildById);

                        if (ok) {
                            return ResponseEntity.ok("Build Successfully updated");
                        } else {
                            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
                        }
                    } else {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("That is not your build");
                    }
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Build not found");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Neither the id nor the build can be null");
        }
    }
}
