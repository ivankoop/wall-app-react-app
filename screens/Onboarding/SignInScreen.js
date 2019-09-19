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

class SignInScreen extends Component {
    state = {
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
        const {email, password} = this.state;

        if (email === "" || password === "") {
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

        WallAppService.auth(email, password).then(
            data => {
                hideMiddleLoader();
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
                    if (response.message === "INVALID_PASSWORD") {
                        showTopAlert("warning", "Invalid credentials");
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

    _onSignUp = () => {
        const {navigation} = this.props;
        navigation.navigate("SignUp");
    };

    _onReadPosts = () => {
        const {navigation} = this.props;
        navigation.navigate("Home", {authed: false});
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
                            <Text style={styles.signInText}>Sign In</Text>
                            <Form>
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
                                            Sign In
                                        </Text>
                                    </Button>
                                </Item>
                                <Item style={styles.item}>
                                    <TouchableOpacity
                                        onPress={this._onReadPosts}
                                        style={{
                                            flex: 1,
                                            marginTop: 20,
                                            alignSelf: "flex-start",
                                        }}
                                    >
                                        <Text style={styles.readPostsText}>
                                            Read posts
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={this._onSignUp}
                                        style={{flex: 2, marginTop: 20}}
                                    >
                                        <Text style={styles.registerText}>
                                            Don&apos;t have an Account?
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
)(SignInScreen);

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

    readPostsText: {
        color: "white",
        alignSelf: "flex-end",
        textDecorationLine: "underline",
        fontFamily: "Roboto_medium",
    },

    registerText: {
        color: "white",
        alignSelf: "center",
        textDecorationLine: "underline",
        fontFamily: "Roboto_medium",
    },

    signInText: {
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
        flexDirection: "row",
    },

    text: {
        color: "white",
    },
});
