import React, { Component } from "react";
import { ScrollView, View, Dimensions, TouchableOpacity, Image, StyleSheet, AsyncStorage, Platform } from "react-native";
import { Container, Text, Button } from "native-base";
import { Icon } from 'react-native-elements';
import { Toolbar } from 'react-native-material-ui';
import FooterCustom from '../../screens/common/footer_new';
import moment from 'moment';
import 'moment/locale/vi';
import 'moment/locale/fr';
import { translate } from 'react-i18next';
import i18n from 'i18next';
import DienBienAPI from '../../api/index';

import styles from "./styles";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const sizeGrid = SCREEN_WIDTH > 600 ? 600 / 3 : SCREEN_WIDTH / 3;
const sizeSubGrid = Math.sqrt(sizeGrid * sizeGrid / 2) - Math.sqrt(sizeGrid * sizeGrid / 2) / 11;

const imageHeader = require("./../../../assets/login/background.png");
const notifyIcon = require("./../../../assets/Icon/notify-icon.png");
const sunIcon = require("./../../../assets/Icon/sun-icon.png");

const menu_1 = { icon: require("../../../assets/Icon/HomeContentsIcon/HotelIconOrange.png"), title: 'Khách sạn', router: "SR030" };
const menu_2 = { icon: require("../../../assets/Icon/HomeContentsIcon/LeHoi.png"), title: 'Lễ hội', router: "SR050" };
const menu_3 = { icon: require("../../../assets/Icon/HomeContentsIcon/TinTuc.png"), title: 'Tin Tức', router: "SR010" };
const menu_4 = { icon: require("../../../assets/Icon/HomeContentsIcon/SuKien.png"), title: 'Sự kiện', router: "SR020" };
const menu_5 = { icon: require("../../../assets/Icon/HomeContentsIcon/DiaDiem.png"), title: 'Địa điểm', router: "SR060" };
const menu_6 = { icon: require("../../../assets/Icon/HomeContentsIcon/NhaHang.png"), title: 'Nhà hàng', router: "SR040" };
const menu_7 = { icon: require("../../../assets/Icon/HomeContentsIcon/AmThuc.png"), title: 'Ẩm thực', router: "SR052" };
const menu_8 = { icon: require("../../../assets/Icon/HomeContentsIcon/ThueXe.png"), title: 'Thuê xe', router: "SR090" };

const styles1 = StyleSheet.create({
  styleGrid: {
    width: sizeGrid,
    height: sizeGrid,
    alignItems: 'center',
    justifyContent: 'center'
  },
  styleSubGrid: {
    width: sizeSubGrid,
    height: sizeSubGrid,
    backgroundColor: '#fff',
    transform: [{ rotate: '45deg' }],
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 8,
    shadowOffset: { width: 2, height: 4 }
  },
  styleContentGrid: {
    width: sizeSubGrid,
    height: sizeSubGrid,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-45deg' }],
  },
  styleImageGrid: {
    width: sizeGrid / 3.5,
    height: sizeGrid / 3.5
  },
  styleTextGrid: {
    fontSize: sizeGrid / 11,
    paddingLeft:5,
    paddingRight:5,
    textAlign: 'center'
  },
  itemList: {
    marginLeft: 0,
    paddingBottom: 5,
  },
  itemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5
  },
  imageView: {
    width: SCREEN_WIDTH,
    height: 180,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageItem: {
    width: SCREEN_WIDTH,
    height: 180,
    resizeMode: 'cover',
    borderRadius: 6,
  },
  viewDescription: {
    position: "absolute",
    bottom: 0,
    flexDirection: 'row',
    width: SCREEN_WIDTH,
    backgroundColor: '#0e0e0e87',
    height: 50,
    borderRadius: 6
  },
  itemDescription: {
    width: SCREEN_WIDTH,
  },
  textTitle: {
    color: "#fff",
    flexShrink: 1,
    fontSize: 18,
    position: "absolute",
    top: 5,
    left: 15,
    width: SCREEN_WIDTH,
  },
  text: {
    color: "#fff",
    flexShrink: 1,
    fontSize: 12,
    position: "absolute",
    bottom: 5,
    left: 15,
    width: SCREEN_WIDTH,
  },
  numberOfAccesses: {
    position: "absolute",
    bottom: 5,
    right: 15,
    flexDirection: "row"
  },
  textNumberOfAccesses: {
    color: "#fff",
    flexShrink: 1,
    fontSize: 12
  }
})

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      navIndex: 1,
      title: 'home:title',
      currentDate: moment().locale('en').utc('+07:00'),
      numberOfAccesses: 0
    };
  }

  componentDidMount() {
    this.getNumberOfAccesses();
    const { t, i18n } = this.props;
    this.setState({
      currentDate: moment().locale(t('home:language')).utc('+07:00'),
    });
  }

  async getNumberOfAccesses() {
    let urlAPI = DienBienAPI.getServerURLDefault() + "/wp-json/v2/visitor-count";
    try {
      const response = await fetch(urlAPI);
      const responseJson = await response.json();
      if(responseJson && typeof responseJson === 'string' && !isNaN(responseJson.replace(/,/g, '').replace(/./g, ''))){
        this.setState({
          numberOfAccesses: responseJson
        });
      }
    }
    catch (error) {
      console.error(error);
    }
  }


  onPressTab = (index) => {
    switch (index) {
      case 1:
        // this.props.navigation.navigate('Home');
        break;
      case 2:
        // this.props.navigation.navigate('SR100');
        break;
      case 3:
        // this.props.navigation.navigate('SR070_1');
        break;
      case 4:
        // this.props.navigation.navigate('HomeBooking');
        break;
      case 5:
        // this.props.navigation.navigate('HomeInformation');
        break;
    }

  }

  onPressButtonGrid = (screen) => {
    this.props.navigation.navigate(screen);
  };
  
  I18N_name(route) {
    switch (route) {
      case "Home": return "home:title";
      case "setting": return "setting:title";
      case "login": return "login:title";
      case "logout": return "accountManager:option3";
    }
    return "changeLanguage:title";
  }
  addNewSchedule() {
    this.props.navigation.navigate('SR073');
  }
  render() {
    const { t, i18n } = this.props;
    return (
      <Container style={styles.container}>
        <Toolbar
          leftElement="menu"
          onLeftElementPress={() => this.props.navigation.openDrawer()}
          centerElement={t('home:title')}
          rightElement={
            <View style={{ flexDirection: "row" }}>
              <Button
                style={{ width: 40, justifyContent: 'center', alignItems: 'center' }}
                transparent onPress = {() => this.props.navigation.navigate('HomeNotification')}>
                <Image source={notifyIcon} style={{ width: 20, height: 20 }} />
              </Button>
            </View>
          }
          style={{
            container: [{backgroundColor: '#009a74'}, Platform.OS === 'ios' ? {height:"10%", paddingTop:25} : {}]
          }}
        />

        <View style={{ flex: 1 }}>
          <View>
            <Image source={imageHeader} style={{ width: '100%', height: SCREEN_HEIGHT / 3 }} />
            <View style={styles1.viewDescription}>
              <View style={styles1.itemDescription}>
                <Text style={styles1.textTitle} numberOfLines={1}>{t('home:address')}</Text>
                <Text note numberOfLines={1} style={styles1.text}>{this.state.currentDate.format('dddd, DD/MM/YYYY')}</Text>
              </View>
              <View style={styles1.numberOfAccesses}>
                <Icon name='eye' type='material-community' color='#fff' size={17} />
                <Text note numberOfLines={1} style={styles1.textNumberOfAccesses}>  {this.state.numberOfAccesses}</Text>
              </View>
            </View>
          </View>
          <View style={{ alignContent: 'center', justifyContent: 'center', flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <View style={styles1.styleGrid}>

                <View style={styles1.styleSubGrid}>
                  <TouchableOpacity onPress={() => { this.onPressButtonGrid(menu_1.router) }}>
                    <View style={styles1.styleContentGrid}>
                      <Image source={menu_1.icon} style={styles1.styleImageGrid}></Image>
                      <Text style={styles1.styleTextGrid}>{t(this.I18N_name(menu_1.router))}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles1.styleGrid}>
                <View style={styles1.styleSubGrid}>
                  <TouchableOpacity onPress={() => { this.onPressButtonGrid(menu_2.router) }}>
                    <View style={styles1.styleContentGrid}>
                      <Image source={menu_2.icon} style={styles1.styleImageGrid}></Image>
                      <Text style={styles1.styleTextGrid}>{t(this.I18N_name(menu_2.router))}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles1.styleGrid}>
                <View style={styles1.styleSubGrid}>
                  <TouchableOpacity onPress={() => { this.onPressButtonGrid(menu_3.router) }}>
                    <View style={styles1.styleContentGrid}>
                      <Image source={menu_3.icon} style={styles1.styleImageGrid}></Image>
                      <Text style={styles1.styleTextGrid}>{t(this.I18N_name(menu_3.router))}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: -sizeGrid / 2 }}>
              <View style={styles1.styleGrid}>
                <View style={styles1.styleSubGrid}>
                  <TouchableOpacity onPress={() => { this.onPressButtonGrid(menu_4.router) }}>
                    <View style={styles1.styleContentGrid}>
                      <Image source={menu_4.icon} style={styles1.styleImageGrid}></Image>
                      <Text style={styles1.styleTextGrid}>{t(this.I18N_name(menu_4.router))}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles1.styleGrid}>
                <View style={styles1.styleSubGrid}>
                  <TouchableOpacity onPress={() => { this.onPressButtonGrid(menu_5.router) }}>
                    <View style={styles1.styleContentGrid}>
                      <Image source={menu_5.icon} style={styles1.styleImageGrid}></Image>
                      <Text style={styles1.styleTextGrid}>{t(this.I18N_name(menu_5.router))}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: -sizeGrid / 2 }}>
              <View style={styles1.styleGrid}>
                <View style={styles1.styleSubGrid}>
                  <TouchableOpacity onPress={() => { this.onPressButtonGrid(menu_6.router) }}>
                    <View style={styles1.styleContentGrid}>
                      <Image source={menu_6.icon} style={styles1.styleImageGrid}></Image>
                      <Text style={styles1.styleTextGrid}>{t(this.I18N_name(menu_6.router))}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles1.styleGrid}>
                <View style={styles1.styleSubGrid}>
                  <TouchableOpacity onPress={() => { this.onPressButtonGrid(menu_7.router) }}>
                    <View style={styles1.styleContentGrid}>
                      <Image source={menu_7.icon} style={styles1.styleImageGrid}></Image>
                      <Text style={styles1.styleTextGrid}>{t(this.I18N_name(menu_7.router))}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles1.styleGrid}>
                <View style={styles1.styleSubGrid}>
                  <TouchableOpacity onPress={() => { this.onPressButtonGrid(menu_8.router) }}>
                    <View style={styles1.styleContentGrid}>
                      <Image source={menu_8.icon} style={styles1.styleImageGrid}></Image>
                      <Text style={styles1.styleTextGrid}>{t(this.I18N_name(menu_8.router))}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>

        <FooterCustom ref="footerCustom" onPressTab={this.onPressTab.bind(this)} tabIndex={1}></FooterCustom>
      </Container>
    );
  }
}

export default translate(['home'], { wait: true })(Home);