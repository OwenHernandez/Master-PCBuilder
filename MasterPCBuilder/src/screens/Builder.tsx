import { View, Text, TouchableOpacity, Image, Alert, FlatList, ScrollView, Modal, StyleSheet, PixelRatio, Dimensions, TextInput } from 'react-native';
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
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import IBuildType from '../interfaces/IBuildType';
import IComponentType from '../interfaces/IComponentType';

type Props = NativeStackScreenProps<RootStackParamList, 'Builder'>;

const Builder = (props: Props) => {
    const { user, darkMode } = usePrimaryContext();
    const { navigation, route } = props;
    const build = route.params?.build;
    const [buildTemp, setBuildTemp] = useState({} as IBuildType);
    const [cpuSelected, setcpuSelected] = useState({} as IComponentType);
    const [motherboardSelected, setMotherboardSelected] = useState({} as IComponentType);
    const [ramSelected, setramSelected] = useState([{}] as IComponentType[]);
    const [gpuSelected, setgpuSelected] = useState({} as IComponentType);
    const [driveSelected, setDriveSelected] = useState([{}] as IComponentType[]);
    const [towerSelected, setTowerSelected] = useState({} as IComponentType);
    const [fanSelected, setFanSelected] = useState([{}] as IComponentType[]);
    const [psuSelected, setpsuSelected] = useState({} as IComponentType);
    const [tvSelected, setTVSelected] = useState([{}] as IComponentType[]);
    const [keyboardSelected, setKeyboardSelected] = useState({} as IComponentType);
    const [MouseSelected, setMouseSelected] = useState({} as IComponentType);
    const [headphonesSelected, setHeadphonesSelected] = useState({} as IComponentType);
    const [speakersSelected, setSpeakerSelected] = useState({} as IComponentType);
    const [microphoneSelected, setMicrophoneSelected] = useState({} as IComponentType);
    const [modalVisible, setModalVisible] = useState(false);
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    useEffect(() => {
        if (build !== null) {
            setBuildTemp(build);
        }
        //Aqui se llamaria a las apis de los otros
    }, []);

    const components = [
        { name: "CPU", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta...", price: "100€", site: "PCComponentes", type: "CPU" },
        { name: "Motherboard", compImage: "https://www.mouser.es/images/marketingid/2020/img/110657914.png?v=101223.0140", description: "CPU super potente perfecta...", price: "100€", site: "PCComponentes", type: "Motherboard" },
        { name: "Tower", compImage: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Falcon_Northwest_Talon.png", description: "CPU super potente perfecta...", price: "100€", site: "PCComponentes", type: "Tower" },
        { name: "GPU", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta...", price: "100€", site: "PCComponentes", type: "GPU" },
        { name: "RAM", compImage: "https://m.media-amazon.com/images/I/61XmhmEup8L._AC_UF1000,1000_QL80_.jpg", description: "CPU super potente perfecta...", price: "100€", site: "PCComponentes", type: "RAM" },
        { name: "RAM2", compImage: "https://m.media-amazon.com/images/I/61XmhmEup8L._AC_UF1000,1000_QL80_.jpg", description: "CPU super potente perfecta...", price: "100€", site: "PCComponentes", type: "RAM" },
        { name: "Drive", compImage: "https://www.computerstore.es/70797-home_default/ssdsamsung25gb97evoplusnvmem2.jpg", description: "CPU super potente perfecta...", price: "100€", site: "PCComponentes", type: "Drive" }
    ];

    const touchablesMain = [
        { name: "CPU", icon: "cpu", type: "CPU", importIcon: "Octicon" },
        { name: "Motherboard", icon: "developer-board", type: "Motherboard", importIcon: "Material" },
        { name: "Memory RAM", icon: "memory", type: "RAM", importIcon: "FontAwesome5" },
        { name: "Drives", icon: "harddisk", type: "Drive", importIcon: "Material" },
        { name: "Tower", icon: "desktop-tower", type: "Tower", importIcon: "Material" },
        { name: "Fans", icon: "fan", type: "Fan", importIcon: "Material" },
        { name: "PSU", icon: "power", type: "PSU", importIcon: "Material" }
    ];

    const touchablesPeri = [
        { name: "TV", icon: "tv", type: "TV", importIcon: "FontAwesome5" },
        { name: "Keyboard", icon: "keyboard", type: "Keyboard", importIcon: "FontAwesome5" },
        { name: "Mouse", icon: "mouse", type: "Mouse", importIcon: "FontAwesome5" },
        { name: "Headphones", icon: "headphones-alt", type: "Headphones", importIcon: "FontAwesome5" },
        { name: "Speakers", icon: "speaker", type: "Speaker", importIcon: "Material" },
        { name: "Microphone", icon: "microphone", type: "Microphone", importIcon: "FontAwesome5" }
    ];

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
                <Text style={{ ...Styles.headerText, color: (darkMode) ? "white" : "black", fontSize: getFontSize(20) }}>{route.name}</Text>
                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                    <Octicons name='three-bars' size={getIconSize(100)} color={(darkMode) ? "white" : "black"}></Octicons>
                </TouchableOpacity>
            </View>
            <ScrollView>
                <View style={{ flexDirection: "row", justifyContent: "space-around", margin: "10%", alignItems: "center" }}>
                    <TextInput maxLength={20} defaultValue={(build !== null && build !== undefined) && build.name} placeholder='Put the name of the build' placeholderTextColor={(darkMode) ? "white" : "black"} style={{ borderWidth: 2, borderColor: "#ca2613", borderRadius: 20, paddingHorizontal: "5%", width: "80%", fontSize: getFontSize(20), color: (darkMode) ? "white" : "black" }}></TextInput>
                </View>
                <View style={{ alignItems: 'center', marginTop: "5%" }}>
                    <Text style={{ fontSize: getFontSize(30), color: (darkMode) ? "white" : "black" }}>Main Components:</Text>
                </View>
                <FlatList
                    data={touchablesMain}
                    keyExtractor={(touch, index) => index + ""}
                    renderItem={(touch) => {
                        if (touch.item.importIcon === "Octicon") {
                            return (
                                <View>
                                    <TouchableOpacity onPress={toggleModal}>
                                        {
                                            (build !== null && build !== undefined) &&
                                            build.components.map((comp) => {
                                                if (comp.type === touch.item.type) {
                                                    return (
                                                        <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                            <Component comp={comp} />
                                                        </View>
                                                    );
                                                }
                                            })
                                        }
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={toggleModal}>
                                        <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                            <Octicons name={touch.item.icon} size={getIconSize(150)} color={(darkMode) ? "white" : "black"}></Octicons>
                                            <View style={{ flex: 1, alignItems: "center" }}>
                                                <Text style={{ fontSize: getFontSize(30), color: (darkMode) ? "white" : "black" }}>{touch.item.name}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            );
                        } else if (touch.item.importIcon === "Material") {
                            return (
                                <View>
                                    <TouchableOpacity onPress={toggleModal}>
                                        {
                                            (build !== null && build !== undefined) &&
                                            build.components.map((comp) => {
                                                if (comp.type === touch.item.type) {
                                                    return (
                                                        <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                            <Component comp={comp} />
                                                        </View>
                                                    );
                                                }
                                            })
                                        }
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={toggleModal}>
                                        <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                            <Material name={touch.item.icon} size={getIconSize(150)} color={(darkMode) ? "white" : "black"}></Material>
                                            <View style={{ flex: 1, alignItems: "center" }}>
                                                <Text style={{ fontSize: getFontSize(30), color: (darkMode) ? "white" : "black" }}>{touch.item.name}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            );
                        } else if (touch.item.importIcon === "FontAwesome5") {
                            return (
                                <View>
                                    <TouchableOpacity onPress={toggleModal}>
                                        {
                                            (build !== null && build !== undefined) &&
                                            build.components.map((comp) => {
                                                if (comp.type === touch.item.type) {
                                                    return (
                                                        <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                            <Component comp={comp} />
                                                        </View>
                                                    );
                                                }
                                            })
                                        }
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={toggleModal}>
                                        <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                            <FontAwesome5 name={touch.item.icon} size={getIconSize(150)} color={(darkMode) ? "white" : "black"}></FontAwesome5>
                                            <View style={{ flex: 1, alignItems: "center" }}>
                                                <Text style={{ fontSize: getFontSize(30), color: (darkMode) ? "white" : "black" }}>{touch.item.name}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            );
                        }
                    }}
                />
                <View>
                    <TouchableOpacity onPress={toggleModal}>
                        {
                            (build !== null && build !== undefined) &&
                            build.components.map((comp) => {
                                if (comp.type === "GPU") {
                                    return (
                                        <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                            <Component comp={comp} />
                                        </View>
                                    );
                                }
                            })
                        }
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
                </View>
                <View style={{ alignItems: 'center', marginBottom: "5%" }}>
                    <Text style={{ fontSize: getFontSize(30), color: (darkMode) ? "white" : "black" }}>Peripherals:</Text>
                </View>
                <FlatList
                    data={touchablesPeri}
                    keyExtractor={(touch, index) => index + ""}
                    renderItem={(touch) => {
                        if (touch.item.importIcon === "Octicon") {
                            return (
                                <View>
                                    <TouchableOpacity onPress={toggleModal}>
                                        {
                                            (build !== null && build !== undefined) &&
                                            build.components.map((comp) => {
                                                if (comp.type === touch.item.type) {
                                                    return (
                                                        <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                            <Component comp={comp} />
                                                        </View>
                                                    );
                                                }
                                            })
                                        }
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={toggleModal}>
                                        <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                            <Octicons name={touch.item.icon} size={getIconSize(150)} color={(darkMode) ? "white" : "black"}></Octicons>
                                            <View style={{ flex: 1, alignItems: "center" }}>
                                                <Text style={{ fontSize: getFontSize(30), color: (darkMode) ? "white" : "black" }}>{touch.item.name}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            );
                        } else if (touch.item.importIcon === "Material") {
                            return (
                                <View>
                                    <TouchableOpacity onPress={toggleModal}>
                                        {
                                            (build !== null && build !== undefined) &&
                                            build.components.map((comp) => {
                                                if (comp.type === touch.item.type) {
                                                    return (
                                                        <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                            <Component comp={comp} />
                                                        </View>
                                                    );
                                                }
                                            })
                                        }
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={toggleModal}>
                                        <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                            <Material name={touch.item.icon} size={getIconSize(150)} color={(darkMode) ? "white" : "black"}></Material>
                                            <View style={{ flex: 1, alignItems: "center" }}>
                                                <Text style={{ fontSize: getFontSize(30), color: (darkMode) ? "white" : "black" }}>{touch.item.name}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            );
                        } else if (touch.item.importIcon === "FontAwesome5") {
                            return (
                                <View>
                                    <TouchableOpacity onPress={toggleModal}>
                                        {
                                            (build !== null && build !== undefined) &&
                                            build.components.map((comp) => {
                                                if (comp.type === touch.item.type) {
                                                    return (
                                                        <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                            <Component comp={comp} />
                                                        </View>
                                                    );
                                                }
                                            })
                                        }
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={toggleModal}>
                                        <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                            <FontAwesome5 name={touch.item.icon} size={getIconSize(150)} color={(darkMode) ? "white" : "black"}></FontAwesome5>
                                            <View style={{ flex: 1, alignItems: "center" }}>
                                                <Text style={{ fontSize: getFontSize(30), color: (darkMode) ? "white" : "black" }}>{touch.item.name}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            );
                        }
                    }}
                />
            </ScrollView>
            <View style={{ ...Styles.headerView, borderTopColor: "#ca2613" }}>
                <Text style={{ ...Styles.headerText, color: (darkMode) ? "white" : "black" }}>Price Range: {/*Precio*/}€</Text>
                <TouchableOpacity onPress={() => {

                    navigation.navigate("UserBuildsList");
                }}>
                    <Text style={{ ...Styles.headerText, color: (darkMode) ? "white" : "black" }}>Guardar</Text>
                </TouchableOpacity>
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