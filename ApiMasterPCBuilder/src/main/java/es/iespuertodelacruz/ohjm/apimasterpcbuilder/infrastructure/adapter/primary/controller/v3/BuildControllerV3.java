package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v3;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.BuildComponent;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IBuildService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IComponentService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.BuildInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.BuildOutputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.exception.GraphQLErrorException;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.BuildDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class BuildControllerV3 {

    @Autowired
    private IBuildService buildService;

    @Autowired
    private IComponentService componentService;

    @Autowired
    private IUserService userService;

    private final BuildDTOMapper buildDTOMapper = new BuildDTOMapper();

    @SchemaMapping(typeName = "Query", field = "builds")
    public List<BuildOutputDTO> getBuilds() {
        return buildService.findAll().stream().map(buildDTOMapper::toDTO).collect(Collectors.toList());
    }

    @SchemaMapping(typeName = "Query", field = "build")
    public BuildOutputDTO getBuild(@Argument long id) {
        Build byId = buildService.findById(id);
        if (byId == null) {
            throw new GraphQLErrorException("Build not found", HttpStatus.NOT_FOUND);
        }
        return buildDTOMapper.toDTO(byId);
    }

    @SchemaMapping(typeName = "Mutation", field = "saveBuild")
    public BuildOutputDTO save(@Argument BuildInputDTO build) {
        Object principal =
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        User byNick = userService.findByNick(username);

        if (!build.getCategory().equals("Gaming") && !build.getCategory().equals("Work") && !build.getCategory().equals("Budget")) {
            throw new GraphQLErrorException("Invalid category", HttpStatus.BAD_REQUEST);
        }

        Build domain = buildDTOMapper.toDomain(build);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date date = new Date();
        String dateStr = sdf.format(date);
        domain.setDateOfCreation(dateStr);
        domain.setBuildsComponents(new ArrayList<>());
        double totalPrice = 0;
        for (Long compId : build.getComponentsIds()) {
            Component compById = componentService.findById(compId);
            if (compById == null) {
                throw new GraphQLErrorException("Component not found", HttpStatus.NOT_FOUND);
            }
            totalPrice += compById.getPrice();
            BuildComponent bc = new BuildComponent();
            bc.setPriceAtTheTime(compById.getPrice());

            bc.setDateCreated(dateStr);

            bc.setComponent(compById);
            domain.getBuildsComponents().add(bc);
        }
        domain.setTotalPrice(totalPrice);
        domain.setUser(byNick);

        Build save = buildService.save(domain);

        if (save == null) {
            throw new GraphQLErrorException("Error saving build", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return buildDTOMapper.toDTO(save);
    }

    @SchemaMapping(typeName = "Mutation", field = "updateBuild")
    public BuildOutputDTO update(@Argument Long id, @Argument BuildInputDTO build) {
        Build byId = buildService.findById(id);
        if (byId == null) {
            throw new GraphQLErrorException("Build not found", HttpStatus.NOT_FOUND);
        }
        if (!build.getCategory().equals("Gaming") && !build.getCategory().equals("Work") && !build.getCategory().equals("Budget")) {
            throw new GraphQLErrorException("Invalid category", HttpStatus.BAD_REQUEST);
        }

        if (!build.getName().isEmpty()) {
            byId.setName(build.getName());
        }
        if (!build.getNotes().isEmpty()) {
            byId.setNotes(build.getNotes());
        }

        byId.setBuildsComponents(new ArrayList<>());

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date date = new Date();
        String dateStr = sdf.format(date);
        double totalPrice = 0;
        for (Long compId : build.getComponentsIds()) {
            Component compById = componentService.findById(compId);
            if (compById == null) {
                throw new GraphQLErrorException("Component not found", HttpStatus.NOT_FOUND);
            }
            totalPrice += compById.getPrice();
            BuildComponent bc = new BuildComponent();
            bc.setPriceAtTheTime(compById.getPrice());

            bc.setDateCreated(dateStr);

            bc.setComponent(compById);
            byId.getBuildsComponents().add(bc);
        }
        byId.setTotalPrice(totalPrice);
        boolean update = buildService.update(byId);
        if (!update) {
            throw new GraphQLErrorException("Error updating build", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return buildDTOMapper.toDTO(byId);
    }

    @SchemaMapping(typeName = "Mutation", field = "deleteBuild")
    public boolean delete(@Argument long id) {
        Build byId = buildService.findById(id);
        if (byId == null) {
            throw new GraphQLErrorException("Build not found", HttpStatus.NOT_FOUND);
        }
        byId.setDeleted((byte) 1);
        boolean save = buildService.update(byId);

        if (save) {
            return true;
        }
        return false;
    }
}