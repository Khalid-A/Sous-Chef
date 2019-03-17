import React from 'react';
import { StyleSheet, Image, View, Dimensions} from 'react-native';
import { RkCard, RkText } from 'react-native-ui-kitten';

export default class SousChefCardSearch extends React.Component {
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
        flexDirection:'row',
        flex: 1,
        margin: 5,
        width: Dimensions.get('window').width -10,
        height: Dimensions.get('window').height/5.5  ,
        borderRadius: 3,
        backgroundColor: "white",
        padding:0,
        overflow: 'hidden',
        borderColor: 'transparent',
        alignItems:'center',
        justifyContent:'center',
    },
    cardHeader: {
        margin: 0,
        padding: 0,
        alignSelf: "flex-start",
        fontFamily: "Avenir",
        fontSize: 14,
        fontWeight: 'bold',
    },
    cardBody: {
        margin: 0,
        padding: 0,
        alignSelf: "flex-start",
        fontFamily: "Avenir",
        fontSize: 12,
        color: 'grey',
    },
    cardImage: {
        flex: 2,
        borderRadius: 3,
        height: Dimensions.get('window').height/5.5,
        overflow: 'hidden',
    }
})
