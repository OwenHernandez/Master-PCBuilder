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
    ScrollView
} from 'react-native';
import React, {useEffect, useState} from 'react'
import {Styles} from '../themes/Styles';
import Octicons from 'react-native-vector-icons/Octicons';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {usePrimaryContext} from '../contexts/PrimaryContext';
import Component from '../components/Component';
import {RootStackParamList} from '../navigations/StackNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import IBuildType from '../interfaces/IBuildType';
import IComponentType from '../interfaces/IComponentType';
import axios from 'axios';
import {Globals} from '../components/Globals';
import IBuildComponentType from "../interfaces/IBuildComponentType";
import HeaderScreen from "../components/HeaderScreen";
import RNFetchBlob from "rn-fetch-blob";
import {Dropdown} from "react-native-element-dropdown";

type Props = NativeStackScreenProps<RootStackParamList, 'Builder'>;

type Select = {
    label: string,
    value: string
}

const Builder = (props: Props) => {
    const {user, darkMode, token} = usePrimaryContext();
    const {navigation, route} = props;
    const build = route.params?.build;
    const builds = route.params?.builds;
    const [msg, setMsg] = useState("");
    const [buildTemp, setBuildTemp] = useState({} as IBuildType);
    const [buildUpt, setBuildUpt] = useState({} as IBuildType);
    const [buildsTemp, setBuildsTemp] = useState({} as IBuildType[]);
    const [modalCompType, setModalCompType] = useState("");
    const [components, setComponents] = useState([{}] as IComponentType[]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMainVisible, setModalMainVisible] = useState(false);
    const [modalPeriVisible, setModalPeriVisible] = useState(false);
    const [mainVisible, setMainVisible] = useState(false);
    const [periVisible, setPeriVisible] = useState(false);
    const [componentsSelected, setComponentsSelected] = useState([] as IBuildComponentType[]);
    const [compByType, setCompByType] = useState([{}] as IComponentType[]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("Gaming");

    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;

    useEffect(() => {
        if (build !== null) {
            setBuildTemp(build);
            if (build !== undefined && build.buildsComponents !== null) {
                setBuildUpt(build);

                setTotalPrice(build.totalPrice);
            } else {
                setBuildUpt(undefined);
            }
        } else {
            newBuild();
        }
        if (builds !== null) {
            setBuildsTemp(builds);
        }
        getComponents();
        getCategories();
    }, [build]);

    function getCategories() {
        setCategories([
            {label: Globals.CATEGORY_GAMING, value: Globals.CATEGORY_GAMING},
            {label: Globals.CATEGORY_BUDGET, value: Globals.CATEGORY_BUDGET},
            {label: Globals.CATEGORY_WORK, value: Globals.CATEGORY_WORK}
        ]);
    }

    function newBuild() {
        setComponentsSelected([]);
        setBuildTemp(null);
        setMsg("");
        setTotalPrice(0);
        setBuildUpt(undefined);
    }

    const toggleModal = (modalType: string) => {
        setModalCompType(modalType);
        setCompByType(components.filter(comp => comp.type === modalType));
        setModalVisible(!modalVisible);
    };
    const toggleModalMainCategories = () => {
        setModalMainVisible(!modalMainVisible);
    }
    const toggleModalPeriCategories = () => {
        setModalPeriVisible(!modalPeriVisible);
    }

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

            setBuildTemp((prevBuild) => ({...prevBuild, buildsComponents: [...prevBuildComp, newBuildComp]}));
        } else {
            setBuildTemp((prevBuild) => ({...prevBuild, buildsComponents: [newBuildComp]}));
        }
        setTotalPrice(prevPrice => prevPrice + comp.price);
        setModalVisible(false);
    }

    async function getComponents() {
        setComponents([]);
        try {
            const getComp = await axios.get(Globals.IP_HTTP + "/api/v2/components", {headers: {"Authorization": "Bearer " + token}});
            for (const comp of getComp.data) {
                const compImgResponse = await RNFetchBlob.fetch(
                    'GET',
                    Globals.IP_HTTP + '/api/v2/components/img/' + comp.id + '/' + comp.image,
                    {Authorization: `Bearer ${token}`}
                );
                let picture = ""
                if (compImgResponse.data !== Globals.IMG_NOT_FOUND) {
                    picture = await compImgResponse.base64();
                }
                comp.image = picture;
                comp.wished = false;
                user.componentsWanted.forEach((compWished) => {
                    if (compWished.id === comp.id) {
                        comp.wished = true;
                    }
                });
                setComponents(prevComps => [...prevComps, comp]);
            }
        }catch (error){
            console.log(error);
        }

    }

    async function saveBuild() {
        let compIdArray: number[] = [];
        componentsSelected.forEach((buildComp) => {
            compIdArray.push(buildComp.component.id);
        })
        const newBuildTemp: IBuildType = {
            id: null,
            name: buildTemp.name,
            notes: buildTemp.notes,
            category: selectedCategory,
            buildsComponents: componentsSelected,
            totalPrice: totalPrice,
            userNick: user.nick
        }
        console.log({
            name: buildTemp.name,
            notes: buildTemp.notes ?? null,
            componentsIds: compIdArray,
            category: selectedCategory
        })
        try {
            const response = await axios.post(
                Globals.IP_HTTP + "/api/v2/builds",
                {
                    name: buildTemp.name,
                    notes: buildTemp.notes ?? null,
                    componentsIds: compIdArray,
                    category: selectedCategory
                },
                {headers: {"Authorization": "Bearer " + token}}
            );
            if (response.status === 200) {
                setBuildsTemp(undefined);
                navigation.navigate("UserBuildsList");
            } else {
                setMsg(response.statusText);
            }
        } catch (err) {
            console.log(err)
        }

    }

    async function updateBuild() {
        let compIdArray: number[] = [];
        buildTemp.buildsComponents.forEach((buildComp) => {
            compIdArray.push(buildComp.component.id);
        })
        const response = await axios.put(
            Globals.IP_HTTP + "/api/v2/builds/" + buildTemp.id,
            {name: buildTemp.name, notes: buildTemp.notes, category: buildTemp.category, componentsIds: compIdArray},
            {headers: {"Authorization": "Bearer " + token}}
        );
        if (response.status === 200) {
            setBuildsTemp(undefined);
            navigation.navigate("UserBuildsList");
        } else {
            setMsg(response.statusText);
        }
    }

    const touchablesMain = [
        {name: "CPU", icon: "cpu", type: "CPU", importIcon: "Octicon"},
        {name: "Motherboard", icon: "developer-board", type: "Motherboard", importIcon: "Material"},
        {name: "Memory RAM", icon: "memory", type: "RAM", importIcon: "FontAwesome5"},
        {name: "Drive", icon: "harddisk", type: "Drive", importIcon: "Material"},
        {name: "Tower", icon: "desktop-tower", type: "Tower", importIcon: "Material"},
        {name: "Fan", icon: "fan", type: "Fan", importIcon: "Material"},
        {name: "PSU", icon: "power", type: "PSU", importIcon: "Material"},
        {
            name: "GPU",
            icon: (darkMode) ? "../../img/tarjeta-grafica_light.png" : "../../img/tarjeta-grafica_dark.png",
            type: "GPU",
            importIcon: "Image"
        }
    ];

    const touchablesPeri = [
        {name: "TV", icon: "tv", type: "TV", importIcon: "FontAwesome5"},
        {name: "Keyboard", icon: "keyboard", type: "Keyboard", importIcon: "FontAwesome5"},
        {name: "Mouse", icon: "mouse", type: "Mouse", importIcon: "FontAwesome5"},
        {name: "Headphones", icon: "headphones-alt", type: "Headphones", importIcon: "FontAwesome5"},
        {name: "Speakers", icon: "speaker", type: "Speaker", importIcon: "Material"},
        {name: "Microphone", icon: "microphone", type: "Microphone", importIcon: "FontAwesome5"}
    ];

    return (
        <View style={{flex: 1}}>
            <View style={{flex: 1, backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"}}>
                <HeaderScreen name={route.name} navigation={navigation} profile={false} drawer={true}/>
                <ScrollView>
                    <View style={{
                        flexDirection: "row",
                        paddingVertical: "2%",
                        justifyContent: "space-around"
                    }}>
                        <TouchableOpacity style={{
                            ...Styles.touchable,
                            alignItems: 'center',
                            margin: "5%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: 170,
                            height: 170,
                        }} onPress={toggleModalMainCategories}>
                            <Text style={{
                                fontSize: getFontSize(23),
                                color: (darkMode) ? "white" : "black"
                            }}>Components</Text>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalMainVisible}
                                onRequestClose={() => setModalMainVisible(!modalVisible)}
                            >
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "flex-end",
                                    backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"
                                }}>
                                    <TouchableOpacity onPress={() => setModalMainVisible(!modalMainVisible)}>
                                        <Material style={{marginTop: "5%", margin: "2%"}} name='close-box'
                                                  size={getIconSize(100)}
                                                  color={(darkMode) ? "white" : "black"}></Material>
                                    </TouchableOpacity>
                                </View>
                                {
                                    (modalMainVisible) &&
                                    <FlatList
                                        style={{backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"}}
                                        data={touchablesMain}
                                        keyExtractor={(touch, index) => index + ""}
                                        renderItem={(touch) => {
                                            switch (touch.item.importIcon) {
                                                case "Octicon":
                                                    return (
                                                        <View>
                                                            <TouchableOpacity
                                                                onPress={() => toggleModal(touch.item.type)}>
                                                                <View
                                                                    style={{...Styles.touchable, flexDirection: 'row'}}>
                                                                    <Octicons name={touch.item.icon}
                                                                              size={getIconSize(150)}
                                                                              color={(darkMode) ? "white" : "black"}></Octicons>
                                                                    <View style={{flex: 1, alignItems: "center"}}>
                                                                        <Text style={{
                                                                            fontSize: getFontSize(30),
                                                                            color: (darkMode) ? "white" : "black"
                                                                        }}>{touch.item.name}</Text>
                                                                    </View>
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    );
                                                    break;
                                                case "Material" :
                                                    return (
                                                        <View>
                                                            <TouchableOpacity
                                                                onPress={() => toggleModal(touch.item.type)}>
                                                                <View
                                                                    style={{...Styles.touchable, flexDirection: 'row'}}>
                                                                    <Material name={touch.item.icon}
                                                                              size={getIconSize(150)}
                                                                              color={(darkMode) ? "white" : "black"}></Material>
                                                                    <View style={{flex: 1, alignItems: "center"}}>
                                                                        <Text style={{
                                                                            fontSize: getFontSize(30),
                                                                            color: (darkMode) ? "white" : "black"
                                                                        }}>{touch.item.name}</Text>
                                                                    </View>
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    );
                                                    break;
                                                case "FontAwesome5":
                                                    return (
                                                        <View>
                                                            <TouchableOpacity
                                                                onPress={() => toggleModal(touch.item.type)}>
                                                                <View
                                                                    style={{...Styles.touchable, flexDirection: 'row'}}>
                                                                    <FontAwesome5 name={touch.item.icon}
                                                                                  size={getIconSize(150)}
                                                                                  color={(darkMode) ? "white" : "black"}></FontAwesome5>
                                                                    <View style={{flex: 1, alignItems: "center"}}>
                                                                        <Text style={{
                                                                            fontSize: getFontSize(30),
                                                                            color: (darkMode) ? "white" : "black"
                                                                        }}>{touch.item.name}</Text>
                                                                    </View>
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    );
                                                    break;
                                                default:
                                                    return (
                                                        <View>
                                                            <TouchableOpacity
                                                                onPress={() => toggleModal(touch.item.type)}
                                                                style={{...Styles.touchable, flexDirection: 'row'}}>
                                                                <Image
                                                                    source={(!darkMode) ? require("../../img/tarjeta-grafica_dark.png")
                                                                        : require("../../img/tarjeta-grafica_light.png")}
                                                                    style={{
                                                                        width: getIconSize(150),
                                                                        height: getIconSize(150)
                                                                    }}
                                                                />
                                                                <View style={{flex: 1, alignItems: "center"}}>
                                                                    <Text style={{
                                                                        fontSize: getFontSize(30),
                                                                        color: (darkMode) ? "white" : "black"
                                                                    }}>{touch.item.name}</Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    );
                                                    break;
                                            }
                                        }}
                                    />
                                }
                            </Modal>
                        </TouchableOpacity>

                        <TouchableOpacity style={{
                            ...Styles.touchable,
                            alignItems: 'center',
                            margin: "5%",
                            flexDirection: "row",
                            width: 170,
                            height: 170,
                            justifyContent: "space-between"
                        }} onPress={toggleModalPeriCategories}>
                            <Text style={{
                                fontSize: getFontSize(25),
                                color: (darkMode) ? "white" : "black"
                            }}>Peripherals</Text>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalPeriVisible}
                                onRequestClose={() => setModalMainVisible(!modalPeriVisible)}
                            >
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "flex-end",
                                    backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"
                                }}>
                                    <TouchableOpacity onPress={() => setModalPeriVisible(!modalPeriVisible)}>
                                        <Material style={{marginTop: "5%", margin: "2%"}} name='close-box'
                                                  size={getIconSize(100)}
                                                  color={(darkMode) ? "white" : "black"}></Material>
                                    </TouchableOpacity>
                                </View>
                                {
                                    (modalPeriVisible) &&
                                    <FlatList
                                        style={{backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"}}
                                        data={touchablesPeri}
                                        keyExtractor={(touch, index) => index + ""}
                                        renderItem={(touch) => {
                                            switch (touch.item.importIcon) {
                                                case "Octicon" :
                                                    return (
                                                        <View>

                                                            <TouchableOpacity
                                                                onPress={() => toggleModal(touch.item.type)}>
                                                                <View
                                                                    style={{...Styles.touchable, flexDirection: 'row'}}>
                                                                    <Octicons name={touch.item.icon}
                                                                              size={getIconSize(150)}
                                                                              color={(darkMode) ? "white" : "black"}></Octicons>
                                                                    <View style={{flex: 1, alignItems: "center"}}>
                                                                        <Text style={{
                                                                            fontSize: getFontSize(30),
                                                                            color: (darkMode) ? "white" : "black"
                                                                        }}>{touch.item.name}</Text>
                                                                    </View>
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    );
                                                case "Material" :
                                                    return (
                                                        <View>
                                                            <TouchableOpacity
                                                                onPress={() => toggleModal(touch.item.type)}>
                                                                <View
                                                                    style={{...Styles.touchable, flexDirection: 'row'}}>
                                                                    <Material name={touch.item.icon}
                                                                              size={getIconSize(150)}
                                                                              color={(darkMode) ? "white" : "black"}></Material>
                                                                    <View style={{flex: 1, alignItems: "center"}}>
                                                                        <Text style={{
                                                                            fontSize: getFontSize(30),
                                                                            color: (darkMode) ? "white" : "black"
                                                                        }}>{touch.item.name}</Text>
                                                                    </View>
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    );
                                                case "FontAwesome5":
                                                    return (
                                                        <View>

                                                            <TouchableOpacity
                                                                onPress={() => toggleModal(touch.item.type)}>
                                                                <View
                                                                    style={{...Styles.touchable, flexDirection: 'row'}}>
                                                                    <FontAwesome5 name={touch.item.icon}
                                                                                  size={getIconSize(150)}
                                                                                  color={(darkMode) ? "white" : "black"}></FontAwesome5>
                                                                    <View style={{flex: 1, alignItems: "center"}}>
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
                                        }
                                        }
                                    />
                                }
                            </Modal>
                        </TouchableOpacity>
                    </View>

                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        margin: "5%",
                        alignItems: "center"
                    }}>
                        <TextInput
                            maxLength={20}
                            defaultValue={(buildTemp !== null && buildTemp !== undefined) && buildTemp.name}
                            placeholder='name' placeholderTextColor="#a3a3a3"
                            style={{
                                borderWidth: 2,
                                borderColor: "#ca2613",

                                paddingLeft: "5%",
                                width: "100%",
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black"
                            }}
                            onChangeText={(text) => setBuildTemp((prevBuild) => ({...prevBuild, name: text}))}
                        ></TextInput>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                            margin: "5%",
                            alignItems: "center"
                        }}>
                        <TextInput
                            maxLength={20}
                            defaultValue={(buildTemp !== null && buildTemp !== undefined) && buildTemp.notes}
                            placeholder='notes' placeholderTextColor="#a3a3a3"
                            style={{
                                borderWidth: 2,
                                borderColor: "#ca2613",

                                paddingLeft: 20,
                                width: "100%",
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black"
                            }}
                            onChangeText={(text) => setBuildTemp((prevBuild) => ({...prevBuild, notes: text}))}
                        ></TextInput>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                            margin: "5%",
                            alignItems: "center"
                        }}>
                        <Dropdown
                            data={categories}
                            labelField={"label"}
                            valueField={"value"}
                            value={selectedCategory}
                            placeholder={"Select a category"}
                            onChange={(newValue) => setSelectedCategory(newValue.value)}
                            style={{
                                height: getIconSize(130),
                                backgroundColor: (darkMode) ? "#242121" : "#F5F5F5",
                                borderColor: "#ca2613",
                                //
                                width: getIconSize(800),
                                borderWidth: 2,
                                marginBottom: "8%",
                            }}
                            placeholderStyle={{
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black",
                                textAlign: 'center'
                            }}
                            iconStyle={{
                                tintColor: '#ca2613',
                                width: getIconSize(100),
                                height: getIconSize(100)
                            }}
                            containerStyle={{
                                backgroundColor: (darkMode) ? "#242121" : "#F5F5F5",
                                borderColor: "#ca2613",
                                borderWidth: 2/*, */
                            }}
                            itemTextStyle={{
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black",
                                textAlign: 'center'
                            }}
                            activeColor={"#ca2613"}
                            selectedTextStyle={{
                                fontSize: getFontSize(20),
                                color: (darkMode) ? "white" : "black",
                                textAlign: 'center'
                            }}
                        />
                    </View>
                    <View style={{backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"}}>
                        {
                            (buildTemp !== null && buildTemp !== undefined) &&
                            <FlatList numColumns={2} data={buildTemp.buildsComponents}
                                      contentContainerStyle={{alignItems: "center", width: "100%"}}
                                      renderItem={(buildComp) => {
                                          return <TouchableOpacity
                                              style={{...Styles.touchable, width: getIconSize(450), height: getIconSize(600), margin: "2%"}}>
                                              {
                                                  buildComp.item !== null &&
                                                  <TouchableOpacity
                                                      style={{
                                                          ...Styles.touchable,
                                                          width: getIconSize(450),
                                                          height: getIconSize(600),
                                                          margin: "5%",
                                                          justifyContent: "center",
                                                          alignItems: "center"
                                                      }}
                                                      onPress={() => removeFromBuild(buildComp.item.component)}>
                                                      <Material name='close-box' size={getIconSize(100)}
                                                                color={(darkMode) ? "white" : "black"}></Material>
                                                      <Component comp={buildComp.item.component}/>
                                                  </TouchableOpacity>
                                              }
                                          </TouchableOpacity>
                                      }}
                            />
                        }

                    </View>
                </ScrollView>
                <View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(!modalVisible)}
                    >
                        <View style={{...styles.modalContainer}}>
                            <View style={{...styles.modalContent, backgroundColor: (darkMode) ? "#242121" : "#F5F5F5"}}>
                                <View style={{flexDirection: "row", justifyContent: "space-between", margin: "5%"}}>
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
                                    data={compByType}
                                    numColumns={2}
                                    contentContainerStyle={{marginHorizontal: "2%"}}
                                    renderItem={(comp) => {
                                        if (comp.item.type === modalCompType) {
                                            return (
                                                <TouchableOpacity style={{...Styles.touchable, width: getIconSize(450)}} onPress={() => {
                                                    let newBuildComp: IBuildComponentType = {
                                                        dateCreated: new Date().toISOString().slice(0, 10),
                                                        priceAtTheTime: comp.item.price,
                                                        component: comp.item
                                                    };
                                                    setComponentsSelected([...componentsSelected, newBuildComp]);
                                                    setComponentToBuild(comp.item)
                                                }}>
                                                    <Component comp={comp.item}/>
                                                </TouchableOpacity>
                                            );
                                        }
                                    }}

                                />
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>


            <View style={{
                ...Styles.headerView,
                borderTopColor: "#ca2613",
                backgroundColor: (darkMode) ? "#242121" : "#F5F5F5",
            }}>
                <Text style={{...Styles.headerText, color: (darkMode) ? "white" : "black"}}>Price
                    Range: {totalPrice}€</Text>
                <Text style={{...Styles.headerText, color: "red"}}>{msg}</Text>
                <TouchableOpacity>
                    <Text style={{
                        ...Styles.headerText,
                        color: (darkMode) ? "white" : "black"
                    }} onPress={newBuild}>New Build</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    if (buildUpt === undefined) {
                        saveBuild();
                    } else {
                        updateBuild();
                    }
                }}>
                    <Text style={{
                        ...Styles.headerText,
                        color: (darkMode) ? "white" : "black"
                    }}>{(buildUpt === undefined) ? "Save" : "Update"}</Text>
                </TouchableOpacity>

            </View>
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
