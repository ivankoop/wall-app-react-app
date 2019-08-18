import React from "react";
import {
    createAppContainer,
    createSwitchNavigator,
    createStackNavigator,
} from "react-navigation";
import LaunchScreen from "../screens/Launch/LaunchScreen";
import OnboardingScreen from "../screens/Onboarding/OnboardingScreen";
import HomeScreen from "../screens/Home/HomeScreen";

const AuthConfig = {
    headerMode: "none",
    navigationOptions: {
        headerVisible: false,
    },
};

const AuthStack = createStackNavigator(
    {
        Onboarding: {
            screen: OnboardingScreen,
        },
    },
    AuthConfig
);

const AppConfig = {
    headerMode: "none",
    navigationOptions: {
        headerVisible: false,
    },
};

const AppStack = createStackNavigator(
    {
        Home: {
            screen: HomeScreen,
        },
    },
    AppConfig
);

export default createAppContainer(
    createSwitchNavigator(
        {
            Launch: LaunchScreen,
            App: AppStack,
            Auth: AuthStack,
        },
        {
            initialRouteName: "Launch",
        }
    )
);
