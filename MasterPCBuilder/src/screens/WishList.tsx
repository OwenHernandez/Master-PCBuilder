import {Alert, Dimensions, FlatList, Image, PixelRatio, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React, {useEffect, useState} from 'react'
import IComponentType from '../interfaces/IComponentType';
import {Styles} from '../themes/Styles';
import {usePrimaryContext} from '../contexts/PrimaryContext';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigations/StackNavigator';
import Icon from 'react-native-vector-icons/Octicons';
import Component from '../components/Component';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderScreen from '../components/HeaderScreen';
import RNFetchBlob from "rn-fetch-blob";
import {Globals} from "../components/Globals";

type Props = NativeStackScreenProps<RootStackParamList, 'WishList'>;

const WishList = (props: Props) => {
    const {navigation, route} = props;
    const {user, darkMode, token} = usePrimaryContext();
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const [wishList, setWishList] = useState([{}] as IComponentType[]);

    useEffect(() => {
        getImgComponents();
    }, [user]);

    async function getImgComponents() {
        try {
            setWishList([]);
            for (const comp of user.componentsWanted) {
                if (comp.image.length < 200) {
                    const compImgResponse = await RNFetchBlob.fetch(
                        'GET',
                        Globals.IP_HTTP + '/api/v2/components/img/' + comp.id + '/' + comp.image,
                        {Authorization: `Bearer ${token}`}
                    );
                    let picture = ""
                    if (compImgResponse.data !== Globals.IMG_NOT_FOUND) {
                        picture = await compImgResponse.base64();
                    }
                    comp.image = picture;
                    comp.wished = false;
                    user.componentsWanted?.forEach((compWished) => {
                        if (comp.id === compWished.id) {
                            comp.wished = true;
                        }
                    });
                }
                setWishList(prevWishList => [...prevWishList, comp]);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <View>
            <HeaderScreen name={"Wish List"} navigation={navigation} profile={false} drawer={false}/>
            <View style={{height: "90%", width: "100%"}}>
                {
                    wishList !== undefined &&
                    <FlatList
                        data={wishList}
                        numColumns={2}
                        contentContainerStyle={{alignItems: "center", width: "100%"}}
                        renderItem={(comp) => {
                            if (comp.item.id !== undefined) {
                                comp.item.wished = false;
                                user.componentsWanted?.forEach((compWished) => {
                                    if (comp.item.id === compWished.id) {
                                        comp.item.wished = true;
                                    }
                                });
                                return (
                                    <TouchableOpacity
                                        style={{
                                            ...Styles.touchable,
                                            margin: "3%",
                                            height: getIconSize(600),
                                            width: getIconSize(450),
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}
                                        onPress={() => {
                                            navigation.navigate("ComponentScreen", {comp: comp.item})
                                        }

                                        }>
                                        <Component comp={comp.item}/>
                                    </TouchableOpacity>
                                )
                            }
                        }}
                        keyExtractor={(comp, index) => index + ""}
                    />
                }

            </View>
        </View>
    )
}

export default WishList