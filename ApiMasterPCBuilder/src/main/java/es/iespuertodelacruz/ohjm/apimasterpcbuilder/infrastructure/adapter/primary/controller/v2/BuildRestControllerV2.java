package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v2;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.BuildComponent;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IBuildService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IComponentService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.BuildComponentDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.BuildInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.BuildOutputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.BuildInputDTOMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.BuildOutputDTOMapper;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.secundary.mapper.BuildComponentEntityMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.logging.Logger;

@RestController
@CrossOrigin
@RequestMapping("/api/v2/builds")
public class BuildRestControllerV2 {

    @Autowired
    IBuildService buildService;

    @Autowired
    IUserService userService;

    @Autowired
    IComponentService componentService;

    BuildOutputDTOMapper outputDTOMapper = new BuildOutputDTOMapper();

    BuildInputDTOMapper inputDTOMapper = new BuildInputDTOMapper();

    @Transactional
    @GetMapping
    public ResponseEntity<?> getByUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        User byNick = userService.findByNick(username);

        if (byNick != null) {
            List<Build> byUserId = buildService.findByUserId(byNick.getId());
            if (byUserId != null) {
                List<BuildOutputDTO> res = new ArrayList<>();
                for (Build b : byUserId) {
                    BuildOutputDTO bdto = outputDTOMapper.toDTO(b);
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
    public ResponseEntity<?> save(@RequestBody BuildInputDTO buildInputDTO) {
        if (buildInputDTO != null) {
            Object principal =
                    SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username = ((UserDetails) principal).getUsername();
            User byNick = userService.findByNick(username);

            if (byNick != null) {
                if (!buildInputDTO.getCategory().equals("Gaming") && !buildInputDTO.getCategory().equals("Work") && !buildInputDTO.getCategory().equals("Budget")) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The category must be Gaming, Work or Budget");
                }
                Build build = inputDTOMapper.toDomain(buildInputDTO);
                build.setBuildsComponents(new ArrayList<>());
                double totalPrice = 0;
                for (Long compId : buildInputDTO.getComponentsIds()) {
                    Component compById = componentService.findById(compId);
                    if (compById == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The components must exist");
                    }
                    totalPrice += compById.getPrice();
                    BuildComponent bc = new BuildComponent();
                    bc.setPriceAtTheTime(compById.getPrice());

                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                    Date date = new Date();
                    String dateStr = sdf.format(date);
                    bc.setDateCreated(dateStr);

                    bc.setComponent(compById);
                    build.getBuildsComponents().add(bc);
                }
                build.setTotalPrice(totalPrice);
                build.setUser(byNick);

                Build save = buildService.save(build);
                if (save != null) {
                    BuildOutputDTO outputDTO = outputDTOMapper.toDTO(save);
                    return ResponseEntity.ok(outputDTO);
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
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
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
    public ResponseEntity<?> update(@RequestBody BuildInputDTO buildInputDTO, @PathVariable("id") Long id) {
        if (buildInputDTO != null && id != null) {
            Object principal =
                    SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username = ((UserDetails) principal).getUsername();
            User userByNick = userService.findByNick(username);

            if (userByNick != null) {
                Build buildById = buildService.findById(id);
                if (buildById != null) {
                    if (buildById.getUser().getId() == userByNick.getId()) {
                        Build build = inputDTOMapper.toDomain(buildInputDTO);
                        double totalPrice = 0;
                        if (build.getBuildsComponents() == null) {
                            build.setBuildsComponents(new ArrayList<>());
                        }
                        for (Long compId : buildInputDTO.getComponentsIds()) {
                            Component compById = componentService.findById(compId);
                            if (compById == null) {
                                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The components must exist");
                            }
                            totalPrice += compById.getPrice();
                            BuildComponent bc = new BuildComponent();
                            bc.setPriceAtTheTime(compById.getPrice());

                            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                            Date date = new Date();
                            String dateStr = sdf.format(date);
                            bc.setDateCreated(dateStr);

                            bc.setComponent(compById);
                            build.getBuildsComponents().add(bc);
                        }
                        build.setTotalPrice(totalPrice);
                        build.setId(buildById.getId());
                        build.setUser(userByNick);
                        boolean ok = buildService.update(build);

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
