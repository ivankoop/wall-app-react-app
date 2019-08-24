import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Text,
    Dimensions,
} from "react-native";

const {width} = Dimensions.get("window");

class MiddleLoader extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        visibleLoader: PropTypes.bool,
    };

    render() {
        const {visibleLoader} = this.props;

        return (
            visibleLoader && (
                <View style={styles.mainContainer}>
                    <View style={styles.contentContainer}>
                        <ActivityIndicator
                            style={styles.indicator}
                            size="large"
                            color="#58F1FF"
                        />
                        <Text style={styles.text}>Loading...</Text>
                    </View>
                </View>
            )
        );
    }
}

const mapStateToProps = state => {
    const {visibleLoader} = state.middleLoaderControls;

    return {
        visibleLoader: visibleLoader,
    };
};

export default connect(mapStateToProps)(MiddleLoader);

const styles = StyleSheet.create({
    mainContainer: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        justifyContent: "center",
    },

    contentContainer: {
        alignSelf: "center",
        position: "absolute",
        backgroundColor: "rgba(0,0,0,0.8)",
        width: width * 0.4,
        paddingTop: 20,
        paddingBottom: 20,
        borderRadius: 63,
        paddingRight: 10,
        paddingLeft: 10,
        flexDirection: "row",
    },

    indicator: {
        flex: 0.2,
        marginLeft: 15,
    },

    text: {
        color: "white",
        flex: 1,
        alignSelf: "center",
        paddingLeft: 20,
        fontSize: width * 0.04,
        fontFamily: "Roboto_medium",
    },
});
