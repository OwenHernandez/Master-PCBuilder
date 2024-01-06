import IComponentType from "./IComponentType";

export default interface IBuildType {
    name: string;
    price: string;
    notes?: string;
    components: Array<IComponentType>
}