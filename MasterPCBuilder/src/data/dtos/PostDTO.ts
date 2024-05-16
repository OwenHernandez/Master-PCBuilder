import {BuildDTO} from "./BuildDTO";
import {UserDTO} from "./UserDTO";

export class PostDTO {
    id: number;
    title: string;
    description: string | null;
    build: BuildDTO;
    user: UserDTO;
    deleted: boolean;
}