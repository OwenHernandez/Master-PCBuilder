import IUserType from "./IUserType";
import IAdminType from "./IAdminType";

export interface IMsgType {
    msg: string;
    userSend: IUserType | IAdminType;
    userReceive: IUserType | IAdminType;
}