import React from 'react';
import {BACKGROUND_COLOR} from '../common/SousChefColors'
import {StyleSheet, Image, Text, View } from 'react-native';
import {RkCard, RkText} from 'react-native-ui-kitten';

export default class SousChefCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        if (this.props.imagePath == undefined) {
            this.props.imagePath = "";
        }
    }

    render() {
        if (this.props.imagePath.trim() == "") {
        }
        return (
            <RkCard rkType="shadowed" style={[styles.card]}>
                <Image rkCardImg source={
                    this.props.imagePath.trim() == "" ?
                    require("../assets/sousChefLogo.png") :
                    {uri: this.props.imagePath}
                } style={[styles.cardImage]}/>
                <View rkCardContent style={{flex: 1}}>
                    <RkText style={[styles.cardHeader]}>{this.props.headerText}</RkText>
                    <RkText style={[styles.cardBody]}>{this.props.bodyText}</RkText>
                </View>
            </RkCard>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 10,
        width: 200,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: BACKGROUND_COLOR
    },
    cardHeader: {
        alignSelf: "flex-start",
        fontFamily: "Avenir Next",
        fontSize: 15
    },
    cardBody: {
        alignSelf: "flex-start",
        fontFamily: "Avenir Next",
        fontSize: 13
    },
    cardImage: {
        flex: 2, 
        borderRadius: 10, 
        overflow: 'hidden'
    }
})