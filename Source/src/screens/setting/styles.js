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
    DatePickerLIP: {
        opacity:0, 
        backgroundColor:'#FFFF00' , 
        position:'absolute',
        width: '100%', 
        height:'100%',
    },

    dropdown_2: {
        width: 135,
        opacity:0,
        position:'absolute',
        height:'100%',
        backgroundColor: '#FFFF00',
    },
    dropdown_2_text: {
        marginVertical: 10,
        marginHorizontal: 6,
        fontSize: 15,
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    dropdown_2_dropdown: {
        width: 135,
        height: 280,
        borderColor: '#cacaca',
        borderWidth: 0.5,
        borderRadius: 3,
    },
    dropdown_2_row: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        borderBottomWidth:0.5, 
        borderBottomColor: '#dadada',
    },
    dropdown_2_row_text: {
        marginHorizontal: 2,
        fontSize: 15,
        textAlignVertical: 'center',
    },
    dropdown_2_separator: {
        height: 1,
    },
};