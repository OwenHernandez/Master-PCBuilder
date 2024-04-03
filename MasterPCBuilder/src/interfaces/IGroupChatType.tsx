import IUserType from "./IUserType";

export default interface IGroupChatType {
    id: number,
    name: string,
    description: string,
    picture: string,
    dateOfCreation: string,
    admin: IUserType,
    users: IUserType[]
}