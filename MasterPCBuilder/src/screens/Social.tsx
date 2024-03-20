import {View, Text, TouchableOpacity, FlatList, Image, Alert, PixelRatio, TextInput} from 'react-native'
import React, {useEffect, useState} from 'react'
import {Styles} from '../themes/Styles';
import {DrawerActions} from '@react-navigation/native';
import {usePrimaryContext} from '../contexts/PrimaryContext';
import IPostType from '../interfaces/IPostType';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigations/StackNavigator';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Octicons from 'react-native-vector-icons/Octicons';
import {Dimensions} from 'react-native';
import HeaderScreen from "../components/HeaderScreen";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import {Globals} from "../components/Globals";
import RNFetchBlob from "rn-fetch-blob";

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
    const [postsByTitle, setPostsByTitle] = useState([{}] as IPostType[]);

    useEffect(() => {
        setPostsList([]);
        setPostsByTitle([]);
        getPosts();
    }, [posts]);

    async function getPosts() {
        try {
            const response = await axios.get(Globals.IP + "/api/v2/posts", {headers: {"Authorization": "Bearer " + token}});
            for (const post of response.data) {
                const getPostFile = await RNFetchBlob.fetch(
                    'GET',
                    Globals.IP + '/api/v2/posts/img/' + post.id + '/' + post.image,
                    {Authorization: `Bearer ${token}`}
                );
                if (getPostFile.data !== Globals.IMG_NOT_FOUND) {
                    post.image = getPostFile.base64();
                } else {
                    post.image = "";
                }
                const getUserFile = await RNFetchBlob.fetch(
                    'GET',
                    Globals.IP + '/api/v2/users/img/' + post.user.id + '/' + post.user.picture,
                    {Authorization: `Bearer ${token}`}
                );
                if (getUserFile.data !== Globals.IMG_NOT_FOUND) {
                    post.user.picture = getUserFile.base64();
                } else {
                    post.user.picture = "";
                }
                if (post.usersWhoLiked.includes(user?.id)) {
                    post.liked = true;
                } else {
                    post.liked = false;
                }
                setPostsList(prevPosts => [...prevPosts, post]);
                setPostsByTitle(prevPosts => [...prevPosts, post]);
            }
        } catch (e) {
            console.log(e);
        }
    }

    async function addRemoveLike(post: IPostType) {
        try {
            const response = await axios.put(
                Globals.IP + "/api/v2/posts/" + post.id + "/like" + user?.id,
                null,
                {headers: {Authorization: "Bearer " + token}}
            );
            post.liked = !post.liked;
        } catch (err) {
            console.log(err);
        }
    }
    const arrayCategoriaBuilder : Array<string> = ["Todos","Gaming","Budget","Work"];
    return (
        <View style={{flex: 1, backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"}}>
            <HeaderScreen name={route.name} navigation={navigation} profile={false} drawer={true}/>
            <View style={{height: "90%"}}>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    margin: "10%",
                    alignItems: "center"
                }}>
                    <TextInput
                        placeholder='Search a post by title'
                        placeholderTextColor={"#a3a3a3"}
                        style={{
                            borderWidth: 2,
                            borderColor: "#ca2613",
                            borderRadius: 20,
                            paddingHorizontal: "5%",
                            width: "80%",
                            fontSize: getFontSize(15),
                            color: (darkMode) ? "white" : "black"
                        }}
                        onChangeText={(text) => {
                            if (text === "")
                                setPostsByTitle(postsList);
                            else
                                setPostsByTitle(postsList.filter((post) => post.title.toLowerCase().includes(text)))
                        }}
                    ></TextInput>
                    <FontAwesome5Icon
                        name="search"
                        size={getIconSize(80)}
                        color={(darkMode) ? "white" : "black"}
                    />
                </View>
                <View style={{}}>

                    <FlatList
                        style={{marginHorizontal:10}}
                        data={arrayCategoriaBuilder}
                        horizontal={true}
                        renderItem={(categoria) => {
                                return (
                                    <TouchableOpacity
                                        style={{
                                            margin: 10,
                                            borderRadius: 20,
                                            borderWidth: 2,
                                            borderColor: "#ca2613",
                                            padding: 10,
                                            width:100
                                    }}
                                        onPress={() => {
                                            if (categoria.item === "Todos"){
                                                setPostsByTitle(postsList);

                                            }else {
                                                setPostsByTitle(postsList);
                                                setPostsByTitle(postsList.filter((post) => post.build?.category === categoria.item))
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
                            }
                        }
                    />
                </View>
                <FlatList
                    data={postsByTitle}
                    renderItem={(post) => {
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
                                                onPress={() => navigation.navigate("OtherUserProfile", {userSelected: post.item.user})}>
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
                                            <TouchableOpacity style={{justifyContent: "center"}}
                                                              onPress={() => Alert.alert("Daria o quitaria like")}>
                                                <FontAwesome
                                                    name={(post.item.liked) ? 'thumbs-o-up' : "thumbs-up"}
                                                    size={getIconSize(80)}
                                                    color={(darkMode) ? "white" : "black"}></FontAwesome>
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
                                        </View>

                                    </View>
                                    <View style={{alignItems: "center"}}>
                                        <Image
                                            source={{
                                                uri: "data:image/jpeg;base64," + post.item.image
                                            }}
                                            style={{
                                                width: getIconSize(900),
                                                height: getIconSize(900),
                                                borderRadius: 20
                                            }}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                    keyExtractor={(post, index) => index + ""}
                />
            </View>
        </View>
    )
}

export default Social