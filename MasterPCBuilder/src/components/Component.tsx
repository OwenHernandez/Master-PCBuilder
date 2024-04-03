import {
    Alert,
    Dimensions,
    Image, ImageBackground,
    PixelRatio,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import React, {useEffect, useState} from 'react'
import IComponentType from '../interfaces/IComponentType'
import {usePrimaryContext} from '../contexts/PrimaryContext';
import {Styles} from '../themes/Styles';
import {Globals} from "./Globals";
import axios, {AxiosError} from "axios";
import RNFetchBlob from "rn-fetch-blob";
import LinearGradient from "react-native-linear-gradient";

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
                Globals.IP_HTTP + "/api/v2/users/" + user.id + "/wishlist/" + comp?.id,
                null,
                {headers: {Authorization: "Bearer " + token}}
            );
            comp.wished = !comp.wished;
            setUser({...response.data, picture: user.picture, friends: [...user.friends]});
        } catch (err) {
            console.log(err);
        }
    }
/*

                    <View style={{justifyContent: "flex-end",paddingHorizontal:"5%"}}>
                        <Text style={{
                            fontSize: getFontSize(20),
                            color: (darkMode) ? "white" : "black",
                            marginRight: "10%"
                        }}>Amazon:{comp.amazon_price}</Text>
                        <Text style={{
                            fontSize: getFontSize(20),
                            color: (darkMode) ? "white" : "black",
                        }}>Ebay:{comp.ebay_price}</Text>
                    </View>
 */
    return (
        <SafeAreaView style={{flex: 1,}}>
            <View style={{flex: 1,borderRadius: 20, overflow: 'hidden'}}>
                    <ImageBackground
                        source={{
                            uri: "data:image/jpeg;base64," + comp?.image
                        }}
                        style={{
                            width: "100%",
                            height: "100%",
                            alignItems: "center",
                        }}
                    >
                        <LinearGradient colors={['rgba(0, 0, 0, 0)','rgba(0, 0, 0, 0)' ,'#3e423f', (darkMode) ? "#242121" : "#F5F5F5"]} style={{flex:1,justifyContent:"flex-start",alignItems:"flex-end",flexDirection:"row",width:"100%"}} >
                            <View style={{padding:"5%"}}>
                                <View style={{}}>
                                    <Text style={{
                                        fontSize: getFontSize(20),
                                        color: (darkMode) ? "white" : "black",
                                    }}>{comp?.name}</Text>
                                    <Text style={{
                                        fontSize: getFontSize(20),
                                        color: (darkMode) ? "white" : "black",
                                    }}>{comp?.price}€</Text>
                                </View>
                            </View>
                        </LinearGradient>

                    </ImageBackground>

            </View>
            {/*<View style={{justifyContent: "flex-end", marginTop: "5%"}}>
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
            </View>*/}
        </SafeAreaView>
    )
}

export default Component

const styles = StyleSheet.create({})