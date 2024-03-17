import {
    Alert,
    Dimensions,
    Image,
    PixelRatio,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import React, {useEffect} from 'react'
import IComponentType from '../interfaces/IComponentType'
import {usePrimaryContext} from '../contexts/PrimaryContext';
import {Styles} from '../themes/Styles';
import {Globals} from "./Globals";
import axios, {AxiosError} from "axios";
import RNFetchBlob from "rn-fetch-blob";

type Props = {
    comp: IComponentType;
}

const Component = (props: Props) => {
    const {comp} = props;
    const {darkMode, user, token, setUser} = usePrimaryContext();
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;

    async function addRemoveWishList() {
        try {
            const response = await axios.put(
                Globals.IP + "/api/v2/users/" + user.id + "/wishlist/" + comp?.id,
                null,
                {headers: {Authorization: "Bearer " + token}}
            );
            setUser({...response.data, picture: user.picture, friends: [...user.friends]});
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1, justifyContent: "center"}}>
                <View style={{alignItems: "center"}}>
                    <Image
                        source={{
                            uri: "data:image/jpeg;base64," + comp?.image
                        }}
                        style={{
                            margin: "2%",
                            width: getIconSize(300),
                            height: getIconSize(300),
                            alignItems: "center",
                            borderRadius: 10
                        }}
                    />
                </View>
                <View style={{justifyContent: "center",paddingHorizontal:"5%"}}>
                    <Text style={{
                        fontSize: getFontSize(20),
                        color: (darkMode) ? "white" : "black",
                        marginRight: "10%"
                    }}>{comp?.name}</Text>
                    <Text style={{
                        fontSize: getFontSize(20),
                        color: (darkMode) ? "white" : "black",
                    }}>{comp?.price}€</Text>
                </View>
            </View>
            <View style={{justifyContent: "flex-end", marginTop: "5%"}}>
                {
                    (comp?.wished) ?
                        <TouchableOpacity style={{...Styles.touchable, borderRadius: 15}}
                                          onPress={addRemoveWishList}>
                            <Text style={{color: (darkMode) ? "white" : "black", textAlign: "center"}}>Remove From Wish List</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={{...Styles.touchable, borderRadius: 15}}
                                          onPress={addRemoveWishList}>
                            <Text style={{color: (darkMode) ? "white" : "black", textAlign: "center"}}>Add to Wish
                                List</Text>
                        </TouchableOpacity>
                }
            </View>
        </SafeAreaView>
    )
}

export default Component

const styles = StyleSheet.create({})