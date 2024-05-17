import {ComponentDTO} from "./ComponentDTO";

export class BuildComponentDTO {
    id: number;
    dateCreated: string;
    priceAtTheTime: number;
    component: ComponentDTO; // Referencia al DTO del componente
}