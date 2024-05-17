import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Components} from "./Components";

@Entity("Sellers")
export class Sellers {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'boolean' })
    deleted: boolean;

    @OneToMany(() => Components, component => component.seller)
    components: Components[];
}