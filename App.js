import {AppLoading} from "expo";
import {Asset} from "expo-asset";
import * as Font from "expo-font";
import React, {useState} from "react";
import {Platform, StatusBar, StyleSheet, View, Text} from "react-native";
import {Provider} from "react-redux";
import store from "./store";
import AppNavigator from "./navigation/AppNavigator";
import TopAlert from "./components/TopAlert/TopAlert";
import MiddleLoader from "./components/MiddleLoader/MiddleLoader";
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

export default function App(props) {
    const [isLoadingComplete, setLoadingComplete] = useState(false);

    if (!isLoadingComplete && !props.skipLoadingScreen) {
        return (
            <AppLoading
                startAsync={loadResourcesAsync}
                onError={handleLoadingError}
                onFinish={() => handleFinishLoading(setLoadingComplete)}
            />
        );
    } else {
        return (
            <Provider store={store}>
                <View style={styles.container}>
                    {Platform.OS === "ios" && <StatusBar barStyle="default" />}
                    <AppNavigator />
                    <MiddleLoader />
                    <TopAlert />
                </View>
            </Provider>
        );
    }
}

async function loadResourcesAsync() {
    await Promise.all([
        Asset.loadAsync([
            require("./assets/images/robot-dev.png"),
            require("./assets/images/robot-prod.png"),
        ]),
        Font.loadAsync({
            // This is the font that we are using for our tab bar

            // We include SpaceMono because we use it in HomeScreen.js. Feel free to
            // remove this if you are not using it in your app
            Roboto: require("native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
            "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf"),
        }),
    ]);
}

function handleLoadingError(error) {
    // In this case, you might want to report the error to your error reporting
    // service, for example Sentry
    console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
    setLoadingComplete(true);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
});
