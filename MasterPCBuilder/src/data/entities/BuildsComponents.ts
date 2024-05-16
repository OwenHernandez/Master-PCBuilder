import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Builds} from "./Builds";
import {Components} from "./Components";

@Entity("BuildComponents")
export class BuildComponents {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Builds, build => build.buildComponents)
    @JoinColumn({ name: "build_id" })
    build: Builds;

    @ManyToOne(() => Components, component => component.buildComponents)
    @JoinColumn({ name: "component_id" })
    component: Components;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    priceAtTheTime: number;

    @Column({ type: 'varchar', length: 50 })
    dateCreated: string;
}