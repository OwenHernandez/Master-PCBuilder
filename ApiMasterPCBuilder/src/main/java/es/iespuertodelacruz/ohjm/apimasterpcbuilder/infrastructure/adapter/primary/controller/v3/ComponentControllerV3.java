package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.controller.v3;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Component;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Seller;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.User;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IComponentService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.ISellerService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.port.primary.IUserService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.service.FileStorageService;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ComponentInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.ComponentOutputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.exception.GraphQLErrorException;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper.ComponentDTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.http.HttpStatus;
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
        return componentService.findAll().stream()
                .map(componentDTOMapper::toDTO)
                .collect(Collectors.toList());
    }

    @SchemaMapping(typeName = "Query", field = "component")
    public ComponentOutputDTO getComponent(@Argument long id) {
        return componentDTOMapper.toDTO(componentService.findById(id));
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
        Seller byName = sellerService.findByName(component.getSellerName());
        if (byName == null) {
            throw new GraphQLErrorException("Seller not found", HttpStatus.NOT_FOUND);
        }
        domain.setSeller(byName);

        return componentDTOMapper.toDTO(componentService.save(domain));
    }

    @SchemaMapping(typeName = "Mutation", field = "updateComponent")
    public ComponentOutputDTO update(@Argument Long id, @Argument ComponentInputDTO component) {
        Component byId = componentService.findById(id);
        if (byId == null) {
            throw new GraphQLErrorException("Component not found", HttpStatus.NOT_FOUND);
        }
        if (component.getImage64() != null) {
            String codedPicture = component.getImage64();
            byte[] photoBytes = Base64.getDecoder().decode(codedPicture);
            String newFileName = storageService.save(component.getName() + "_" + component.getImage(), photoBytes);
            component.setImage(newFileName);
        } else {
            component.setImage(byId.getImage());
        }
        Component componentInput = componentDTOMapper.toDomain(component);
        componentInput.setId(id);
        componentInput.setAmazon_price(byId.getAmazon_price());
        componentInput.setEbay_price(byId.getEbay_price());
        componentInput.setPrice(component.getPrice());
        componentInput.setDescription(component.getDescription());
        componentInput.setUserWhoCreated(byId.getUserWhoCreated());
        System.out.println(component.getSellerName());
        Seller byName = sellerService.findByName(component.getSellerName());

        if (byName == null) {
            throw new GraphQLErrorException("Seller not found", HttpStatus.NOT_FOUND);
        }
        componentInput.setSeller(byName);

        Component save = componentService.save(componentInput);
        if (save == null) {
            throw new GraphQLErrorException("Error saving component", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return componentDTOMapper.toDTO(save);
    }

    @SchemaMapping(typeName = "Mutation", field = "deleteComponent")
    public boolean delete(@Argument long id) {
        Component byId = componentService.findById(id);
        if (byId == null) {
            throw new GraphQLErrorException("Component not found", HttpStatus.NOT_FOUND);
        }
        byId.setIsDeleted((byte) 1);
        try {
            Component save = componentService.save(byId);
            if (save.getIsDeleted() == 1) {
                return true;
            }
        } catch (Exception e) {
            throw new GraphQLErrorException("Error deleting component", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return false;
    }
}
