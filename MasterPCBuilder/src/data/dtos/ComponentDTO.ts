export class ComponentDTO {
    id: number;
    name: string;
    type: string;
    description: string | null;
    price: number;
    amazon_price: number;
    ebay_price: number;
    deleted: boolean;
    sellerName: string;
}