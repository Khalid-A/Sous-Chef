import React from 'react';
import { BACKGROUND_COLOR } from '../common/SousChefColors'
import { StyleSheet, Image, Text, View, Dimensions,ScrollView} from 'react-native';
import { RkCard, RkText } from 'react-native-ui-kitten';

export default class SousChefCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        if (this.props.imagePath == undefined) {
            this.props.imagePath = "";
        }
    }

    render() {
        return (
            <RkCard rkType="shadowed" style={[styles.card]}>
                <Image rkCardImg source={
                    this.props.imagePath.trim() == "" ?
                    require("../assets/sousChefLogo.png") :
                    {uri: this.props.imagePath}
                } style={[styles.cardImage]}/>
              <View rkCardContent style={{flex: 1, margin: 0, padding: 0,}}>
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
        margin: 3,
        width: Dimensions.get('window').width/2,
        height: Dimensions.get('window').height/4  ,
        borderRadius: 10,
        // overflow: 'hidden',
        backgroundColor: "white",
        padding:0,
        // shadowOpacity: 0.75,
        //   shadowRadius: 5,
        //   shadowColor: 'red',
        //   shadowOffset: { height: 0, width: 0 },
        // borderColor: "#1d945b",
    },
    cardHeader: {
        margin: 0,
        padding: 0,
        alignSelf: "flex-start",
        fontFamily: "Avenir",
        fontSize: 14
    },
    cardBody: {
        margin: 0,
        padding: 0,
        alignSelf: "flex-start",
        fontFamily: "Avenir",
        fontSize: 11
    },
    cardImage: {
        flex: 2,
        borderRadius: 10,
        // overflow: 'hidden',
    }
})
