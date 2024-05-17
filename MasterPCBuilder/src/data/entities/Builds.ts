import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Users} from "./Users";
import {BuildComponents} from "./BuildsComponents";
import {Posts} from "./Posts";

@Entity("Builds")
export class Builds {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 20, default: 'nameless' })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    notes: string | null;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalPrice: number;

    @ManyToOne(() => Users, user => user.builds)
    user: Users;

    @Column({ type: 'varchar', length: 50, nullable: true })
    category: string | null;

    @Column({ type: 'boolean' })
    deleted: boolean;

    @OneToMany(() => Posts, post => post.build)
    posts: Posts[];

    @OneToMany(() => BuildComponents, buildComponent => buildComponent.build)
    buildsComponents: BuildComponents[];
}