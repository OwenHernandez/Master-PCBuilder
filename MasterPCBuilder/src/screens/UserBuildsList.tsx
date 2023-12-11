import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import IComponentType from '../interfaces/IComponentType';
import IBuildType from '../interfaces/IBuildType';
import Component from '../components/Component';
import { Styles } from '../themes/Styles';
import Icon from 'react-native-vector-icons/Octicons';

type Props = NativeStackScreenProps<RootStackParamList, 'UserBuildsList'>;

const UserBuildsList = (props: Props) => {
    const { navigation, route } = props;
    const [buildsList, setBuildsList] = useState([{}] as IBuildType[]);
    const tempBuilds = [
        {
            name: "BuildCoso",
            price: "",
            notes: "jkfdjsgvfjdnjghsridhgjf",
            components: [
                { name: "CPU", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta...", price: "100€" },
                { name: "CPU", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta...", price: "100€" }
            ]
        }
    ];
    useEffect(() => {
        //Aqui se llamaria a la base de datos para conseguir sus builds
    }, []);

    return (
        <View>
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
            <FlatList
                data={tempBuilds}
                renderItem={(build) => {
                    return (
                        <FlatList
                            data={build.item.components}
                            renderItem={(comp) => {
                                return (
                                    <Component comp={comp.item} />
                                )
                            }}
                        />
                    )
                }}
                keyExtractor={(comp, index) => index + ""}
            />
        </View>
    )
}

export default UserBuildsList

const styles = StyleSheet.create({})