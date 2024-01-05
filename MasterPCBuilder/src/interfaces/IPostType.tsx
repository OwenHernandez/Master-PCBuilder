import IComponentType from "./IComponentType";
import IUserType from "./IUserType";

export default interface IPostType {
    title: string;
    userPosted: IUserType;
    image: string;
    priceRange: string;
    description: string;
    components: Array<IComponentType>;
    comments?: Array<string>;
    liked: boolean;
}