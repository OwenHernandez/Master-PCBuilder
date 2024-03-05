import { Alert, Dimensions, FlatList, Image, PixelRatio, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import IComponentType from '../interfaces/IComponentType';
import { Styles } from '../themes/Styles';
import { usePrimaryContext } from '../contexts/PrimaryContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigations/StackNavigator';
import Icon from 'react-native-vector-icons/Octicons';
import Component from '../components/Component';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderScreen from '../components/HeaderScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'WishList'>;

const WishList = (props: Props) => {
    const { navigation, route } = props;
    const { user, darkMode } = usePrimaryContext();
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const [wishList, setWishList] = useState([{}] as IComponentType[]);
    const [wished, setWished] = useState(false);

    useEffect(() => {
        setWishList(user.componentsWished);
    }, []);

    return (
        <View>
            <HeaderScreen name={"Wish List"} navigation={navigation} profile={false} drawer={false} />
            <FlatList
                data={wishList}
                renderItem={(comp) => {
                    user.componentsWished.forEach((compWished) => {
                        if (comp.item.id === compWished.id) {
                            setWished(true);
                        }
                    });
                    return (
                        <View>
                            <Component comp={comp.item} wished={wished} />
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