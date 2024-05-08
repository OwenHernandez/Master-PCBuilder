import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn} from "typeorm";
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 30 })
    nick: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    picture: string;

    @Column()
    active: boolean;

    @Column()
    hash: string;

    @Column({ length: 30 })
    role: string;

    @Column()
    deleted: boolean;

    @OneToMany(() => Build, build => build.user)
    builds: Build[];

    @OneToMany(() => Blocked, blocked => blocked.userWhoBlocked)
    blockers: Blocked[];

    @OneToMany(() => Blocked, blocked => blocked.userBlocked)
    blocked: Blocked[];

    @OneToMany(() => Friend, friend => friend.user1)
    friendsInitiated: Friend[];

    @OneToMany(() => Friend, friend => friend.user2)
    friendsReceived: Friend[];

    @OneToMany(() => Like, like => like.user)
    likes: Like[];

    @OneToMany(() => Post, post => post.user)
    posts: Post[];

    @OneToMany(() => GroupChatsUsers, groupChatsUsers => groupChatsUsers.user)
    groupChats: GroupChatsUsers[];

    @OneToMany(() => PriceAlert, priceAlert => priceAlert.user)
    priceAlerts: PriceAlert[];

    @OneToMany(() => Component, component => component.user)
    components: Component[];

    @OneToMany(() => Wishlist, wishlist => wishlist.user)
    wishlists: Wishlist[];
}
@Entity()
export class Build {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 20, default: 'nameless' })
    name: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    notes: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    totalPrice: number;

    @ManyToOne(() => User, user => user.builds)
    user: User;

    @Column({ length: 50, nullable: true })
    category: string;

    @Column("bigint")
    dateOfCreation: number;

    @Column()
    deleted: boolean;

    @OneToMany(() => BuildComponent, buildComponent => buildComponent.build)
    buildComponents: BuildComponent[];

    @OneToMany(() => Post, post => post.build)
    posts: Post[];
}
@Entity()
export class BuildComponent {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Build, build => build.buildComponents)
    @JoinColumn({ name: "build_id" })
    build: Build;

    @ManyToOne(() => Component, component => component.buildComponents)
    @JoinColumn({ name: "component_id" })
    component: Component;

    @Column("decimal", { precision: 10, scale: 2 })
    priceAtTheTime: number;

    @Column("bigint")
    dateCreated: number;
}
@Entity()
export class Component {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 50 })
    type: string;

    @Column({ nullable: true })
    image: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    description: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    price: number;

    @Column({ type: "decimal", precision: 10, scale: 0 })
    amazonPrice: number;

    @Column({ type: "decimal", precision: 10, scale: 0 })
    ebayPrice: number;

    @ManyToOne(() => Seller, seller => seller.components)
    seller: Seller;

    @ManyToOne(() => User, user => user.components)
    user: User;

    @Column()
    deleted: boolean;

    @OneToMany(() => BuildComponent, buildComponent => buildComponent.component)
    buildComponents: BuildComponent[];

    @OneToMany(() => PriceHistory, priceHistory => priceHistory.component)
    priceHistories: PriceHistory[];

    @OneToMany(() => PriceAlert, priceAlert => priceAlert.component)
    priceAlerts: PriceAlert[];

    @OneToMany(() => Wishlist, wishlist => wishlist.component)
    wishlists: Wishlist[];
}
@Entity()
export class Blocked {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.blockers)
    @JoinColumn({ name: "user_who_blocked_id" })
    userWhoBlocked: User;

    @ManyToOne(() => User, user => user.blocked)
    @JoinColumn({ name: "user_blocked_id" })
    userBlocked: User;
}
@Entity()
export class Friend {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.friendsInitiated)
    @JoinColumn({ name: "user_id1" })
    user1: User;

    @ManyToOne(() => User, user => user.friendsReceived)
    @JoinColumn({ name: "user_id2" })
    user2: User;
}
@Entity()
export class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.likes)
    user: User;

    @ManyToOne(() => Post, post => post.likes)
    @JoinColumn({ name: "post_id" })
    post: Post;
}
@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    title: string;

    @Column({ nullable: true })
    image: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    description: string;

    @ManyToOne(() => Build, build => build.posts)
    build: Build;

    @ManyToOne(() => User, user => user.posts)
    user: User;

    @Column()
    deleted: boolean;

    @OneToMany(() => Like, like => like.post)
    likes: Like[];
}
@Entity()
export class GroupChat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    name: string;

    @Column({ type: "varchar", length: 100 })
    description: string;

    @Column("bigint")
    dateOfCreation: number;

    @Column()
    picture: string;

    @Column()
    deleted: boolean;

    @OneToMany(() => GroupChatsUsers, groupChatsUsers => groupChatsUsers.groupChat)
    users: GroupChatsUsers[];
}
@Entity()
export class GroupChatsUsers {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => GroupChat, groupChat => groupChat.users)
    @JoinColumn({ name: "group_chat_id" })
    groupChat: GroupChat;

    @ManyToOne(() => User, user => user.groupChats)
    @JoinColumn({ name: "user_id" })
    user: User;
}
@Entity()
export class PriceAlert {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.priceAlerts)
    user: User;

    @ManyToOne(() => Component, component => component.priceAlerts)
    @JoinColumn({ name: "component_id" })
    component: Component;

    @Column("decimal", { precision: 10, scale: 2 })
    targetPrice: number;

    @Column()
    alertActive: boolean;
}
@Entity()
export class PriceHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "decimal", precision: 10, scale: 0 })
    ebayPrice: number;

    @Column({ type: "decimal", precision: 10, scale: 0 })
    amazonPrice: number;

    @Column({ type: "decimal", precision: 10, scale: 0 })
    price: number;

    @Column("bigint")
    date: number;

    @ManyToOne(() => Component, component => component.priceHistories)
    @JoinColumn({ name: "component_id" })
    component: Component;
}
@Entity()
export class Wishlist {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.wishlists)
    user: User;

    @ManyToOne(() => Component, component => component.wishlists)
    component: Component;
}
@Entity()
export class Seller {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ nullable: true })
    image: string;

    @Column()
    deleted: boolean;

    @OneToMany(() => Component, component => component.seller)
    components: Component[];
}
