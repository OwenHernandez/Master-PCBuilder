import IComponentType from "./IComponentType";

export default interface IPostType {
    title: string;
    image: string;
    priceRange: string;
    description: string;
    components: Array<IComponentType>;
    comments?: Array<string>;
    liked: boolean;
}