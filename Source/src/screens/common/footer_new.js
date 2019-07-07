import React, { Component } from "react";
import { Image, Platform } from "react-native";
import {
  Container, Header, Title, Content,
  Button, Footer, FooterTab, Text,
  Body, Left, Right, Icon
} from "native-base";

import { translate } from 'react-i18next';
import i18n from 'i18next';

import styles from "./styles";

class FooterCustom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab1: false,
      tab2: false,
      tab3: false,
      tab4: false,
      tab5: false,
      source1: require("../../../assets/Icon/Footer/TrangChu.png"),
      source2: require("../../../assets/Icon/Footer/Tour.png"),
      source3: require("../../../assets/Icon/Footer/LichTrinh.png"),
      source4: require("../../../assets/Icon/Footer/LichSu.png"),
      source5: require("../../../assets/Icon/Footer/Information.png"),
    };
  }
  toggleTab(index) {
    // this.setState({
    //   tab1: false,
    //   tab2: false,
    //   tab3: false,
    //   tab4: false,
    //   tab5: false,
    //   source1: require("../../../assets/Icon/Footer/TrangChu.png"),
    //   source2: require("../../../assets/Icon/Footer/Tour.png"),
    //   source3: require("../../../assets/Icon/Footer/LichTrinh.png"),
    //   source4: require("../../../assets/Icon/Footer/LichSu.png"),
    //   source5: require("../../../assets/Icon/Footer/Information.png"),
    // });

    this.props.onPressTab(index);
  }
  componentDidMount() {
    if (this.props.tabIndex) {
      switch (this.props.tabIndex) {
        case 1:
          this.setState({
            tab1: true,
            source1: require("../../../assets/Icon/Footer/TrangChuSelect.png")
          });
          break;
        case 2:
          this.setState({
            tab2: true,
            source2: require("../../../assets/Icon/Footer/TourSelect.png")
          });
          break;
        case 3:
          this.setState({
            tab3: true,
            source3: require("../../../assets/Icon/Footer/LichTrinhSelect.png")
          });
          break;
        case 4:
          this.setState({
            tab4: true,
            source4: require("../../../assets/Icon/Footer/LichSuSelect.png")
          });
          break;
        case 5:
          this.setState({
            tab5: true,
            source5: require("../../../assets/Icon/Footer/InformationSelect.png")
          });
          break;
      }
      this.toggleTab(this.props.tabIndex);
    }
  }
  render() {
    const { t, i18n } = this.props;
    return (
      <Footer style={styles.footer}>
        <FooterTab style={styles.footerContainer}>
          <Button active={this.state.tab1} onPress={() => this.toggleTab(1)}>
            <Image source={this.state.source1} style={{ flex: 1, width: 30, height: 30 }}></Image>
            <Text numberOfLines={1} uppercase={false} style={styles.textButton}>{t('home:title')}</Text>
          </Button>
          <Button active={this.state.tab2} onPress={() => this.toggleTab(2)}>
            <Image source={this.state.source2} style={{ flex: 1, width: 30, height: 30 }}></Image>
            <Text numberOfLines={1} uppercase={false} style={styles.textButton}>{t('tours:title')}</Text>
          </Button>
          <Button active={this.state.tab3} onPress={() => this.toggleTab(3)}>
            <Image source={this.state.source3} style={{ flex: 1, width: 30, height: 30 }}></Image>
            <Text numberOfLines={1} uppercase={false} style={styles.textButton}>{t('tours:schedule')}</Text>
          </Button>
          <Button active={this.state.tab4} onPress={() => this.toggleTab(4)}>
            <Image source={this.state.source4} style={{ flex: 1, width: 30, height: 30 }}></Image>
            <Text numberOfLines={1} uppercase={false} style={styles.textButton}>{t('home:historyBooking')}</Text>
          </Button>
          <Button active={this.state.tab5} onPress={() => this.toggleTab(5)}>
            <Image source={this.state.source5} style={{ flex: 1, width: 30, height: 30 }}></Image>
            <Text numberOfLines={1} uppercase={false} style={styles.textButton}>{t('home:menu7_1')}</Text>
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}

export default translate(['FooterCustom'], { wait: true })(FooterCustom);
