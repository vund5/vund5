import React, { Component } from "react";
import { StyleSheet, View, Modal, Keyboard, TextInput, YellowBox, AsyncStorage, Dimensions, TouchableOpacity, Alert, Platform, KeyboardAvoidingView } from "react-native";
import { Container, Text, Button, Item, Right } from "native-base";
import { Icon, Rating } from 'react-native-elements';

import { translate } from 'react-i18next';
import i18n from 'i18next'
import DienBienAPI from '../../api/index';

const rate_comment = require("../../../assets/icon_" + 4.5 + "_star.png");
const SCREEN_WIDTH = Dimensions.get("window").width;

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const APIUrl = '/wp-json/wp/v2/comments';

class ModalComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDisabled: true,
      textComment: '',
      isActiveComment: true
    };
  }

  getFullURL(url) {
    return DienBienAPI.getServerURL() + url;
  }
  onCancel() {
    this.props.onCancel();
  }
  onReload() {
    this.props.onReload();
  }
  componentDidMount() {
    AsyncStorage.getItem('user', (err, user) => {
      if (user !== null) {
        var _user = JSON.parse(user);
        // _user.email
        // _user.name
        // _user.username
        // _user.tokenId
        this.setState({ token: _user.tokenId });
      }
    }).done();
  }
  async postDatasFromAPI() {
    const { t, i18n } = this.props;
    if (!this.state.isActiveComment)
      return;
    this.setState({ isActiveComment: false, isDisabled: true });
    Keyboard.dismiss();
    let url = this.getFullURL(APIUrl);
    if (this.state.token == null) {
      Alert.alert(t('message:title'), t('message:message7'), [{ text: t('message:text_ok') }], { cancelable: false });
      // this.props.navigation.navigate('login'); 
      return;
    }
    try {
      const response = await DienBienAPI.fetch_timeout(
        url,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.state.token
          },
          body: JSON.stringify({
            content: this.state.textComment.replace(/^\s+|\s+$/g, ""),
            post: this.props.idPost,
          }),
        }
      );
      let responseJson = await response.json();
      if (!!responseJson && !!responseJson.id && !!responseJson.status && responseJson.status == 'hold') {
        Alert.alert(t('message:title'), t('message:message4'), [{ text: t('message:text_ok') }], { cancelable: false });
      } else if (!!responseJson && !!responseJson.id && !!responseJson.status && responseJson.status == 'approved') {
        this.onReload();
      } else if (!!responseJson && !!responseJson.message && responseJson.message.length > 0) {
        Alert.alert(t('message:title'), responseJson.message, [{ text: t('message:text_ok') }], { cancelable: false });
      } else {
        Alert.alert(t('message:title'), t('message:message4'), [{ text: t('message:text_ok') }], { cancelable: false });
      }
      this.setState({ textComment: '', isDisabled: true, isActiveComment: true });
      // this.props.onCancel();
    }
    catch (error) {
      this.setState({ textComment: '', isDisabled: true, isActiveComment: true });
      if (Platform.OS === 'ios'){
        setTimeout(() => {
          Alert.alert(t('message:title'), t('message:message11'),[{text: t('message:text_ok')}],{ cancelable: false });
        }, 500);
      }else{
        Alert.alert(t('message:title'), t('message:message11'),[{text: t('message:text_ok')}],{ cancelable: false });
      }
    }
  }
  onChangeTextComment(text) {
    if (!this.state.isActiveComment)
      return;
    this.setState({ textComment: text });
    if (text.length > 0) {
      this.setState({ isDisabled: false });
    } else {
      this.setState({ isDisabled: true });
    }
  }
  ratingCompleted(rating) {
    console.log("Rating is: " + rating)
  }
  render() {
    const { t, i18n } = this.props;
    if (!this.props.visibleComment || this.state.token == null) {
      return (
        // null
        <View style={{ height: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
          <Text note>{t('message:message5')}</Text>
        </View>
      )
    } else {
      if (Platform.OS === 'ios') {
        return (
          <KeyboardAvoidingView behavior="padding" onCancel={this.onCancel.bind(this)} style={{ flexDirection: "column", backgroundColor: '#ffffff', }} enabled>
            {this.props.rating &&
              <View style={{ flexDirection: "row", height: 36, padding: 3 }}>
                <Rating
                  type="star"
                  fractions={1}
                  startingValue={3}
                  imageSize={20}
                  onFinishRating={this.ratingCompleted}
                  style={{ paddingVertical: 5 }}
                />
              </View>
            }
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.textAreaContainer} >
                <TextInput
                  returnKeyType="done"
                  style={styles.textArea}
                  underlineColorAndroid="transparent"
                  placeholder={t('message:message8')}
                  placeholderTextColor="grey"
                  multiline={true}
                  maxLength={500}
                  value={this.state.textComment}
                  onChangeText={(text) => this.onChangeTextComment(text)}
                  onEndEditing={(e) => this.onChangeTextComment(e.nativeEvent.text.replace(/^\s+|\s+$/g, ""))}
                />
              </View>
              <Right style={{ justifyContent: 'center', alignItems: 'center', height: 36 }}>
                <TouchableOpacity transparent style={{}}
                  disabled={this.state.isDisabled}
                  onPress={this.postDatasFromAPI.bind(this)}>
                  <Text uppercase={false} style={{ color: this.state.isDisabled ? '#ccc' : '#009a74' }} numberOfLines={1}>{t('TextButton:text2')}</Text>
                </TouchableOpacity>
              </Right>
            </View>
          </KeyboardAvoidingView>
        );
      } else {
        return (
          <View onCancel={this.onCancel.bind(this)} style={{ flexDirection: "column", backgroundColor: '#ffffff', }}>
            {this.props.rating &&
              <View style={{ flexDirection: "row", height: 36, padding: 3 }}>
                <Rating
                  type="star"
                  fractions={1}
                  startingValue={3}
                  imageSize={20}
                  onFinishRating={this.ratingCompleted}
                  style={{ paddingVertical: 5 }}
                />
              </View>
            }
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.textAreaContainer} >
                <TextInput
                  returnKeyType="done"
                  style={styles.textArea}
                  underlineColorAndroid="transparent"
                  placeholder={t('message:message8')}
                  placeholderTextColor="grey"
                  multiline={true}
                  maxLength={500}
                  value={this.state.textComment}
                  onChangeText={(text) => this.onChangeTextComment(text)}
                  onEndEditing={(e) => this.onChangeTextComment(e.nativeEvent.text.replace(/^\s+|\s+$/g, ""))}
                />
              </View>
              <Right style={{ justifyContent: 'center', alignItems: 'center', height: 36 }}>
                <TouchableOpacity transparent style={{}}
                  disabled={this.state.isDisabled}
                  onPress={this.postDatasFromAPI.bind(this)}>
                  <Text uppercase={false} style={{ color: this.state.isDisabled ? '#ccc' : '#009a74' }} numberOfLines={1}>{t('TextButton:text2')}</Text>
                </TouchableOpacity>
              </Right>
            </View>
          </View>
        );
      }
    }
  }
}

export default translate(['ModalComment'], { wait: true })(ModalComment);

const styles = StyleSheet.create({
  name: {
    fontSize: 15,
    color: "#232323",
  },
  image: {
    height: 15,
    width: 75
  },
  textAreaContainer: {
    padding: 5,
    paddingRight: 0
  },
  textArea: {
    width: SCREEN_WIDTH - 60,
    borderWidth: 1,
    borderColor: '#d7d7d7',
    justifyContent: "flex-start",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 5,
    maxHeight: 75,
    minHeight: 30,
  }
});
