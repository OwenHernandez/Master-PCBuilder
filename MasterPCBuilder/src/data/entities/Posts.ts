import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Builds} from "./Builds";
import {Users} from "./Users";

@Entity("Posts")
export class Posts {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    title: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    description: string | null;

    @ManyToOne(() => Builds, build => build.posts)
    build: Builds;

    @ManyToOne(() => Users, user => user.posts)
    user: Users;

    @Column({ type: 'boolean' })
    deleted: boolean;
}