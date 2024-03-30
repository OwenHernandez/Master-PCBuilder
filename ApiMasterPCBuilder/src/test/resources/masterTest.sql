SET MODE MYSQL;

DROP TABLE IF EXISTS `wishlist`;
DROP TABLE IF EXISTS `likes`;
DROP TABLE IF EXISTS `builds_components`;
DROP TABLE IF EXISTS `components`;
DROP TABLE IF EXISTS `posts`;
DROP TABLE IF EXISTS `builds`;
DROP TABLE IF EXISTS `blocked`;
DROP TABLE IF EXISTS `friends`;
DROP TABLE IF EXISTS `group_chats_users`;
DROP TABLE IF EXISTS `group_chats`;
DROP TABLE IF EXISTS `sellers`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users`
(
    `ID`       int          NOT NULL AUTO_INCREMENT,
    `NICK`     varchar(30)  NOT NULL,
    `EMAIL`    varchar(255) NOT NULL,
    `PASSWORD` varchar(255) NOT NULL,
    `PICTURE`  varchar(255) DEFAULT NULL,
    `ACTIVE`   tinyint      DEFAULT '0',
    `HASH`     varchar(255) NOT NULL,
    `ROLE`     varchar(30)  NOT NULL,
    PRIMARY KEY (`ID`),
    UNIQUE (`NICK`),
    UNIQUE (`EMAIL`)
);

CREATE TABLE `sellers`
(
    `ID`    int          NOT NULL AUTO_INCREMENT,
    `NAME`  varchar(100) NOT NULL,
    `IMAGE` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`ID`),
    UNIQUE (`NAME`)
);

CREATE TABLE `builds`
(
    `ID`               int            NOT NULL AUTO_INCREMENT,
    `NAME`             varchar(20)  DEFAULT 'nameless',
    `NOTES`            varchar(255) DEFAULT NULL,
    `TOTAL_PRICE`      decimal(10, 2) NOT NULL,
    `USER_ID`          int            NOT NULL,
    `CATEGORY`         varchar(50)  DEFAULT NULL,
    `DATE_OF_CREATION` bigint       DEFAULT NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT `FK_USER_BUILD` FOREIGN KEY (`USER_ID`) REFERENCES `users` (`ID`)
);

CREATE TABLE `posts`
(
    `ID`          int         NOT NULL AUTO_INCREMENT,
    `TITLE`       varchar(50) NOT NULL,
    `IMAGE`       varchar(255) DEFAULT NULL,
    `DESCRIPTION` varchar(100) DEFAULT NULL,
    `BUILD_ID`    int         NOT NULL,
    `USER_ID`     int         NOT NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT `FK_BUILD_POST` FOREIGN KEY (`BUILD_ID`) REFERENCES `builds` (`ID`),
    CONSTRAINT `FK_USER_POST` FOREIGN KEY (`USER_ID`) REFERENCES `users` (`ID`)
);

CREATE TABLE `components`
(
    `ID`           int            NOT NULL AUTO_INCREMENT,
    `NAME`         varchar(100)   NOT NULL,
    `IMAGE`        varchar(255)   DEFAULT NULL,
    `DESCRIPTION`  varchar(100)   DEFAULT NULL,
    `PRICE`        decimal(10, 2) NOT NULL,
    `SELLER_ID`    int            NOT NULL,
    `USER_ID`      int            NOT NULL,
    `TYPE`         varchar(20)    NOT NULL,
    `AMAZON_PRICE` decimal(10, 2) DEFAULT NULL,
    `EBAY_PRICE`   decimal(10, 2) DEFAULT NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT `FK_SELLER_COMPONENT` FOREIGN KEY (`SELLER_ID`) REFERENCES `sellers` (`ID`),
    CONSTRAINT `FK_USER_COMPONENTS` FOREIGN KEY (`USER_ID`) REFERENCES `users` (`ID`)
);

CREATE TABLE `builds_components`
(
    `ID`                int            NOT NULL AUTO_INCREMENT,
    `BUILD_ID`          int            NOT NULL,
    `COMPONENT_ID`      int            NOT NULL,
    `PRICE_AT_THE_TIME` decimal(10, 2) NOT NULL,
    `DATE_CREATED`      bigint         NOT NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT `FK_BUILD_BUILD_COMPONENT` FOREIGN KEY (`BUILD_ID`) REFERENCES `builds` (`ID`),
    CONSTRAINT `FK_COMPONENT_BUILD_COMPONENT` FOREIGN KEY (`COMPONENT_ID`) REFERENCES `components` (`ID`)
);

CREATE TABLE `group_chats`
(
    `ID`               int          NOT NULL AUTO_INCREMENT,
    `NAME`             varchar(50)  NOT NULL,
    `DESCRIPTION`      varchar(100) NOT NULL,
    `DATE_OF_CREATION` bigint       NOT NULL,
    `GROUP_ADMIN_ID`   int          NOT NULL,
    `PICTURE`          varchar(255) NOT NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT `GROUP_CHAT_ADMIN_ID` FOREIGN KEY (`GROUP_ADMIN_ID`) REFERENCES `users` (`ID`)
);

CREATE TABLE `group_chats_users`
(
    `ID`            int NOT NULL AUTO_INCREMENT,
    `GROUP_CHAT_ID` int NOT NULL,
    `USER_ID`       int NOT NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT `FK_GROUP_CHATS_GROUP_CHAT` FOREIGN KEY (`GROUP_CHAT_ID`) REFERENCES `group_chats` (`ID`),
    CONSTRAINT `FK_GROUP_CHATS_USER` FOREIGN KEY (`USER_ID`) REFERENCES `users` (`ID`)
);

CREATE TABLE `blocked`
(
    `ID`                  int NOT NULL AUTO_INCREMENT,
    `USER_WHO_BLOCKED_ID` int NOT NULL,
    `USER_BLOCKED_ID`     int NOT NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT `FK_USERBLOCKED_BLOCKED` FOREIGN KEY (`USER_BLOCKED_ID`) REFERENCES `users` (`ID`),
    CONSTRAINT `FK_USERWHOBLOCKED_BLOCKED` FOREIGN KEY (`USER_WHO_BLOCKED_ID`) REFERENCES `users` (`ID`)
);

CREATE TABLE `friends`
(
    `ID`       int NOT NULL AUTO_INCREMENT,
    `USER_ID1` int NOT NULL,
    `USER_ID2` int NOT NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT `FK_USER1_FRIEND` FOREIGN KEY (`USER_ID1`) REFERENCES `users` (`ID`),
    CONSTRAINT `FK_USER2_FRIEND` FOREIGN KEY (`USER_ID2`) REFERENCES `users` (`ID`)
);

CREATE TABLE `likes`
(
    `ID`      int NOT NULL AUTO_INCREMENT,
    `USER_ID` int NOT NULL,
    `POST_ID` int NOT NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT `FK_POST_LIKE` FOREIGN KEY (`POST_ID`) REFERENCES `posts` (`ID`),
    CONSTRAINT `FK_USER_LIKE` FOREIGN KEY (`USER_ID`) REFERENCES `users` (`ID`)
);

CREATE TABLE `wishlist`
(
    `ID`           int NOT NULL AUTO_INCREMENT,
    `USER_ID`      int NOT NULL,
    `COMPONENT_ID` int NOT NULL,
    PRIMARY KEY (`ID`),
    CONSTRAINT `FK_COMPONENT_WISHLIST` FOREIGN KEY (`COMPONENT_ID`) REFERENCES `components` (`ID`),
    CONSTRAINT `FK_USER_WISHLIST` FOREIGN KEY (`USER_ID`) REFERENCES `users` (`ID`)
);

INSERT INTO `users`
VALUES (1, 'user1', 'user1@example.com', 'password1', 'user1.jpg', 1, 'hash1', 'ROLE_ADMIN'),
       (2, 'user2', 'user2@example.com', 'password2', 'user2.jpg', 1, 'hash2', 'ROLE_USER'),
       (3, 'Coso', 'coso8610@gmail.com', '$2a$10$SZEU19//bprJ96NKVUj9cubMwrF0SFme21kqLj6iHr/4S/vdnYS6G',
        'Coso_1000000033_1.jpg', 1, '$2a$10$JGz5Ymj0rPnICzmh5WAlU.Xeui1OP7umdaFJxNLurTY9CY8Zgmm/u', 'ROLE_ADMIN');

INSERT INTO `sellers`
VALUES (1, 'TechStore', 'techstore_logo.jpg'),
       (2, 'PCParts', 'pcparts_logo.jpg'),
       (3, 'ElectroGadgets', 'electrogadgets_logo.jpg');

INSERT INTO `builds`
VALUES (1, 'Gaming PC', 'High-end gaming PC build', 1500.00, 1, 'Gaming', 576437878532),
       (2, 'Workstation', 'Professional video editing workstation', 2000.00, 2, 'Work', 576437878532),
       (3, 'Budget PC', 'Entry-level budget PC', 800.00, 1, 'Budget', 576437878532);

INSERT INTO `posts`
VALUES (1, 'My Gaming PC Setup', 'Coso_1000000033.jpg', 'Just finished building my dream gaming PC!', 2, 1),
       (2, 'Video Editing Rig', 'video_editing.jpg', 'Check out my new video editing setup!', 2, 2),
       (3, 'Budget PC Build', 'budget_build.jpg', 'Built a budget-friendly PC for everyday use.', 2, 1);

INSERT INTO `components`
VALUES (1, 'Graphics Card', 'Coso_1000000036.jpg', 'NVIDIA RTX 3080', 800.00, 1, 1, 'GPU', 800.00, 700.00),
       (2, 'Processor', 'Coso_1000000034.jpg', 'AMD Ryzen 7 5800X', 400.00, 2, 3, 'CPU', 400.00, 300.00),
       (3, 'Memory', 'Coso_1000000037.jpg', 'Corsair Vengeance 16GB', 120.00, 3, 2, 'RAM', 120.00, 60.00);

INSERT INTO `builds_components`
VALUES (1, 1, 1, 800.00, 1704153600000),
       (2, 1, 2, 400.00, 1704153600000),
       (3, 2, 3, 120.00, 1704153600000);

INSERT INTO `group_chats`
VALUES (1, 'CosoGroup', 'fsdfdsgdfs', 1711411200000, 1, 'jgfkhfg'),
       (2, 'CosoGroupOG!!', 'A group for all the coso enjoyers!!', 1711584000000, 3, 'GroupChat12_1000000033.jpg');

INSERT INTO `group_chats_users`
VALUES (1, 1, 1),
       (2, 1, 2),
       (3, 1, 3);

INSERT INTO `blocked`
VALUES (1, 1, 2),
       (2, 3, 1),
       (3, 2, 3);

INSERT INTO `friends`
VALUES (1, 3, 2),
       (2, 3, 1);

INSERT INTO `likes`
VALUES (1, 1, 2),
       (2, 2, 3),
       (3, 3, 3);

INSERT INTO `wishlist`
VALUES (1, 1, 1),
       (2, 1, 3),
       (3, 3, 2);