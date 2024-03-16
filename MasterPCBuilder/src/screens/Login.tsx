import {
    Alert,
    Dimensions,
    Image,
    PixelRatio,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import React, {useEffect} from 'react'
import {RootStackParamList} from '../navigations/StackNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import useLogin from '../hooks/useLogin';
import {Styles} from '../themes/Styles';
import {usePrimaryContext} from '../contexts/PrimaryContext';
import Toast from "react-native-toast-message";

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login = (props: Props) => {
    const {navigation, route} = props;
    const {darkMode} = usePrimaryContext();
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const {changeNick, changePassword, checkLogin, errorMsg, nick, password} = useLogin();
    return (
        <View style={{flex: 1}}>
            <View style={{...Styles.headerView, flexDirection: "column"}}>
                <Text style={{
                    ...Styles.headerText,
                    color: (darkMode) ? "white" : "black",
                    fontSize: getFontSize(20)
                }}>{route.name}</Text>
            </View>
            <ScrollView>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Image
                        source={(darkMode) ? require("../../img/logo_dark.png") : require("../../img/logo_light.png")}
                        style={{width: getIconSize(600), height: getIconSize(600)}}
                    />
                    <View>
                        <TextInput
                            placeholder='Nick' placeholderTextColor={"#a3a3a3"} onChangeText={changeNick}
                            value={nick}
                            style={{
                                textAlign: "center",
                                borderRadius: 20,
                                backgroundColor: (darkMode) ? "#121212" : "white",
                                marginBottom: "10%",
                                width: getIconSize(900),
                                color: "white"
                            }}></TextInput>
                        <TextInput
                            secureTextEntry={true}
                            placeholder='Password'
                            placeholderTextColor={"#a3a3a3"}
                            onChangeText={changePassword}
                            value={password}
                            style={{
                                textAlign: "center",
                                borderRadius: 20,
                                backgroundColor: (darkMode) ? "#121212" : "white",
                                width: getIconSize(900),
                                color: "white"
                            }}
                        ></TextInput>
                    </View>
                    <View style={{flexDirection: "row", padding: "8%"}}>
                        <TouchableOpacity style={{...Styles.touchable, width: getIconSize(450)}}
                                          onPress={() => checkLogin(navigation)}>
                            <Text
                                style={{
                                    color: (darkMode) ? "white" : "black",
                                    textAlign: "center",
                                    fontSize: getFontSize(20)
                                }}>Access</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{...Styles.touchable, width: getIconSize(450)}}
                                          onPress={() => navigation.navigate("Register")}>
                            <Text style={{
                                color: (darkMode) ? "white" : "black",
                                textAlign: "center",
                                fontSize: getFontSize(20)
                            }}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <Toast/>
        </View>
    )
}

export default Login