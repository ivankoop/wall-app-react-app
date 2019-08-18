import React, {Component} from "react";
import {
    StyleSheet,
    Image,
    AsyncStorage,
    View,
    StatusBar,
    ActivityIndicator,
    Text,
} from "react-native";
import PropTypes from "prop-types";

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <StatusBar barStyle="light-content" />
                <Text style={styles.text}>Home Screen</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
    },

    text: {
        color: "white",
    },
});
