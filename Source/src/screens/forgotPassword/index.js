import React, {Component} from 'react';
import styles from "./styles";
import { translate } from 'react-i18next';
import i18n from 'i18next';
import {
    TextInput,
    View,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    AsyncStorage,
    ImageBackground,
    Alert,
    Platform
} from 'react-native';
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Text,
    Body,
    Left,
    Right,
    Icon,
} from "native-base";
import { Toolbar } from 'react-native-material-ui';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Grid, Row, Col } from "react-native-easy-grid";
import Spinner from 'react-native-loading-spinner-overlay';
import DienBienAPI from '../../api/index';
const userIcon = require('./../../../assets/login/ic_user.png');
const imgLogo = require('./../../../assets/login/logo.png');
const iconEmail = require('./../../../assets/login/mail-icon.png');
const APIUrl = '/wp-json/v2/user-resetpassword';

class forgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
          userName: '',
          email: '',
          loading_visible: false,
        };
    }

    getFullURL(url) {
      return DienBienAPI.getServerURL() + url;
    }
    _onPressSend (event) {
        event.preventDefault();
        const { t, i18n } = this.props;
        if (this.state.loading_visible) {
            return;
        }
        this.setState({loading_visible: true,});
        if (this.state.email =='') {
            this.setState({loading_visible: false,});
            Alert.alert(t('message:title'), t('forgotPassword:input_error'),[{text: t('message:text_ok')}],{ cancelable: false });
        } else {
            // var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            // if (!this.state.email.match(re)) {
            //     Alert.alert(t('message:title'), t('forgotPassword:error_email'),[{text: t('message:text_ok')}],{ cancelable: false });
            //     this.setState({loading_visible: false});
            //     return;
            // }
            this.getUserForgotAPI();
        }
    }
    async getUserForgotAPI() {
        let url = this.getFullURL(APIUrl);
        const { t, i18n } = this.props;
        try {
            let response = await DienBienAPI.fetch_timeout(
                url,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: this.state.email,
                    })
                }
            );
            let responseJSON = await response.json();
            this.validateForgotPassword(responseJSON);
        } catch (error) {
            //if (error.status == 408) {
                this.setState({loading_visible: false});
                if (Platform.OS === 'ios'){
                    setTimeout(() => {
                      Alert.alert(t('message:title'), t('message:message11'),[{text: t('message:text_ok')}],{ cancelable: false });
                    }, 500);
                  }else{
                    Alert.alert(t('message:title'), t('message:message11'),[{text: t('message:text_ok')}],{ cancelable: false });
                  }
            //}
        }
    }
    validateForgotPassword(responseJSON) {
        const { t, i18n } = this.props;
        this.setState({loading_visible: false});
        if (responseJSON.code == 200) {
            setTimeout(() => {
                Alert.alert(
                    t('message:title'), 
                    t('forgotPassword:forgotPassword_successful'),
                    [
                        {text: t('message:text_ok'), onPress: () => this.props.navigation.navigate('login')},
                    ],{ cancelable: false }
                );
            }, 500);
        } else {
            setTimeout(() => {
                Alert.alert(t('message:title'), t('forgotPassword:message_error'),[{text: t('message:text_ok')}],{ cancelable: false });
            }, 500);
        }
    }
    goToBackScreen = () => {
        this.props.navigation.navigate('login');
    };
    render() {
        const { t, i18n } = this.props;
        return (
            <Container style={[styles.container]}>
                <Spinner visible={this.state.loading_visible} textContent={t('forgotPassword:text_loading')} textStyle={{color: '#FFF'}} />
                <Toolbar
                    leftElement={
                        <Button transparent onPress={this.goToBackScreen.bind(this)}>
                            <Icon style={{color:"#fff"}} name="md-arrow-back" />
                        </Button>
                    }
                    centerElement={t('forgotPassword:title', { lng: i18n.language })}
                    style={{container: [{ 
                            backgroundColor: '#00a680',
                            elevation:0,
                            borderBottomColor: '#2bb594',
                            borderBottomWidth: 1,
                        },Platform.OS === 'ios' ? {height:"10%", paddingTop:25} : {}],
                    }}
                />
                <Content>
                    <View size={3}>
                        <Left style={{flex:1}}></Left>
                        <Body style={[{flex:3, width:'60%'}]}>
                            <Image style={styles.logo} source={imgLogo} resizeMode="contain"/>
                        </Body>
                        <Right style={{flex:1}}></Right>
                    </View>
                    <View style={[{width:'100%', paddingBottom:20},styles.center]}>
                        <View style={{width:'100%', padding:20, maxWidth: 500}}>
                            <Text style={{color:'#fff', fontStyle:'italic'}}>{t('forgotPassword:detail')}</Text>
                        </View>
                    </View>
                    
                    <View style={[styles.center]}>
                        <View size={1} style={[styles.rowLogin, styles.maxWidth_500, styles.inputWrap, styles.borderColor]}>
                            <View style={[styles.iconWrap, styles.center, styles.borderColor]}>
                                <Image source={iconEmail} resizeMode="contain" style={styles.icon}/>
                            </View>
                            <TextInput style={[styles.input, styles.borderColor]} placeholderTextColor='#ffffff90' returnKeyType="done"
                            placeholder={t('forgotPassword:email_placeholder')}
                            onEndEditing={(e) => this.setState({email: e.nativeEvent.text.replace(/^\s+|\s+$/g, "")})}
                            onChange={(e) => this.setState({email: e.nativeEvent.text})}
                            underlineColorAndroid="transparent" value={this.state.email}/>
                        </View>
                    </View>

                    <View style={{height:150}}>
                        <Left style={{flex:1}}/>
                        <Body style={[{flex:5, width:200}, styles.colButton]}>
                            <Button style={styles.buttonLogin} rounded warning onPress={this._onPressSend.bind(this)}>
                                <Text uppercase={false} style={[styles.buttonText]}>{t('forgotPassword:btn_send')}</Text>
                            </Button>
                        </Body>
                        <Right style={{flex:1}}/>
                    </View>

                    
                </Content>
            </Container>
        );
    }
}

export default translate(['forgotPassword'], { wait: true })(forgotPassword);