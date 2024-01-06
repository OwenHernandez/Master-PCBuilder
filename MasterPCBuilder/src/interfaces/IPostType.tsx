import IBuildType from "./IBuildType";
import IComponentType from "./IComponentType";
import IUserType from "./IUserType";

export default interface IPostType {
    title: string;
    userPosted: IUserType;
    image: string;
    priceRange: string;
    description: string;
    build: IBuildType;
    comments?: Array<string>;
    liked: boolean;
}