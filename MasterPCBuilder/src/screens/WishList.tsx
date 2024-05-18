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

    /**
     * `useEffect` hook that is executed when the `user` state changes.
     *
     * This hook calls the `getImgComponents` function to fetch the image components associated with the user.
     * As the dependency array contains `user`, this hook will run whenever the `user` state changes.
     */
    useEffect(() => {
        getImgComponents();
    }, [user]);

    /**
     * Asynchronous function to fetch image components associated with the user.
     *
     * This function does the following:
     * 1. Initializes the `wishList` state to an empty array.
     * 2. Iterates over the `componentsWanted` array of the `user` state.
     * 3. For each component, if the length of the `image` property is less than 200, it sends a GET request to the server to fetch the image.
     * 4. If the response data is not equal to `Globals.IMG_NOT_FOUND`, it converts the response data to base64 and assigns it to the `image` property of the component.
     * 5. Sets the `wished` property of the component to false.
     * 6. Iterates over the `componentsWanted` array of the `user` state again. If the id of the component matches the id of the component in the array, it sets the `wished` property of the component to true.
     * 7. Adds the component to the `wishList` state.
     *
     * @async
     * @function
     * @throws Will log any error that occurs during the execution of the function.
     */
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