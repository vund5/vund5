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
        borderBottomWidth: 0,
    },
    content: {
        padding:10
    },
    listitem: {
        backgroundColor:'#fff',
        borderRadius: 5,
    },
    icon: {
        fontSize:20, 
        color:"#ff7f02"
    },
};