import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import IPostType from '../interfaces/IPostType';
import { Styles } from '../themes/Styles';
import Icon from 'react-native-vector-icons/Octicons';

type Props = NativeStackScreenProps<RootStackParamList, 'UserPostsList'>;

const UserPostsList = (props: Props) => {
    const { navigation, route } = props;
    const [postsList, setPostsList] = useState([{}] as IPostType[]);
    const tempPostsList = [
        {
            title: "Coso",
            image: "https://upload.wikimedia.org/wikipedia/commons/1/16/Computadora-PC.png",
            components: [{ name: "CPU", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta..." }],
            description: "Es un buen montaje porque...",
            priceRange: "1000€"
        },
        {
            title: "Coso2",
            image: "https://upload.wikimedia.org/wikipedia/commons/1/16/Computadora-PC.png",
            components: [{ name: "CPU", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta..." }],
            description: "Es un buen montaje porque...",
            priceRange: "1000€"
        }
    ];
    useEffect(() => {
        //Aqui se llamaria a la base de datos para conseguir sus posts
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <View style={Styles.headerView}>
                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <Image
                        source={{
                            uri: "https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg",
                            width: 35,
                            height: 35
                        }}
                    />
                </TouchableOpacity>
                <Text style={Styles.headerText}>{route.name}</Text>
                <TouchableOpacity>
                    <Icon name='three-bars' size={30}></Icon>
                </TouchableOpacity>
            </View>
            <View style={{}}>
                <FlatList
                    data={tempPostsList}
                    renderItem={(post) => {
                        return (
                            <TouchableOpacity style={Styles.touchable} onPress={() => navigation.navigate("Post", { post: post.item })}>
                                <View>
                                    <Image
                                        source={{
                                            uri: post.item.image,
                                            width: 130,
                                            height: 130
                                        }}
                                    />
                                    <Text style={{ fontSize: 20 }}>{post.item.title}</Text>
                                    <Text>{post.item.priceRange}</Text>
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

export default UserPostsList