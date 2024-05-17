import IBuildType from "./IBuildType";
import IComponentType from "./IComponentType";
import IUserType from "./IUserType";

export default interface IPostType {
    id: number;
    title: string;
    user: IUserType;
    image: string;
    priceRange: string;
    description: string;
    build: IBuildType;
    usersWhoLiked: IUserType[];
    liked: boolean;
    amountOfLikes: number;
    deleted: boolean;
}