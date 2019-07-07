import React, { Component } from "react";
import { AppRegistry, StyleSheet, Dimensions, View, WebView, Platform } from "react-native";
import { Container, Button, Text, Header, Title, Left, Right, Body } from "native-base";
import { Icon } from 'react-native-elements';
import { Toolbar, COLOR } from 'react-native-material-ui';
import DienBienAPI from '../../api/index';

import { translate } from 'react-i18next';
import i18n from 'i18next';


// const iconMaker = require("../../../assets/Icon/icon_map_maker.png");
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 21.391947;
const LONGITUDE = 103.015922;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class LocationDirections extends Component {
  constructor(props) {
    super(props);

    // AirBnB's Office, and Apple Park
    this.state = {
      coordinates: [],
      latitude: null,
      longitude: null,
      image: '',
      currentLatitude: null,
      currentLongitude: null,
      error: null,
      viettelMapLocationHtml: "[]",
    };

    this.mapView = null;
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        let output = [{
          "lat": position.coords.latitude,
          "lng": position.coords.longitude,
          "title": "My Location",
          "desID": "",
          "image": "http://viettelmaps.com.vn/documentation/web_examples/images/marker_point.png"
        }]
        let _coordinates = [...this.state.coordinates, ...output];
        this.setState({
          coordinates: _coordinates,
          viettelMapLocationHtml: JSON.stringify(_coordinates),
          currentLatitude: position.coords.latitude,
          currentLongitude: position.coords.longitude,
          error: null
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 },
    );

    const { state } = this.props.navigation;
    if (state.params && !!state.params.latitude && !isNaN(state.params.latitude)
      && !!state.params.longitude && !isNaN(state.params.longitude)) {
      let output = [{
        "lat": state.params.latitude,
        "lng": state.params.longitude,
        "title": "End Location",
        "desID": "",
        "image": state.params.image
      }]
      let _coordinates = [...this.state.coordinates, ...output];
      this.setState({
        coordinates: _coordinates,
        viettelMapLocationHtml: JSON.stringify(_coordinates),
        latitude: parseFloat(state.params.latitude),
        longitude: parseFloat(state.params.longitude),
      });
    } else {
      let output = [{
        "lat": LATITUDE,
        "lng": LONGITUDE,
        "title": "End Location",
        "desID": "",
        "image": "http://viettelmaps.com.vn/documentation/web_examples/images/marker_point.png"
      }]
      let _coordinates = [...this.state.coordinates, ...output];
      this.setState({
        coordinates: _coordinates,
        viettelMapLocationHtml: JSON.stringify(_coordinates),
        latitude: LATITUDE,
        longitude: LONGITUDE,
      });
    }
  }

  render() {
    let html = `
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <title>Lịch trình</title>
        <script type="text/javascript" src="` + DienBienAPI.getServerURL() + `/wp-includes/js/jquery/jquery.js?ver=1.12.4"></script>
        <script type="text/javascript" src="http://viettelmap.vn/VTMapService/VTMapAPI?api=VTMap&type=main&k=1594d3bd2036ab7fa221a3482d0e9ade&v=2.0"></script>
        <script type="text/javascript" src="` + DienBienAPI.getServerURL() + `/wp-content/themes/viettelGreen/js/vtmap_full.js?ver=2018"></script>
        <script type="text/javascript">
        var $ = jQuery;
        $( document ).ready(function() {
          var points = {
            "valArray": ` + this.state.viettelMapLocationHtml + `};
          ViettelMap._listMarker = points;
          ViettelMap.loadMapImageDisplay("tour1_map", 21.401981, 103.0167774, 9);
          ViettelMap.addPlanDayDetail();         
        });
          </script>
      </head>
      <body style="margin:0px; padding: 0px">
      <div id="tour1_map" style="width: 100%; height:100%;"></div>   
      </body>
    </html>
    `;
    const { t, i18n } = this.props;
    return (
      <Container style={{ flex: 1 }}>
        <Toolbar
          leftElement={
            <Button
              transparent
              onPress={() => this.props.navigation.goBack()} >
              <Icon name="md-arrow-back" type="ionicon" color='#fff' />
            </Button>
          }
          centerElement={t('home:title_map')}
          style={{
            container: [{ backgroundColor: '#009a74' },Platform.OS === 'ios' ? {height:"10%", paddingTop:25} : {}],
          }}
        />

        <View style={styles.containerMap}>
          <WebView
            source={{ html, baseUrl: 'web/' }}
            style={{ flex: 1, height: null, width: width }}
            mixedContentMode='always'
          />

          {/* <Text> {this.state.currentLatitude} </Text>
          <Text> {this.state.currentLongitude} </Text>
          <Text> {this.state.latitude} </Text>
          <Text> {this.state.longitude} </Text>
          <Text> {this.state.error} </Text> */}
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
  containerMap: {
    flex: 1,
    // position: 'absolute',
    // top: 60,
    // left: 0,
    // right: 0,
    // bottom: 0,
    // height: height,
    // marginTop: 60,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  header: {
    backgroundColor: "#009a74"
  },
});

export default translate(['LocationDirections'], { wait: true })(LocationDirections);