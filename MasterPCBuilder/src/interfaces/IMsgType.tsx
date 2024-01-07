import IUserType from "./IUserType";

export interface IMsgType {
    msg: string;
    userSend: IUserType;
    userReceive: IUserType;
}