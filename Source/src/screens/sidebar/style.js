const React = require("react-native");
const { Platform, Dimensions } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  drawerCover: {
    alignSelf: "stretch",
    height: deviceHeight / 6,
    width: '100%',
    position: "relative",
    marginBottom: 10
  },
  drawerImage: {
    position: "absolute",
    top: Platform.OS === "android" ? deviceHeight / 13 : deviceHeight / 12,
    width: '100%',
    height: 75,
  },
  text: {
    fontWeight: Platform.OS === "ios" ? "500" : "400",
  },
  text_role2: {
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    marginLeft: 15,
  },
  text_back: {
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    marginLeft: 0,
  },
  badgeText: {
    fontSize: Platform.OS === "ios" ? 13 : 11,
    fontWeight: "400",
    textAlign: "center",
    marginTop: Platform.OS === "android" ? -3 : undefined
  },
  avantar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    margin: 10
  },
  Username: {
    color: '#FFF',
    fontSize: 23
  },
  borderColor: {
    borderWidth: 0,
    borderColor: '#FF0000',
  },
  borderColor_1: {
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  image_icon: {
    width: 20,
    height: 20
  },
  sub_menu: {
    marginLeft:30
  },
  styleListItem: {
  },
  viewText: {
    position: "absolute",
    justifyContent: 'center',
    alignItems: 'center',
  }
};
