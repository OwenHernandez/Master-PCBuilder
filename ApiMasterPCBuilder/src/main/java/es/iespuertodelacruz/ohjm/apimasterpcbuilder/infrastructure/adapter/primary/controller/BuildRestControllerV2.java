package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller;

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

import java.util.List;

class BuildDTO {
    private String name;

    private String notes;

    private double totalPrice;

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
}

@RestController
@CrossOrigin
@RequestMapping("/api/v2/builds")
public class BuildRestControllerV2 {

    @Autowired
    IBuildService buildService;

    @Autowired
    IUserService userService;

    @GetMapping
    public ResponseEntity<?> getByUserId() {
        Object principal =
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails)principal).getUsername();
        User byNick = userService.findByNick(username);

        if (byNick != null) {
            List<Build> byUserId = buildService.findByUserId(byNick.getId());

            if (byUserId != null) {
                return ResponseEntity.ok(byUserId);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("There is nothing to show");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
        }
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody BuildDTO buildDTO) {
        if (buildDTO != null) {
            Object principal =
                    SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username = ((UserDetails) principal).getUsername();
            User byNick = userService.findByNick(username);

            if (byNick != null) {
                Build build = new Build();
                build.setName(buildDTO.getName());
                build.setNotes(buildDTO.getNotes());
                build.setTotalPrice(build.getTotalPrice());
                build.setUser(byNick);

                Build save = buildService.save(build);
                if (save != null) {
                    return ResponseEntity.ok(save);
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You should not be here");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The build must not be null");
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
                List<Build> byUserId = buildService.findByUserId(byNick.getId());
                if (byUserId != null) {
                    for (Build b : byUserId) {
                        if (b.getId() == id) {
                            boolean ok = buildService.deleteById(id);
                            if (ok) {
                                return ResponseEntity.ok("Build Successfully deleted");
                            } else {
                                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
                            }
                        }
                    }
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("You do not have any builds to delete");
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
            User byNick = userService.findByNick(username);

            if (byNick != null) {
                
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Neither the id nor the build can be null");
        }
    }
}
