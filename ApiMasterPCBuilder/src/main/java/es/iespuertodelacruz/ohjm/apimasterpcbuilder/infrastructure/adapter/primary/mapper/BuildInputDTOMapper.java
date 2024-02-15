package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.BuildComponent;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.BuildInputDTO;

public class BuildInputDTOMapper {

    public Build toDomain(BuildInputDTO buildInputDTO) {
        Build build = new Build();
        build.setName(buildInputDTO.getName());
        build.setNotes(buildInputDTO.getNotes());

        return build;
    }

    public BuildInputDTO toDTO(Build build) {
        BuildInputDTO buildInputDTO = new BuildInputDTO();
        buildInputDTO.setName(build.getName());
        buildInputDTO.setNotes(build.getNotes());
        for (BuildComponent bc : build.getBuildsComponents()) {
            buildInputDTO.getComponentsIds().add(bc.getComponent().getId());
        }

        return buildInputDTO;
    }
}
