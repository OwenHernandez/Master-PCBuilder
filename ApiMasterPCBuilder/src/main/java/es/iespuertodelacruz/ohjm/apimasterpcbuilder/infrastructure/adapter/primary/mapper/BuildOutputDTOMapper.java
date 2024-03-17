package es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.mapper;

import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.Build;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.domain.model.BuildComponent;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.BuildComponentDTO;
import es.iespuertodelacruz.ohjm.apimasterpcbuilder.infrastructure.adapter.primary.dto.BuildOutputDTO;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

public class BuildOutputDTOMapper {
    Logger log;

    ComponentOutputDTOMapper outputDTOMapper = new ComponentOutputDTOMapper();

    public BuildOutputDTO  toDTO(Build build) {
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
                log= Logger.getLogger(BuildOutputDTOMapper.class.getName());
                if (bc.getComponent() != null) {
                    bcDTO.setComponent(outputDTOMapper.toDTO(bc.getComponent()));
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
}
