import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import IComponentType from '../interfaces/IComponentType';
import { Styles } from '../themes/Styles';
import { usePrimaryContext } from '../contexts/PrimaryContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/StackNavigator';
import Icon from 'react-native-vector-icons/Octicons';
import Component from '../components/Component';

type Props = NativeStackScreenProps<RootStackParamList, 'WishList'>;

const WishList = (props: Props) => {
    const { navigation, route } = props;
    const { user } = usePrimaryContext();
    const [wishList, setWishList] = useState({} as IComponentType[]);
    const tempWishList: IComponentType[] = [
        { name: "CPU", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta...", price: "100€" },
        { name: "MotherBoard", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta...", price: "100€" }
    ];
    useEffect(() => {
        //Buscaria en la base de datos los que tenga en la wishlist
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
                        style={{ ...Styles.imageStyle }}
                    />
                </TouchableOpacity>
                <Text style={Styles.headerText}>{route.name}</Text>
                <TouchableOpacity onPress={() => Alert.alert("Iria al drawer")}>
                    <Icon name='three-bars' size={30} color={"white"}></Icon>
                </TouchableOpacity>
            </View>
            <FlatList
                data={tempWishList}
                renderItem={(comp) => {
                    return (
                        <View>
                            <Component comp={comp.item} />
                            <TouchableOpacity onPress={() => Alert.alert("Quitaria de favorito")}>
                                <Text>Remove From Wish List</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }}
                keyExtractor={(comp, index) => index + ""}
            />
        </View>
    )
}

export default WishList

const styles = StyleSheet.create({})