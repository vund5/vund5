import React, { Component } from "react";
import { StackActions, NavigationActions } from 'react-navigation';
import { Image, Alert, AsyncStorage, TouchableOpacity, Platform} from "react-native";
import {
  Content,
  Text,
  List,
  ListItem,
  Icon,
  Container,
  Left,
  Right,
  Body,
  Badge,
  Thumbnail,
  View,
} from "native-base";
import styles from "./style";

import { translate } from 'react-i18next';
import i18n from 'i18next';

import { connect } from 'react-redux';
import IconAW from 'react-native-vector-icons/FontAwesome';

import { logout, login, setLanguage } from './../../../redux/actions/auth';
import DienBienAPI from '../../api/index';

// const drawerCover = require("../../../assets/drawer-cover.png");
// const drawerImage = require("../../../assets/logo-kitchen-sink.png");
const drawerCover = require("./../../../assets/login/background.png");
const drawerImage = require("./../../../assets/login/avantar.jpg");
const dataURLICON = "./../../../assets/menu/";

const datas_1 = [
	{
		name: "Trang chủ",
		route: "Home",
		icon: require("./../../../assets/menu/icon_home.png"),
		bg: "#C5F442",
  },
  {
    name: "Trải nghiệm",
    route: "SR062",
    icon: require("./../../../assets/menu/icon_tn.png"),
    bg: "#FF0000",
  },
  {
    name: "Cài đặt",
    route: "setting",
    icon: require("./../../../assets/menu/icon_settings.png"),
    bg: "#C5F442",
  },
  {
    name: "Đăng nhập",
    route: "login",
    icon: require("./../../../assets/menu/icon-login.png"),
    bg: "#48525D",
  }
]
const datas_2 = [
	{
		name: "Trang chủ",
		route: "Home",
		icon: require("./../../../assets/menu/icon_home.png"),
		bg: "#C5F442",
  },
  {
    name: "Trải nghiệm",
    route: "SR062",
    icon: require("./../../../assets/menu/icon_tn.png"),
    bg: "#FF0000",
  },
  {
    name: "Cài đặt",
    route: "setting",
    icon: require("./../../../assets/menu/icon_settings.png"),
    bg: "#C5F442",
  },
  {
    name: "Đăng xuất",
    route: "logout",
    icon: require("./../../../assets/menu/icon_logout.png"),
    bg: "#48525D",
  }
]

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOffsetWidth: 1,
      shadowRadius: 4,
      avatarSource: drawerImage,
      data_menu_1: [...datas_1],
      data_menu_2: [...datas_2],
      show_menu_1: false,
      show_menu_2: false,
      show_menu_3: false,
    };
  }
  componentDidMount = () => {
    if (this.props.isLoggedIn != true) {
      AsyncStorage.getItem('user', (err, user) => {
        if (user !== null) {
          var _user = JSON.parse(user);
          this.checkTokenLogin(_user);
        }
      }).done();
      const STORAGE_KEY = '@APP:languageCode';
      AsyncStorage.getItem(STORAGE_KEY, (err, key) => {
        if (key !== null) {
          this.props.setLanguage(key);
        }
      }).done();
    }
  }
  async checkTokenLogin (_user) {
    let url = DienBienAPI.getServerURLDefault() + '/wp-json/jwt-auth/v1/token/validate';
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + _user.tokenId
      },
    }).then((response) => response.json())
    .then((responseJson) => {
      // Alert.alert(JSON.stringify(responseJson));
      if (responseJson['code'] == 'jwt_auth_valid_token') {
        this.props.onLogin(_user);
      } else {
        this.removeItemValue('user');
      }
    }).catch((error) => {
    });
  }
  async removeItemValue(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    }
    catch(exception) {
      return false;
    }
  }
  func_logut() {
    this.removeItemValue('user');
    this.props.onLogout();
    this.setState({
      show_menu_1: false,
      show_menu_2: false,
      show_menu_3: false,
    });
    this.props.navigation.navigate('Home');
    // const resetAction = StackActions.reset({
    //   index: 0,
    //   actions: [NavigationActions.navigate({ routeName: 'Home' })],
    // });
    // this.props.navigation.dispatch(resetAction);
  }
  func_button_menu(e, data) {
    const { t, i18n } = this.props;
    if (data.route == 'logout') {
      Alert.alert(t('message:title'), 
        t('accountManager:logout_message'),
        [
            {text: t('message:text_ok'), onPress: () => this.func_logut()},
            {text: t('message:text_cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        ],{ cancelable: false }
      )
    } else if (data.route == 'show_menu_1') {
      this.setState({ 
        show_menu_1: !this.state.show_menu_1,
      });
    } else if (data.route == 'show_menu_2') {
      this.setState({
        show_menu_2: !this.state.show_menu_2,
      });
    } else if (data.route == 'show_menu_3') {
      this.setState({
        show_menu_3: !this.state.show_menu_3,
      });
    } else {
      console.log('SideBar: i18n.language'+ i18n.language);
      this.props.navigation.navigate(data.route)
    }
    e.preventDefault();
  }

  I18N_name(route){
    switch(route){
      case "Home": return "home:title";
      //case "accountManager": return "";
      case "SR010": return "home:menu1";
      case "SR020": return "home:menu2";
      case "SR030": return "home:menu3";
      case "SR040": return "home:menu4";
      case "SR050": return "home:menu5";
      //case "SR052": return "";
      case "SR090": return "home:menu6";
      case "show_menu_1": return "target:title";
      case "SR060": return "target:menu1";
      case "SR062": return "target:menu2";
      //case "show_menu_2": return "";
      //case "SR081": return "";
      //case "SR082": return "";
      //case "SR083": return "";
      //case "SR084": return "";
      //case "SR086": return "";
      //case "SR087": return "";
      //case "SR085": return "";
      case "show_menu_3": return "tours:schedule";
      //case "SR070": return "tours:schedule";
      case "SR070_1": return "tours:my_schedule";
      case "SR100": return "tours:title";
      case "setting": return "home:setting";
      case "login": return "login:title";
      case "logout": return "accountManager:option3";
    }
    return "changeLanguage:title";
  }
  
  render() {
    const { t, i18n } = this.props;
    return (
      <Container>
        <Content
          bounces={false}
          style={{ flex: 1, backgroundColor: "#fff", top: -1 }}
        >
          <View style={styles.drawerCover}>
            <Image source={drawerCover} style={{width:'100%', height:'100%'}} />
          </View>
          
          {this.props.isLoggedIn &&
            <View style={[{flexDirection:'row'}, styles.drawerCover, styles.viewText]}>
              <Left style={{maxWidth:70}}>
                <TouchableOpacity activeOpacity = { 0.8 } onPress = { ()=> {this.props.navigation.navigate('accountManager')} }>
                  <Thumbnail style={[styles.avantar]} source={this.state.avatarSource} />
                </TouchableOpacity>
              </Left>
              <Right style={{justifyContent:'center', alignItems: 'flex-start',}}>
                <TouchableOpacity activeOpacity = { 0.8 } onPress = { ()=> {this.props.navigation.navigate('accountManager')} }>
                  <Text numberOfLines = { 1 } style={[styles.Username, {marginRight:10}]}>{this.props.name}</Text>
                  <Text numberOfLines = { 1 } note style={[{color:'#fff', marginRight:10}]}>{this.props.email}</Text>
                </TouchableOpacity>
              </Right>
            </View>
          }
          {this.props.language == 'vi' && <List
            dataArray={this.props.isLoggedIn ? this.state.data_menu_2 : this.state.data_menu_1}
            renderRow={data =>
              <ListItem icon style={[styles.styleListItem]}
                onPress={(e) => this.func_button_menu(e, data)}
              >
                  <Left>
                    <Image source={data.icon}
                      style={styles.image_icon}
                    ></Image>
                    
                  </Left>
                  <Body>
                    <Text style={styles.text}> 
                      {t(this.I18N_name(data.route))} 
                    </Text>
                  </Body>
                  {data.types &&
                    <Right>
                      <IconAW name="chevron-up"></IconAW>
                    </Right>}
              </ListItem>
            }
          />}
          {this.props.language == 'en' && <List
            dataArray={this.props.isLoggedIn ? this.state.data_menu_2 : this.state.data_menu_1}
            renderRow={data =>
              <ListItem icon style={[styles.styleListItem]}
                onPress={(e) => this.func_button_menu(e, data)}
              >
                  <Left>
                    <Image source={data.icon}
                      style={styles.image_icon}
                    ></Image>
                    
                  </Left>
                  <Body>
                    <Text style={styles.text}> 
                      {t(this.I18N_name(data.route))} 
                    </Text>
                  </Body>
                  {data.types &&
                    <Right>
                      <IconAW name="chevron-up"></IconAW>
                    </Right>}
              </ListItem>
            }
          />}
          {this.props.language == 'fr' && <List
            dataArray={this.props.isLoggedIn ? this.state.data_menu_2 : this.state.data_menu_1}
            renderRow={data =>
              <ListItem icon style={[styles.styleListItem]}
                onPress={(e) => this.func_button_menu(e, data)}
              >
                  <Left>
                    <Image source={data.icon}
                      style={styles.image_icon}
                    ></Image>
                    
                  </Left>
                  <Body>
                    <Text style={styles.text}> 
                      {t(this.I18N_name(data.route))} 
                    </Text>
                  </Body>
                  {data.types &&
                    <Right>
                      <IconAW name="chevron-up"></IconAW>
                    </Right>}
              </ListItem>
            }
          />}
          
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
      isLoggedIn: state.auth.isLoggedIn,
      name: state.auth.name,
      email: state.auth.email,
      language: state.auth.language,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (user) => { dispatch(login(user)); },
    onLogout: () => { dispatch(logout()); },
    setLanguage: (language) => { dispatch(setLanguage(language)); }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(translate(['SideBar'], { wait: true })(SideBar));

// export default SideBar;
