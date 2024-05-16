import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Users} from "./Users";
import {BuildComponents} from "./BuildsComponents";
import {Sellers} from "./Sellers";

@Entity("Components")
export class Components {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 50 })
    type: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    description: string | null;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'decimal', precision: 10, scale: 0 })
    amazon_price: number;

    @Column({ type: 'decimal', precision: 10, scale: 0 })
    ebay_price: number;

    @ManyToOne(() => Sellers, seller => seller.components)
    seller: Sellers;

    @Column({ type: 'boolean' })
    deleted: boolean;

    @OneToMany(() => BuildComponents, buildComponent => buildComponent.component)
    buildComponents: BuildComponents[];
}