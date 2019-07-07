export const login = (user) => {
    return {
        type: 'LOGIN',
        email: user.email,
        name: user.name,
        firstname: user.firstname,
        lastname: user.lastname,
        birthday: user.birthday,
        username: user.username,
        phone: user.phone,
        sex: user.sex,
        tokenId: user.tokenId,
        password: user.password
    };
};
export const update = (user) => {
    return {
        type: 'UPDATE',
        name: user.name,
        firstname: user.firstname,
        lastname: user.lastname,
        birthday: user.birthday,
        sex: user.sex,
        phone: user.phone,
    };
};
export const update_pass = (user) => {
    return {
        type: 'UPDATE_PASS',
        password: user.password,
    };
};

export const setLanguage = (language) => {
    return {
        type: 'UPDATE_LANGUAGE',
        language: language,
    };
};
 
export const logout = () => {
    return {
        type: 'LOGOUT'
    };
};
 
export const signup = (username, password) => {
    return (dispatch) => {
    };
};