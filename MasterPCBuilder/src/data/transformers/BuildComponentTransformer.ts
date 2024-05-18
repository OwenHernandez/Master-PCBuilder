import {BuildComponents} from "../entities/BuildsComponents";
import {BuildComponentDTO} from "../dtos/BuildComponentDTO";
import {transformComponentDTOToEntity, transformComponentToDTO} from "./ComponentTransformer";
import {Builds} from "../entities/Builds";
import {ComponentRepository} from "../Database";

export function transformBuildComponentToDTO(buildComponent: BuildComponents): BuildComponentDTO {
    return {
        id: buildComponent.id,
        dateCreated: buildComponent.dateCreated,
        priceAtTheTime: buildComponent.priceAtTheTime,
        component: transformComponentToDTO(buildComponent.component)
    };
}

export async function transformBuildComponentDTOToEntity(dto: BuildComponentDTO) {
    let buildComponent = new BuildComponents();
    buildComponent.id = dto.id;
    buildComponent.dateCreated = dto.dateCreated;
    buildComponent.priceAtTheTime = dto.priceAtTheTime;
    if (dto.component) {
        let component = await ComponentRepository.findOneBy({id: dto.component.id});
        if (!component) {
            try {
                component = await transformComponentDTOToEntity(dto.component);
                await ComponentRepository.save(component);
            } catch (e) {
                console.error("Error al guardar el componente:", e);
                throw new Error("Error al guardar el componente.");
            }
        }
        buildComponent.component = component;
    }

    return buildComponent;
}
