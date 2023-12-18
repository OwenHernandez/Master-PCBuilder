import { Alert, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import usePost from '../hooks/usePost';
import Component from '../components/Component';
import { Styles } from '../themes/Styles';
import Icon from 'react-native-vector-icons/Octicons';
import { usePrimaryContext } from '../contexts/PrimaryContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Post'>;

const Post = (props: Props) => {
    const { user } = usePrimaryContext();
    const { navigation, route } = props;
    const post = route.params.post;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={Styles.headerView}>
                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <Image
                        source={{
                            uri: user.profilePic,
                            width: 35,
                            height: 35
                        }}
                        style={{ ...Styles.imageStyle }}
                    />
                </TouchableOpacity>
                <Text style={Styles.headerText}>{post.title}</Text>
                <TouchableOpacity onPress={() => Alert.alert("Iria al drawer")}>
                    <Icon name='three-bars' size={30} color={"white"}></Icon>
                </TouchableOpacity>
            </View>
            <View style={{}}>
                <View style={{ flexDirection: "row", borderColor: "#ca2613", borderWidth: 2, borderTopWidth: 0 }}>
                    <Image
                        source={{
                            uri: post.image,
                            width: 150,
                            height: 150
                        }}
                        style={{ margin: "5%" }}
                    />
                    <View style={{}}>
                        <Text style={{ fontSize: 25, color: "white" }}>Cost: {post.priceRange}</Text>
                        <Text style={{ fontSize: 15, maxWidth: "73%", color: "white" }}>Description: {"\n\n"}{post.description}{"\n\n"}</Text>
                    </View>
                </View>
                <FlatList
                    contentContainerStyle={{ borderColor: "#ca2613", borderWidth: 2, borderTopWidth: 0 }}
                    data={post.components}
                    renderItem={(component) => {
                        return (
                            <Component comp={component.item} />
                        );
                    }}
                    keyExtractor={(comp, index) => index + ""}
                    ListHeaderComponent={<Text style={{ fontSize: 25, color: "white" }}>Components Used:{"\n"}</Text>}
                //ItemSeparatorComponent={() => <Text style={{ color: "#ca2613" }}>―――――――――――――</Text>}
                />
            </View>
        </SafeAreaView>
    )
}

export default Post

const styles = StyleSheet.create({})