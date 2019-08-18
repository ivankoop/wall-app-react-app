import {Constants} from "expo";

//TODO: set env dir
const ENV = {
    dev: {
        apiUrl: "http://35.186.216.88/",
    },
    staging: {
        apiUrl: "http://35.186.216.88/",
    },
    prod: {
        apiUrl: "http://35.186.216.88/",
    },
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
    // What is __DEV__ ?
    // This variable is set to true when react-native is running in Dev mode.
    // __DEV__ is true when run locally, but false when published.
    if (__DEV__) {
        return ENV.dev;
    } else if (env === "staging") {
        return ENV.staging;
    } else if (env === "prod") {
        return ENV.prod;
    }
};

export default getEnvVars;
