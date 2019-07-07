import React, { Component } from "react";
import { Text } from "native-base";
import { View, Image, Dimensions, Platform } from "react-native";
import Swiper from 'react-native-swiper';

const titleHeaderBg = require("../../../assets/bg_title_header.png");

const { width } = Dimensions.get('window')
const stylesSwiper = {
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  view: {
    backgroundColor: '#989a9c73', 
    bottom: 3, 
    width: '100%',
    position: 'absolute'
  },
  text: {
    fontSize: 14,
    marginLeft: 5,
    color: "#005068",
  },
  image: {
    width,
    flex: 1,
    backgroundColor: 'transparent'
  }
}
const styles = {
  linear_gradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
};
class SlideshowTest extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render () {
    return (
      <View style={{height: 200 }}>
        <Swiper autoplay horizontal={true}
          // onMomentumScrollEnd={(e, state, context) => console.log('index:', state.index)}
          dot={<View style={{backgroundColor: 'rgba(0,0,0,.2)', width: 6, height: 6, borderRadius: 4, marginLeft: 3, marginRight: 5, marginTop: 3, marginBottom: 3}} />}
          activeDot={<View style={{backgroundColor: '#007aff', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 5, marginTop: 3, marginBottom: 3}} />}
          paginationStyle={{
            bottom: 5, left: null, right: 3, 
          }} loop >
            {this.props.datas.map((data, key) => {
              return (
                <View style={stylesSwiper.slide} key={key}>
                  <Image resizeMode='stretch' style={stylesSwiper.image} source={data.img} />
                  <View style={stylesSwiper.view}>
                    <View style={{ flex: 1, position: 'absolute', bottom: 0, padding: 5, height: 75, justifyContent: 'flex-end' }}>
                      <Text style={{color: "#fff", fontSize: 18}} numberOfLines={1}>{data.name}</Text>
                      <View style={{ flexDirection: "row" }}>
                        <Image source={data.rate} style={{height: 18, width: 90}}/>
                        <Text note style={{color: "#fff"}}>  { data.comments } đánh giá</Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
        </Swiper>
        <Image source ={titleHeaderBg} style={{ flex: 1, position: 'absolute', bottom: 0, resizeMode: 'stretch', height: 60, marginBottom: -3, opacity: 0.8 }}/>
        </View>
    )
  }
}

export default SlideshowTest;
