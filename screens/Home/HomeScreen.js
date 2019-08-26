import React, {Component} from "react";

import {Form, Item, Input, Button} from "native-base";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {LinearGradient} from "expo-linear-gradient";
import {WallAppService} from "../../services/WallAppService";
import {getWallPosts, insertPost} from "../../redux/actions/wallpost.actions";
import {
    showMiddleLoader,
    hideMiddleLoader,
} from "../../components/MiddleLoader/actions/middleloader.actions";
import {showTopAlert} from "../../components/TopAlert/actions/topalert.actions";
import {Ionicons} from "@expo/vector-icons";
import {
    StyleSheet,
    View,
    StatusBar,
    KeyboardAvoidingView,
    Text,
    ScrollView,
    RefreshControl,
    SafeAreaView,
    Dimensions,
    Keyboard,
    Alert,
} from "react-native";

import moment from "moment";

class HomeScreen extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        newPost: "",
    };

    static propTypes = {
        getWallPosts: PropTypes.func,
        wallPosts: PropTypes.array,
        wallPostsLoading: PropTypes.bool,
        navigation: PropTypes.object,
        showTopAlert: PropTypes.func,
        showMiddleLoader: PropTypes.func,
        hideMiddleLoader: PropTypes.func,
        insertPost: PropTypes.func,
    };

    componentDidMount() {
        const {getWallPosts} = this.props;
        getWallPosts();
    }

    _onLogOut = async () => {
        const {navigation} = this.props;
        await WallAppService.logout();
        navigation.navigate("Auth");
    };

    _onRefresh = () => {
        const {getWallPosts} = this.props;
        getWallPosts();
    };

    _onSubmit = () => {
        const {newPost} = this.state;
        const {
            showMiddleLoader,
            hideMiddleLoader,
            showTopAlert,
            insertPost,
        } = this.props;

        if (newPost === "") {
            return;
        }

        Keyboard.dismiss();
        showMiddleLoader();
        this.setState({newPost: ""});

        WallAppService.createPost(newPost).then(
            data => {
                hideMiddleLoader();
                insertPost(data.post);
            },
            error => {
                hideMiddleLoader();

                const {response} = error;

                if (error === 500 || error === 502) {
                    showTopAlert("error", `(${error}) - Internal Server Error`);
                    return;
                }

                showTopAlert("error", `(${response.status}) - Client Error`);
            }
        );
    };

    _onSignIn = () => {
        const {navigation} = this.props;
        navigation.navigate("Auth");
    };

    _onLogOut = () => {
        Alert.alert(
            "Log Out",
            "",
            [
                {
                    text: "Yes",
                    onPress: async () => {
                        const {navigation} = this.props;
                        await WallAppService.logout();
                        navigation.navigate("Home", {authed: false});
                    },
                },
                {
                    text: "No",
                },
            ],
            {cancelable: false}
        );
    };

    render() {
        const {wallPostsLoading, wallPosts, navigation} = this.props;
        const {newPost} = this.state;

        const {authed} = navigation.state.params;

        return (
            <LinearGradient
                colors={["#58F1FF", "#009CD8"]}
                style={styles.mainContainer}
            >
                <StatusBar barStyle="dark-content" />

                <SafeAreaView style={{flex: 1, width: "100%"}}>
                    <ScrollView
                        style={styles.scrollView}
                        refreshControl={
                            <RefreshControl
                                tintColor="#FFFFFF"
                                refreshing={wallPostsLoading}
                                onRefresh={this._onRefresh}
                            />
                        }
                    >
                        {wallPosts.map((item, index) =>
                            this.renderWallPost(item, index)
                        )}
                    </ScrollView>
                    {authed ? (
                        <KeyboardAvoidingView behavior="position" enabled>
                            <Form>
                                <Item style={styles.inputCont}>
                                    <Input
                                        style={styles.textInput}
                                        placeholder="Write something..."
                                        autoCompleteType="email"
                                        placeholderTextColor="grey"
                                        returnKeyType={"send"}
                                        value={newPost}
                                        onChangeText={value => {
                                            this.setState({newPost: value});
                                        }}
                                        onSubmitEditing={this._onSubmit}
                                        ref={input => {
                                            this.input = input;
                                        }}
                                    />
                                    <Button
                                        onPress={this._onSubmit}
                                        style={styles.sendButton}
                                    >
                                        <Text style={styles.sendButtonText}>
                                            Send
                                        </Text>
                                    </Button>
                                </Item>
                            </Form>
                        </KeyboardAvoidingView>
                    ) : (
                        <View style={styles.signInCont}>
                            <Button
                                onPress={this._onSignIn}
                                style={styles.singInButton}
                            >
                                <Text style={styles.signInButtonText}>
                                    Sign In to write posts
                                </Text>
                            </Button>
                        </View>
                    )}
                    {authed && (
                        <Button
                            onPress={this._onLogOut}
                            style={styles.logOutBtn}
                        >
                            <Ionicons
                                name="md-log-out"
                                color="white"
                                style={{fontSize: 20}}
                            ></Ionicons>
                        </Button>
                    )}
                </SafeAreaView>
            </LinearGradient>
        );
    }

    renderWallPost = (item, index) => {
        return (
            <View key={index} style={styles.wallPostMainCont}>
                <View style={styles.wallPostCont}>
                    <View style={styles.WallPostTopCont}>
                        <View style={styles.WallPostTopLeft}>
                            <Text style={styles.WallPostUserName}>
                                {item.user.name + " " + item.user.lastName}
                            </Text>
                        </View>
                        <View style={styles.WallPostTopRight}>
                            <Text style={styles.WallPostDate}>
                                {moment(item.creationDate).format(
                                    "MM/DD/YYYY HH:MM"
                                )}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.WallPostMidCont}>
                        <Text style={styles.WallPostText}>{item.text}</Text>
                    </View>
                </View>
            </View>
        );
    };
}

const mapStateToProps = state => {
    const {wallPosts, wallPostsLoading} = state.wallPostsControls;

    return {
        wallPosts: wallPosts,
        wallPostsLoading: wallPostsLoading,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getWallPosts: () => dispatch(getWallPosts()),
        showMiddleLoader: () => dispatch(showMiddleLoader()),
        hideMiddleLoader: () => dispatch(hideMiddleLoader()),
        showTopAlert: () => dispatch(showTopAlert()),
        insertPost: post => dispatch(insertPost(post)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeScreen);

const {width} = Dimensions.get("window");

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    scrollView: {
        width: "100%",
    },

    signInCont: {
        backgroundColor: "#009CD8",
        marginLeft: 0,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 16,
        paddingBottom: 16,
    },

    logOutBtn: {
        position: "absolute",
        width: 50,
        height: 50,
        top: "7%",
        backgroundColor: "#004560",
        right: "5%",
        borderRadius: 50,
        justifyContent: "center",
    },

    singInButton: {
        width: "100%",
        backgroundColor: "#004560",
        height: 45,
    },

    signInButtonText: {
        width: "100%",
        textAlign: "center",
        color: "white",
        fontSize: width * 0.044,
        fontFamily: "Roboto_medium",
    },

    inputCont: {
        borderColor: "transparent",
        flexDirection: "row",
        backgroundColor: "#009CD8",
        marginLeft: 0,
        paddingLeft: 16,
        paddingTop: 10,
    },

    textInput: {
        color: "#004560",
        fontFamily: "Roboto_medium",
        backgroundColor: "white",
        borderRadius: 5,
        height: 45,
        marginBottom: 10,
        flex: 4,
    },

    sendButton: {
        flex: 1,
        height: 45,
        marginTop: 3,
        marginRight: 16,
        marginLeft: 8,
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: "#004560",
    },

    sendButtonText: {
        width: "100%",
        fontSize: width * 0.04,
        color: "white",
        fontFamily: "Roboto_medium",
        textAlign: "center",
    },

    wallPostMainCont: {
        width: "100%",
        paddingLeft: 16,
        paddingRight: 16,
        marginTop: 20,
    },

    wallPostCont: {
        width: "100%",
        paddingBottom: 10,

        backgroundColor: "white",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },

    WallPostTopCont: {
        width: "100%",
        height: 30,
        flexDirection: "row",
    },

    WallPostMidCont: {
        paddingLeft: 10,
        paddingRight: 10,
    },

    WallPostText: {
        fontFamily: "Roboto_medium",
        fontSize: width * 0.038,
    },

    WallPostTopLeft: {
        flex: 1,
        paddingLeft: 10,
        justifyContent: "center",
    },

    WallPostTopRight: {
        flex: 1,
        paddingRight: 10,
        justifyContent: "center",
    },

    WallPostUserName: {
        color: "#004560",
        fontFamily: "Roboto_medium",
        fontSize: width * 0.038,
    },

    WallPostDate: {
        color: "grey",
        fontFamily: "Roboto_medium",
        fontSize: width * 0.035,
        alignSelf: "flex-end",
    },

    text: {
        color: "white",
    },
});
