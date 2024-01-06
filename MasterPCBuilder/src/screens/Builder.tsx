import { View, Text, TouchableOpacity, Image, Alert, FlatList, ScrollView, Modal, StyleSheet, PixelRatio, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react'
import { Styles } from '../themes/Styles';
import Octicons from 'react-native-vector-icons/Octicons';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { usePrimaryContext } from '../contexts/PrimaryContext';
import { RootDrawerParamList } from '../navigations/DrawerNavigator';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import Component from '../components/Component';

type Props = DrawerScreenProps<RootDrawerParamList, 'Builder'>;

const Builder = (props: Props) => {
    const { user, darkMode } = usePrimaryContext();
    const { navigation, route } = props;
    const [modalVisible, setModalVisible] = useState(false);
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    useEffect(() => {
        //Aqui se llamaria a las apis de los otros
    }, []);

    const components = [
        { name: "CPU", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta...", price: "100€", site: "PCComponentes" },
        { name: "CPU", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta...", price: "100€", site: "PCComponentes" },
        { name: "CPU", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta...", price: "100€", site: "PCComponentes" },
        { name: "CPU", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta...", price: "100€", site: "PCComponentes" },
        { name: "CPU", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta...", price: "100€", site: "PCComponentes" },
        { name: "CPU", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta...", price: "100€", site: "PCComponentes" }
    ]

    return (
        <View style={{ flex: 1, backgroundColor: (darkMode) ? "#242121" : "#F5F5F5" }}>
            <View style={Styles.headerView}>
                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <Image
                        source={{
                            uri: user.profilePic,
                            width: getIconSize(110),
                            height: getIconSize(110)
                        }}
                        style={{ ...Styles.imageStyle, borderColor: (darkMode) ? "white" : "black", borderWidth: 1 }}
                    />
                </TouchableOpacity>
                <Text style={{ ...Styles.headerText, color: (darkMode) ? "white" : "black" }}>{route.name}</Text>
                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                    <Octicons name='three-bars' size={getIconSize(100)} color={(darkMode) ? "white" : "black"}></Octicons>
                </TouchableOpacity>
            </View>
            <ScrollView>
                <View style={{ alignItems: 'center', marginTop: "5%" }}>
                    <Text style={{ fontSize: getFontSize(30), color: (darkMode) ? "white" : "black" }}>Main Components:</Text>
                </View>
                <TouchableOpacity onPress={toggleModal} style={{ ...Styles.touchable, flexDirection: 'row' }}>
                    <Octicons name="cpu" size={getIconSize(150)} color={(darkMode) ? "white" : "black"}></Octicons>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={{ fontSize: getFontSize(30), color: (darkMode) ? "white" : "black" }}>CPU</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert("Abrira un modal con las opciones de motherBoards")} style={{ ...Styles.touchable, flexDirection: 'row' }}>
                    <Material name="developer-board" size={getIconSize(150)} color={(darkMode) ? "white" : "black"}></Material>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={{ fontSize: getFontSize(30), color: (darkMode) ? "white" : "black" }}>Mother Board</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert("Abrira un modal con las opciones de memorias ram")} style={{ ...Styles.touchable, flexDirection: 'row' }}>
                    <FontAwesome5 name="memory" size={getIconSize(150)} color={(darkMode) ? "white" : "black"}></FontAwesome5>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={{ fontSize: getFontSize(30), color: (darkMode) ? "white" : "black" }}>Memory RAM</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert("Abrira un modal con las opciones de gpus")} style={{ ...Styles.touchable, flexDirection: 'row' }}>
                    <Image
                        source={(!darkMode) ? require("../../img/tarjeta-grafica_dark.png") : require("../../img/tarjeta-grafica_light.png")}
                        style={{ width: getIconSize(150), height: getIconSize(150) }}
                    />
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={{ fontSize: getFontSize(30), color: (darkMode) ? "white" : "black" }}>GPU</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert("Abrira un modal con las opciones de discos")} style={{ ...Styles.touchable, flexDirection: 'row' }}>
                    <Material name="harddisk" size={getIconSize(150)} color={(darkMode) ? "white" : "black"}></Material>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={{ fontSize: getFontSize(30), color: (darkMode) ? "white" : "black" }}>Drives</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert("Abrira un modal con las opciones de torres")} style={{ ...Styles.touchable, flexDirection: 'row' }}>
                    <Material name="desktop-tower" size={getIconSize(150)} color={(darkMode) ? "white" : "black"}></Material>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={{ fontSize: getFontSize(30), color: (darkMode) ? "white" : "black" }}>Tower</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert("Abrira un modal con las opciones de refrigeraciones")} style={{ ...Styles.touchable, flexDirection: 'row' }}>
                    <Material name="fan" size={getIconSize(150)} color={(darkMode) ? "white" : "black"}></Material>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={{ fontSize: getFontSize(30), color: (darkMode) ? "white" : "black" }}>Fans</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert("Abrira un modal con las opciones de psus")} style={{ ...Styles.touchable, flexDirection: 'row' }}>
                    <Material name="power" size={getIconSize(150)} color={(darkMode) ? "white" : "black"}></Material>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={{ fontSize: getFontSize(30), color: (darkMode) ? "white" : "black" }}>PSU</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ alignItems: 'center', marginBottom: "5%" }}>
                    <Text style={{ fontSize: getFontSize(30), color: (darkMode) ? "white" : "black" }}>Peripherals:</Text>
                </View>
                <TouchableOpacity onPress={() => Alert.alert("Abrira un modal con las opciones de psus")} style={{ ...Styles.touchable, flexDirection: 'row' }}>
                    <FontAwesome5 name="tv" size={getIconSize(150)} color={(darkMode) ? "white" : "black"}></FontAwesome5>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={{ fontSize: getFontSize(30), color: (darkMode) ? "white" : "black" }}>TV</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert("Abrira un modal con las opciones de psus")} style={{ ...Styles.touchable, flexDirection: 'row' }}>
                    <FontAwesome5 name="keyboard" size={getIconSize(150)} color={(darkMode) ? "white" : "black"}></FontAwesome5>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={{ fontSize: getFontSize(30), color: (darkMode) ? "white" : "black" }}>Keyboard</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert("Abrira un modal con las opciones de psus")} style={{ ...Styles.touchable, flexDirection: 'row' }}>
                    <FontAwesome5 name="mouse" size={getIconSize(150)} color={(darkMode) ? "white" : "black"}></FontAwesome5>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={{ fontSize: getFontSize(30), color: (darkMode) ? "white" : "black" }}>Mouse</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert("Abrira un modal con las opciones de psus")} style={{ ...Styles.touchable, flexDirection: 'row' }}>
                    <FontAwesome5 name="headphones-alt" size={getIconSize(150)} color={(darkMode) ? "white" : "black"}></FontAwesome5>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={{ fontSize: getFontSize(30), color: (darkMode) ? "white" : "black" }}>Headphones</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert("Abrira un modal con las opciones de psus")} style={{ ...Styles.touchable, flexDirection: 'row' }}>
                    <Material name="speaker" size={getIconSize(150)} color={(darkMode) ? "white" : "black"}></Material>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={{ fontSize: getFontSize(30), color: (darkMode) ? "white" : "black" }}>Speakers</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert("Abrira un modal con las opciones de psus")} style={{ ...Styles.touchable, flexDirection: 'row' }}>
                    <FontAwesome5 name="microphone" size={getIconSize(150)} color={(darkMode) ? "white" : "black"}></FontAwesome5>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={{ fontSize: getFontSize(30), color: (darkMode) ? "white" : "black" }}>Microphone</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
            <View style={{ ...Styles.headerView, borderTopColor: "#ca2613" }}>
                <Text style={{ ...Styles.headerText, color: (darkMode) ? "white" : "black" }}>Price Range: {/*Precio*/}€</Text>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={toggleModal}
            >

                <View style={{ ...styles.modalContainer }}>
                    <View style={{ ...styles.modalContent, backgroundColor: (darkMode) ? "#242121" : "#F5F5F5" }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", margin: "5%" }}>
                            <Text style={{ fontSize: getFontSize(20), color: (darkMode) ? "white" : "black", marginHorizontal: "5%" }}>Choose one for your computer and press it</Text>
                            <TouchableOpacity onPress={toggleModal}>
                                <Material name='close-box' size={getIconSize(100)} color={(darkMode) ? "white" : "black"}></Material>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={components}
                            renderItem={(comp) => {
                                return (
                                    <TouchableOpacity onPress={() => Alert.alert("pondria el componente en el boton")}>
                                        <Component comp={comp.item} />
                                    </TouchableOpacity>
                                );
                            }}

                        />
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default Builder

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        marginTop: "40%",
        borderColor: "#ca2613",
        borderWidth: 2
    },
    modalContent: {
        borderRadius: 10
    },
    closeModalText: {
        marginTop: 10,
        color: 'red',
    }
});