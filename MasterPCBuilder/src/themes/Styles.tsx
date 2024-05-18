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
        
        backgroundColor: 'white',
        color: "black",
        textAlign: 'center'
    },
    touchable: {
        margin: "5%",
        borderWidth: 2,
        borderColor: "#ca2613",
        padding: "3%"
    },
    imageStyle: {
        borderRadius: 50
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        marginTop: "45%",
        borderTopWidth: 2,
        borderColor: "#ca2613"
    },
    loadingContainer: {
        position: 'absolute', // Posicionamiento absoluto
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center', // Centrar horizontalmente
        justifyContent: 'center', // Centrar verticalmente
        backgroundColor: 'rgba(0,0,0,0.5)', // Fondo negro semi-translúcido
    }
})