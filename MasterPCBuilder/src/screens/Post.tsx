import {
    Dimensions,
    FlatList, Image,
    ImageBackground,
    PixelRatio,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import React, {useEffect, useState} from 'react'
import {RootStackParamList} from '../navigations/StackNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Component from '../components/Component';
import {Styles} from '../themes/Styles';
import {usePrimaryContext} from '../contexts/PrimaryContext';
import HeaderScreen from "../components/HeaderScreen";
import LinearGradient from "react-native-linear-gradient";
import {Globals} from "../components/Globals";
import RNFetchBlob from "rn-fetch-blob";
import IPostType from "../interfaces/IPostType";
import {Menu, MenuOption, MenuOptions, MenuTrigger} from "react-native-popup-menu";
import Entypo from "react-native-vector-icons/Entypo";
import axios from "axios";

type Props = NativeStackScreenProps<RootStackParamList, 'Post'>;

const Post = (props: Props) => {
    const {user, darkMode, token} = usePrimaryContext();
    const {navigation, route} = props;
    const post = route.params.post;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const [postSelected, setPostSelected] = useState({} as IPostType);

    /**
     * `useEffect` hook that is executed once after the component mounts.
     *
     * This hook calls the `getImg` function to fetch the images for the components of the post.
     * As the dependency array is empty, this hook will only run once after the component mounts.
     */
    useEffect(() => {
        getImg();
    }, []);

    /**
     * Asynchronous function to fetch the images for the components of the post.
     *
     * This function does the following:
     * 1. Iterates over the `buildsComponents` array of the `post` object.
     * 2. For each `buildComponent`, it checks if the length of the `image` property of the `component` object is greater than 200. If it is, it skips to the next iteration.
     * 3. Sends a GET request to the server to fetch the image of the component. The request headers contain the authorization token.
     * 4. If the response data is not equal to `Globals.IMG_NOT_FOUND`, it converts the response data to base64 and assigns it to the `image` property of the `component` object. Otherwise, it assigns an empty string to the `image` property of the `component` object.
     * 5. After iterating over the entire array, it updates the `postSelected` state with the `post` object.
     *
     * @async
     * @function
     * @throws Will log any error that occurs during the execution of the function.
     */
    async function getImg() {
        for (const buildComp of post.build.buildsComponents) {
            try {
                const comp = buildComp.component;
                if (comp.image.length > 200) {
                    continue;
                }
                const getCompImg = await RNFetchBlob.fetch(
                    'GET',
                    Globals.IP_HTTP + '/api/v2/components/img/' + comp.id + '/' + comp.image,
                    {Authorization: `Bearer ${token}`}
                );
                if (getCompImg.data !== Globals.IMG_NOT_FOUND) {
                    comp.image = getCompImg.base64();
                } else {
                    comp.image = "";
                }

            } catch (e) {
                console.log(e);
            }
        }
        setPostSelected(post);
    }

    function editPost() {
        navigation.navigate("EditPost", {postSelected: postSelected});
    }

    async function deletePost() {
        try {
            const response = await axios.delete(
                Globals.IP_HTTP + '/api/v2/posts/' + postSelected.id,
                {
                    headers: {Authorization: `Bearer ${token}`}
                }
            );
            navigation.navigate("Posts", {posts: []});
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <HeaderScreen name={postSelected.title} navigation={navigation} profile={false} drawer={false}/>
            <View style={{height: "100%"}}>
                <View>
                    {
                        post.image !== "" ?
                            <ImageBackground
                                source={{
                                    uri: "data:image/jpeg;base64," + post.image
                                }}
                                style={{height: getIconSize(800)}}
                            >
                                {
                                    postSelected?.user?.nick === user.nick &&
                                    <View style={{
                                        flex: 1,
                                        margin: "5%",
                                        justifyContent: "flex-start",
                                        alignItems: "flex-end"
                                    }}>
                                        <Menu>
                                            <MenuTrigger>
                                                <Entypo name={"dots-three-vertical"} size={getIconSize(60)}
                                                        color={(darkMode) ? "white" : "black"}/>
                                            </MenuTrigger>
                                            <MenuOptions
                                                optionsContainerStyle={{
                                                    backgroundColor: (darkMode) ? "#242121" : "#F5F5F5",

                                                    width: getIconSize(500),
                                                    borderColor: "#ca2613",
                                                    borderWidth: 2,
                                                    padding: "2%"
                                                }}
                                            >
                                                <MenuOption
                                                    onSelect={() => editPost()}
                                                    text='Edit Component'
                                                    customStyles={{
                                                        optionText: {color: (darkMode) ? "white" : "black"}
                                                    }}
                                                />
                                                <MenuOption
                                                    onSelect={() => deletePost()}
                                                    text='Delete Component'
                                                    customStyles={{
                                                        optionText: {color: (darkMode) ? "white" : "black"}
                                                    }}
                                                />
                                            </MenuOptions>
                                        </Menu>
                                    </View>
                                }
                                <LinearGradient
                                    colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)', '#3e423f', (darkMode) ? "#242121" : "#F5F5F5"]}
                                    style={{flex: 1, justifyContent: "flex-end", alignItems: "baseline"}}>
                                    <View style={{margin: "5%"}}>
                                        <Text style={{
                                            fontSize: getFontSize(25),
                                            color: (darkMode) ? "white" : "black"
                                        }}>Cost: {postSelected.build?.totalPrice} €</Text>
                                        <Text style={{
                                            fontSize: getFontSize(15),
                                            maxWidth: "73%",
                                            color: (darkMode) ? "white" : "black"
                                        }}>{postSelected.description}</Text>
                                    </View>
                                </LinearGradient>
                            </ImageBackground>
                            :
                            (post.build?.category === Globals.CATEGORY_GAMING) ?
                                <ImageBackground
                                    source={
                                        require("../../img/defaultGamingPostImg.png")
                                    }
                                    style={{height: getIconSize(800)}}
                                >
                                    {
                                        postSelected?.user?.nick === user.nick &&
                                        <View style={{
                                            flex: 1,
                                            margin: "5%",
                                            justifyContent: "flex-start",
                                            alignItems: "flex-end"
                                        }}>
                                            <Menu>
                                                <MenuTrigger>
                                                    <Entypo name={"dots-three-vertical"} size={getIconSize(60)}
                                                            color={(darkMode) ? "white" : "black"}/>
                                                </MenuTrigger>
                                                <MenuOptions
                                                    optionsContainerStyle={{
                                                        backgroundColor: (darkMode) ? "#242121" : "#F5F5F5",

                                                        width: getIconSize(500),
                                                        borderColor: "#ca2613",
                                                        borderWidth: 2,
                                                        padding: "2%"
                                                    }}
                                                >
                                                    <MenuOption
                                                        onSelect={() => editPost()}
                                                        text='Edit Component'
                                                        customStyles={{
                                                            optionText: {color: (darkMode) ? "white" : "black"}
                                                        }}
                                                    />
                                                    <MenuOption
                                                        onSelect={() => deletePost()}
                                                        text='Delete Component'
                                                        customStyles={{
                                                            optionText: {color: (darkMode) ? "white" : "black"}
                                                        }}
                                                    />
                                                </MenuOptions>
                                            </Menu>
                                        </View>
                                    }
                                    <LinearGradient
                                        colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)', '#3e423f', (darkMode) ? "#242121" : "#F5F5F5"]}
                                        style={{flex: 1, justifyContent: "flex-end", alignItems: "baseline"}}>
                                        <View style={{margin: "5%"}}>
                                            <Text style={{
                                                fontSize: getFontSize(25),
                                                color: (darkMode) ? "white" : "black"
                                            }}>Cost: {postSelected.build?.totalPrice} €</Text>
                                            <Text style={{
                                                fontSize: getFontSize(15),
                                                maxWidth: "73%",
                                                color: (darkMode) ? "white" : "black"
                                            }}>{postSelected.description}</Text>
                                        </View>
                                    </LinearGradient>
                                </ImageBackground>
                                :
                                (post.build?.category === Globals.CATEGORY_BUDGET) ?
                                    <ImageBackground
                                        source={
                                            require("../../img/defaultBudgetPostImg.jpg")
                                        }
                                        style={{height: getIconSize(800)}}
                                    >
                                        {
                                            postSelected?.user?.nick === user.nick &&
                                            <View style={{
                                                flex: 1,
                                                margin: "5%",
                                                justifyContent: "flex-start",
                                                alignItems: "flex-end"
                                            }}>
                                                <Menu>
                                                    <MenuTrigger>
                                                        <Entypo name={"dots-three-vertical"} size={getIconSize(60)}
                                                                color={(darkMode) ? "white" : "black"}/>
                                                    </MenuTrigger>
                                                    <MenuOptions
                                                        optionsContainerStyle={{
                                                            backgroundColor: (darkMode) ? "#242121" : "#F5F5F5",

                                                            width: getIconSize(500),
                                                            borderColor: "#ca2613",
                                                            borderWidth: 2,
                                                            padding: "2%"
                                                        }}
                                                    >
                                                        <MenuOption
                                                            onSelect={() => editPost()}
                                                            text='Edit Component'
                                                            customStyles={{
                                                                optionText: {color: (darkMode) ? "white" : "black"}
                                                            }}
                                                        />
                                                        <MenuOption
                                                            onSelect={() => deletePost()}
                                                            text='Delete Component'
                                                            customStyles={{
                                                                optionText: {color: (darkMode) ? "white" : "black"}
                                                            }}
                                                        />
                                                    </MenuOptions>
                                                </Menu>
                                            </View>
                                        }
                                        <LinearGradient
                                            colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)', '#3e423f', (darkMode) ? "#242121" : "#F5F5F5"]}
                                            style={{flex: 1, justifyContent: "flex-end", alignItems: "baseline"}}>
                                            <View style={{margin: "5%"}}>
                                                <Text style={{
                                                    fontSize: getFontSize(25),
                                                    color: (darkMode) ? "white" : "black"
                                                }}>Cost: {postSelected.build?.totalPrice} €</Text>
                                                <Text style={{
                                                    fontSize: getFontSize(15),
                                                    maxWidth: "73%",
                                                    color: (darkMode) ? "white" : "black"
                                                }}>{postSelected.description}</Text>
                                            </View>
                                        </LinearGradient>
                                    </ImageBackground>
                                    :
                                    (post.build?.category === Globals.CATEGORY_WORK) ?
                                        <ImageBackground
                                            source={
                                                require("../../img/defaultWorkPostImg.png")
                                            }
                                            style={{height: getIconSize(800)}}
                                        >
                                            {
                                                postSelected?.user?.nick === user.nick &&
                                                <View style={{
                                                    flex: 1,
                                                    margin: "5%",
                                                    justifyContent: "flex-start",
                                                    alignItems: "flex-end"
                                                }}>
                                                    <Menu>
                                                        <MenuTrigger>
                                                            <Entypo name={"dots-three-vertical"} size={getIconSize(60)}
                                                                    color={(darkMode) ? "white" : "black"}/>
                                                        </MenuTrigger>
                                                        <MenuOptions
                                                            optionsContainerStyle={{
                                                                backgroundColor: (darkMode) ? "#242121" : "#F5F5F5",

                                                                width: getIconSize(500),
                                                                borderColor: "#ca2613",
                                                                borderWidth: 2,
                                                                padding: "2%"
                                                            }}
                                                        >
                                                            <MenuOption
                                                                onSelect={() => editPost()}
                                                                text='Edit Component'
                                                                customStyles={{
                                                                    optionText: {color: (darkMode) ? "white" : "black"}
                                                                }}
                                                            />
                                                            <MenuOption
                                                                onSelect={() => deletePost()}
                                                                text='Delete Component'
                                                                customStyles={{
                                                                    optionText: {color: (darkMode) ? "white" : "black"}
                                                                }}
                                                            />
                                                        </MenuOptions>
                                                    </Menu>
                                                </View>
                                            }
                                            <LinearGradient
                                                colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)', '#3e423f', (darkMode) ? "#242121" : "#F5F5F5"]}
                                                style={{flex: 1, justifyContent: "flex-end", alignItems: "baseline"}}>
                                                <View style={{margin: "5%"}}>
                                                    <Text style={{
                                                        fontSize: getFontSize(25),
                                                        color: (darkMode) ? "white" : "black"
                                                    }}>Cost: {postSelected.build?.totalPrice} €</Text>
                                                    <Text style={{
                                                        fontSize: getFontSize(15),
                                                        maxWidth: "73%",
                                                        color: (darkMode) ? "white" : "black"
                                                    }}>{postSelected.description}</Text>
                                                </View>
                                            </LinearGradient>
                                        </ImageBackground>
                                        :
                                        <Text>No foto</Text>
                    }
                </View>
                <View style={{height: "53%"}}>
                    <FlatList
                        data={postSelected.build?.buildsComponents}
                        numColumns={2}
                        contentContainerStyle={{alignItems: "center", width: "100%"}}
                        renderItem={(buildComponent) => {
                            return (
                                <TouchableOpacity
                                    style={{
                                        ...Styles.touchable,
                                        width: getIconSize(450),
                                        height: getIconSize(600),
                                        margin: "5%",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        opacity: (!buildComponent.item.component.deleted) ? 1 : 0.5
                                    }}
                                    onPress={() => (buildComponent.item.component.deleted) ? Alert.alert("This component is no longer available") : navigation.navigate("ComponentScreen", {comp: buildComponent.item.component})}>
                                    <Component comp={buildComponent.item.component}/>
                                </TouchableOpacity>
                            );
                        }}
                        keyExtractor={(comp, index) => index + ""}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Post

const styles = StyleSheet.create({})