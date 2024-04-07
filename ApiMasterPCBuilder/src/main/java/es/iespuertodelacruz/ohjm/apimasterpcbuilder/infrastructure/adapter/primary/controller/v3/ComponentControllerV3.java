package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v3;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IComponentService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.ISellerService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.FileStorageService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ComponentInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ComponentOutputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.ComponentDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class ComponentControllerV3 {

    @Autowired
    private IComponentService componentService;

    @Autowired
    private IUserService userService;

    @Autowired
    private FileStorageService storageService;

    @Autowired
    private ISellerService sellerService;

    private final ComponentDTOMapper componentDTOMapper = new ComponentDTOMapper();

    @SchemaMapping(typeName = "Query", field = "components")
    public List<ComponentOutputDTO> getComponents() {
        List<Component> all = componentService.findAll();
        return all.stream()
                .map(componentDTOMapper::toDTO)
                .collect(Collectors.toList());
    }

    @SchemaMapping(typeName = "Query", field = "component")
    public ComponentOutputDTO getComponent(@Argument long id) {
        Component byId = componentService.findById(id);
        return componentDTOMapper.toDTO(byId);
    }

    @SchemaMapping(typeName = "Mutation", field = "saveComponent")
    public ComponentOutputDTO save(@Argument ComponentInputDTO component) {
        Object principal =
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = ((UserDetails) principal).getUsername();
        User userByNick = userService.findByNick(username);

        String codedPicture = component.getImage64();
        byte[] photoBytes = Base64.getDecoder().decode(codedPicture);
        String newFileName = storageService.save(component.getName() + "_" + component.getImage(), photoBytes);
        component.setImage(newFileName);

        Component domain = componentDTOMapper.toDomain(component);
        domain.setUserWhoCreated(userByNick);
        domain.setSeller(sellerService.findByName(component.getSellerName()));

        return componentDTOMapper.toDTO(componentService.save(domain));
    }

    @SchemaMapping(typeName = "Mutation", field = "updateComponent")
    public boolean update(@Argument Long id, @Argument ComponentInputDTO component) {
        Component byId = componentService.findById(id);
        if (byId == null) {
            return false;
        }
        if (component.getImage64() != null) {
            String codedPicture = component.getImage64();
            byte[] photoBytes = Base64.getDecoder().decode(codedPicture);
            String newFileName = storageService.save(component.getName() + "_" + component.getImage(), photoBytes);
            component.setImage(newFileName);
        } else {
            component.setImage(byId.getImage());
        }
        Component domain = componentDTOMapper.toDomain(component);
        domain.setId(id);
        domain.setUserWhoCreated(byId.getUserWhoCreated());
        domain.setSeller(sellerService.findByName(component.getSellerName()));

        return componentService.update(domain);
    }

    @SchemaMapping(typeName = "Mutation", field = "deleteComponent")
    public boolean delete(@Argument long id) {
        return componentService.deleteById(id);
    }
}
