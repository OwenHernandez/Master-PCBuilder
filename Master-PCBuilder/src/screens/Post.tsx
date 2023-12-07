import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import usePost from '../hooks/usePost';
import Component from '../components/Component';

type Props = NativeStackScreenProps<RootStackParamList, 'Post'>;

const Post = (props: Props) => {
    const { navigation, route } = props;
    const { post, setPost } = usePost();
    const p = route.params.post;

    useEffect(() => {
        setPost(p);
    }, []);


    return (
        <View>
            <Image
                source={{
                    uri: post.image
                }}
            />
            <Text>{post.title}</Text>
            <Text>{post.priceRange}</Text>
            <Text>{post.description}</Text>
            <FlatList
                data={post.components}
                renderItem={(component) => {
                    return (
                        <Component comp={component.item} />
                    );
                }}
                keyExtractor={(comp, index) => index + ""}
            />
        </View>
    )
}

export default Post

const styles = StyleSheet.create({})