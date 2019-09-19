import React from "react";
import renderer from "react-test-renderer";
import {Provider} from "react-redux";
import {combineReducers, createStore} from "redux";
import TopAlert from "../TopAlert";
import {topAlertControls} from "../reducer/topalert.reducer";

const myReducers = combineReducers({
    topAlertControls,
});

const store = createStore(myReducers);

describe("TopAlert", () => {
    beforeEach(() => {
        console.error = jest.fn();
    });

    it("renders TopAlert", () => {
        jest.useFakeTimers();
        const tree = renderer
            .create(
                <Provider store={store}>
                    <TopAlert visible={true} />
                </Provider>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
