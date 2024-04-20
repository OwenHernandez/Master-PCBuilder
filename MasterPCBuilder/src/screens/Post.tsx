import {
    Alert,
    Dimensions,
    FlatList,
    Image, ImageBackground,
    PixelRatio,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import React, {useEffect} from 'react'
import {RootStackParamList} from '../navigations/StackNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import usePost from '../hooks/usePost';
import Component from '../components/Component';
import {Styles} from '../themes/Styles';
import Icon from 'react-native-vector-icons/Octicons';
import {usePrimaryContext} from '../contexts/PrimaryContext';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderScreen from "../components/HeaderScreen";
import LinearGradient from "react-native-linear-gradient";

type Props = NativeStackScreenProps<RootStackParamList, 'Post'>;

const Post = (props: Props) => {
    const {user, darkMode} = usePrimaryContext();
    const {navigation, route} = props;
    const post = route.params.post;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    return (
        <SafeAreaView style={{flex: 1}}>
            <HeaderScreen name={route.name} navigation={navigation} profile={true} drawer={false}/>
            <View style={{flex:1}}>
                <View style={{flex:1}}>
                    <ImageBackground
                        source={{
                            uri: (user?.picture) ? "data:image/jpeg;base64," + post.image  : "",
                        }}
                        style={{ height: getIconSize(800), borderRadius: 20}}
                    >
                        <LinearGradient colors={['rgba(0, 0, 0, 0)','rgba(0, 0, 0, 0)' ,'#3e423f', (darkMode) ? "#242121" : "#F5F5F5"]}style={{flex:1,justifyContent:"flex-end",alignItems:"baseline"}} >
                            <View style={{margin:"5%"}}>
                                <Text style={{
                                    fontSize: 25,
                                    color: (darkMode) ? "white" : "black"
                                }}>Cost: {post.build.totalPrice}€</Text>
                                <Text style={{
                                    fontSize: 15,
                                    maxWidth: "73%",
                                    color: (darkMode) ? "white" : "black"
                                }}>Description: {"\n\n"}{post.description}</Text>
                            </View>
                        </LinearGradient>
                    </ImageBackground>
                </View>
                <View style={{flex: 2}}>
                <FlatList
                    contentContainerStyle={{borderColor: "#ca2613", borderWidth: 2, borderTopWidth: 0}}
                    data={post.build.buildsComponents}
                    numColumns={2}
                    renderItem={(buildComponent) => {
                        return (
                            <TouchableOpacity style={{...Styles.touchable,width:163}}
                                onPress={() => navigation.navigate("ComponentScreen", {comp: buildComponent.item.component})}>
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