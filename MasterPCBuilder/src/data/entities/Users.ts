import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Builds} from "./Builds";
import {Posts} from "./Posts";

@Entity('Users')
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 30 })
    nick: string;

    @Column({ type: 'varchar' })
    email: string;

    @Column({ type: 'varchar', nullable: true })
    password: string | null;

    @Column({ type: 'varchar', length: 30 })
    role: string;

    @Column({ type: 'boolean' })
    deleted: boolean;

    @OneToMany(() => Builds, build => build.user)
    builds: Builds[];

    @OneToMany(() => Posts, post => post.user)
    posts: Posts[];
}