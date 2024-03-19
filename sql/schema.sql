DROP DATABASE IF EXISTS MASTER;
CREATE DATABASE MASTER;
USE MASTER;

DROP TABLE IF EXISTS BUILDS_COMPONENTS;
DROP TABLE IF EXISTS LIKES;
DROP TABLE IF EXISTS FRIENDS;
DROP TABLE IF EXISTS POSTS;
DROP TABLE IF EXISTS COMPONENTS;
DROP TABLE IF EXISTS SELLERS;
DROP TABLE IF EXISTS BUILDS;
DROP TABLE IF EXISTS USERS;


CREATE TABLE `BUILDS` (
  `ID` int NOT NULL,
  `NAME` varchar(20) DEFAULT 'nameless',
  `NOTES` varchar(255) DEFAULT NULL,
  `TOTAL_PRICE` decimal(10,2) NOT NULL,
  `USER_ID` int NOT NULL
) ;

--
-- Volcado de datos para la tabla `BUILDS`
--

INSERT INTO `BUILDS` (`ID`, `NAME`, `NOTES`, `TOTAL_PRICE`, `USER_ID`) VALUES
(1, 'Gaming PC', 'High-end gaming PC build', 1500.00, 1),
(2, 'Workstation', 'Professional video editing workstation', 2000.00, 2),
(3, 'Budget PC', 'Entry-level budget PC', 800.00, 1),
(4, 'CosoBuildReborn', 'jgkfdhjehgdfhjgbkjngfldnbngfbjk', 50.00, 5),
(9, 'string23', 'string', 1320.00, 5),
(10, 'gfdsgds', 'gdfsgsd', 520.00, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `BUILDS_COMPONENTS`
--

CREATE TABLE `BUILDS_COMPONENTS` (
  `ID` int NOT NULL,
  `BUILD_ID` int NOT NULL,
  `COMPONENT_ID` int NOT NULL,
  `PRICE_AT_THE_TIME` decimal(10,2) NOT NULL,
  `DATE_CREATED` bigint NOT NULL
) ;

--
-- Volcado de datos para la tabla `BUILDS_COMPONENTS`
--

INSERT INTO `BUILDS_COMPONENTS` (`ID`, `BUILD_ID`, `COMPONENT_ID`, `PRICE_AT_THE_TIME`, `DATE_CREATED`) VALUES
(1, 1, 1, 800.00, 20240201),
(2, 1, 2, 400.00, 20240201),
(3, 1, 3, 120.00, 20240201),
(4, 2, 2, 400.00, 20240202),
(5, 2, 3, 120.00, 20240202),
(6, 3, 4, 150.00, 20240203),
(18, 10, 2, 400.00, 1708560000000),
(19, 10, 3, 120.00, 1708560000000),
(29, 9, 1, 800.00, 1708560000000),
(30, 9, 2, 400.00, 1708560000000),
(31, 9, 3, 120.00, 1708560000000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `COMPONENTS`
--

CREATE TABLE `COMPONENTS` (
  `ID` int NOT NULL,
  `NAME` varchar(100) NOT NULL,
  `TYPE` varchar(50) NOT NULL,
  `IMAGE` varchar(255) DEFAULT NULL,
  `DESCRIPTION` varchar(100) DEFAULT NULL,
  `PRICE` decimal(10,2) NOT NULL,
  `SELLER_ID` int NOT NULL,
  `USER_ID` int NOT NULL
) ;

--
-- Volcado de datos para la tabla `COMPONENTS`
--

INSERT INTO `COMPONENTS` (`ID`, `NAME`, `TYPE`, `IMAGE`, `DESCRIPTION`, `PRICE`, `SELLER_ID`, `USER_ID`) VALUES
(1, 'Graphics Card', 'GPU', 'gpu.jpg', 'NVIDIA RTX 3080', 800.00, 1, 1),
(2, 'Processor', 'CPU', 'cpu.jpg', 'AMD Ryzen 7 5800X', 400.00, 2, 3),
(3, 'Memory', 'RAM', 'ram.jpg', 'Corsair Vengeance 16GB', 120.00, 3, 4),
(4, 'Storage', 'Storage', 'ssd.jpg', 'Samsung 1TB SSD', 150.00, 1, 2),
(9, 'AMD Ryzen 5 5500', 'CPU', NULL, 'fhkjdhka', 100.00, 1, 5),
(10, 'i5', 'CPU', NULL, 'gdfgf', 100.00, 1, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `FRIENDS`
--

CREATE TABLE `FRIENDS` (
  `ID` int NOT NULL,
  `USER_ID1` int NOT NULL,
  `USER_ID2` int NOT NULL
) ;

--
-- Volcado de datos para la tabla `FRIENDS`
--

INSERT INTO `FRIENDS` (`ID`, `USER_ID1`, `USER_ID2`) VALUES
(35, 5, 1),
(36, 5, 2),
(37, 5, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `LIKES`
--

CREATE TABLE `LIKES` (
  `ID` int NOT NULL,
  `USER_ID` int NOT NULL,
  `POST_ID` int NOT NULL
) ;

--
-- Volcado de datos para la tabla `LIKES`
--

INSERT INTO `LIKES` (`ID`, `USER_ID`, `POST_ID`) VALUES
(1, 1, 2),
(2, 2, 1),
(3, 3, 3),
(4, 2, 4),
(6, 5, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `POSTS`
--

CREATE TABLE `POSTS` (
  `ID` int NOT NULL,
  `TITLE` varchar(50) NOT NULL,
  `IMAGE` varchar(255) DEFAULT NULL,
  `DESCRIPTION` varchar(100) DEFAULT NULL,
  `BUILD_ID` int NOT NULL,
  `USER_ID` int NOT NULL
) ;

--
-- Volcado de datos para la tabla `POSTS`
--

INSERT INTO `POSTS` (`ID`, `TITLE`, `IMAGE`, `DESCRIPTION`, `BUILD_ID`, `USER_ID`) VALUES
(1, 'My Gaming PC Setup', 'gaming_setup.jpg', 'Just finished building my dream gaming PC!', 1, 1),
(2, 'Video Editing Rig', 'video_editing.jpg', 'Check out my new video editing setup!', 2, 2),
(3, 'Budget PC Build', 'budget_build.jpg', 'Built a budget-friendly PC for everyday use.', 3, 1),
(4, 'CosoPost', 'coso.png', 'cosocosocosocosocosocosocosocosocoso', 9, 5),
(6, 'fewfew', NULL, 'fefgregre', 9, 5),
(7, 'fewfew2', NULL, 'fefgregre', 9, 5),
(8, 'Post', NULL, 'jgdklsf', 4, 5),
(9, 'PostCreado', NULL, 'ghkjfdhsgskgfsdgdfsdfsgdfsgdfgdfgdfsgfdgdfgfdgsd', 4, 5),
(10, 'Post32131', NULL, 'gfhdgfhdf', 4, 5),
(11, 'Post947283', NULL, 'glfdsjgdfskj', 4, 5),
(12, 'Post947283', NULL, 'glfdsjgdfskj', 4, 5),
(13, 'Post947283', NULL, 'glfdsjgdfskj', 4, 5),
(14, 'Post947283', NULL, 'glfdsjgdfskj', 4, 5),
(15, 'Post947283', NULL, 'glfdsjgdfskj', 4, 5),
(16, 'Post42739852', NULL, 'glfdsjgdfskj', 9, 5),
(17, 'PostEjemplo', 'Coso_Coso_1000000034_1.png', 'gkjfdshkjgdfks', 4, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `SELLERS`
--

CREATE TABLE `SELLERS` (
  `ID` int NOT NULL,
  `NAME` varchar(100) NOT NULL,
  `IMAGE` varchar(255) DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `SELLERS`
--

INSERT INTO `SELLERS` (`ID`, `NAME`, `IMAGE`) VALUES
(1, 'TechStore', 'techstore_logo.jpg'),
(2, 'PCParts', 'pcparts_logo.jpg'),
(3, 'ElectroGadgets', 'electrogadgets_logo.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `USERS`
--

CREATE TABLE `USERS` (
  `ID` int NOT NULL,
  `NICK` varchar(30) NOT NULL,
  `EMAIL` varchar(255) NOT NULL,
  `PASSWORD` varchar(255) NOT NULL,
  `PICTURE` varchar(255) DEFAULT NULL,
  `ACTIVE` tinyint DEFAULT '0',
  `HASH` varchar(255) NOT NULL,
  `ROLE` varchar(30) NOT NULL
) ;

--
-- Volcado de datos para la tabla `USERS`
--

INSERT INTO `USERS` (`ID`, `NICK`, `EMAIL`, `PASSWORD`, `PICTURE`, `ACTIVE`, `HASH`, `ROLE`) VALUES
(1, 'user1', 'user1@example.com', 'password1', 'user1.jpg', 1, 'hash1', 'admin'),
(2, 'user2', 'user2@example.com', 'password2', 'user2.jpg', 1, 'hash2', 'user'),
(3, 'user3', 'user3@example.com', 'password3', 'user3.jpg', 0, 'hash3', 'user'),
(4, 'user4', 'user4@example.com', 'password4', 'user4.jpg', 1, 'hash4', 'user'),
(5, 'Coso', 'coso8610@gmail.com', '$2a$10$NBBTHdG7zOzOjIc6J2x4NOo8VzXoE/BMXZCp.W.qiLv.pBXCMUHAy', 'Coso_1000000034_1.png', 1, '$2a$10$W3Ct4gFZhjMQqOIYmoLeX.v9Ttz5LP2Y.m4PwpDxy9rBdAck91V8S', 'ROLE_ADMIN'),
(6, 'Owen', 'owentoto423@gmail.com', '$2a$10$wp9TcVafCLnM5plLABRUM.RZQUaktNavFsURk40r3rIJ/kB0LYtdG', NULL, 1, '$2a$10$4tROCfVeZal6U9q2djI4p.QUpd8A9F4oFShpdFpr0JF0jpjiC.o4S', 'ROLE_USER');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `WISHLIST`
--

CREATE TABLE `WISHLIST` (
  `ID` int NOT NULL,
  `USER_ID` int NOT NULL,
  `COMPONENT_ID` int NOT NULL
) ;

--
-- Volcado de datos para la tabla `WISHLIST`
--

INSERT INTO `WISHLIST` (`ID`, `USER_ID`, `COMPONENT_ID`) VALUES
(1, 1, 1),
(2, 1, 3),
(3, 1, 9),
(4, 2, 2),
(5, 2, 4),
(6, 3, 1),
(7, 3, 10),
(8, 4, 2),
(9, 4, 9),
(10, 5, 3),
(11, 5, 4),
(12, 6, 10);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `BUILDS`
--
ALTER TABLE `BUILDS`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_USER_BUILD` (`USER_ID`);

--
-- Indices de la tabla `BUILDS_COMPONENTS`
--
ALTER TABLE `BUILDS_COMPONENTS`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_BUILD_BUILD_COMPONENT` (`BUILD_ID`),
  ADD KEY `FK_COMPONENT_BUILD_COMPONENT` (`COMPONENT_ID`);

--
-- Indices de la tabla `COMPONENTS`
--
ALTER TABLE `COMPONENTS`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_SELLER_COMPONENT` (`SELLER_ID`),
  ADD KEY `FK_USER_COMPONENT` (`USER_ID`);

--
-- Indices de la tabla `FRIENDS`
--
ALTER TABLE `FRIENDS`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_USER1_FRIEND` (`USER_ID1`),
  ADD KEY `FK_USER2_FRIEND` (`USER_ID2`);

--
-- Indices de la tabla `LIKES`
--
ALTER TABLE `LIKES`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_USER_LIKE` (`USER_ID`),
  ADD KEY `FK_POST_LIKE` (`POST_ID`);

--
-- Indices de la tabla `POSTS`
--
ALTER TABLE `POSTS`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_BUILD_POST` (`BUILD_ID`),
  ADD KEY `FK_USER_POST` (`USER_ID`);

--
-- Indices de la tabla `SELLERS`
--
ALTER TABLE `SELLERS`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `UQ_NAME_SELLER` (`NAME`);

--
-- Indices de la tabla `USERS`
--
ALTER TABLE `USERS`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `UQ_NICK_USER` (`NICK`),
  ADD UNIQUE KEY `UQ_EMAIL_USER` (`EMAIL`);

--
-- Indices de la tabla `WISHLIST`
--
ALTER TABLE `WISHLIST`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `FK_USER_WISHLIST` (`USER_ID`),
  ADD KEY `FK_COMPONENT_WISHLIST` (`COMPONENT_ID`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `BUILDS`
--
ALTER TABLE `BUILDS`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `BUILDS_COMPONENTS`
--
ALTER TABLE `BUILDS_COMPONENTS`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `COMPONENTS`
--
ALTER TABLE `COMPONENTS`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `FRIENDS`
--
ALTER TABLE `FRIENDS`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT de la tabla `LIKES`
--
ALTER TABLE `LIKES`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `POSTS`
--
ALTER TABLE `POSTS`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `SELLERS`
--
ALTER TABLE `SELLERS`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `USERS`
--
ALTER TABLE `USERS`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `WISHLIST`
--
ALTER TABLE `WISHLIST`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `BUILDS`
--
ALTER TABLE `BUILDS`
  ADD CONSTRAINT `FK_USER_BUILD` FOREIGN KEY (`USER_ID`) REFERENCES `USERS` (`ID`);

--
-- Filtros para la tabla `BUILDS_COMPONENTS`
--
ALTER TABLE `BUILDS_COMPONENTS`
  ADD CONSTRAINT `FK_BUILD_BUILD_COMPONENT` FOREIGN KEY (`BUILD_ID`) REFERENCES `BUILDS` (`ID`),
  ADD CONSTRAINT `FK_COMPONENT_BUILD_COMPONENT` FOREIGN KEY (`COMPONENT_ID`) REFERENCES `COMPONENTS` (`ID`);

--
-- Filtros para la tabla `COMPONENTS`
--
ALTER TABLE `COMPONENTS`
  ADD CONSTRAINT `FK_SELLER_COMPONENT` FOREIGN KEY (`SELLER_ID`) REFERENCES `SELLERS` (`ID`),
  ADD CONSTRAINT `FK_USER_COMPONENT` FOREIGN KEY (`USER_ID`) REFERENCES `USERS` (`ID`);

--
-- Filtros para la tabla `FRIENDS`
--
ALTER TABLE `FRIENDS`
  ADD CONSTRAINT `FK_USER1_FRIEND` FOREIGN KEY (`USER_ID1`) REFERENCES `USERS` (`ID`),
  ADD CONSTRAINT `FK_USER2_FRIEND` FOREIGN KEY (`USER_ID2`) REFERENCES `USERS` (`ID`);

--
-- Filtros para la tabla `LIKES`
--
ALTER TABLE `LIKES`
  ADD CONSTRAINT `FK_POST_LIKE` FOREIGN KEY (`POST_ID`) REFERENCES `POSTS` (`ID`),
  ADD CONSTRAINT `FK_USER_LIKE` FOREIGN KEY (`USER_ID`) REFERENCES `USERS` (`ID`);

--
-- Filtros para la tabla `POSTS`
--
ALTER TABLE `POSTS`
  ADD CONSTRAINT `FK_BUILD_POST` FOREIGN KEY (`BUILD_ID`) REFERENCES `BUILDS` (`ID`),
  ADD CONSTRAINT `FK_USER_POST` FOREIGN KEY (`USER_ID`) REFERENCES `USERS` (`ID`);

--
-- Filtros para la tabla `WISHLIST`
--
ALTER TABLE `WISHLIST`
  ADD CONSTRAINT `FK_COMPONENT_WISHLIST` FOREIGN KEY (`COMPONENT_ID`) REFERENCES `COMPONENTS` (`ID`),
  ADD CONSTRAINT `FK_USER_WISHLIST` FOREIGN KEY (`USER_ID`) REFERENCES `USERS` (`ID`);
COMMIT;

