import {Users} from "../entities/Users";
import {UserDTO} from "../dtos/UserDTO";

export function transformUserToDTO(user: Users): UserDTO {
    return {
        id: user.id,
        nick: user.nick,
        email: user.email,
        role: user.role,
        deleted: user.deleted
    };
}

export function transformUserDTOToEntity(dto: UserDTO): Users {
    let user = new Users();
    user.id = dto.id;
    user.nick = dto.nick;
    user.email = dto.email;
    user.password = null;
    user.role = dto.role;
    user.deleted = dto.deleted;
    user.builds = [];
    user.posts = [];
    return user;
}