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
    ScrollView,
    RefreshControl,
    SafeAreaView,
    Dimensions,
} from "react-native";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {LinearGradient} from "expo-linear-gradient";
import {WallAppService} from "../../services/WallAppService";

import {getWallPosts} from "../../redux/actions/wallpost.actions";

import moment from "moment";

class HomeScreen extends Component {
    constructor(props) {
        super(props);
    }

    state = {};

    static propTypes = {
        getWallPosts: PropTypes.func,
        wallPosts: PropTypes.array,
        wallPostsLoading: PropTypes.bool,
        navigation: PropTypes.object,
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

    render() {
        const {wallPostsLoading, wallPosts} = this.props;

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

                        <Text style={styles.text}>Home Screen</Text>
                        <TouchableOpacity onPress={this._onLogOut}>
                            <Text style={{color: "white"}}>Log Out</Text>
                        </TouchableOpacity>
                    </ScrollView>
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
