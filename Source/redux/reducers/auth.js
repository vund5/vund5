const defaultState = {
    isLoggedIn: false,
    email: '',
    name: '',
    firstname: '',
    lastname: '',
    phone: '',
    birthday: '',
    sex: '',
    username: '',
    tokenId: '',
    language: 'vi',
    password: '',
};
 
export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case 'LOGIN': 
            return Object.assign({}, state, { 
                isLoggedIn: true,
                email: action.email,
                name: action.name,
                firstname: action.firstname,
                lastname: action.lastname,
                birthday: action.birthday,
                username: action.username,
                phone: action.phone,
                sex: action.sex,
                tokenId: action.tokenId,
                password: action.password
            });
        case 'LOGOUT':
            return Object.assign({}, state, { 
                isLoggedIn: false,
                email: '',
                name: '',
                firstname: '',
                lastname: '',
                birthday: '',
                sex: '',
                username: '',
                phone: '',
                tokenId: '',
                password: '',
            });
        case 'UPDATE':
            return Object.assign({}, state, { 
                isLoggedIn: true,
                name: action.name,
                firstname: action.firstname,
                lastname: action.lastname,
                birthday: action.birthday,
                sex: action.sex,
                phone: action.phone,
            });
        case 'UPDATE_PASS':
            return Object.assign({}, state, {
                password: action.password,
            });
        case 'UPDATE_LANGUAGE':
            return Object.assign({}, state, {
                language: action.language,
            });
        default:
            return state;
    }
}