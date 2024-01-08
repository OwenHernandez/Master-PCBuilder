import { View, Text, SafeAreaView, TouchableOpacity, Image, PixelRatio, Dimensions, TextInput, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { usePrimaryContext } from '../contexts/PrimaryContext';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import Octicons from 'react-native-vector-icons/Octicons';
import { DrawerActions } from '@react-navigation/native';
import { Styles } from '../themes/Styles';
import { RootTabsParamList } from '../navigations/SocialTabs';
import { RootStackParamList } from '../navigations/StackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DropDownPicker, { ItemType, ValueType } from 'react-native-dropdown-picker';
import IBuildType from '../interfaces/IBuildType';

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePost'>;

const CreatePost = (props: Props) => {
    const { user, darkMode } = usePrimaryContext();
    const { navigation, route } = props;
    const fontScale = PixelRatio.getFontScale();
    const getFontSize = (size: number) => size / fontScale;
    const fullScreen = Dimensions.get("window").scale;
    const getIconSize = (size: number) => size / fullScreen;
    const [selectedValue, setSelectedValue] = useState({} as string);
    const [showContent, setShowContent] = useState(false);
    const [items, setItems] = useState<ItemType<ValueType>[]>([]);

    const toggleContent = () => {
        setShowContent(!showContent);
    };

    useEffect(() => {
        //Cargaria de la api rest los builds que ha hecho esa persona

        tempBuilds.forEach((build) => {
            let item: ItemType<ValueType> = {
                label: build.name,
                value: build.name
            }
            setItems(prevItems => [...prevItems, item]);
        });
    }, []);

    const tempBuilds: IBuildType[] = [
        {
            name: "BuildCoso",
            price: "1000€",
            notes: "jkfdjsgvfjdnjghsridhgjf",
            components: [
                { name: "CPU", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta...", price: "100€", site: "PCCOmponentes", type: "CPU" },
                { name: "Motherboard", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta...", price: "100€", site: "PCCOmponentes", type: "Motherboard" }
            ]
        },
        {
            name: "BuildCoso2",
            price: "1000€",
            components: [
                { name: "CPU", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta...", price: "100€", site: "PCCOmponentes", type: "CPU" },
                { name: "Motherboard", compImage: "https://i.ebayimg.com/images/g/-1sAAOSwtQNlLpw6/s-l1600.jpg", description: "CPU super potente perfecta...", price: "100€", site: "PCCOmponentes", type: "Motherboard" }
            ]
        }
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: (darkMode) ? "#242121" : "#F5F5F5" }}>
            <View style={Styles.headerView}>
                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <Image
                        source={{
                            uri: user.profilePic
                        }}
                        style={{ ...Styles.imageStyle, borderColor: (darkMode) ? "white" : "black", borderWidth: 1, width: getIconSize(110), height: getIconSize(110) }}
                    />
                </TouchableOpacity>
                <Text style={{ ...Styles.headerText, color: (darkMode) ? "white" : "black", fontSize: getFontSize(20) }}>{route.name}</Text>
                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                    <Octicons name='three-bars' size={getIconSize(100)} color={(darkMode) ? "white" : "black"}></Octicons>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View>
                    <View style={{ backgroundColor: '#524f4f', padding: "10%", borderRadius: 20, alignItems: "center", marginHorizontal: "10%", marginBottom: "2%" }}>
                        <TextInput placeholder='Title' style={{ ...Styles.textInput, marginBottom: "5%", width: getIconSize(450) }} placeholderTextColor={"black"}></TextInput>
                        <TextInput placeholder='Price' style={{ ...Styles.textInput, marginBottom: "5%", width: getIconSize(450) }} placeholderTextColor={"black"}></TextInput>
                        <TextInput placeholder='Description' style={{ ...Styles.textInput, width: getIconSize(450) }} placeholderTextColor={"black"} numberOfLines={3} multiline={true}></TextInput>
                    </View>
                    <DropDownPicker
                        items={items}
                        placeholder='Select a build'
                        textStyle={{ fontSize: getFontSize(20), color: (darkMode) ? "white" : "black", textAlign: 'center' }}
                        arrowIconStyle={{ tintColor: '#ca2613' }}
                        containerStyle={{ alignItems: "center" }}
                        dropDownContainerStyle={{ backgroundColor: (darkMode) ? "#242121" : "#F5F5F5" }}
                        tickIconStyle={{ tintColor: '#ca2613' }}
                        style={{ height: getIconSize(130), backgroundColor: (darkMode) ? "#242121" : "#F5F5F5", borderColor: "#ca2613", width: getIconSize(900), borderWidth: 2 }}
                        open={showContent}
                        setOpen={toggleContent}
                        value={selectedValue ?? ""}
                        setValue={setSelectedValue}
                    />
                </View>
                <TouchableOpacity style={{ ...Styles.touchable }} onPress={() => { Alert.alert("Crearia el post y lo mandaria al social"); navigation.navigate("Social") }}>
                    <Text style={{ fontSize: getFontSize(20), color: (darkMode) ? "white" : "black", textAlign: 'center' }}>Create Post</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default CreatePost