import { Platform } from 'react-native';
import { StyleSheet } from 'react-native';
import {
    BUTTON_BACKGROUND_COLOR,
    BACKGROUND_COLOR,
    DIALOG_COLOR,
} from '../common/SousChefColors';


export const DEFAULT_FONT = Platform.OS == 'ios' ? "Avenir" : "Roboto"

export default globalStyle = StyleSheet.create({
    gradientButtonText: {
        fontSize: 16,
        fontFamily: DEFAULT_FONT,
        textAlign: 'center',
        color: 'white',
        backgroundColor:'transparent',
        fontWeight: 'bold',
    },
    gradientButton: {
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: BUTTON_BACKGROUND_COLOR,
        padding: 10,
        width: 250,
        borderRadius:30,
        margin: 10,
    },
    linearGradient: {
        flex: 1,
        alignItems: 'center',
    },
    errorMessage: {
        color: 'white',
        borderTopWidth: 20,
        borderLeftWidth: 20,
        borderRightWidth: 20,
        flexWrap: 'wrap',
    },
    actionButtonIconSearch: {
        fontSize: 20,
        height: 22,
        color: BUTTON_BACKGROUND_COLOR,
        flex: 2,
    },
    textInputLabelSearch: {
        fontSize: 20,
        fontFamily: DEFAULT_FONT,
        fontWeight: 'bold',
        color: BUTTON_BACKGROUND_COLOR,
    },
    textInputSearch: {
        borderBottomColor: BACKGROUND_COLOR,
        borderBottomWidth: 1,
    },
    listItem: {
        flex: 1,
        height: 50,
        borderColor: "lightgrey",
        backgroundColor: 'white',
        borderBottomWidth: 0.25,
        justifyContent:'center',
    },
    list: {
        flex: 1,
        flexDirection: "column",
    },
    containerList: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        backgroundColor: 'white',
        paddingBottom: 25
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    popupHeader: {
        fontFamily: DEFAULT_FONT,
        fontSize: 20,
        fontWeight: 'bold',
        color: BUTTON_BACKGROUND_COLOR,
        padding: 5,
    },
    header: {
        fontFamily: DEFAULT_FONT,
        fontWeight: 'bold',
        color: BUTTON_BACKGROUND_COLOR,
        fontSize: 20,
        margin: 10,
    },
    headerContainer: {
        borderColor: "lightgrey",
        borderBottomWidth: 0.5
    },
    dialogButtonContainer: {
        backgroundColor: DIALOG_COLOR
    },
    dialogButtonText: {
        color: "white",
        fontFamily: DEFAULT_FONT,
        fontWeight: 'bold',
    },
    dialogTitleContainer: {
        backgroundColor: DIALOG_COLOR,
    },
    dialogTitleText: {
        color: "white",
        fontFamily: DEFAULT_FONT,
        fontSize: 20,
        fontWeight: 'bold',
    },

});
