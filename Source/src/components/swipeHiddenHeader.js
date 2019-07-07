import React, { Component } from 'react';
import { Animated, Text, View, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const HEADER_HEIGHT = 56;
const BOX_SIZE = (Dimensions.get('window').width / 2) - 12;
const PHOTOS = Array.from({ length: 24 }).map((_, i) => `https://unsplash.it/300/300/?random&__id${i}`);

export default class SwipeHiddenHeader extends Component {
  state = {
    scrollAnim: new Animated.Value(0),
    offsetAnim: new Animated.Value(0),
  };
  
  componentDidMount() {
    this.state.scrollAnim.addListener(this._handleScroll);
  }

  componentWillUnmount() {
    this.state.scrollAnim.removeListener(this._handleScroll);
  }
  
  _handleScroll = ({ value }) => {
    this._previousScrollvalue = this._currentScrollValue;
    this._currentScrollValue = value;
  };
  
  _handleScrollEndDrag = () => {
    this._scrollEndTimer = setTimeout(this._handleMomentumScrollEnd, 0);
  };

  _handleMomentumScrollBegin = () => {
    clearTimeout(this._scrollEndTimer);
  };
  
  _handleMomentumScrollEnd = () => {
    const previous = this._previousScrollvalue;
    const current = this._currentScrollValue;
    
    if (previous > current || current < HEADER_HEIGHT) {
      // User scrolled down or scroll amount was too less, lets snap back our header
      Animated.spring(this.state.offsetAnim, {
        toValue: -current,
        tension: 300,
        friction: 35,
      }).start();
    } else {
      Animated.timing(this.state.offsetAnim, {
        toValue: 0,
        duration: 300,
      }).start();
    }
  };
  
  onScroll = (e)=>{
    const offsetY = e.nativeEvent.contentOffset.y;
    this.state.scrollAnim();
  }

  render() {
    const { scrollAnim, offsetAnim } = this.state;
    
    const translateY = Animated.add(scrollAnim, offsetAnim).interpolate({
      inputRange: [0, HEADER_HEIGHT],
      outputRange: [0, -HEADER_HEIGHT],
      extrapolate: 'clamp'
    });
    
    return (
      <View style={ [styles.container, this.props.styles ? this.props.styles : {}] }>
        <AnimatedScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gallery}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [ { nativeEvent: { contentOffset: { y: this.state.scrollAnim } } } ],
          )}
          onMomentumScrollBegin={this._handleMomentumScrollBegin}
          onMomentumScrollEnd={this._handleMomentumScrollEnd}
          onScrollEndDrag={this._handleScrollEndDrag}
        >
          {this.props.renderScrollComponent()}
        </AnimatedScrollView>
        <Animated.View style={[styles.header, { transform: [{translateY}] }]}>
          {this.props.renderHeader()}
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // padding: 4,
    paddingTop: HEADER_HEIGHT,
  },
  photo: {
    height: BOX_SIZE,
    width: BOX_SIZE,
    resizeMode: 'cover',
    margin: 4,
  },
  header: {
    height: HEADER_HEIGHT,
    paddingTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 16,
  },
});
