import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import usePost from '../hooks/usePost';
import Component from '../components/Component';
import { Styles } from '../themes/Styles';
import Icon from 'react-native-vector-icons/Octicons';

type Props = NativeStackScreenProps<RootStackParamList, 'Post'>;

const Post = (props: Props) => {
    const { navigation, route } = props;
    const post = route.params.post;

    return (
        <ScrollView>
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
                <Text style={Styles.headerText}>{post.title}</Text>
                <TouchableOpacity>
                    <Icon name='three-bars' size={30}></Icon>
                </TouchableOpacity>
            </View>
            <View style={{}}>
                <View style={{ flexDirection: "row", borderColor: "red", borderWidth: 2, borderBottomWidth: 0, borderTopWidth: 0 }}>
                    <Image
                        source={{
                            uri: post.image,
                            width: 150,
                            height: 150
                        }}
                    />
                    <View style={{}}>
                        <Text style={{ fontSize: 25 }}>Cost: {post.priceRange}</Text>
                        <Text style={{ fontSize: 15, maxWidth: "80%" }}>Description: {"\n\n"}{post.description}{"\n\n"}</Text>
                    </View>
                </View>
                <FlatList
                    contentContainerStyle={{ borderColor: "red", borderWidth: 2 }}
                    data={post.components}
                    renderItem={(component) => {
                        return (
                            <Component comp={component.item} />
                        );
                    }}
                    keyExtractor={(comp, index) => index + ""}
                    ListHeaderComponent={<Text style={{ fontSize: 25 }}>Components Used:{"\n"}</Text>}
                />
            </View>
        </ScrollView>
    )
}

export default Post

const styles = StyleSheet.create({})