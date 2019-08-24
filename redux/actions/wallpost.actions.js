import {
    GET_WALL_POST_REQUEST,
    GET_WALL_POST_SUCCESS,
    GET_WALL_POST_FAILURE,
} from "../constants/wallpost.constants";

import {WallAppService} from "../../services/WallAppService";
import {showTopAlert} from "../../components/TopAlert/actions/topalert.actions";

export const getWallPosts = () => {
    return dispatch => {
        dispatch(request());

        return WallAppService.getPosts().then(
            data => {
                console.log("success", data);
                dispatch(success(data));
            },
            error => {
                console.log("error", error);
                dispatch(failure());

                if (error === 500 || error === 502) {
                    dispatch(
                        showTopAlert(
                            "error",
                            `(${error}) - Internal Server Error`
                        )
                    );
                    return;
                }

                dispatch(
                    showTopAlert("error", `(${response.status}) - Client Error`)
                );
            }
        );
    };

    function request() {
        return {
            type: GET_WALL_POST_REQUEST,
        };
    }

    function success(data) {
        return {
            type: GET_WALL_POST_SUCCESS,
            wallPosts: data.posts,
        };
    }

    function failure() {
        return {
            type: GET_WALL_POST_FAILURE,
        };
    }
};
