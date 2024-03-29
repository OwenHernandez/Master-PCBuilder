import {
    ImageBackground,
    Dimensions,
    Image,
    PixelRatio,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    FlatList
} from 'react-native'
import React, {useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { usePrimaryContext } from '../contexts/PrimaryContext';
import useLogout from '../hooks/useLogout';
import { Styles } from '../themes/Styles';
import Octicon from 'react-native-vector-icons/Octicons';
import { DrawerActions } from '@react-navigation/native';
import axios from "axios";
import {Globals} from "../components/Globals";
import HeaderScreen from "../components/HeaderScreen";
import LinearGradient from 'react-native-linear-gradient';
import {FAB} from "react-native-elements";

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const Profile = (props: Props) => {
    const { user, darkMode, token } = usePrimaryContext();
    const { navigation, route } = props;
    const [img, setImg] = useState<any>();
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const { logout } = useLogout();

    /*const actions = [
        { name: "Your Balls", nav: "UserBuildsList" },
        { name: "Your Posts", nav: "UserPostsList" },
        { name: "Liked Posts", nav: "LikedPostsList" },
        { name: "Wish List", nav: "WishList" },
        { name: "Friends", nav: "FriendsList" }
    ];*/

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: (darkMode) ? "#242121" : "#F5F5F5" }}>
            <HeaderScreen name={route.name} navigation={navigation} profile={true} drawer={true}/>
            <ScrollView>
                <View style={{ alignItems: 'center' }}>
                    <ImageBackground
                        source={{
                            uri: (user?.picture) ? "data:image/jpeg;base64," + user?.picture  : "https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png?x=480&quality=40",
                        }}
                        style={{ ...Styles.imageStyle, width: "100%", height: 300}}
                    >
                        <LinearGradient colors={['rgba(0, 0, 0, 0)','rgba(0, 0, 0, 0)' ,'#3e423f', (darkMode) ? "#242121" : "#F5F5F5"]}style={{flex:1,justifyContent:"flex-end",alignItems:"baseline"}} >
                            <View style={{  justifyContent: 'space-between', margin: "3%" }}>
                                <Text style={{ fontSize: getFontSize(40), color: (darkMode) ? "white" : "black" }}>{user?.nick}</Text>
                                <Text style={{ fontSize: getFontSize(18), color: (darkMode) ? "white" : "black" }}>{user?.email}</Text>
                            </View>
                            </LinearGradient>
                    </ImageBackground>
                </View>
                <View style={{margin:"5%",}}>
                    <Text style={{ fontSize: getFontSize(40), color: (darkMode) ? "white" : "black" }}>Friends</Text>
                    {
                        user.friends!==null?
                            <FlatList style={{}} horizontal={true} data={user.friends} renderItem={(friend)=>{
                            return <View style={{width:100,margin:3}}>
                                <TouchableOpacity onPress={() => navigation.navigate("Chat", {friend: friend.item})}
                                                  style={{
                                                      ...Styles.touchable,
                                                      flexDirection: "row",
                                                      alignItems: "center",
                                                      margin: 3
                                                  }}>
                                    <TouchableOpacity onPress={() => navigation.navigate("OtherUserProfile", {userSelected:friend.item})}>
                                        <Image
                                            source={{
                                                uri: (friend.item.picture !== "") ? "data:image/jpeg;base64," + friend.item.picture : "https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png?x=480&quality=40"
                                            }}
                                            style={{
                                                ...Styles.imageStyle,
                                                borderColor: (darkMode) ? "white" : "black",
                                                borderWidth: 1,
                                                width: 30,
                                                height: 30
                                            }}
                                        />
                                    </TouchableOpacity>
                                    <Text style={{
                                        color: (darkMode) ? "white" : "black",
                                        marginLeft: 5,
                                        marginRight: 13
                                    }}>{friend.item.nick}</Text>
                                </TouchableOpacity>
                            </View>
                            }}/>:<></>
                            //<Text style={{ fontSize: getFontSize(20), color: (darkMode) ? "white" : "black" }}>You have no friends</Text>
                    }
                </View>
                <View style={{flexDirection:"row",justifyContent:"space-around",marginHorizontal:"5%"}}>
                    <TouchableOpacity style={{ ...Styles.touchable,width:"45%",margin:"2%", marginBottom: "3%", padding: "6%" }} onPress={() => navigation.navigate("UserBuildsList")}>
                        <Text style={{ fontSize: getFontSize(20), textAlign: 'center', color: (darkMode) ? "white" : "black" }}>Your Builds</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ ...Styles.touchable,width:"45%",margin:"2%", marginBottom: "3%", padding: "6%" }} onPress={() => navigation.navigate("WishList")}>
                        <Text style={{ fontSize: getFontSize(20), textAlign: 'center', color: (darkMode) ? "white" : "black" }}>Wish List</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={{ ...Styles.touchable, marginBottom: "3%", padding: "6%", borderColor: "violet" }} onPress={() => logout(navigation)}>
                    <Text style={{ fontSize: getFontSize(20), textAlign: 'center', color: (darkMode) ? "white" : "black" }}>Logout</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile