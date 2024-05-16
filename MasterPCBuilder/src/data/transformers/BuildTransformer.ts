import {Builds} from "../entities/Builds";
import {BuildDTO} from "../dtos/BuildDTO";
import {transformBuildComponentDTOToEntity, transformBuildComponentToDTO} from "./BuildComponentTransformer";
import {Users} from "../entities/Users";
import {UserRepository} from "../Database";
import {BuildComponents} from "../entities/BuildsComponents";

export function transformBuildToDTO(build: Builds): BuildDTO {
    return {
        id: build.id,
        name: build.name,
        notes: build.notes,
        totalPrice: build.totalPrice,
        category: build.category,
        userNick: build.user ? build.user.nick : null,
        deleted: build.deleted,
        buildsComponents: build.buildsComponents.map(transformBuildComponentToDTO)
    };
}

export async function transformBuildDTOToEntity(dto: BuildDTO) {
    let build = new Builds();
    build.id = dto.id;
    build.name = dto.name;
    build.notes = dto.notes;
    build.totalPrice = dto.totalPrice;
    build.category = dto.category;
    build.deleted = dto.deleted;
    // Necesitarás decidir cómo manejar la relación 'user' (usualmente buscando el usuario por nick o ID)
    let newUser: Users;
    UserRepository.findOneBy({nick: dto.userNick}).then(user => newUser = user);
    build.user = newUser;
    if (dto.buildsComponents) {
        dto.buildsComponents.map(async buildComponent => {
            build.buildsComponents.push(await transformBuildComponentDTOToEntity(buildComponent));
        });
    }
    return build;
}
