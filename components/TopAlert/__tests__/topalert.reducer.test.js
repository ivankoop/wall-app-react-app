import {topAlertControls as reducer} from "../reducer/topalert.reducer";
import {SHOW_TOP_ALERT, HIDE_TOP_ALERT} from "../constants/topalert.constants";
describe("TopAlert -> Reducers", () => {
    it("should return the initial state", () => {
        expect(reducer(undefined, {})).toEqual({
            alertType: "warning",
            text: "",
            visible: false,
        });
    });

    it("should handle SHOW_TOP_ALERT", () => {
        expect(
            reducer([], {
                type: SHOW_TOP_ALERT,
                alertType: "warning",
                text: "Ha ocurrido un error",
            })
        ).toEqual({
            visible: true,
            alertType: "warning",
            text: "Ha ocurrido un error",
        });
    });

    it("should handle HIDE_TOP_ALERT", () => {
        expect(
            reducer([], {
                type: HIDE_TOP_ALERT,
            })
        ).toEqual({
            visible: false,
            alertType: "warning",
            text: "",
        });
    });
});
