import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, Modal, StyleSheet, PixelRatio, Dimensions, TextInput } from 'react-native';
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
import axios from 'axios';
import { Globals } from '../components/Globals';

type Props = NativeStackScreenProps<RootStackParamList, 'Builder'>;

const Builder = (props: Props) => {
    const { user, darkMode, token } = usePrimaryContext();
    const { navigation, route } = props;
    const build = route.params?.build;
    const builds = route.params?.builds;
    const [buildTemp, setBuildTemp] = useState({} as IBuildType);
    const [buildsTemp, setBuildsTemp] = useState({} as IBuildType[]);
    const [modalCompType, setModalCompType] = useState("");
    const [components, setComponents] = useState([{}] as IComponentType[]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [mainVisible, setMainVisible] = useState(false);
    const [periVisible, setPeriVisible] = useState(false);
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;

    const toggleModal = (modalType: string) => {
        setModalCompType(modalType);
        setModalVisible(!modalVisible);
    };

    function toggleMain() {
        setMainVisible(!mainVisible);
    }

    function togglePeri() {
        setPeriVisible(!periVisible);
    }

    function removeFromBuild(comp: IComponentType) {
        let prevComp = buildTemp.components;
        setBuildTemp((prevBuild) => ({ ...prevBuild, components: [...prevComp.filter((compFilt) => comp.name !== compFilt.name)] }));
        setTotalPrice(prevPrice => prevPrice - comp.price);
    }

    function setComponentToBuild(comp: IComponentType) {
        if (buildTemp !== undefined && buildTemp !== null) {
            let prevComp = buildTemp.components;
            setBuildTemp((prevBuild) => ({ ...prevBuild, components: [...prevComp, comp] }));
        } else {
            setBuildTemp((prevBuild) => ({ ...prevBuild, components: [comp] }));
        }
        setTotalPrice(prevPrice => prevPrice + comp.price);
        setModalVisible(false);
    }

    async function getComponents() {
        const response = await axios.get(Globals.IP + "/api/v2/components", { headers: { "Authorization": "Bearer " + token } });
        setComponents(response.data);
    }

    useEffect(() => {
        if (build !== null) {
            setBuildTemp(build);
            if (build !== undefined && build.components !== null) {
                build.components.forEach(comp => {
                    setTotalPrice(prevPrice => prevPrice + comp.price);
                });
            }
        }
        if (builds !== null) {
            setBuildsTemp(builds);
        }
        getComponents();
    }, [build]);

    const touchablesMain = [
        { name: "CPU", icon: "cpu", type: "CPU", importIcon: "Octicon" },
        { name: "Motherboard", icon: "developer-board", type: "Motherboard", importIcon: "Material" },
        { name: "Memory RAM", icon: "memory", type: "RAM", importIcon: "FontAwesome5" },
        { name: "Drive", icon: "harddisk", type: "Drive", importIcon: "Material" },
        { name: "Tower", icon: "desktop-tower", type: "Tower", importIcon: "Material" },
        { name: "Fan", icon: "fan", type: "Fan", importIcon: "Material" },
        { name: "PSU", icon: "power", type: "PSU", importIcon: "Material" },
        { name: "GPU", icon: (darkMode) ? "../../img/tarjeta-grafica_light.png" : "../../img/tarjeta-grafica_dark.png", type: "GPU", importIcon: "Image" }
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
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-around", margin: "10%", alignItems: "center" }}>
                    <TextInput
                        maxLength={20}
                        defaultValue={(build !== null && build !== undefined) && build.name}
                        placeholder='Put the name of the build' placeholderTextColor={(darkMode) ? "white" : "black"}
                        style={{ borderWidth: 2, borderColor: "#ca2613", borderRadius: 20, paddingHorizontal: "5%", width: "80%", fontSize: getFontSize(20), color: (darkMode) ? "white" : "black" }}
                    ></TextInput>
                </View>
                <TouchableOpacity style={{ ...Styles.touchable, alignItems: 'center', marginVertical: "5%", flexDirection: "row", justifyContent: "space-between" }} onPress={toggleMain}>
                    <Text style={{ fontSize: getFontSize(25), color: (darkMode) ? "white" : "black" }}>Main Components:</Text>
                    <FontAwesome5 name={(mainVisible) ? "chevron-up" : "chevron-down"} size={getIconSize(100)} color={(darkMode) ? "white" : "black"} />
                </TouchableOpacity>
                {
                    (mainVisible) &&
                    <FlatList
                        data={touchablesMain}
                        keyExtractor={(touch, index) => index + ""}
                        renderItem={(touch) => {
                            if (touch.item.importIcon === "Octicon") {
                                return (
                                    <View>
                                        <TouchableOpacity onPress={() => toggleModal(touch.item.type)}>
                                            {
                                                (buildTemp !== null && buildTemp !== undefined && buildTemp.components !== undefined) &&
                                                buildTemp.components.map((comp) => {
                                                    if (comp.type === touch.item.type) {
                                                        return (
                                                            <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                                <Component comp={comp} />
                                                                <TouchableOpacity onPress={() => removeFromBuild(comp)}>
                                                                    <Material name='close-box' size={getIconSize(100)} color={(darkMode) ? "white" : "black"}></Material>
                                                                </TouchableOpacity>
                                                            </View>
                                                        );
                                                    }
                                                })
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => toggleModal(touch.item.type)}>
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
                                        <TouchableOpacity onPress={() => toggleModal(touch.item.type)}>
                                            {
                                                (buildTemp !== null && buildTemp !== undefined && buildTemp.components !== undefined) &&
                                                buildTemp.components.map((comp) => {
                                                    if (comp.type === touch.item.type) {
                                                        return (
                                                            <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                                <Component comp={comp} />
                                                                <TouchableOpacity onPress={() => removeFromBuild(comp)}>
                                                                    <Material name='close-box' size={getIconSize(100)} color={(darkMode) ? "white" : "black"}></Material>
                                                                </TouchableOpacity>
                                                            </View>
                                                        );
                                                    }
                                                })
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => toggleModal(touch.item.type)}>
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
                                        <TouchableOpacity onPress={() => toggleModal(touch.item.type)}>
                                            {
                                                (buildTemp !== null && buildTemp !== undefined && buildTemp.components !== undefined) &&
                                                buildTemp.components.map((comp) => {
                                                    if (comp.type === touch.item.type) {
                                                        return (
                                                            <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                                <Component comp={comp} />
                                                                <TouchableOpacity onPress={() => removeFromBuild(comp)}>
                                                                    <Material name='close-box' size={getIconSize(100)} color={(darkMode) ? "white" : "black"}></Material>
                                                                </TouchableOpacity>
                                                            </View>
                                                        );
                                                    }
                                                })
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => toggleModal(touch.item.type)}>
                                            <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                <FontAwesome5 name={touch.item.icon} size={getIconSize(150)} color={(darkMode) ? "white" : "black"}></FontAwesome5>
                                                <View style={{ flex: 1, alignItems: "center" }}>
                                                    <Text style={{ fontSize: getFontSize(30), color: (darkMode) ? "white" : "black" }}>{touch.item.name}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                );
                            } else {
                                return (
                                    <View>
                                        <TouchableOpacity onPress={() => toggleModal(touch.item.type)}>
                                            {
                                                (buildTemp !== null && buildTemp !== undefined && buildTemp.components !== undefined) &&
                                                buildTemp.components.map((comp) => {
                                                    if (comp.type === touch.item.type) {
                                                        return (
                                                            <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                                <Component comp={comp} />
                                                                <TouchableOpacity onPress={() => removeFromBuild(comp)}>
                                                                    <Material name='close-box' size={getIconSize(100)} color={(darkMode) ? "white" : "black"}></Material>
                                                                </TouchableOpacity>
                                                            </View>
                                                        );
                                                    }
                                                })
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => toggleModal(touch.item.type)} style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                            <Image
                                                source={(!darkMode) ? require("../../img/tarjeta-grafica_dark.png") : require("../../img/tarjeta-grafica_light.png")}
                                                style={{ width: getIconSize(150), height: getIconSize(150) }}
                                            />
                                            <View style={{ flex: 1, alignItems: "center" }}>
                                                <Text style={{ fontSize: getFontSize(30), color: (darkMode) ? "white" : "black" }}>{touch.item.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                );
                            }
                        }}
                    />
                }
                <TouchableOpacity style={{ ...Styles.touchable, alignItems: 'center', marginVertical: "5%", flexDirection: "row", justifyContent: "space-between" }} onPress={togglePeri}>
                    <Text style={{ fontSize: getFontSize(25), color: (darkMode) ? "white" : "black" }}>Peripherals:</Text>
                    <FontAwesome5 name={(periVisible) ? "chevron-up" : "chevron-down"} size={getIconSize(100)} color={(darkMode) ? "white" : "black"} />
                </TouchableOpacity>
                {
                    (periVisible) &&
                    <FlatList
                        data={touchablesPeri}
                        keyExtractor={(touch, index) => index + ""}
                        renderItem={(touch) => {
                            if (touch.item.importIcon === "Octicon") {
                                return (
                                    <View>
                                        <TouchableOpacity onPress={() => toggleModal(touch.item.type)}>
                                            {
                                                (buildTemp !== null && buildTemp !== undefined && buildTemp.components !== undefined) &&
                                                buildTemp.components.map((comp) => {
                                                    if (comp.type === touch.item.type) {
                                                        return (
                                                            <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                                <Component comp={comp} />
                                                                <TouchableOpacity onPress={() => removeFromBuild(comp)}>
                                                                    <Material name='close-box' size={getIconSize(100)} color={(darkMode) ? "white" : "black"}></Material>
                                                                </TouchableOpacity>
                                                            </View>
                                                        );
                                                    }
                                                })
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => toggleModal(touch.item.type)}>
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
                                        <TouchableOpacity onPress={() => toggleModal(touch.item.type)}>
                                            {
                                                (buildTemp !== null && buildTemp !== undefined && buildTemp.components !== undefined) &&
                                                buildTemp.components.map((comp) => {
                                                    if (comp.type === touch.item.type) {
                                                        return (
                                                            <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                                <Component comp={comp} />
                                                                <TouchableOpacity onPress={() => removeFromBuild(comp)}>
                                                                    <Material name='close-box' size={getIconSize(100)} color={(darkMode) ? "white" : "black"}></Material>
                                                                </TouchableOpacity>
                                                            </View>
                                                        );
                                                    }
                                                })
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => toggleModal(touch.item.type)}>
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
                                        <TouchableOpacity onPress={() => toggleModal(touch.item.type)}>
                                            {
                                                (buildTemp !== null && buildTemp !== undefined && buildTemp.components !== undefined) &&
                                                buildTemp.components.map((comp) => {
                                                    if (comp.type === touch.item.type) {
                                                        return (
                                                            <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                                <Component comp={comp} />
                                                                <TouchableOpacity onPress={() => removeFromBuild(comp)}>
                                                                    <Material name='close-box' size={getIconSize(100)} color={(darkMode) ? "white" : "black"}></Material>
                                                                </TouchableOpacity>
                                                            </View>
                                                        );
                                                    }
                                                })
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => toggleModal(touch.item.type)}>
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
                }
            </View>
            <View style={{ ...Styles.headerView, borderTopColor: "#ca2613" }}>
                <Text style={{ ...Styles.headerText, color: (darkMode) ? "white" : "black" }}>Price Range: {totalPrice}€</Text>
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
                onRequestClose={() => setModalVisible(!modalVisible)}
            >

                <View style={{ ...styles.modalContainer }}>
                    <View style={{ ...styles.modalContent, backgroundColor: (darkMode) ? "#242121" : "#F5F5F5" }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", margin: "5%" }}>
                            <Text style={{ fontSize: getFontSize(20), color: (darkMode) ? "white" : "black", marginHorizontal: "5%" }}>Choose one for your computer and press it</Text>
                            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                                <Material name='close-box' size={getIconSize(100)} color={(darkMode) ? "white" : "black"}></Material>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={components}
                            renderItem={(comp) => {
                                if (comp.item.type === modalCompType) {
                                    return (
                                        <TouchableOpacity onPress={() => setComponentToBuild(comp.item)}>
                                            <Component comp={comp.item} />
                                        </TouchableOpacity>
                                    );
                                }
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