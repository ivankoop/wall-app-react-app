import {SHOW_TOP_ALERT, HIDE_TOP_ALERT} from "../constants/topalert.constants";

export const showTopAlert = (alertType, text) => {
    return {
        type: SHOW_TOP_ALERT,
        alertType: alertType,
        text: text,
    };
};

export const hideTopAlert = () => {
    return {
        type: HIDE_TOP_ALERT,
    };
};
