import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
    headerView: {
        borderBottomColor: "#ca2613",
        borderWidth: 2,
        padding: "5%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    headerText: {
        color: "white",
        textAlign: 'center'
    },
    textInput: {
        borderRadius: 20,
        backgroundColor: 'white',
        color: "black",
        textAlign: 'center'
    },
    touchable: {
        margin: "5%",
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#ca2613",
        padding: "3%"
    },
    imageStyle: {
        borderRadius: 50
    }
})