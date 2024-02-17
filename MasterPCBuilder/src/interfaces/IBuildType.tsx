import IComponentType from "./IComponentType";
import IBuildComponentType from "./IBuildComponentType";

export default interface IBuildType {
    id: number;
    name: string;
    totalPrice: number;
    notes?: string;
    userNick: string;
    buildsComponents: Array<IBuildComponentType>;
}