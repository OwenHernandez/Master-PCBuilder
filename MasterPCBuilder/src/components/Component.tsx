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

    return (
        <SafeAreaView style={{flex: 1, width: "100%"}}>
            <View style={{flex: 1,  overflow: 'hidden', width: "100%"}}>
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
                    <LinearGradient
                        colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)', '#3e423f', (darkMode) ? "#242121" : "#F5F5F5"]}
                        style={{
                            flex: 1,
                            justifyContent: "flex-start",
                            alignItems: "flex-end",
                            flexDirection: "row",
                            width: "100%"
                        }}>
                        <View style={{padding: "5%"}}>
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
        </SafeAreaView>
    )
}

export default Component

const styles = StyleSheet.create({})