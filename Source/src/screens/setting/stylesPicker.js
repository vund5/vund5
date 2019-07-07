const React = require("react-native");
const { Dimensions, Platform } = React;
const height = Dimensions.get("window").height;

export default {
  inputIOS: {
    fontSize: 13,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    backgroundColor: 'white',
    color: 'black',
  },
};
