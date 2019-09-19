import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import {showTopAlert, hideTopAlert} from "../actions/topalert.actions";
import {SHOW_TOP_ALERT, HIDE_TOP_ALERT} from "../constants/topalert.constants";

const middlewares = [thunk];

describe("TopAlert -> Actions", () => {
    console.error = jest.fn();

    it("should create an action to SHOW_TOP_ALERT", () => {
        const expectedAction = {
            type: SHOW_TOP_ALERT,
            alertType: "warning",
            text: "ha ocurrido un error",
        };
        expect(showTopAlert("warning", "ha ocurrido un error")).toEqual(
            expectedAction
        );
    });

    it("should create an action to SHOW_TOP_ALERT", () => {
        const expectedAction = {
            type: HIDE_TOP_ALERT,
        };
        expect(hideTopAlert()).toEqual(expectedAction);
    });
});
