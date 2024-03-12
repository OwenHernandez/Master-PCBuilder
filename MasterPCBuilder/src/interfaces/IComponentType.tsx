export default interface IComponentType {
    id: number;
    name: string;
    price: number;
    type: string;
    image: string;
    description: string;
    sellerName: string;
    userNick: string;
    wished?: boolean;
}