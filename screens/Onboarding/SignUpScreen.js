import React, {Component} from "react";
import {
    StyleSheet,
    View,
    Text,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions,
    TouchableOpacity,
    AsyncStorage,
} from "react-native";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Form, Item, Input, Button} from "native-base";
import {LinearGradient} from "expo-linear-gradient";
import {showTopAlert} from "../../components/TopAlert/actions/topalert.actions";
import {
    showMiddleLoader,
    hideMiddleLoader,
} from "../../components/MiddleLoader/actions/middleloader.actions";

import {WallAppService} from "../../services/WallAppService";

class SignUpScreen extends Component {
    state = {
        name: "",
        lastName: "",
        email: "",
        password: "",
    };

    static propTypes = {
        showMiddleLoader: PropTypes.func,
        showTopAlert: PropTypes.func,
        hideMiddleLoader: PropTypes.func,
        navigation: PropTypes.object,
    };

    _onSubmit = () => {
        const {showMiddleLoader, showTopAlert, hideMiddleLoader} = this.props;
        const {name, lastName, email, password} = this.state;

        if (name === "" || lastName === "" || email === "" || password === "") {
            showTopAlert("warning", "Complete all fields");
            return;
        }

        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (regex.test(email) === false) {
            showTopAlert("warning", "The email is not valid");
            return;
        }

        if (password.length < 8) {
            showTopAlert("warning", "Minimum password length 8");
            return;
        }

        showMiddleLoader();

        WallAppService.register(name, lastName, password, email).then(
            data => {
                hideMiddleLoader();
                showTopAlert("success", "Register successfull!");
                this._authed(data);
            },
            error => {
                hideMiddleLoader();
                const {response} = error;

                if (error === 500 || error === 502) {
                    showTopAlert("error", `(${error}) - Internal Server Error`);
                    return;
                }

                if (response.message) {
                    if (response.message === "EMAIL_ALREADY_EXISTS") {
                        showTopAlert("warning", "Email is already registered");
                        return;
                    }
                }

                showTopAlert("error", `(${response.status}) - Client Error`);
            }
        );
    };

    _authed = async data => {
        const {navigation} = this.props;

        await AsyncStorage.setItem("accessToken", data.accessToken);
        await AsyncStorage.setItem("refreshToken", data.refreshToken);

        navigation.navigate("Home", {authed: true});
    };

    _onSignIn = () => {
        const {navigation} = this.props;
        navigation.goBack();
    };

    render() {
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    Keyboard.dismiss();
                }}
            >
                <LinearGradient
                    colors={["#58F1FF", "#009CD8"]}
                    style={styles.mainContainer}
                >
                    <View style={styles.contentContainer}>
                        <KeyboardAvoidingView behavior="position" enabled>
                            <Text style={styles.signUpText}>Sign Up</Text>
                            <Form>
                                <Item style={styles.item}>
                                    <Input
                                        style={styles.textInput}
                                        placeholder="Name"
                                        placeholderTextColor="grey"
                                        returnKeyType={"next"}
                                        onChangeText={value => {
                                            this.setState({name: value});
                                        }}
                                        onSubmitEditing={() => {
                                            this.lastName._root.focus();
                                        }}
                                    />
                                </Item>
                                <Item style={styles.item}>
                                    <Input
                                        style={styles.textInput}
                                        placeholder="Last Name"
                                        placeholderTextColor="grey"
                                        returnKeyType={"next"}
                                        onChangeText={value => {
                                            this.setState({lastName: value});
                                        }}
                                        onSubmitEditing={() => {
                                            this.email._root.focus();
                                        }}
                                        ref={input => {
                                            this.lastName = input;
                                        }}
                                    />
                                </Item>
                                <Item style={styles.item}>
                                    <Input
                                        style={styles.textInput}
                                        placeholder="Email"
                                        autoCompleteType="email"
                                        placeholderTextColor="grey"
                                        returnKeyType={"next"}
                                        onChangeText={value => {
                                            this.setState({email: value});
                                        }}
                                        onSubmitEditing={() => {
                                            this.password._root.focus();
                                        }}
                                        ref={input => {
                                            this.email = input;
                                        }}
                                    />
                                </Item>
                                <Item style={styles.item}>
                                    <Input
                                        style={styles.textInput}
                                        placeholder="Password"
                                        secureTextEntry={true}
                                        placeholderTextColor="grey"
                                        returnKeyType={"done"}
                                        onChangeText={value => {
                                            this.setState({password: value});
                                        }}
                                        onSubmitEditing={this._onSubmit}
                                        ref={input => {
                                            this.password = input;
                                        }}
                                    />
                                </Item>
                                <Item style={styles.item}>
                                    <Button
                                        onPress={this._onSubmit}
                                        style={styles.button}
                                    >
                                        <Text style={styles.buttonText}>
                                            Sign Up
                                        </Text>
                                    </Button>
                                </Item>
                                <Item style={styles.item}>
                                    <TouchableOpacity
                                        onPress={this._onSignIn}
                                        style={{width: "100%", marginTop: 20}}
                                    >
                                        <Text style={styles.registerText}>
                                            Already registered, Sign In
                                        </Text>
                                    </TouchableOpacity>
                                </Item>
                            </Form>
                        </KeyboardAvoidingView>
                    </View>
                    <Text style={styles.copyRight}>
                        Created with ❤️ by Ivan Koop
                    </Text>
                </LinearGradient>
            </TouchableWithoutFeedback>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        showMiddleLoader: () => dispatch(showMiddleLoader()),
        hideMiddleLoader: () => dispatch(hideMiddleLoader()),
        showTopAlert: (alertType, text) =>
            dispatch(showTopAlert(alertType, text)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignUpScreen);

const {width} = Dimensions.get("window");

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "black",
    },

    contentContainer: {
        flex: 1,
        justifyContent: "center",
        paddingRight: 16,
    },

    textInput: {
        color: "#004560",
        fontFamily: "Roboto_medium",
        backgroundColor: "white",
        borderRadius: 5,
        marginBottom: 20,
    },

    button: {
        fontFamily: "Roboto_medium",
        width: "100%",
        alignContent: "center",
        backgroundColor: "#004560",
    },

    buttonText: {
        textAlign: "center",
        width: "100%",
        color: "white",
        fontSize: width * 0.04,
        fontFamily: "Roboto_medium",
    },

    registerText: {
        color: "white",
        alignSelf: "center",
        textDecorationLine: "underline",
        fontFamily: "Roboto_medium",
    },

    signUpText: {
        marginLeft: 16,
        color: "#004560",
        fontFamily: "Roboto_medium",
        fontSize: width * 0.1,
        marginBottom: 20,
    },

    copyRight: {
        color: "#004560",
        alignSelf: "center",
        fontFamily: "Roboto_medium",
        position: "absolute",
        bottom: 20,
    },

    item: {
        borderColor: "transparent",
    },

    text: {
        color: "white",
    },
});
