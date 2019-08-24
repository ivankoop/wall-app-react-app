import React from "react";
import renderer from "react-test-renderer";
import {Provider} from "react-redux";
import {combineReducers, createStore} from "redux";
import MiddleLoader from "../MiddleLoader";
import {middleLoaderControls} from "../reducer/middleloader.reducer";

const myReducers = combineReducers({
    middleLoaderControls,
});

const store = createStore(myReducers);

describe("MiddleLoader", () => {
    beforeEach(() => {
        console.error = jest.fn();
    });

    it("renders MiddleLoader", () => {
        jest.useFakeTimers();
        const tree = renderer
            .create(
                <Provider store={store}>
                    <MiddleLoader visible={true} />
                </Provider>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
