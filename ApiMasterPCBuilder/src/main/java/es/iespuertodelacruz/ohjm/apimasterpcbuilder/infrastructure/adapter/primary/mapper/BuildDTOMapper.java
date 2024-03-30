package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.BuildComponent;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.BuildComponentDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.BuildInputDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.BuildOutputDTO;

import java.util.ArrayList;
import java.util.List;

public class BuildDTOMapper {

    ComponentDTOMapper componentDTOMapper = new ComponentDTOMapper();

    public BuildOutputDTO toDTO(Build build) {
        BuildOutputDTO buildOutputDTO = new BuildOutputDTO();
        buildOutputDTO.setId(build.getId());
        buildOutputDTO.setName(build.getName());
        buildOutputDTO.setNotes(build.getNotes());
        buildOutputDTO.setCategory(build.getCategory());
        buildOutputDTO.setTotalPrice(build.getTotalPrice());
        if (build.getBuildsComponents() != null) {
            List<BuildComponentDTO> bcDTOList = new ArrayList<>();
            for (BuildComponent bc : build.getBuildsComponents()) {
                BuildComponentDTO bcDTO = new BuildComponentDTO();
                bcDTO.setDateCreated(bc.getDateCreated());
                bcDTO.setPriceAtTheTime(bc.getPriceAtTheTime());
                if (bc.getComponent() != null) {
                    bcDTO.setComponent(componentDTOMapper.toDTO(bc.getComponent()));
                }
                bcDTOList.add(bcDTO);
            }
            buildOutputDTO.setBuildsComponents(bcDTOList);
        }
        if (build.getUser() != null) {
            buildOutputDTO.setUserNick(build.getUser().getNick());
        }

        return buildOutputDTO;
    }

    public Build toDomain(BuildInputDTO buildInputDTO) {
        Build build = new Build();
        build.setName(buildInputDTO.getName());
        build.setNotes(buildInputDTO.getNotes());
        build.setCategory(buildInputDTO.getCategory());

        return build;
    }
}
