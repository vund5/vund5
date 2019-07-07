const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;

export default {
  container: {
    backgroundColor: "#eee"
  },
  header: {
    backgroundColor: "#009a74"
  },
  wrapper: {
  },

  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },

  image: {
    flex: 1,
    width: null,
    height: null
  },
  child: {
    height: 200,
    justifyContent: 'center'
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  boxShadow: {
    width: 200,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#ed7171',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 10
  }
};
