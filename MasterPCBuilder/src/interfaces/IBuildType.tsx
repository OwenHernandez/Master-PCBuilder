import IComponentType from "./IComponentType";
import IBuildComponentType from "./IBuildComponentType";

export default interface IBuildType {
    id: number | any;
    name: string;
    totalPrice: number;
    notes?: string;
    userNick: string;
    category: any;
    buildsComponents: Array<IBuildComponentType>;
}