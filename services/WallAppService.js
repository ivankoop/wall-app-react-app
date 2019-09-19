import {AsyncStorage} from "react-native";
import getEnvVars from "../environment";

export const WallAppService = {
    auth,
    refreshAuth,
    logout,
    register,
    getPosts,
    createPost,
};

const {apiUrl} = getEnvVars();

// User auth
function auth(email, password) {
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    };

    return fetch(`${apiUrl}user/auth`, requestOptions)
        .then(handleResponse)
        .then(data => {
            return data;
        });
}

// User refresh auth
function refreshAuth(refreshToken) {
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            refreshToken: refreshToken,
        }),
    };

    return fetch(`${apiUrl}user/auth`, requestOptions)
        .then(handleResponse)
        .then(data => {
            return data;
        });
}

// User logout
async function logout() {
    // removing tokens from AsyncStorage
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
}

// User Register
function register(name, lastName, password, email) {
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name: name,
            lastName: lastName,
            password: password,
            email: email,
        }),
    };

    return fetch(`${apiUrl}user`, requestOptions)
        .then(handleResponse)
        .then(data => {
            return data;
        });
}

// get all posts
function getPosts() {
    const requestOptions = {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    };

    return fetch(`${apiUrl}posts`, requestOptions)
        .then(handleResponse)
        .then(data => {
            return data;
        });
}

// create a post, using auth interceptor
async function createPost(text) {
    const accessToken = await AsyncStorage.getItem("accessToken");
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify({
            text: text,
        }),
    };

    return fetch(`${apiUrl}posts`, requestOptions)
        .then(response => handleAuthResponse(response, createPost))
        .then(data => {
            return data;
        });
}

// response handler with refresh token interceptor
async function handleAuthResponse(response, requestFunction) {
    return response.text().then(async text => {
        if (!response.ok) {
            const status = response.status;

            if (status === 401) {
                const refreshToken = await AsyncStorage.getItem("refreshToken");

                return refreshAuth(refreshToken).then(
                    async data => {
                        await AsyncStorage.setItem(
                            "accessToken",
                            data.accessToken
                        );
                        await AsyncStorage.setItem(
                            "refreshToken",
                            data.refreshToken
                        );

                        return await requestFunction();
                    },
                    response => {
                        return Promise.reject({
                            status: response,
                            response: "refresh",
                        });
                    }
                );
            }

            try {
                return Promise.reject({
                    status: status,
                    response: JSON.parse(text),
                });
            } catch (e) {
                return Promise.reject(status);
            }
        }

        if (text === "OK") {
            return true;
        }

        return JSON.parse(text);
    });
}

// response handler without interceptor
function handleResponse(response) {
    return response.text().then(text => {
        if (!response.ok) {
            const status = response.status;

            try {
                return Promise.reject({
                    status: status,
                    response: JSON.parse(text),
                });
            } catch (e) {
                return Promise.reject(status);
            }
        }

        if (text === "OK") {
            return true;
        }

        return JSON.parse(text);
    });
}
