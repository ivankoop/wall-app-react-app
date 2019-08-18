import {SHOW_TOP_ALERT, HIDE_TOP_ALERT} from "../constants/topalert.constants";

const INTIAL_STATE = {
    alertType: "warning",
    text: "",
    visible: false,
};

export function topAlertControls(state = INTIAL_STATE, action) {
    switch (action.type) {
        case SHOW_TOP_ALERT:
            return {
                ...state,
                alertType: action.alertType,
                text: action.text,
                visible: true,
            };
        case HIDE_TOP_ALERT:
            return {
                ...state,
                alertType: "warning",
                text: "",
                visible: false,
            };

        default:
            return state;
    }
}
