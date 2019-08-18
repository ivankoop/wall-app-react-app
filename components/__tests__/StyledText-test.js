import React from "react";
import renderer from "react-test-renderer";
import {MonoText} from "../StyledText";

describe("MonoText", () => {
    beforeEach(() => {
        console.error = jest.fn();
    });

    it("renders MonoText", () => {
        jest.useFakeTimers();
        const tree = renderer.create(<MonoText/>).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
