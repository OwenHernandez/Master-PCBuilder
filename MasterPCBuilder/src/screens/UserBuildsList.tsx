import {Dimensions, FlatList, PixelRatio, Text, TouchableOpacity, View} from 'react-native'
import React, {useEffect, useState} from 'react'
import {RootStackParamList} from '../navigations/StackNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import IBuildType from '../interfaces/IBuildType';
import {Styles} from '../themes/Styles';
import {usePrimaryContext} from '../contexts/PrimaryContext';
import axios from 'axios';
import {Globals} from '../components/Globals';
import HeaderScreen from "../components/HeaderScreen";

type Props = NativeStackScreenProps<RootStackParamList, 'UserBuildsList'>;

const UserBuildsList = (props: Props) => {
    const {user, darkMode, token} = usePrimaryContext();
    const {navigation, route} = props;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const [buildsList, setBuildsList] = useState([{}] as IBuildType[]);
    const [buildsFilteredList, setBuildsFilteredList] = useState([{}] as IBuildType[]);
    const [categoryToFilter, setCategoryToFilter] = useState(Globals.CATEGORY_ALL);

    const arrayCategoriaBuilder: Array<string> = [Globals.CATEGORY_ALL, Globals.CATEGORY_GAMING, Globals.CATEGORY_BUDGET, Globals.CATEGORY_WORK];
    /**
     * `useEffect` hook that is executed when the component mounts.
     *
     * This hook calls the `getUserBuilds` function to fetch the user's builds from the server.
     * As the dependency array is empty, this hook will only run once, when the component mounts.
     */
    useEffect(() => {
        getUserBuilds();
    }, []);

    /**
     * Asynchronous function to fetch user's builds from the server.
     *
     * This function does the following:
     * 1. Sends a GET request to the server to fetch all builds associated with the user.
     * 2. Sets the fetched builds to the `buildsList` and `buildsFilteredList` states.
     *
     * @async
     * @function
     * @throws Will log any error that occurs during the execution of the function.
     */
    async function getUserBuilds() {
        try {
            const response = await axios.get(Globals.IP_HTTP + "/api/v2/builds", {headers: {"Authorization": "Bearer " + token}});
            setBuildsList(response.data);
            setBuildsFilteredList(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <View>
            <HeaderScreen name={"Your Builds"} navigation={navigation} profile={false} drawer={false}/>
            <View style={{height: "90%"}}>
                <View style={{flexDirection: "row", justifyContent: "space-between", marginHorizontal: 10, alignItems: "center"}}>
                    <Text style={{
                        fontSize: getFontSize(20),
                        color: (darkMode) ? "white" : "black",
                        marginHorizontal: 10,
                        textAlign: "center"
                    }}>Category:</Text>
                    <FlatList
                        style={{marginHorizontal: 10}}
                        data={arrayCategoriaBuilder}
                        horizontal={true}
                        renderItem={(categoria) => {
                            return (
                                <TouchableOpacity
                                    style={{
                                        margin: 10,
                                        
                                        borderWidth: 2,
                                        borderColor: (categoryToFilter === categoria.item) ? "violet" : "#ca2613",
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