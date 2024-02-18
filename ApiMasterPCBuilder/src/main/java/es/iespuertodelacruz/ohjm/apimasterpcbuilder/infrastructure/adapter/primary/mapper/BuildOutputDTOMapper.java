package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.BuildComponent;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.BuildComponentDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.BuildOutputDTO;

import java.util.ArrayList;
import java.util.List;

public class BuildOutputDTOMapper {

    ComponentOutputDTOMapper outputDTOMapper = new ComponentOutputDTOMapper();

    ComponentInputDTOMapper inputDTOMapper = new ComponentInputDTOMapper();

    public Build toDomain(BuildOutputDTO buildOutputDTO) {
        Build build = new Build();
        build.setId(buildOutputDTO.getId());
        build.setName(buildOutputDTO.getName());
        build.setNotes(buildOutputDTO.getNotes());
        build.setTotalPrice(buildOutputDTO.getTotalPrice());
        if (buildOutputDTO.getBuildsComponents() != null) {
            List<BuildComponent> bcList = new ArrayList<>();
            for (BuildComponentDTO bcDTO : buildOutputDTO.getBuildsComponents()) {
                BuildComponent bc = new BuildComponent();
                bc.setDateCreated(bcDTO.getDateCreated());
                bc.setPriceAtTheTime(bcDTO.getPriceAtTheTime());
                bc.setComponent(inputDTOMapper.toDomain(bcDTO.getComponent()));
                bcList.add(bc);
            }
            build.setBuildsComponents(bcList);
        }


        return build;
    }

    public BuildOutputDTO toDTO(Build build) {
        BuildOutputDTO buildOutputDTO = new BuildOutputDTO();
        buildOutputDTO.setId(build.getId());
        buildOutputDTO.setName(build.getName());
        buildOutputDTO.setNotes(build.getNotes());
        buildOutputDTO.setTotalPrice(build.getTotalPrice());
        if (build.getBuildsComponents() != null) {
            List<BuildComponentDTO> bcDTOList = new ArrayList<>();
            for (BuildComponent bc : build.getBuildsComponents()) {
                BuildComponentDTO bcDTO = new BuildComponentDTO();
                bcDTO.setDateCreated(bc.getDateCreated());
                bcDTO.setPriceAtTheTime(bc.getPriceAtTheTime());
                bcDTO.setComponent(outputDTOMapper.toDTO(bc.getComponent()));
                bcDTOList.add(bcDTO);
            }
            buildOutputDTO.setBuildsComponents(bcDTOList);
        }
        if (build.getUser() != null) {
            buildOutputDTO.setUserNick(build.getUser().getNick());
        }

        return buildOutputDTO;
    }
}
