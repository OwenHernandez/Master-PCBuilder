export default interface IUserType {
    nick: string;
    email: string;
    password: string;
    profilePic: string;
    friends: { nick: string }[];
}