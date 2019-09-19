import React, {Component} from "react";
import {View, Text, StyleSheet, Animated, StatusBar, Image} from "react-native";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {isIphoneX} from "../../helpers/Utils";
import {hideTopAlert} from "./actions/topalert.actions";

class TopAlert extends Component {
    constructor(props) {
        super(props);

        this.state = {
            animation: new Animated.Value(0),
            animationRunning: false,
        };
    }

    static defaultProps = {
        type: "warning",
        text: "Ha ocurrido un error.",
    };

    static propTypes = {
        type: PropTypes.string,
        text: PropTypes.string,
        visible: PropTypes.bool,
        hideTopAlert: PropTypes.func,
        alertType: PropTypes.string,
    };

    _showAlert = () => {
        const {hideTopAlert} = this.props;

        Animated.timing(this.state.animation, {
            toValue: isIphoneX() ? 130 : 80,
            duration: 200,
        }).start();

        setTimeout(async () => {
            await Animated.timing(this.state.animation, {
                toValue: 0,
                duration: 200,
            }).start(() => {
                hideTopAlert();
            });
        }, 2000);
    };

    componentDidUpdate() {
        const {visible} = this.props;
        if (visible) {
            this._showAlert();
        }
    }

    render() {
        const {animation} = this.state;
        const {alertType, text, visible} = this.props;

        let icon = iconWarningSmall;

        if (alertType === "error") {
            icon = iconErrorSmall;
        } else if (alertType === "success") {
            icon = iconCheckSmall;
        }

        return (
            visible && (
                <Animated.View
                    style={{...styles.mainContainer, height: animation}}
                >
                    <StatusBar
                        barStyle="light-content"
                        backgroundColor="transparent"
                    />
                    <View style={styles.contentContainer}>
                        <Image source={icon} style={styles.icon}></Image>
                        <Text style={styles.text}>{text}</Text>
                    </View>
                </Animated.View>
            )
        );
    }
}

const mapStateToProps = state => {
    const {visible, alertType, text} = state.topAlertControls;

    return {
        visible: visible,
        alertType: alertType,
        text: text,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        hideTopAlert: () => dispatch(hideTopAlert()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopAlert);

const iconCheckSmall = require("../../assets/images/icon-check-small.png");
const iconErrorSmall = require("../../assets/images/icon-error-small.png");
const iconWarningSmall = require("../../assets/images/icon-warning-small.png");

const styles = StyleSheet.create({
    mainContainer: {
        position: "absolute",
        top: 0,
        zIndex: 25,
        height: 0,
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.8)",
    },

    contentContainer: {
        flexDirection: "row",
        paddingLeft: 19,
        paddingRight: 19,
        alignItems: "center",
        position: "absolute",
        bottom: 25,
    },

    icon: {
        width: 24,
        height: 24,
        marginRight: 11,
    },

    text: {
        color: "white",
        fontSize: 12,
        marginRight: 20,
        fontFamily: "Roboto_medium",
    },
});
