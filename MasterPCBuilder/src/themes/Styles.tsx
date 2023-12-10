import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
    headerView: {
        borderBottomColor: "red",
        borderWidth: 2,
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    headerText: {
        fontSize: 20,
        color: "white",
        textAlign: 'center'
    },
    textInput: {
        backgroundColor: 'white',
        color: "black",
        textAlign: 'center',
        width: 150
    },
    touchable: {
        margin: 20,
        borderWidth: 2,
        borderColor: "red",
        padding: 5
    }
})