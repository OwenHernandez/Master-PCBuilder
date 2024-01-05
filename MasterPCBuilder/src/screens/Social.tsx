import { View, Text, TouchableOpacity, FlatList, Image, Alert, PixelRatio } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Styles } from '../themes/Styles';
import { DrawerActions } from '@react-navigation/native';
import { usePrimaryContext } from '../contexts/PrimaryContext';
import IPostType from '../interfaces/IPostType';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/StackNavigator';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Octicons from 'react-native-vector-icons/Octicons';
import { Dimensions } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Social'>;

const Social = (props: Props) => {
    const { user, darkMode } = usePrimaryContext();
    const { navigation, route } = props;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const [postsList, setPostsList] = useState([{}] as IPostType[]);
    const tempPostsList: IPostType[] = [
        {
            title: "Coso",
            userPosted: { nick: "Coso", email: "coso@gmail.com", profilePic: "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=" },
            image: "https://upload.wikimedia.org/wikipedia/commons/1/16/Computadora-PC.png",
            components: [
                { name: "CPU", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta...", price: "100€", site: "PCComponentes" },
                { name: "CPU", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta...", price: "100€", site: "PCComponentes" },
                { name: "CPU", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta...", price: "100€", site: "PCComponentes" },
                { name: "CPU", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta...", price: "100€", site: "PCComponentes" },
                { name: "CPU", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta...", price: "100€", site: "PCComponentes" }
            ],
            description: "Es un buen montaje porque coso, coso, coso, coso, coso, y tambien...",
            priceRange: "1000€",
            liked: false
        },
        {
            title: "Coso2gdhftghfyjydjgfjdfjfgdgdf",
            userPosted: { nick: "Coso2", email: "coso2@gmail.com", profilePic: "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=" },
            image: "https://upload.wikimedia.org/wikipedia/commons/1/16/Computadora-PC.png",
            components: [{ name: "CPU", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta...", price: "100€", site: "PCComponentes" }],
            description: "Es un buen montaje porque...",
            priceRange: "1000€",
            liked: true
        }
    ];
    useEffect(() => {
        //Aqui se llamaria a la base de datos para conseguir sus posts
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: (darkMode) ? "#242121" : "#F5F5F5" }}>
            <View style={Styles.headerView}>
                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <Image
                        source={{
                            uri: user.profilePic
                        }}
                        style={{ ...Styles.imageStyle, borderColor: (darkMode) ? "white" : "black", borderWidth: 1, width: getIconSize(110), height: getIconSize(110) }}
                    />
                </TouchableOpacity>
                <Text style={{ ...Styles.headerText, color: (darkMode) ? "white" : "black" }}>{route.name}</Text>
                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                    <Octicons name='three-bars' size={getIconSize(100)} color={(darkMode) ? "white" : "black"}></Octicons>
                </TouchableOpacity>
            </View>
            <View style={{ height: "90%" }}>
                <FlatList
                    data={tempPostsList}
                    renderItem={(post) => {
                        return (
                            <TouchableOpacity style={Styles.touchable} onPress={() => navigation.navigate("Post", { post: post.item })}>
                                <View>
                                    <View style={{}}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: "5%" }}>
                                            <TouchableOpacity style={{ alignItems: "center", flexDirection: "row" }} onPress={() => Alert.alert("Iria al perfil de la otra persona")}>
                                                <Image
                                                    source={{
                                                        uri: post.item.userPosted.profilePic
                                                    }}
                                                    style={{ ...Styles.imageStyle, borderColor: (darkMode) ? "white" : "black", borderWidth: 1, width: getIconSize(110), height: getIconSize(110) }}
                                                />
                                                <Text style={{ fontSize: getFontSize(15), color: (darkMode) ? "white" : "black", marginHorizontal: "10%" }}>{post.item.userPosted.nick}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ justifyContent: "center" }} onPress={() => Alert.alert("Daria o quitaria like")}>
                                                <FontAwesome name={(post.item.liked) ? 'thumbs-o-up' : "thumbs-up"} size={getIconSize(80)} color={(darkMode) ? "white" : "black"}></FontAwesome>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ margin: "5%" }}>
                                            <Text style={{ fontSize: getFontSize(20), color: (darkMode) ? "white" : "black", marginBottom: "5%" }}>{post.item.title}</Text>
                                            <Text style={{ fontSize: getFontSize(15), color: (darkMode) ? "white" : "black" }}>Price: {post.item.priceRange}</Text>
                                        </View>

                                    </View>
                                    <View style={{ alignItems: "center" }}>
                                        <Image
                                            source={{
                                                uri: post.item.image
                                            }}
                                            style={{ width: getIconSize(900), height: getIconSize(900), borderRadius: 20 }}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                    keyExtractor={(post, index) => index + ""}
                />
            </View>
        </View>
    )
}

export default Social