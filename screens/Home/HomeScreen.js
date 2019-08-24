import React, {Component} from "react";
import {
    StyleSheet,
    Image,
    AsyncStorage,
    View,
    StatusBar,
    ActivityIndicator,
    TouchableOpacity,
    Text,
} from "react-native";
import PropTypes from "prop-types";

import {WallAppService} from "../../services/WallAppService";

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
    }

    _onLogOut = async () => {
        const {navigation} = this.props;
        await WallAppService.logout();
        navigation.navigate("Auth");
    };

    render() {
        return (
            <View style={styles.mainContainer}>
                <StatusBar barStyle="light-content" />
                <Text style={styles.text}>Home Screen</Text>
                <TouchableOpacity onPress={this._onLogOut}>
                    <Text style={{color: "white"}}>Log Out</Text>
                </TouchableOpacity>
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
