import IUserType from "./IUserType";
import IAdminType from "./IAdminType";

export interface IMsgType {
    msg: string;
    author: string;
    receiver?: string;
    topic?: string;
    date: string;
}