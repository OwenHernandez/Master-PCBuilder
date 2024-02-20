import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    Modal,
    StyleSheet,
    PixelRatio,
    Dimensions,
    TextInput,
    KeyboardAvoidingView, Platform
} from 'react-native';
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
import IBuildComponentType from "../interfaces/IBuildComponentType";

type Props = NativeStackScreenProps<RootStackParamList, 'Builder'>;

const Builder = (props: Props) => {
    const { user, darkMode, token } = usePrimaryContext();
    const { navigation, route } = props;
    const build = route.params?.build;
    const builds = route.params?.builds;
    const [msg, setMsg] = useState("");
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

    useEffect(() => {
        if (build !== null) {
            setBuildTemp(build);
            setTotalPrice(0);
            if (build !== undefined && build.buildsComponents !== null) {
                build.buildsComponents.forEach(buildComp => {
                    setTotalPrice(prevPrice => prevPrice + buildComp.component.price);
                });
            }
        }
        if (builds !== null) {
            setBuildsTemp(builds);
        }
        getComponents();
    }, [build]);

    function newBuild() {
        setBuildTemp(null);
        setMsg("");
        setTotalPrice(0);
    }

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
        let prevBuildComp = buildTemp.buildsComponents;
        let buildComp = prevBuildComp.filter(buildCompFilter => comp.name === buildCompFilter.component.name);
        if (buildComp.length > 1) {
            setBuildTemp((prevBuild) =>
            ({
                ...prevBuild,
                buildsComponents: [...prevBuildComp.filter(buildCompFilter => comp.name !== buildCompFilter.component.name),
                ...prevBuildComp.filter(buildCompFilter => comp.name === buildCompFilter.component.name).slice(0, buildComp.length - 1)]
            })
            );
        } else {
            setBuildTemp((prevBuild) =>
            ({
                ...prevBuild,
                buildsComponents: [...prevBuildComp.filter(buildCompFilter => comp.name !== buildCompFilter.component.name)]
            })
            );
        }
        setTotalPrice(prevPrice => prevPrice - comp.price);
    }

    function setComponentToBuild(comp: IComponentType) {
        let newBuildComp: IBuildComponentType = {
            dateCreated: new Date().toISOString().slice(0, 10),
            priceAtTheTime: comp.price,
            component: comp
        };
        if (buildTemp !== undefined && buildTemp !== null) {
            let prevBuildComp = buildTemp.buildsComponents;

            setBuildTemp((prevBuild) => ({ ...prevBuild, buildsComponents: [...prevBuildComp, newBuildComp] }));
        } else {
            setBuildTemp((prevBuild) => ({ ...prevBuild, buildsComponents: [newBuildComp] }));
        }
        setTotalPrice(prevPrice => prevPrice + comp.price);
        setModalVisible(false);
    }

    async function getComponents() {
        const response = await axios.get(Globals.IP + "/api/v2/components", { headers: { "Authorization": "Bearer " + token } });
        setComponents(response.data);
    }

    async function saveBuild() {
        let compIdArray: number[] = [];
        buildTemp.buildsComponents.forEach((buildComp) => {
            compIdArray.push(buildComp.component.id);
        })
        const response = await axios.post(
            Globals.IP + "/api/v2/builds",
            { name: buildTemp.name, notes: buildTemp.notes ?? null, componentsIds: compIdArray },
            { headers: { "Authorization": "Bearer " + token } }
        );
        if (response.status === 200) {
            setBuildsTemp(undefined);
            navigation.navigate("UserBuildsList");
        } else {
            setMsg(response.statusText);
        }
    }

    async function updateBuild() {
        let compIdArray: number[] = [];
        buildTemp.buildsComponents.forEach((buildComp) => {
            compIdArray.push(buildComp.component.id);
        })
        const response = await axios.put(
            Globals.IP + "/api/v2/builds/" + buildTemp.id,
            { name: buildTemp.name, notes: buildTemp.notes ?? null, componentsIds: compIdArray },
            { headers: { "Authorization": "Bearer " + token } }
        );
        if (response.status === 200) {
            setBuildsTemp(undefined);
            navigation.navigate("UserBuildsList");
        } else {
            setMsg(response.statusText);
        }
    }

    const touchablesMain = [
        { name: "CPU", icon: "cpu", type: "CPU", importIcon: "Octicon" },
        { name: "Motherboard", icon: "developer-board", type: "Motherboard", importIcon: "Material" },
        { name: "Memory RAM", icon: "memory", type: "RAM", importIcon: "FontAwesome5" },
        { name: "Drive", icon: "harddisk", type: "Drive", importIcon: "Material" },
        { name: "Tower", icon: "desktop-tower", type: "Tower", importIcon: "Material" },
        { name: "Fan", icon: "fan", type: "Fan", importIcon: "Material" },
        { name: "PSU", icon: "power", type: "PSU", importIcon: "Material" },
        {
            name: "GPU",
            icon: (darkMode) ? "../../img/tarjeta-grafica_light.png" : "../../img/tarjeta-grafica_dark.png",
            type: "GPU",
            importIcon: "Image"
        }
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
                            uri: user.picture,
                            width: getIconSize(110),
                            height: getIconSize(110)
                        }}
                        style={{ ...Styles.imageStyle, borderColor: (darkMode) ? "white" : "black", borderWidth: 1 }}
                    />
                </TouchableOpacity>
                <Text style={{
                    ...Styles.headerText,
                    color: (darkMode) ? "white" : "black",
                    fontSize: getFontSize(20)
                }}>{route.name}</Text>
                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                    <Octicons name='three-bars' size={getIconSize(100)}
                        color={(darkMode) ? "white" : "black"}></Octicons>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    margin: "5%",
                    marginTop: "10%",
                    alignItems: "center"
                }}>
                    <TextInput
                        maxLength={20}
                        defaultValue={(buildTemp !== null && buildTemp !== undefined) && buildTemp.name}
                        placeholder='name' placeholderTextColor="#a3a3a3"
                        style={{
                            borderWidth: 2,
                            borderColor: "#ca2613",
                            borderRadius: 20,
                            paddingHorizontal: "5%",
                            width: "80%",
                            fontSize: getFontSize(20),
                            color: (darkMode) ? "white" : "black"
                        }}
                        onChangeText={(text) => setBuildTemp((prevBuild) => ({ ...prevBuild, name: text }))}
                    ></TextInput>
                </View>
                <View
                    style={{ flexDirection: "row", justifyContent: "space-around", margin: "5%", alignItems: "center" }}>
                    <TextInput
                        maxLength={20}
                        defaultValue={(buildTemp !== null && buildTemp !== undefined) && buildTemp.notes}
                        placeholder='notes' placeholderTextColor="#a3a3a3"
                        style={{
                            borderWidth: 2,
                            borderColor: "#ca2613",
                            borderRadius: 20,
                            paddingHorizontal: "5%",
                            width: "80%",
                            fontSize: getFontSize(20),
                            color: (darkMode) ? "white" : "black"
                        }}
                        onChangeText={(text) => setBuildTemp((prevBuild) => ({ ...prevBuild, notes: text }))}
                    ></TextInput>
                </View>
                <TouchableOpacity style={{
                    ...Styles.touchable,
                    alignItems: 'center',
                    marginVertical: "5%",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }} onPress={toggleMain}>
                    <Text style={{ fontSize: getFontSize(25), color: (darkMode) ? "white" : "black" }}>Main
                        Components:</Text>
                    <FontAwesome5 name={(mainVisible) ? "chevron-up" : "chevron-down"} size={getIconSize(100)}
                        color={(darkMode) ? "white" : "black"} />
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
                                                (buildTemp !== null && buildTemp !== undefined && buildTemp.buildsComponents !== undefined) &&
                                                buildTemp.buildsComponents.map((buildComp) => {
                                                    if (buildComp.component.type === touch.item.type) {
                                                        return (
                                                            <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                                <Component comp={buildComp.component} />
                                                                <TouchableOpacity
                                                                    onPress={() => removeFromBuild(buildComp.component)}>
                                                                    <Material name='close-box' size={getIconSize(100)}
                                                                        color={(darkMode) ? "white" : "black"}></Material>
                                                                </TouchableOpacity>
                                                            </View>
                                                        );
                                                    }
                                                })
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => toggleModal(touch.item.type)}>
                                            <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                <Octicons name={touch.item.icon} size={getIconSize(150)}
                                                    color={(darkMode) ? "white" : "black"}></Octicons>
                                                <View style={{ flex: 1, alignItems: "center" }}>
                                                    <Text style={{
                                                        fontSize: getFontSize(30),
                                                        color: (darkMode) ? "white" : "black"
                                                    }}>{touch.item.name}</Text>
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
                                                (buildTemp !== null && buildTemp !== undefined && buildTemp.buildsComponents !== undefined) &&
                                                buildTemp.buildsComponents.map((buildComp) => {
                                                    if (buildComp.component.type === touch.item.type) {
                                                        return (
                                                            <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                                <Component comp={buildComp.component} />
                                                                <TouchableOpacity
                                                                    onPress={() => removeFromBuild(buildComp.component)}>
                                                                    <Material name='close-box' size={getIconSize(100)}
                                                                        color={(darkMode) ? "white" : "black"}></Material>
                                                                </TouchableOpacity>
                                                            </View>
                                                        );
                                                    }
                                                })
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => toggleModal(touch.item.type)}>
                                            <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                <Material name={touch.item.icon} size={getIconSize(150)}
                                                    color={(darkMode) ? "white" : "black"}></Material>
                                                <View style={{ flex: 1, alignItems: "center" }}>
                                                    <Text style={{
                                                        fontSize: getFontSize(30),
                                                        color: (darkMode) ? "white" : "black"
                                                    }}>{touch.item.name}</Text>
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
                                                (buildTemp !== null && buildTemp !== undefined && buildTemp.buildsComponents !== undefined) &&
                                                buildTemp.buildsComponents.map((buildComp) => {
                                                    if (buildComp.component.type === touch.item.type) {
                                                        return (
                                                            <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                                <Component comp={buildComp.component} />
                                                                <TouchableOpacity
                                                                    onPress={() => removeFromBuild(buildComp.component)}>
                                                                    <Material name='close-box' size={getIconSize(100)}
                                                                        color={(darkMode) ? "white" : "black"}></Material>
                                                                </TouchableOpacity>
                                                            </View>
                                                        );
                                                    }
                                                })
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => toggleModal(touch.item.type)}>
                                            <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                <FontAwesome5 name={touch.item.icon} size={getIconSize(150)}
                                                    color={(darkMode) ? "white" : "black"}></FontAwesome5>
                                                <View style={{ flex: 1, alignItems: "center" }}>
                                                    <Text style={{
                                                        fontSize: getFontSize(30),
                                                        color: (darkMode) ? "white" : "black"
                                                    }}>{touch.item.name}</Text>
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
                                                (buildTemp !== null && buildTemp !== undefined && buildTemp.buildsComponents !== undefined) &&
                                                buildTemp.buildsComponents.map((buildComp) => {
                                                    if (buildComp.component.type === touch.item.type) {
                                                        return (
                                                            <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                                <Component comp={buildComp.component} />
                                                                <TouchableOpacity
                                                                    onPress={() => removeFromBuild(buildComp.component)}>
                                                                    <Material name='close-box' size={getIconSize(100)}
                                                                        color={(darkMode) ? "white" : "black"}></Material>
                                                                </TouchableOpacity>
                                                            </View>
                                                        );
                                                    }
                                                })
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => toggleModal(touch.item.type)}
                                            style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                            <Image
                                                source={(!darkMode) ? require("../../img/tarjeta-grafica_dark.png") : require("../../img/tarjeta-grafica_light.png")}
                                                style={{ width: getIconSize(150), height: getIconSize(150) }}
                                            />
                                            <View style={{ flex: 1, alignItems: "center" }}>
                                                <Text style={{
                                                    fontSize: getFontSize(30),
                                                    color: (darkMode) ? "white" : "black"
                                                }}>{touch.item.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                );
                            }
                        }}
                    />
                }
                <TouchableOpacity style={{
                    ...Styles.touchable,
                    alignItems: 'center',
                    marginVertical: "5%",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }} onPress={togglePeri}>
                    <Text style={{ fontSize: getFontSize(25), color: (darkMode) ? "white" : "black" }}>Peripherals:</Text>
                    <FontAwesome5 name={(periVisible) ? "chevron-up" : "chevron-down"} size={getIconSize(100)}
                        color={(darkMode) ? "white" : "black"} />
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
                                                (buildTemp !== null && buildTemp !== undefined && buildTemp.buildsComponents !== undefined) &&
                                                buildTemp.buildsComponents.map((buildComp) => {
                                                    if (buildComp.component.type === touch.item.type) {
                                                        return (
                                                            <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                                <Component comp={buildComp.component} />
                                                                <TouchableOpacity
                                                                    onPress={() => removeFromBuild(buildComp.component)}>
                                                                    <Material name='close-box' size={getIconSize(100)}
                                                                        color={(darkMode) ? "white" : "black"}></Material>
                                                                </TouchableOpacity>
                                                            </View>
                                                        );
                                                    }
                                                })
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => toggleModal(touch.item.type)}>
                                            <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                <Octicons name={touch.item.icon} size={getIconSize(150)}
                                                    color={(darkMode) ? "white" : "black"}></Octicons>
                                                <View style={{ flex: 1, alignItems: "center" }}>
                                                    <Text style={{
                                                        fontSize: getFontSize(30),
                                                        color: (darkMode) ? "white" : "black"
                                                    }}>{touch.item.name}</Text>
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
                                                (buildTemp !== null && buildTemp !== undefined && buildTemp.buildsComponents !== undefined) &&
                                                buildTemp.buildsComponents.map((buildComp) => {
                                                    if (buildComp.component.type === touch.item.type) {
                                                        return (
                                                            <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                                <Component comp={buildComp.component} />
                                                                <TouchableOpacity
                                                                    onPress={() => removeFromBuild(buildComp.component)}>
                                                                    <Material name='close-box' size={getIconSize(100)}
                                                                        color={(darkMode) ? "white" : "black"}></Material>
                                                                </TouchableOpacity>
                                                            </View>
                                                        );
                                                    }
                                                })
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => toggleModal(touch.item.type)}>
                                            <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                <Material name={touch.item.icon} size={getIconSize(150)}
                                                    color={(darkMode) ? "white" : "black"}></Material>
                                                <View style={{ flex: 1, alignItems: "center" }}>
                                                    <Text style={{
                                                        fontSize: getFontSize(30),
                                                        color: (darkMode) ? "white" : "black"
                                                    }}>{touch.item.name}</Text>
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
                                                (buildTemp !== null && buildTemp !== undefined && buildTemp.buildsComponents !== undefined) &&
                                                buildTemp.buildsComponents.map((buildComp) => {
                                                    if (buildComp.component.type === touch.item.type) {
                                                        return (
                                                            <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                                <Component comp={buildComp.component} />
                                                                <TouchableOpacity
                                                                    onPress={() => removeFromBuild(buildComp.component)}>
                                                                    <Material name='close-box' size={getIconSize(100)}
                                                                        color={(darkMode) ? "white" : "black"}></Material>
                                                                </TouchableOpacity>
                                                            </View>
                                                        );
                                                    }
                                                })
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => toggleModal(touch.item.type)}>
                                            <View style={{ ...Styles.touchable, flexDirection: 'row' }}>
                                                <FontAwesome5 name={touch.item.icon} size={getIconSize(150)}
                                                    color={(darkMode) ? "white" : "black"}></FontAwesome5>
                                                <View style={{ flex: 1, alignItems: "center" }}>
                                                    <Text style={{
                                                        fontSize: getFontSize(30),
                                                        color: (darkMode) ? "white" : "black"
                                                    }}>{touch.item.name}</Text>
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
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={65}
                enabled={Platform.OS === "ios"}
            >
                <TouchableOpacity style={{ ...Styles.touchable }} onPress={newBuild}>
                    <Text style={{
                        fontSize: getFontSize(20),
                        textAlign: 'center',
                        color: (darkMode) ? "white" : "black"
                    }}>New Build</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
            <View style={{
                ...Styles.headerView,
                borderTopColor: "#ca2613",
                backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"
            }}>
                <Text style={{ ...Styles.headerText, color: (darkMode) ? "white" : "black" }}>Price
                    Range: {totalPrice}€</Text>
                <Text style={{ ...Styles.headerText, color: "red" }}>{msg}</Text>
                <TouchableOpacity onPress={() => {
                    if (buildTemp === null) {
                        saveBuild();
                    } else {
                        updateBuild();
                    }
                }}>
                    <Text style={{
                        ...Styles.headerText,
                        color: (darkMode) ? "white" : "black"
                    }}>{(buildTemp === null) ? "Save" : "Update"}</Text>
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
                            <Text style={{
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black",
                                marginHorizontal: "5%"
                            }}>Choose one for your computer and press it</Text>
                            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                                <Material name='close-box' size={getIconSize(100)}
                                    color={(darkMode) ? "white" : "black"}></Material>
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