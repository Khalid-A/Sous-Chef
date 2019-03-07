import { BACKGROUND_COLOR } from './../common/SousChefColors'
import { RkTextInput } from 'react-native-ui-kitten';
import { StyleSheet } from 'react-native';
import React, {Component} from 'react';


export default class SousChefTextInput extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <RkTextInput 
                    rkType="clear"
                    label={this.props.label}
                    placeholder={this.props.placeholder}
                    labelStyle={styles.text}
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={this.props.onChangeText}
                    value={this.props.value}
            /> 
        )
    }
}

const styles = StyleSheet.create({
    text: {
        borderLeftWidth: 50,
        fontSize: 15,
        color: '#333333',
    },
    textInput: {
        borderRightWidth: 50,
        borderColor: BACKGROUND_COLOR,
    },
});