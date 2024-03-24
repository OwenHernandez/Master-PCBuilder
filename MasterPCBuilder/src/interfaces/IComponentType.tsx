export default interface IComponentType {
    id: number;
    name: string;
    price: number;
    amazon_price: number;
    ebay_price: number;
    type: string;
    image: string;
    description: string;
    sellerName: string;
    userNick: string;
    wished?: boolean;
}