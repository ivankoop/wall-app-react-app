import {combineReducers} from "redux";
import {topAlertControls} from "./components/TopAlert/reducer/topalert.reducer";
import {middleLoaderControls} from "./components/MiddleLoader/reducer/middleloader.reducer";

export default combineReducers({
    topAlertControls,
    middleLoaderControls,
});
