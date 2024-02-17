export default interface IUserType {
    id: number;
    nick: string;
    email: string;
    picture: string;
    friends: IUserType[];
}