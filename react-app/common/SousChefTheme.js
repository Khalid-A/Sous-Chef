import { Platform } from 'react-native';
import {
  StyleSheet,
  Dimensions,
} from 'react-native';
import { BUTTON_BACKGROUND_COLOR } from '../common/SousChefColors';
export const DEFAULT_FONT = Platform.OS == 'ios' ? "Avenir" : "Roboto"

export default globalStyles = StyleSheet.create({
    gradientButtonText: {
        fontSize: 16,
        fontFamily: DEFAULT_FONT,
        textAlign: 'center',
        color: BUTTON_BACKGROUND_COLOR,
        backgroundColor:'transparent',
        fontWeight: 'bold',
    },
    gradientButton: {
        alignItems: 'center',
        backgroundColor: 'white',
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
    }
});
