import {Components} from "../entities/Components";
import {ComponentDTO} from "../dtos/ComponentDTO";
import {SellerRepository} from "../Database";
import {Sellers} from "../entities/Sellers";

export function transformComponentToDTO(component: Components): ComponentDTO {
    return {
        id: component.id,
        name: component.name,
        type: component.type,
        description: component.description,
        price: component.price,
        amazon_price: component.amazon_price,
        ebay_price: component.ebay_price,
        deleted: component.deleted,
        sellerName: component.seller ? component.seller.name : null,
    };
}

export async function transformComponentDTOToEntity(dto: ComponentDTO) {
    let component = new Components();
    component.id = dto.id;
    component.name = dto.name;
    component.type = dto.type;
    component.description = dto.description;
    component.price = dto.price;
    component.amazon_price = dto.amazon_price;
    component.ebay_price = dto.ebay_price;
    component.deleted = dto.deleted;
    if (dto.sellerName) {
        let seller = await SellerRepository.findOneBy({name: dto.sellerName});
        if (!seller) {
            seller = new Sellers();
            seller.name = dto.sellerName;
            seller.deleted = false;
            seller.components = [];
            seller.components.push(component);
            try {
                seller = await SellerRepository.save(seller);
            } catch (e) {
                console.error("Error al guardar el vendedor:", e);
                throw new Error("Error al guardar el vendedor.");
            }
        }
        component.seller = seller;
    }
    return component;
}