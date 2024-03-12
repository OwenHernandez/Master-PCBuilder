package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.BuildComponent;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.BuildInputDTO;

public class BuildInputDTOMapper {

    public Build toDomain(BuildInputDTO buildInputDTO) {
        Build build = new Build();
        build.setName(buildInputDTO.getName());
        build.setNotes(buildInputDTO.getNotes());
        build.setCategory(buildInputDTO.getCategory());

        return build;
    }
}
