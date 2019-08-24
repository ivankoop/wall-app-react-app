import {
    SHOW_MIDDLE_LOADER,
    HIDE_MIDDLE_LOADER,
} from "../constants/middleloader.constants";

export const showMiddleLoader = text => {
    return {
        type: SHOW_MIDDLE_LOADER,
    };
};

export const hideMiddleLoader = () => {
    return {
        type: HIDE_MIDDLE_LOADER,
    };
};
