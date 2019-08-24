import {
    GET_WALL_POST_REQUEST,
    GET_WALL_POST_SUCCESS,
    GET_WALL_POST_FAILURE,
} from "../constants/wallpost.constants";

const INTIAL_STATE = {
    wallPosts: [],
    wallPostsLoading: false,
};

export function wallPostsControls(state = INTIAL_STATE, action) {
    switch (action.type) {
        case GET_WALL_POST_REQUEST:
            return {
                ...state,
                wallPostsLoading: true,
            };
        case GET_WALL_POST_SUCCESS:
            return {
                ...state,
                wallPostsLoading: false,
                wallPosts: action.wallPosts,
            };

        case GET_WALL_POST_FAILURE:
            return {
                ...state,
                wallPostsLoading: false,
            };

        default:
            return state;
    }
}
