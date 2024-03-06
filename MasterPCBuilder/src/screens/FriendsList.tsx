import {
    Dimensions,
    FlatList,
    Image,
    PixelRatio,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import React, {useEffect, useState} from 'react'
import {Styles} from '../themes/Styles';
import {usePrimaryContext} from '../contexts/PrimaryContext';
import {RootStackParamList} from '../navigations/StackNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import IUserType from '../interfaces/IUserType';
import HeaderScreen from "../components/HeaderScreen";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

type Props = NativeStackScreenProps<RootStackParamList, 'Friends List'>;

const FriendsList = (props: Props) => {
    const {navigation} = props;
    const {user, darkMode} = usePrimaryContext();
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const [friendsList, setFriendsList] = useState([{}] as IUserType[]);
    const [friendsByName, setFriendsByName] = useState([{}] as IUserType[]);

    useEffect(() => {
        setFriendsList(user.friends);
        setFriendsByName(user.friends);
    }, [user]);

    return (
        <View style={{backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"}}>
            <HeaderScreen name={"Friends"} navigation={navigation} profile={false} drawer={true}/>
            <View style={{height: "90%"}}>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    margin: "10%",
                    alignItems: "center"
                }}>
                    <TextInput
                        placeholder='Search a friend by name'
                        placeholderTextColor={"#a3a3a3"}
                        style={{
                            borderWidth: 2,
                            borderColor: "#ca2613",
                            borderRadius: 20,
                            paddingHorizontal: "5%",
                            width: "80%",
                            fontSize: getFontSize(15),
                            color: (darkMode) ? "white" : "black"
                        }}
                        onChangeText={(text) => {
                            if (text === "")
                                setFriendsByName(friendsList);
                            else
                                setFriendsByName(friendsList.filter((friend) => friend.nick.toLowerCase().includes(text)))
                        }}
                    ></TextInput>
                    <FontAwesome5Icon name="search" size={getIconSize(80)}
                                      color={(darkMode) ? "white" : "black"}/>
                </View>
                <FlatList
                    data={friendsByName}
                    renderItem={(friend) => {
                        return (
                            <TouchableOpacity onPress={() => navigation.navigate("Chat", {userSelected: friend.item})}
                                              style={{
                                                  ...Styles.touchable,
                                                  flexDirection: "row",
                                                  alignItems: "center",
                                                  margin: "3%"
                                              }}>
                                <TouchableOpacity onPress={() => navigation.navigate("OtherUserProfile", {userSelected: friend.item})}>
                                    <Image
                                        source={{
                                            uri: (friend.item.picture !== "") ? "data:image/jpeg;base64," + friend.item.picture : "https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png?x=480&quality=40",
                                        }}
                                        style={{
                                            ...Styles.imageStyle,
                                            borderColor: (darkMode) ? "white" : "black",
                                            borderWidth: 1,
                                            width: getIconSize(110),
                                            height: getIconSize(110)
                                        }}
                                    />
                                </TouchableOpacity>
                                <Text style={{
                                    color: (darkMode) ? "white" : "black",
                                    marginLeft: "5%",
                                    marginRight: "13%"
                                }}>{friend.item.nick}</Text>
                            </TouchableOpacity>

                        )
                    }}
                    keyExtractor={(comp, index) => index + ""}
                />
            </View>
        </View>
    )
}

export default FriendsList

const styles = StyleSheet.create({})