import {Posts} from "../entities/Posts";
import {PostDTO} from "../dtos/PostDTO";
import {transformBuildDTOToEntity, transformBuildToDTO} from "./BuildTransformer";
import {transformUserDTOToEntity, transformUserToDTO} from "./UserTransformer";
import {BuildComponentRepository, BuildRepository, UserRepository} from "../Database";
import {transformBuildComponentDTOToEntity} from "./BuildComponentTransformer";

export function transformPostToDTO(post: Posts): PostDTO {
    return {
        id: post.id,
        title: post.title,
        description: post.description,
        build: post.build ? transformBuildToDTO(post.build) : null,
        user: post.user ? transformUserToDTO(post.user) : null,
        deleted: post.deleted
    };
}

export async function transformPostDTOToEntity(dto: PostDTO) {
    let post = new Posts();
    post.id = dto.id;
    post.title = dto.title;
    post.description = dto.description;
    post.deleted = dto.deleted;

    // Asegurándose de que el usuario existe
    if (dto.user) {
        let existingUser = await UserRepository.findOne({where: {id: dto.user.id}});
        if (!existingUser) {
            try {
                existingUser = await UserRepository.save(transformUserDTOToEntity(dto.user));
            } catch (e) {
                console.error("Error al guardar el usuario:", e);
                throw new Error("Error al guardar el usuario.");
            }
        }
        post.user = existingUser;
    }

    // Asegurándose de que el build existe
    if (dto.build) {
        let existingBuild = await BuildRepository.findOne({where: {id: dto.build.id}});
        if (!existingBuild) {
            try {
                existingBuild = await BuildRepository.save(await transformBuildDTOToEntity(dto.build));
            } catch (e) {
                console.error("Error al guardar el build:", e);
                throw new Error("Error al guardar el build.");
            }
        }
        if (dto.build.buildsComponents) {
            let existingBuildsComponents = await BuildComponentRepository.findBy({build: existingBuild});
            if (!existingBuildsComponents || existingBuildsComponents.length === 0) {
                dto.build.buildsComponents.map(async (buildComponent) => {
                    try {
                        let buildComponentEntity = await transformBuildComponentDTOToEntity(buildComponent);
                        buildComponentEntity.build = existingBuild;
                        existingBuildsComponents.push(await BuildComponentRepository.save(buildComponentEntity));
                    } catch (e) {
                        console.error("Error al guardar el buildComponent:", e);
                        throw new Error("Error al guardar el buildComponent.");
                    }
                });
            }
            existingBuild.buildsComponents = existingBuildsComponents;
        }
        post.build = existingBuild;
    } else {
        console.log("No hay build: " + dto.build);
    }

    return post;
}