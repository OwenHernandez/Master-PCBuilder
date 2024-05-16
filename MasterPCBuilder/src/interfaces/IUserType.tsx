import IComponentType from "./IComponentType";

export default interface IUserType {
    id: number;
    nick: string;
    email: string;
    picture: string;
    friends: IUserType[];
    blockedUsers: IUserType[];
    componentsWanted: IComponentType[];
    deleted: boolean;
}