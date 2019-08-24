import React, {Component} from "react";
import {
    StyleSheet,
    Image,
    AsyncStorage,
    View,
    StatusBar,
    ActivityIndicator,
} from "react-native";
import PropTypes from "prop-types";

import {WallAppService} from "../../services/WallAppService";

export default class LaunchScreen extends Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
        this.state = {
            loading: true,
        };
    }

    static propTypes = {
        navigation: PropTypes.any,
    };

    _bootstrapAsync = async () => {
        const {navigation} = this.props;
        const accessToken = await AsyncStorage.getItem("accessToken");

        if (!accessToken) {
            this.setState({loading: false});
            navigation.navigate("Auth");
        } else {
            const refreshToken = await AsyncStorage.getItem("refreshToken");

            WallAppService.refreshAuth(refreshToken).then(
                async data => {
                    await AsyncStorage.setItem("accessToken", data.accessToken);
                    await AsyncStorage.setItem(
                        "refreshToken",
                        data.refreshToken
                    );
                    this._screenSwitch();
                },
                error => {
                    console.info("REFRESH ERROR", error);
                    this.setState({loading: false});
                }
            );
        }
    };

    _screenSwitch() {
        const {navigation} = this.props;
        console.info("SCREEN SWTICH");
        // TODO: check screen
        navigation.navigate("Home");
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <StatusBar barStyle="light-content" />
                <ActivityIndicator size="large" color="#FFFFFF" />
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
});
