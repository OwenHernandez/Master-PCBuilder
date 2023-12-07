import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import IPostType from '../interfaces/IPostType';

type Props = NativeStackScreenProps<RootStackParamList, 'UserPostsList'>;

const UserPostsList = (props: Props) => {
    const { navigation } = props;
    const [postsList, setPostsList] = useState([{}] as IPostType[]);
    useEffect(() => {
        //Aqui se llamaria a la base de datos para conseguir sus posts
    }, []);

    return (
        <View>
            <FlatList
                data={postsList}
                renderItem={(post) => {
                    return (
                        <TouchableOpacity onPress={() => navigation.navigate("Post", { post: post.item })}>
                            <View>
                                <Image
                                    source={{
                                        uri: post.item.image
                                    }}
                                />
                                <Text>{post.item.title}</Text>
                                <Text>{post.item.priceRange}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
                keyExtractor={(post, index) => index + ""}
            />
        </View>
    )
}

export default UserPostsList

const styles = StyleSheet.create({})