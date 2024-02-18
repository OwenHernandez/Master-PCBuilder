import IComponentType from "./IComponentType";

export default interface IBuildComponentType {
    dateCreated: string;
    priceAtTheTime: number;
    component: IComponentType;
}