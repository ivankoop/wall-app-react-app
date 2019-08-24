import React from "react";
import {
    createAppContainer,
    createSwitchNavigator,
    createStackNavigator,
} from "react-navigation";
import LaunchScreen from "../screens/Launch/LaunchScreen";
import SignInScreen from "../screens/Onboarding/SignInScreen";
import SignUpScreen from "../screens/Onboarding/SignUpScreen";
import HomeScreen from "../screens/Home/HomeScreen";

const AuthConfig = {
    headerMode: "none",
    navigationOptions: {
        headerVisible: false,
    },
};

const AuthStack = createStackNavigator(
    {
        SignIn: {
            screen: SignInScreen,
        },
        SignUp: {
            screen: SignUpScreen,
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
