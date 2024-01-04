import { View, Text, TouchableOpacity, Image, Alert, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Styles } from '../themes/Styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Octicons from 'react-native-vector-icons/Octicons';
import { usePrimaryContext } from '../contexts/PrimaryContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/StackNavigator';
import IBuildType from '../interfaces/IBuildType';
import IPostType from '../interfaces/IPostType';

type Props = NativeStackScreenProps<RootStackParamList, 'LikedPostsList'>;

const LikedPostsList = (props: Props) => {
    const { user, darkMode } = usePrimaryContext();
    const { navigation, route } = props;
    const [postsList, setPostsList] = useState([{}] as IPostType[]);
    const tempPostsList = [
        {
            title: "Coso",
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
            title: "Coso2",
            image: "https://upload.wikimedia.org/wikipedia/commons/1/16/Computadora-PC.png",
            components: [{ name: "CPU", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta...", price: "100€", site: "PCComponentes" }],
            description: "Es un buen montaje porque...",
            priceRange: "1000€",
            liked: true
        }
    ];
    useEffect(() => {
        //Aqui se llamaria a la api para conseguir los posts que dio like
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <View style={Styles.headerView}>
                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <Image
                        source={{
                            uri: user.profilePic,
                            width: 35,
                            height: 35
                        }}
                        style={{ ...Styles.imageStyle, borderColor: (darkMode) ? "white" : "black", borderWidth: 1 }}
                    />
                </TouchableOpacity>
                <Text style={{ ...Styles.headerText, color: (darkMode) ? "white" : "black" }}>{route.name}</Text>
                <TouchableOpacity onPress={() => Alert.alert("Iria al drawer")}>
                    <Octicons name='three-bars' size={30} color={(darkMode) ? "white" : "black"}></Octicons>
                </TouchableOpacity>
            </View>
            <View>
                <FlatList
                    numColumns={2}
                    data={tempPostsList}
                    renderItem={(post) => {
                        return (
                            <TouchableOpacity style={Styles.touchable} onPress={() => navigation.navigate("Post", { post: post.item })}>
                                <View>
                                    <Image
                                        source={{
                                            uri: post.item.image,
                                            width: 120,
                                            height: 120
                                        }}
                                    />
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: "5%" }}>
                                        <View>
                                            <Text style={{ fontSize: 20, color: (darkMode) ? "white" : "black" }}>{post.item.title}</Text>
                                            <Text style={{ color: (darkMode) ? "white" : "black" }}>{post.item.priceRange}</Text>
                                        </View>
                                        <TouchableOpacity style={{ justifyContent: "center" }} onPress={() => Alert.alert("Daria o quitaria like")}>
                                            <FontAwesome name={(post.item.liked) ? 'thumbs-o-up' : "thumbs-up"} size={20} color={(darkMode) ? "white" : "black"}></FontAwesome>
                                        </TouchableOpacity>
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

export default LikedPostsList