const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;

export default {
    container: {
        backgroundColor: "#00a680",
    },
    header: {
        backgroundColor: "#00a680",
        borderBottomColor: '#2bb594',
        borderBottomWidth: 1,
    },
    headerLeft: {
        maxWidth: 65
    },
    headerRight: {
        maxWidth: 65
    },
    headerBody: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowFull: {
        width: null,
        height: null,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowLogin: {
        width: null,
        height: null,
    },
    alignItemsEnd: {
        alignItems: 'flex-end',
        marginBottom: 5
    },
    logo: {
        width: '100%',
    },
    groupButton: {
        width: null,
        height: null,
        justifyContent: 'center',
        alignItems: 'center',
    },
    groupInput: {
        width: null,
        height: null,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonLogin: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        width: '100%',
    },
    maxWidth_500: {
        maxWidth: 500,
    },
    minHeight_100: {
        minHeight:100
    },
    minHeight_50: {
        minHeight:50
    },
    minHeight_60: {
        minHeight:60
    },
    buttonLoginFBIcon: {
        width: 70,
    },
    
    colButton: {
        // maxWidth: 400,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    areaUserName: {
        width: null,
        height: null,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection:'row',
    },
    iconUserName: {
        width: '100%'
    },
    background: {
        width: null,
        height: null,
    },
    text1: {
        color: '#FFFFFF',
        backgroundColor: "transparent",
        textAlign: 'center',
        marginBottom: 10,
        paddingHorizontal: 10
    },
    text2: {
        color: '#FFFFFF',
        backgroundColor: "transparent",
        textAlign: 'center',
        fontStyle: 'italic'
    },
    wrapper: {
        paddingHorizontal: 5,
    },
    inputWrap: {
        paddingHorizontal: 0,
        flexDirection:"row",
        height:36,
        backgroundColor:"transparent",
    },
    input: {
        flex: 1,
        paddingHorizontal: 5,
        backgroundColor: '#12ac8a',
        width: '100%',
        height: '100%',
        marginLeft: 5,
        maxHeight: 60,
        color:'#fff',
        fontSize: 20
    },
    iconWrap: {
        backgroundColor: "#1fb08f",
        width: '100%',
        height: '100%',
        maxWidth: 60,
        maxHeight: 60,
    },
    iconWrap_Pass: {
        backgroundColor: "#12ac8a",
        width: '100%',
        height: '100%',
        maxWidth: 60,
        maxHeight: 60,
    },
    icon: {
        width: 30,
        height: 30,
    },
    buttonLoginFB: {
        height: 60,
        maxWidth: 170,
        width: '99%',
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#3b5a9a',
    },
    buttonLoginG: {
        height: 60,
        maxWidth: 170,
        width: '99%',
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#df4a32'
    },
    iconFB: {
        marginLeft:10,
        fontSize: 25,
        color: '#FFFFFF',
    },
    iconG: {
        marginLeft:5,
        fontSize: 25,
        color: '#FFFFFF',
    },
    loginFaceText: {
        color: '#FFFFFF',
        backgroundColor: "transparent",
        textAlign: 'center',
        fontSize: 20,
    },
    button: {
        backgroundColor: "#d73352",
        paddingVertical: 8,
        marginVertical: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: '#FFFFFF',
        textAlign: 'center',
		fontSize: 20
    },
    forgotPasswordText: {
        color: '#FFFFFF',
        backgroundColor: "transparent",
        textAlign: 'center',
        textDecorationLine: 'underline'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    borderColor: {
        borderWidth: 0,
        borderColor: '#FF0000',
    },
    borderColor_1: {
        borderWidth: 1,
        borderColor: '#FF0000',
    },
    center: {
        alignItems: "center",
        justifyContent: "center",
    },
    appStyle: {
        orientation: 'portrait',
    },
    butonBack: {
        fontSize: 40,
    },
    headerText: {
        fontSize: 23,
    },
    
};