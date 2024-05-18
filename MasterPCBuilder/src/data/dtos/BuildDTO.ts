import {BuildComponentDTO} from "./BuildComponentDTO";

export class BuildDTO {
    id: number;
    name: string;
    notes: string | null;
    totalPrice: number;
    category: string | null;
    userNick: string; // Puede ser cambiado a userId si es más relevante
    deleted: boolean;
    buildsComponents: BuildComponentDTO[];
}