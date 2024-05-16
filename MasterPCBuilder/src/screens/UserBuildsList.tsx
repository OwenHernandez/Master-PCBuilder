import {Alert, Dimensions, FlatList, PixelRatio, Text, TouchableOpacity, View} from 'react-native'
import React, {useEffect, useState} from 'react'
import {RootStackParamList} from '../navigations/StackNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import IBuildType from '../interfaces/IBuildType';
import {Styles} from '../themes/Styles';
import {usePrimaryContext} from '../contexts/PrimaryContext';
import axios from 'axios';
import {Globals} from '../components/Globals';
import HeaderScreen from "../components/HeaderScreen";
import {BuildRepository} from "../data/Database";
import {transformBuildDTOToEntity, transformBuildToDTO} from "../data/transformers/BuildTransformer";

type Props = NativeStackScreenProps<RootStackParamList, 'UserBuildsList'>;

const UserBuildsList = (props: Props) => {
    const {user, darkMode, token} = usePrimaryContext();
    const {navigation, route} = props;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const [buildsList, setBuildsList] = useState([{}] as any[]);
    const [buildsFilteredList, setBuildsFilteredList] = useState([{}] as any[]);
    const [categoryToFilter, setCategoryToFilter] = useState(Globals.CATEGORY_ALL);

    const arrayCategoriaBuilder: Array<string> = [Globals.CATEGORY_ALL, Globals.CATEGORY_GAMING, Globals.CATEGORY_BUDGET, Globals.CATEGORY_WORK];

    useEffect(() => {
        setBuildsList([]);
        setBuildsFilteredList([]);
        getUserBuilds();
    }, []);

    async function getUserBuilds() {
        try {
            const response = await axios.get(Globals.IP_HTTP + "/api/v2/builds", {headers: {"Authorization": "Bearer " + token}});
            setBuildsList(response.data);
            setBuildsFilteredList(response.data);
            try {
                for (const build of response.data) {
                    let newBuild = await transformBuildDTOToEntity(build);
                    await BuildRepository.save(newBuild);
                }
            } catch (err) {
                console.log("Error while trying to save build: " + err);
            }
        } catch (err) {
            console.log(err);
            let buildsOffline = await BuildRepository.find({
                relations: {
                    buildsComponents: {
                        component: {
                            seller: true
                        }
                    }
                }
            });
            for (const build of buildsOffline) {
                let newBuild = transformBuildToDTO(build);
                setBuildsList(prevBuilds => [...prevBuilds, newBuild]);
                setBuildsFilteredList(prevBuilds => [...prevBuilds, newBuild]);
            }
        }
    }

    return (
        <View>
            <HeaderScreen name={"Your Builds"} navigation={navigation} profile={false} drawer={false}/>
            <View style={{height: "90%"}}>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <FlatList
                        data={arrayCategoriaBuilder}
                        horizontal={true}
                        renderItem={(categoria) => {
                            return (
                                <TouchableOpacity
                                    style={{
                                        margin: getIconSize(30),
                                        borderWidth: 2,
                                        borderColor: "#ca2613",
                                        backgroundColor: (categoryToFilter === categoria.item) ? "#676767" : (darkMode) ? "#242121" : "#F5F5F5",
                                        padding: 10,
                                        width: 100
                                    }}
                                    onPress={() => {
                                        if (categoria.item === Globals.CATEGORY_ALL) {
                                            setBuildsFilteredList(buildsList);
                                            setCategoryToFilter(Globals.CATEGORY_ALL);
                                        } else {
                                            setBuildsFilteredList(buildsList.filter((build) => build.category === categoria.item))
                                            switch (categoria.item) {
                                                case Globals.CATEGORY_WORK:
                                                    if (categoryToFilter === Globals.CATEGORY_WORK) {
                                                        setBuildsFilteredList(buildsList);
                                                        setCategoryToFilter(Globals.CATEGORY_ALL);
                                                    } else {
                                                        setCategoryToFilter(Globals.CATEGORY_WORK);
                                                    }
                                                    break;

                                                case Globals.CATEGORY_GAMING:
                                                    if (categoryToFilter === Globals.CATEGORY_GAMING) {
                                                        setBuildsFilteredList(buildsList);
                                                        setCategoryToFilter(Globals.CATEGORY_ALL);
                                                    } else {
                                                        setCategoryToFilter(Globals.CATEGORY_GAMING);
                                                    }
                                                    break;

                                                case Globals.CATEGORY_BUDGET:
                                                    if (categoryToFilter === Globals.CATEGORY_BUDGET) {
                                                        setBuildsFilteredList(buildsList);
                                                        setCategoryToFilter(Globals.CATEGORY_ALL);
                                                    } else {
                                                        setCategoryToFilter(Globals.CATEGORY_BUDGET);
                                                    }
                                                    break;
                                            }
                                        }
                                    }}
                                >
                                    <View style={{alignItems: "center"}}>
                                        <Text style={{
                                            fontSize: getFontSize(20),
                                            color: (darkMode) ? "white" : "black"
                                        }}>{categoria.item}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </View>
                <FlatList
                    data={buildsFilteredList}
                    numColumns={2}
                    renderItem={(build) => {
                        return (
                            <TouchableOpacity
                                style={{
                                    ...Styles.touchable,
                                    width: "40%",
                                }}
                                onPress={() => {
                                    navigation.navigate("Builder", {
                                            build: build.item,
                                            builds: buildsList
                                        }
                                    )
                                }}>
                                <View>
                                    <View style={{alignItems: "flex-start"}}>
                                        <Text style={{
                                            fontSize: getFontSize(20),
                                            color: (darkMode) ? "white" : "black",
                                            marginHorizontal: "10%"
                                        }}>{build.item.name}</Text>
                                        <Text style={{
                                            fontSize: getFontSize(15),
                                            color: (darkMode) ? "white" : "black",
                                            marginHorizontal: "10%"
                                        }}>{build.item.totalPrice} €</Text>
                                        <Text style={{
                                            fontSize: getFontSize(15),
                                            color: (darkMode) ? "white" : "black",
                                            marginHorizontal: "10%",
                                            marginBottom: "2%"
                                        }}>{build.item.category}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                    keyExtractor={(comp, index) => index + ""}
                />
            </View>
        </View>
    )
}

export default UserBuildsList