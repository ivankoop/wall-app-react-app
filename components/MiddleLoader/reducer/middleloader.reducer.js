import {
    SHOW_MIDDLE_LOADER,
    HIDE_MIDDLE_LOADER,
} from "../constants/middleloader.constants";

const INTIAL_STATE = {
    visibleLoader: false,
};

export function middleLoaderControls(state = INTIAL_STATE, action) {
    switch (action.type) {
        case SHOW_MIDDLE_LOADER:
            return {
                ...state,
                visibleLoader: true,
            };
        case HIDE_MIDDLE_LOADER:
            return {
                ...state,
                visibleLoader: false,
            };

        default:
            return state;
    }
}
