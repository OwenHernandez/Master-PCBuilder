import {View, Text, TouchableOpacity, FlatList, Image, PixelRatio, TextInput, Modal, LogBox} from 'react-native'
import React, {useEffect, useState} from 'react'
import {Styles} from '../themes/Styles';
import {usePrimaryContext} from '../contexts/PrimaryContext';
import IPostType from '../interfaces/IPostType';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigations/StackNavigator';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Dimensions} from 'react-native';
import HeaderScreen from "../components/HeaderScreen";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import {Globals} from "../components/Globals";
import RNFetchBlob from "rn-fetch-blob";
import Material from "react-native-vector-icons/MaterialCommunityIcons";
import IUserType from "../interfaces/IUserType";
import {PostRepository} from "../data/Database";
import {transformPostDTOToEntity, transformPostToDTO} from "../data/transformers/PostTransformer";

type Props = NativeStackScreenProps<RootStackParamList, 'Posts'>;

const Social = (props: Props) => {
    const {user, darkMode, token} = usePrimaryContext();
    const {navigation, route} = props;
    const posts = route.params?.posts;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const [postsList, setPostsList] = useState([{}] as any[]);
    const [postsFiltered, setPostsFiltered] = useState([{}] as any[]);
    const [categoryToFilter, setCategoryToFilter] = useState(Globals.CATEGORY_ALL);
    const [modalvisible, setModalvisible] = useState<boolean>(false);
    const [byPrice, setByPrice] = useState<boolean>(false);

    useEffect(() => {
        setPostsList([]);
        setPostsFiltered([]);
        getPosts();
    }, [posts, user]);

    /**
     * Function to toggle the visibility of the modal.
     * It inverses the current state of `modalvisible`.
     * If `modalvisible` is true, it will be set to false and vice versa.
     */
    const toggleModal = () => {
        setModalvisible(!modalvisible);
    }

    /**
     * Asynchronous function to fetch posts from the server.
     *
     * This function does the following:
     * 1. Sends a GET request to the server to fetch all posts.
     * 2. Iterates over each post in the response data.
     * 3. For each post, it fetches the post's image and the user's profile picture.
     * 4. If the fetched image is not found, it sets the image to an empty string.
     * 5. Checks if the post is liked by the current user.
     * 6. Counts the total number of likes for the post.
     * 7. Adds the post to the `postsList` and `postsFiltered` states.
     *
     * @async
     * @function
     * @throws Will log any error that occurs during the execution of the function.
     */
    async function getPosts() {
        try {
            const response = await axios.get(Globals.IP_HTTP + "/api/v2/posts", {headers: {"Authorization": "Bearer " + token}});
            for (const post of response.data) {
                try {
                    let newPost = await transformPostDTOToEntity(post);
                    await PostRepository.save(newPost);
                } catch (error) {
                    console.log("Error while trying to save post: ", error.message);
                }
                const getPostFile = await RNFetchBlob.fetch(
                    'GET',
                    Globals.IP_HTTP + '/api/v2/posts/img/' + post.id + '/' + post.image,
                    {Authorization: `Bearer ${token}`}
                );
                if (getPostFile.data !== Globals.IMG_NOT_FOUND) {
                    post.image = getPostFile.base64();
                } else {
                    post.image = "";
                }
                const getUserFile = await RNFetchBlob.fetch(
                    'GET',
                    Globals.IP_HTTP + '/api/v2/users/img/' + post.user.id + '/' + post.user.picture,
                    {Authorization: `Bearer ${token}`}
                );
                if (getUserFile.data !== Globals.IMG_NOT_FOUND) {
                    post.user.picture = getUserFile.base64();
                } else {
                    post.user.picture = "";
                }
                post.liked = isLiked(post);
                post.amountOfLikes = post.usersWhoLiked.length;
                setPostsList(prevPosts => [...prevPosts, post]);
                setPostsFiltered(prevPosts => [...prevPosts, post]);
            }
        } catch (e) {
            try {
                console.error("Error 1: " + e);
                let postOffline = await PostRepository.find({
                    relations: {
                        user: true,
                        build: {
                            buildsComponents: {
                                component: {
                                    seller: true
                                }
                            }
                        }
                    }
                });
                for (const post of postOffline) {
                    let newPost = transformPostToDTO(post);
                    setPostsList(prevPost => [...prevPost, newPost]);
                    setPostsFiltered(prevPost => [...prevPost, newPost]);
                }
            } catch (error) {
                console.error("Error 2: " + error);
            }
        }
    }

    /**
     * Asynchronous function to add or remove a like from a post.
     *
     * This function does the following:
     * 1. Sends a PUT request to the server to add or remove a like from the post.
     * 2. If the request is successful, it toggles the `liked` state of the post.
     * 3. If the post is liked, it increments the `amountOfLikes` by 1.
     * 4. If the post is not liked, it decrements the `amountOfLikes` by 1.
     * 5. Updates the `postsFiltered` state with the updated post.
     *
     * @async
     * @function
     * @param {IPostType} post - The post to add or remove a like from.
     * @throws Will log any error that occurs during the execution of the function.
     */
    async function addRemoveLike(post: IPostType) {
        try {
            const response = await axios.put(
                Globals.IP_HTTP + "/api/v2/posts/" + post.id + "/like/" + user?.id,
                null,
                {headers: {Authorization: "Bearer " + token}}
            );
            post.liked = !post.liked;
            if (post.liked) {
                post.amountOfLikes++;
            } else {
                post.amountOfLikes--;
            }

            setPostsFiltered(postsFiltered.map((postFiltered) => (postFiltered.id === post.id ? post : postFiltered)));
        } catch (err) {
            console.log(err);
        }
    }

    const arrayCategoriaBuilder: Array<string> = [Globals.CATEGORY_ALL, Globals.CATEGORY_GAMING, Globals.CATEGORY_BUDGET, Globals.CATEGORY_WORK];

    /**
     * Function to check if a user is blocked.
     *
     * This function iterates over the `blockedUsers` array of the current user.
     * For each blocked user, it checks if the blocked user's id matches the selected user's id.
     * If a match is found, it returns true, indicating that the selected user is blocked.
     * If no match is found after iterating over the entire array, it returns false.
     *
     * @function
     * @param {IUserType} userSelected - The user to check if they are blocked.
     * @returns {boolean} - Returns true if the selected user is blocked, false otherwise.
     */
    function isBlocked(userSelected: IUserType): boolean {
        for (const blockedUser of user.blockedUsers) {
            if (blockedUser.id === userSelected.id) {
                return true;
            }
        }
        return false;
    }

    /**
     * Function to check if a post is liked by the current user.
     *
     * This function iterates over the `usersWhoLiked` array of the selected post.
     * For each user in the array, it checks if the user's id matches the current user's id.
     * If a match is found, it returns true, indicating that the current user has liked the post.
     * If no match is found after iterating over the entire array, it returns false.
     *
     * @function
     * @param {IPostType} postSelected - The post to check if it is liked by the current user.
     * @returns {boolean} - Returns true if the current user has liked the selected post, false otherwise.
     */
    function isLiked(postSelected: IPostType): boolean {
        for (const userSelected of postSelected.usersWhoLiked) {
            if (userSelected.id === user.id) {
                return true;
            }
        }
        return false;
    }


    return (
        <View style={{flex: 1, backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"}}>
            <HeaderScreen name={route.name} navigation={navigation} profile={false} drawer={true}/>
            <View style={{height: "90%"}}>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}>
                    <TouchableOpacity
                        style={{
                            ...Styles.touchable,
                            borderWidth: 2,
                            borderColor: "#ca2613",
                            justifyContent: "center",
                        }}
                        onPress={() => {
                            toggleModal();
                        }}
                    >
                        <View style={{alignItems: "center"}}>
                            <Text style={{
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black"
                            }}>Filters</Text>
                        </View>
                    </TouchableOpacity>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalvisible}
                        onRequestClose={() => setModalvisible(!modalvisible)}
                    >
                        <View style={{
                            ...Styles.modalContainer,
                            flex: 1,
                            backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"
                        }}>
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"
                            }}>
                                <TouchableOpacity

                                    onPress={() => setModalvisible(!modalvisible)}>
                                    <Material style={{marginTop: "5%", margin: "2%"}} name='close-box'
                                              size={getIconSize(100)}
                                              color={(darkMode) ? "white" : "black"}></Material>
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                justifyContent: "center",
                                backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"
                            }}>
                                <TouchableOpacity
                                    style={Styles.touchable}
                                    onPress={() => {
                                        setModalvisible(!modalvisible);
                                        setPostsFiltered(postsList.sort((a, b) => {
                                            switch (byPrice) {
                                                case true:
                                                    if (a.build.totalPrice < b.build.totalPrice) {
                                                        return 1;
                                                    }

                                                    if (a.build.totalPrice > b.build.totalPrice) {
                                                        return -1;
                                                    }

                                                    return 0;
                                                case false:
                                                    if (a.build.totalPrice > b.build.totalPrice) {
                                                        return 1;
                                                    }

                                                    if (a.build.totalPrice < b.build.totalPrice) {
                                                        return -1;
                                                    }
                                                    return 0;
                                            }
                                        }));
                                        setByPrice(!byPrice);
                                    }}>
                                    <View style={{flexDirection: "row"}}>
                                        <FontAwesome
                                            name={(byPrice) ? 'long-arrow-down' : "long-arrow-up"}
                                            size={getIconSize(80)}
                                            color={(darkMode) ? "white" : "black"}></FontAwesome>
                                        <Text style={{
                                            marginLeft: "5%",
                                            fontSize: getFontSize(20),
                                            color: (darkMode) ? "white" : "black"
                                        }}>By Price</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    <View style={{
                        flex: 3,
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <TextInput
                            placeholder='Search a post by title'
                            placeholderTextColor={"#a3a3a3"}
                            style={{
                                alignItems: "flex-start",
                                borderWidth: 2,
                                borderColor: "#ca2613",

                                paddingHorizontal: "5%",
                                width: "100%",
                                fontSize: getFontSize(15),
                                color: (darkMode) ? "white" : "black"
                            }}
                            onChangeText={(text) => {
                                if (text === "")
                                    setPostsFiltered(postsList);
                                else
                                    setPostsFiltered(postsList.filter((post) => post.title.toLowerCase().includes(text)))
                            }}
                        ></TextInput>
                    </View>
                    <View style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <FontAwesome5Icon
                            name="search"
                            size={getIconSize(80)}
                            color={(darkMode) ? "white" : "black"}
                        />
                    </View>
                </View>
                <View style={{flexDirection: "row", marginHorizontal: "2%", marginRight: "5%"}}>
                    <FlatList
                        data={arrayCategoriaBuilder}
                        horizontal={true}
                        renderItem={(categoria) => {
                            return (
                                <TouchableOpacity
                                    style={{
                                        margin: getIconSize(40),
                                        borderWidth: 2,
                                        borderColor: "#ca2613",
                                        backgroundColor: (categoryToFilter === categoria.item) ? "#676767" : (darkMode) ? "#242121" : "#F5F5F5",
                                        padding: 10,
                                        width: 100
                                    }}
                                    onPress={() => {
                                        if (categoria.item === Globals.CATEGORY_ALL) {
                                            setPostsFiltered(postsList);
                                            setCategoryToFilter(Globals.CATEGORY_ALL);
                                        } else {
                                            setPostsFiltered(postsList.filter((post) => post.build?.category === categoria.item))
                                            switch (categoria.item) {
                                                case Globals.CATEGORY_WORK:
                                                    if (categoryToFilter === Globals.CATEGORY_WORK) {
                                                        setPostsFiltered(postsList);
                                                        setCategoryToFilter(Globals.CATEGORY_ALL);
                                                    } else {
                                                        setCategoryToFilter(Globals.CATEGORY_WORK);
                                                    }
                                                    break;

                                                case Globals.CATEGORY_GAMING:
                                                    if (categoryToFilter === Globals.CATEGORY_GAMING) {
                                                        setPostsFiltered(postsList);
                                                        setCategoryToFilter(Globals.CATEGORY_ALL);
                                                    } else {
                                                        setCategoryToFilter(Globals.CATEGORY_GAMING);
                                                    }
                                                    break;

                                                case Globals.CATEGORY_BUDGET:
                                                    if (categoryToFilter === Globals.CATEGORY_BUDGET) {
                                                        setPostsFiltered(postsList);
                                                        setCategoryToFilter(Globals.CATEGORY_ALL);
                                                    } else {
                                                        setCategoryToFilter(Globals.CATEGORY_BUDGET);
                                                    }
                                                    break;
                                            }
                                        }
                                    }}
                                >
                                    <View style={{alignItems: "center"}}>
                                        <Text style={{
                                            fontSize: getFontSize(20),
                                            color: (darkMode) ? "white" : "black"
                                        }}>{categoria.item}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </View>
                <FlatList
                    data={postsFiltered}
                    renderItem={(post) => {
                        if (post.item.user && !isBlocked(post.item.user) && !post.item.deleted) {
                            return (
                                <TouchableOpacity
                                    style={Styles.touchable}
                                    onPress={() => navigation.navigate("Post", {post: post.item})}
                                >
                                    <View>
                                        <View style={{}}>
                                            <View style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                marginHorizontal: "5%"
                                            }}>
                                                <TouchableOpacity
                                                    style={{alignItems: "center", flexDirection: "row"}}
                                                    onPress={() => (post.item.user?.id !== user.id) ? navigation.navigate("OtherUserProfile", {userSelected: post.item.user}) : navigation.navigate("Profile")}>
                                                    {
                                                        (post.item.user?.picture === "") ?
                                                            <Image
                                                                source={
                                                                    require("../../img/defaultProfilePic.png")
                                                                }
                                                                style={{
                                                                    ...Styles.imageStyle,
                                                                    borderColor: (darkMode) ? "white" : "black",
                                                                    borderWidth: 1,
                                                                    width: getIconSize(100),
                                                                    height: getIconSize(100)
                                                                }}
                                                            />
                                                            :
                                                            <Image
                                                                source={{
                                                                    uri: "data:image/jpeg;base64," + post.item.user?.picture
                                                                }}
                                                                style={{
                                                                    ...Styles.imageStyle,
                                                                    borderColor: (darkMode) ? "white" : "black",
                                                                    borderWidth: 1,
                                                                    width: getIconSize(100),
                                                                    height: getIconSize(100)
                                                                }}
                                                            />
                                                    }
                                                    <Text style={{
                                                        fontSize: getFontSize(15),
                                                        color: (darkMode) ? "white" : "black",
                                                        marginHorizontal: "10%"
                                                    }}>{post.item.user?.nick}</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{
                                                    justifyContent: "space-between",
                                                    flexDirection: "row",
                                                    alignItems: "center"
                                                }} onPress={() => addRemoveLike(post.item)}>
                                                    <FontAwesome
                                                        name={!(post.item.liked) ? 'thumbs-o-up' : 'thumbs-up'}
                                                        size={getIconSize(80)}
                                                        color={(darkMode) ? "white" : "black"}></FontAwesome>
                                                    <Text style={{
                                                        fontSize: getFontSize(18),
                                                        color: (darkMode) ? "white" : "black"
                                                    }}>{" "}{post.item.amountOfLikes}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{margin: "5%"}}>
                                                <Text style={{
                                                    fontSize: getFontSize(20),
                                                    color: (darkMode) ? "white" : "black",
                                                    marginBottom: "5%"
                                                }}>{post.item.title}</Text>
                                                <Text style={{
                                                    fontSize: getFontSize(15),
                                                    color: (darkMode) ? "white" : "black"
                                                }}>Price: {post.item.build?.totalPrice}€</Text>
                                                <Text style={{
                                                    fontSize: getFontSize(15),
                                                    color: (darkMode) ? "white" : "black"
                                                }}>Category: {post.item.build?.category}</Text>
                                            </View>
                                        </View>
                                        <View style={{alignItems: "center"}}>
                                            {
                                                post.item.image !== "" ?
                                                    <Image
                                                        source={{
                                                            uri: "data:image/jpeg;base64," + post.item.image
                                                        }}
                                                        style={{
                                                            width: getIconSize(900),
                                                            height: getIconSize(900),

                                                        }}
                                                    />
                                                    :
                                                    (post.item.build?.category === Globals.CATEGORY_GAMING) ?
                                                        <Image
                                                            source={
                                                                require("../../img/defaultGamingPostImg.png")
                                                            }
                                                            style={{
                                                                width: getIconSize(900),
                                                                height: getIconSize(900),

                                                            }}
                                                        />
                                                        :
                                                        (post.item.build?.category === Globals.CATEGORY_BUDGET) ?
                                                            <Image
                                                                source={
                                                                    require("../../img/defaultBudgetPostImg.jpg")
                                                                }
                                                                style={{
                                                                    width: getIconSize(900),
                                                                    height: getIconSize(900),

                                                                }}
                                                            />
                                                            :
                                                            (post.item.build?.category === Globals.CATEGORY_WORK) ?
                                                                <Image
                                                                    source={
                                                                        require("../../img/defaultWorkPostImg.png")
                                                                    }
                                                                    style={{
                                                                        width: getIconSize(900),
                                                                        height: getIconSize(900),

                                                                    }}
                                                                />
                                                                :
                                                                <Text>No foto</Text>
                                            }
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                    }}
                    keyExtractor={(post, index) => index + ""}
                />
            </View>
        </View>
    )
}

export default Social
