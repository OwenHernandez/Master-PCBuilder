import IUserType from "./IUserType";
import IAdminType from "./IAdminType";

export interface IMsgType {
    content: string;
    author: string;
    receiver?: string;
    topic?: string;
    date: string;
}