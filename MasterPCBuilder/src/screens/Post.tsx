import {
    Alert,
    Dimensions,
    FlatList,
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

    useEffect(() => {
        getImg();
    }, []);

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
                    <ImageBackground
                        source={{
                            uri: (postSelected.image !== "") ? "data:image/jpeg;base64," + postSelected.image :
                                (postSelected.build?.category === Globals.CATEGORY_GAMING) ?
                                    "https://regeneration.co.nz/cdn/shop/files/ullr-gaming-pc-regen-computers.webp?v=1696907011"
                                    :
                                    (postSelected.build?.category === Globals.CATEGORY_BUDGET) ?
                                        "https://pcbuildsonabudget.com/wp-content/uploads/2022/10/1200-Dollar-PC-Build-Case.jpg"
                                        :
                                        (postSelected.build?.category === Globals.CATEGORY_WORK) ?
                                            "https://www.pcspecialist.co.uk/images/cases/12030/h.png?1602846384"
                                            :
                                            ""
                        }}
                        style={{height: getIconSize(800),}}
                    >
                        {
                            postSelected?.user?.nick === user.nick &&
                            <View style={{flex: 1, margin: "5%", justifyContent: "flex-start", alignItems: "flex-end"}}>
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