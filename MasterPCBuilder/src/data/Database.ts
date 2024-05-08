import { DataSource } from "typeorm";
import {
    Build,
    BuildComponent,
    Component,
    Friend,
    GroupChat,
    GroupChatsUsers,
    Like,
    Post, PriceHistory,
    Seller,
    User, Wishlist
} from "./Entities";

export const dataSource = new DataSource({
    type: "react-native",
    location: "default",
    database: "MASTER.db",
    logging: [],
    synchronize: true,
    entities: [
        User,
        Build,
        Component,
        Seller,
        BuildComponent,
        GroupChat,
        GroupChatsUsers,
        Friend,
        Like,
        Post,
        PriceHistory,
        Wishlist
    ]
});

export const UserRepository = dataSource.getRepository(User);
export const BuildRepository = dataSource.getRepository(Build);
export const ComponentRepository = dataSource.getRepository(Component);
export const SellerRepository = dataSource.getRepository(Seller);
export const BuildComponentRepository = dataSource.getRepository(BuildComponent);
export const GroupChatRepository = dataSource.getRepository(GroupChat);
export const GroupChatsUsersRepository = dataSource.getRepository(GroupChatsUsers);
export const FriendRepository = dataSource.getRepository(Friend);
export const LikeRepository = dataSource.getRepository(Like);
export const PostRepository = dataSource.getRepository(Post);
export const PriceHistoryRepository = dataSource.getRepository(PriceHistory);
export const WishlistRepository = dataSource.getRepository(Wishlist);

dataSource.initialize().then(() => {
    console.log("Data Source has been initialized!");
}).catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
