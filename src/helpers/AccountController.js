export const getAccount = (access_token) => {
    return Promise.race([
        new Promise((resolve, reject) => {
            fetch(global.URL + 'api/account/get', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.result === 'GOOD') {
                    resolve(responseJson);   
                }
            })
            .catch((error) => {
                reject(error);
            })
        })
    ])
};

export const resetPasswordAccount = (current_password, password, password_confirmation, access_token) => {
    return Promise.race([
        new Promise((resolve, reject) => {
            fetch(global.URL + 'api/account/reset/password', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                body: JSON.stringify({
                    current_password,
                    password,
                    password_confirmation
                })
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.result === 'GOOD') {
                    resolve(responseJson);
                }
            })
            .catch((error) => {
                reject(error);
            })
        })
    ])
};