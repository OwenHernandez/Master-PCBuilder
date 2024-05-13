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
import {ComponentRepository, PostRepository} from "../data/Database";
import IComponentType from "../interfaces/IComponentType";
import IPriceHistoryType from "../interfaces/IPriceHistoryType";
import IBuildType from "../interfaces/IBuildType";
import IBuildComponentType from "../interfaces/IBuildComponentType";

type Props = NativeStackScreenProps<RootStackParamList, 'Posts'>;

const Social = (props: Props) => {
    const {user, darkMode, token} = usePrimaryContext();
    const {navigation, route} = props;
    const posts = route.params?.posts;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const [postsList, setPostsList] = useState([{}] as IPostType[]);
    const [postsFiltered, setPostsFiltered] = useState([{}] as IPostType[]);
    const [categoryToFilter, setCategoryToFilter] = useState(Globals.CATEGORY_ALL);
    const [modalvisible, setModalvisible] = useState<boolean>(false);
    const [byPrice, setByPrice] = useState<boolean>(false);
    LogBox.ignoreAllLogs();
    useEffect(() => {
        setPostsList([]);
        setPostsFiltered([]);
        getPosts();
    }, [posts, user]);

    const toggleModal = () => {
        setModalvisible(!modalvisible);
    }

    async function getPosts() {
        try {
            const response = await axios.get(Globals.IP_HTTP + "/api/v2/posts", {headers: {"Authorization": "Bearer " + token}});
            for (const post of response.data) {
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
            let postOffline =await PostRepository.find();
            let postNotInserted = response.data.filter(onlinePost => {
                    return !postOffline.some(offlinePost => offlinePost.id === onlinePost.id);
                }
            );
            for(const post of postNotInserted){
                let insertResult = await PostRepository.insert(post);
            }
        } catch (e) {
            console.log(e);
            let auxPostOffline:Array<IPostType>=[];
            let postOffline = await PostRepository.find();
            for (const post of postOffline) {
                let usersWhoLiked:IUserType[] =[];
                for (const like of post.likes) {
                    let newLikeUser:IUserType ={
                        id: like.user.id,
                        nick: like.user.nick,
                        picture: like.user.picture,
                        blockedUsers: [],
                        componentsWanted:[] ,
                        friends: [],
                        email: like.user.email,
                    }
                    usersWhoLiked.push(newLikeUser);
                }
                let newUser:IUserType ={
                    id: post.user.id,
                    nick: post.user.nick,
                    picture: post.user.picture,
                    blockedUsers: [],
                    componentsWanted:[] ,
                    friends: [],
                    email: post.user.email,
                }
                let auxBuildComponents:IBuildComponentType[] =[];
                for (const build of post.build.buildComponents){
                    let newComponent:IComponentType ={
                        id: build.component.id,
                        name: build.component.name,
                        type: build.component.type,
                        price: build.component.price,
                        image: build.component.image,
                        wished: false,
                        amazon_price: build.component.amazonPrice,
                        ebay_price: build.component.ebayPrice,
                        description: build.component.description,
                        sellerName: build.component.seller.name,
                        userNick: build.component.user.nick,
                        priceHistory: [],
                    }
                    let newBuildComponent:IBuildComponentType ={
                        component: newComponent,
                        dateCreated: build.dateCreated+"",
                        priceAtTheTime: build.priceAtTheTime,
                    }
                    auxBuildComponents.push(newBuildComponent);
                }
                let newBuild:IBuildType={
                    id: post.build.id,
                    category: post.build.category,
                    totalPrice: post.build.totalPrice,
                    buildsComponents: auxBuildComponents,
                    name: post.build.name,
                    notes: post.build.notes,
                    userNick: post.build.user.nick,
                }
                let newPost:IPostType = {
                    id: post.id,
                    title: post.title,
                    image: post.image,
                    build: newBuild,
                    user: newUser,
                    liked: false,
                    amountOfLikes:post.likes.length,
                    usersWhoLiked: usersWhoLiked,
                    description: post.description,
                    priceRange:newBuild.totalPrice+""


                }
                auxPostOffline.push(newPost);
            }
            setPostsList(auxPostOffline);
            setPostsFiltered(auxPostOffline);
            console.log(auxPostOffline)
        }
    }

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

    function isBlocked(userSelected: IUserType): boolean {
        for (const blockedUser of user.blockedUsers) {
            if (blockedUser.id === userSelected.id) {
                return true;
            }
        }
        return false;
    }

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
                    flexDirection:"row",
                    margin: "5%",
                }}>
                    <View style={{flex:4}}>
                        <TextInput
                            placeholder='Search a post by title'
                            placeholderTextColor={"#a3a3a3"}
                            style={{
                                alignItems:"flex-start",
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
                        flex:1,
                        alignItems:"center",
                        justifyContent:"center"
                    }}>
                        <FontAwesome5Icon
                            style={{

                            }}
                            name="search"
                            size={getIconSize(80)}
                            color={(darkMode) ? "white" : "black"}
                        />
                    </View>


                </View>
                <View style={{flexDirection: "row"}}>
                    <View style={{marginLeft: "2%"}}>
                        <TouchableOpacity
                            style={{
                                margin: 10,

                                borderWidth: 2,
                                borderColor: "#ca2613",
                                padding: 10
                            }}
                            onPress={() =>  {
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
                            style={{height: "70%"}}
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
                    </View>
                    <FlatList
                        style={{}}
                        data={arrayCategoriaBuilder}
                        horizontal={true}
                        renderItem={(categoria) => {
                            return (
                                <TouchableOpacity
                                    style={{
                                        margin: 10,

                                        borderWidth: 2,
                                        borderColor: (categoryToFilter === categoria.item) ? "violet" : "#ca2613",
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
                        if (post.item.user && !isBlocked(post.item.user)) {
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
                                                    onPress={() => (post.item.user?.id !== user.id) ? navigation.navigate("OtherUserProfile", {userSelected: post.item.user}): navigation.navigate("Profile")}>
                                                    <Image
                                                        source={{
                                                            uri: (post.item.user?.picture !== "") ? "data:image/jpeg;base64," + post.item.user?.picture : "https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png?x=480&quality=40",
                                                        }}
                                                        style={{
                                                            ...Styles.imageStyle,
                                                            borderColor: (darkMode) ? "white" : "black",
                                                            borderWidth: 1,
                                                            width: getIconSize(110),
                                                            height: getIconSize(110)
                                                        }}
                                                    />
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
                                            <Image
                                                source={{
                                                    uri: (post.item.image !== "") ? "data:image/jpeg;base64," + post.item.image :
                                                        (post.item.build?.category === Globals.CATEGORY_GAMING) ?
                                                            "https://regeneration.co.nz/cdn/shop/files/ullr-gaming-pc-regen-computers.webp?v=1696907011"
                                                            :
                                                            (post.item.build?.category === Globals.CATEGORY_BUDGET) ?
                                                                "https://pcbuildsonabudget.com/wp-content/uploads/2022/10/1200-Dollar-PC-Build-Case.jpg"
                                                                :
                                                                (post.item.build?.category === Globals.CATEGORY_WORK) ?
                                                                    "https://www.pcspecialist.co.uk/images/cases/12030/h.png?1602846384"
                                                                    :
                                                                    ""
                                                }}
                                                style={{
                                                    width: getIconSize(900),
                                                    height: getIconSize(900),

                                                }}
                                            />
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
