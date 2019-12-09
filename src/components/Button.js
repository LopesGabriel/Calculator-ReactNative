import React from 'react';
import {
    StyleSheet,
    Text,
    Dimensions,
    TouchableHighlight
} from 'react-native';

const styles = StyleSheet.create({
    button:{
        fontSize: 40,
        height: Dimensions.get('window').height / 6,
        width: Dimensions.get('window').width / 4,
        padding: 20,
        backgroundColor: '#f0f0f0',
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#888',
    },
    operationButton:{
        color: '#fff',
        backgroundColor: '#fa8231',
    },
    buttonDouble:{
        width: (Dimensions.get('window').width / 4) * 2,
    },
    buttonTriple: {
        width: (Dimensions.get('window').width / 4) * 3,
    },
    creditos:{
        color: 'blue',
        fontWeight: 'bold',
    }
});

export default props => {
    const stylesButton = [styles.button]
    if(props.double) stylesButton.push(styles.buttonDouble)
    if(props.triple) stylesButton.push(styles.buttonTriple)
    if(props.operation) stylesButton.push(styles.operationButton)
    if(props.creditos) stylesButton.push(styles.creditos)
    return(
        <TouchableHighlight onPress={props.onClick}>
            <Text style={stylesButton}>{props.label}</Text>
        </TouchableHighlight>
    )
}