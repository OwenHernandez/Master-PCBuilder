import { DataSource } from "typeorm";
import {Users} from "./entities/Users";
import {Builds} from "./entities/Builds";
import {Components} from "./entities/Components";
import {Sellers} from "./entities/Sellers";
import {BuildComponents} from "./entities/BuildsComponents";
import {Posts} from "./entities/Posts";

export const dataSource = new DataSource({
    type: "react-native",
    location: "default",
    database: "MASTER.db",
    logging: [],
    synchronize: true,
    entities: [
        Users,
        Builds,
        Components,
        Sellers,
        BuildComponents,
        Posts
    ]
});

export const UserRepository = dataSource.getRepository(Users);
export const BuildRepository = dataSource.getRepository(Builds);
export const ComponentRepository = dataSource.getRepository(Components);
export const SellerRepository = dataSource.getRepository(Sellers);
export const BuildComponentRepository = dataSource.getRepository(BuildComponents);
export const PostRepository = dataSource.getRepository(Posts);

dataSource.initialize().then(() => {
    console.log("Data Source has been initialized!");
}).catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
