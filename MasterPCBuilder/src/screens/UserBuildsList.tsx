import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import IComponentType from '../interfaces/IComponentType';
import IBuildType from '../interfaces/IBuildType';
import Component from '../components/Component';
import { Styles } from '../themes/Styles';
import Icon from 'react-native-vector-icons/Octicons';
import { usePrimaryContext } from '../contexts/PrimaryContext';

type Props = NativeStackScreenProps<RootStackParamList, 'UserBuildsList'>;

const UserBuildsList = (props: Props) => {
    const { user, darkMode } = usePrimaryContext();
    const { navigation, route } = props;
    const [buildsList, setBuildsList] = useState([{}] as IBuildType[]);
    const tempBuilds = [
        {
            name: "BuildCoso",
            price: "1000€",
            notes: "jkfdjsgvfjdnjghsridhgjf",
            components: [
                { name: "CPU", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta...", price: "100€" },
                { name: "CPU", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta...", price: "100€" }
            ]
        }
    ];
    useEffect(() => {
        //Aqui se llamaria a la api para conseguir sus builds
    }, []);

    return (
        <View>
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
                    <Icon name='three-bars' size={30} color={(darkMode) ? "white" : "black"}></Icon>
                </TouchableOpacity>
            </View>
            <FlatList
                data={tempBuilds}
                renderItem={(build) => {
                    return (
                        <View>
                            <Text style={{ fontSize: 30, color: (darkMode) ? "white" : "black" }}>{build.item.name}</Text>
                            <Text style={{ fontSize: 20, color: (darkMode) ? "white" : "black" }}>{build.item.price}</Text>
                        </View>
                    )
                }}
                keyExtractor={(comp, index) => index + ""}
            />
        </View>
    )
}

export default UserBuildsList

const styles = StyleSheet.create({})