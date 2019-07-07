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

const lockIcon = require('./../../../assets/login/ic_lock_1.png');
const userIcon = require('./../../../assets/login/ic_user.png');
const imgLogo = require('./../../../assets/login/logo.png');
const iconEmail = require('./../../../assets/login/mail-icon.png');
const showPass = require('./../../../assets/login/show-password-1.png');
const ic_phone = require('./../../../assets/login/ic_phone.png');
const ic_firstname = require('./../../../assets/login/ic_firstname.png');
const APIUrl = '/wp-json/v2/user-register';

class register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            firstname: '',
            lastname: '',
            phone: '',
            userName: '',
            password: '',
            password_1: '',
            hidePassword: true,
            hidePassword_1: true,
            loading_visible: false,
        };
    }

    getFullURL(url) {
      return DienBienAPI.getServerURL() + url;
    }
    _onPressRegister (event) {
        event.preventDefault();
        const { t, i18n } = this.props;
        if (this.state.loading_visible) {
            return;
        }
        this.setState({loading_visible: true,});
        if (this.state.email ==''
            || this.state.firstname ==''
            || this.state.lastname ==''
            || this.state.userName ==''
            || this.state.password ==''
            || this.state.password_1 =='') {
                this.setState({loading_visible: false,});
                Alert.alert(t('message:title'), t('register:input_error'),[{text: t('message:text_ok')}],{ cancelable: false });
        } else {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!this.state.email.match(re)) {
                Alert.alert(t('message:title'), t('register:error_email'),[{text: t('message:text_ok')}],{ cancelable: false });
                this.setState({loading_visible: false});
                return;
            } else if (this.state.email.length < 9 || this.state.email.length > 100) {
                Alert.alert(t('message:title'), t('register:error_email1'),[{text: t('message:text_ok')}],{ cancelable: false });
                this.setState({loading_visible: false});
                return;
            }
            if (this.state.firstname.length > 200) {
                Alert.alert(t('message:title'), t('register:error_firstname'),[{text: t('message:text_ok')}],{ cancelable: false });
                this.setState({loading_visible: false});
                return;
            }
            if (this.state.lastname.length > 200) {
                Alert.alert(t('message:title'), t('register:error_lastname'),[{text: t('message:text_ok')}],{ cancelable: false });
                this.setState({loading_visible: false});
                return;
            }
            var reUserName = /([\w]+)/;
            if (!this.state.userName.match(reUserName) || this.state.userName.match(reUserName)[0] != this.state.userName) {
                Alert.alert(t('message:title'), t('register:error_userName2'),[{text: t('message:text_ok')}],{ cancelable: false });
                this.setState({loading_visible: false});
                return;
            }
            if (this.state.userName.length > 24) {
                Alert.alert(t('message:title'), t('register:error_userName'),[{text: t('message:text_ok')}],{ cancelable: false });
                this.setState({loading_visible: false});
                return;
            }
            if (this.state.userName.length < 3) {
                Alert.alert(t('message:title'), t('login:error_userName1'),[{text: t('message:text_ok')}],{ cancelable: false });
                this.setState({loading_visible: false});
                return;
            }
            if (this.state.password.length > 30) {
                Alert.alert(t('message:title'), t('register:error_password'),[{text: t('message:text_ok')}],{ cancelable: false });
                this.setState({loading_visible: false});
                return;
            }
            if (this.state.password.length < 8) {
                Alert.alert(t('message:title'), t('login:error_password1'),[{text: t('message:text_ok')}],{ cancelable: false });
                this.setState({loading_visible: false});
                return;
            }
            var rePass = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#\(\)])[A-Za-z\d@$!%*?&#\(\)]{8,30}$/;
            if (!this.state.password.match(rePass)) {
                Alert.alert(t('message:title'), t('register:error_password2'),[{text: t('message:text_ok')}],{ cancelable: false });
                this.setState({loading_visible: false});
                return;
            }
            if (this.state.password != this.state.password_1) {
                Alert.alert(t('message:title'), t('register:again_password_error'),[{text: t('message:text_ok')}],{ cancelable: false });
                this.setState({loading_visible: false});
            } else {
                this.getUserRegisterAPI();
            }
        }
    }
    async getUserRegisterAPI() {
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
                        username: this.state.userName,
                        email: this.state.email,
                        firstname: this.state.firstname,
                        lastname: this.state.lastname,
                        password: this.state.password,
                        re_password: this.state.password_1,
                    })
                }
            );
            let responseJSON = await response.json();
            this.validateRegister(responseJSON);
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
    validateRegister(responseJSON) {
        const { t, i18n } = this.props;
        this.setState({loading_visible: false});
        if (responseJSON.code == 200) {
            setTimeout(() => {
                Alert.alert(t('message:title'), 
                    t('register:register_successful'),
                    [
                        {text: t('message:text_ok'), onPress: () => this.props.navigation.navigate('login')},
                    ],{ cancelable: false }
                );
            }, 500);
        } else {
            setTimeout(() => {
                Alert.alert(t('message:title'), t('register:message_error'),[{text: t('message:text_ok')}],{ cancelable: false });
            }, 500);
        }
    }
    goToBackScreen = () => {
        this.props.navigation.navigate('login');
    };
    managePasswordVisibility = () => {
        this.setState({ hidePassword: !this.state.hidePassword });
    };
    managePasswordVisibility_1 = () => {
        this.setState({ hidePassword_1: !this.state.hidePassword_1 });
    };
    render() {
        var { navigate } = this.props.navigation;
        const { t, i18n } = this.props;
        return (
            <Container style={[styles.container]}>
                <Spinner visible={this.state.loading_visible} textContent={t('register:text_loading')} textStyle={{color: '#FFF'}} />
                <Toolbar
                    leftElement={
                        <Button transparent onPress={this.goToBackScreen.bind(this)}>
                            <Icon style={{color:"#fff"}} name="md-arrow-back" />
                        </Button>
                    }
                    centerElement={t('register:title', { lng: i18n.language })}
                    style={{container: [{ 
                            backgroundColor: '#00a680',
                            elevation:0,
                            borderBottomColor: '#2bb594',
                            borderBottomWidth: 1,
                        },Platform.OS === 'ios' ? {height:"10%", paddingTop:25} : {}],
                    }}
                />
                <Content scrollEnabled={true}>
                    <View size={3}>
                        <Left style={{flex:1}}></Left>
                        <Body style={[{flex:3, width:'60%'}]}>
                            <Image style={styles.logo} source={imgLogo} resizeMode="contain"/>
                        </Body>
                        <Right style={{flex:1}}></Right>
                    </View>
                    <View size={0.5}></View>
                    <View size={7.5} style={[styles.center]}>
                        <View size={1} style={[styles.rowRegister, styles.maxWidth_500, styles.inputWrap, styles.borderColor]}>
                            <View style={[styles.iconWrap, styles.center, styles.borderColor]}>
                                <Image source={iconEmail} resizeMode="contain" style={styles.icon}/>
                            </View>
                            <TextInput style={[styles.input, styles.borderColor]} maxLength = {100} placeholderTextColor='#ffffff90' returnKeyType="done"
                                placeholder={t('register:email_placeholder')}
                                onEndEditing={(e) => this.setState({email: e.nativeEvent.text.replace(/^\s+|\s+$/g, "")})}
                                onChange={(e) => this.setState({email: e.nativeEvent.text})}
                                underlineColorAndroid="transparent" value={this.state.email}/>
                        </View>
                        <View size={1} style={[styles.rowRegister, styles.maxWidth_500, styles.inputWrap, styles.borderColor]}>
                            <View style={[styles.iconWrap, styles.center, styles.borderColor]}>
                                <Image source={ic_firstname} resizeMode="contain" style={styles.icon}/>
                            </View>
                            <TextInput style={[styles.input_name, styles.borderColor]} maxLength = {200} placeholderTextColor='#ffffff90' returnKeyType="done"
                                placeholder={t('register:first_name_placeholder')}
                                onEndEditing={(e) => this.setState({firstname: e.nativeEvent.text.replace(/^\s+|\s+$/g, "")})}
                                onChange={(e) => this.setState({firstname: e.nativeEvent.text})}
                                underlineColorAndroid="transparent" value={this.state.firstname}/>
                            <TextInput style={[styles.input_name, styles.borderColor]} maxLength = {200} placeholderTextColor='#ffffff90' returnKeyType="done"
                                placeholder={t('register:last_name_placeholder')}
                                onEndEditing={(e) => this.setState({lastname: e.nativeEvent.text.replace(/^\s+|\s+$/g, "")})}
                                onChange={(e) => this.setState({lastname: e.nativeEvent.text})}
                                underlineColorAndroid="transparent" value={this.state.lastname}/>
                        </View>
                        {/* <View size={1} style={[styles.rowRegister, styles.maxWidth_500, styles.inputWrap, styles.borderColor]}>
                            <View style={[styles.iconWrap, styles.center, styles.borderColor]}>
                                <Image source={ic_phone} resizeMode="contain" style={styles.icon}/>
                            </View>
                            <TextInput style={[styles.input, styles.borderColor]} placeholder={t('register:phone_placeholder')}  onEndEditing={(e) =>
                            this.setState({phone: e.nativeEvent.text.replace(/^\s+|\s+$/g, "")})} underlineColorAndroid="transparent"/>
                        </View> */}
                        <View size={1} style={[styles.rowRegister, styles.maxWidth_500, styles.inputWrap, styles.borderColor]}>
                            <View style={[styles.iconWrap, styles.center, styles.borderColor]}>
                                <Image source={userIcon} resizeMode="contain" style={styles.icon}/>
                            </View>
                            <TextInput style={[styles.input, styles.borderColor]} maxLength = {24} placeholderTextColor='#ffffff90' returnKeyType="done"
                                placeholder={t('register:user_name_placeholder')}
                                onEndEditing={(e) => this.setState({userName: e.nativeEvent.text.replace(/^\s+|\s+$/g, "")})}
                                onChange={(e) => this.setState({userName: e.nativeEvent.text})}
                                underlineColorAndroid="transparent" value={this.state.userName}/>
                        </View>
                        <View size={1} style={[styles.rowRegister, styles.maxWidth_500, styles.inputWrap, styles.borderColor]}>
                            <View style={[styles.iconWrap, styles.center, styles.borderColor]}>
                                <Image source={lockIcon} resizeMode="contain" style={styles.icon}/>
                            </View>
                            <TextInput style={[styles.input,styles.borderColor]} maxLength = {30} placeholderTextColor='#ffffff90' returnKeyType="done"
                            placeholder={t('register:pass_placeholder')}
                                secureTextEntry={this.state.hidePassword}
                                onEndEditing={(e) => this.setState({password: e.nativeEvent.text.replace(/^\s+|\s+$/g, "")})}
                                onChange={(e) => this.setState({password: e.nativeEvent.text})}
                                underlineColorAndroid="transparent" value={this.state.password}/>
                            <View style={[styles.iconWrap_Pass, styles.center, styles.borderColor]}>
                                <TouchableOpacity activeOpacity = { 0.8 } onPress = { this.managePasswordVisibility }>
                                    <Image source={showPass} resizeMode="contain" style={styles.icon}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View size={1} style={[styles.rowRegister, styles.maxWidth_500, styles.inputWrap, styles.borderColor]}>
                            <View style={[styles.iconWrap, styles.center, styles.borderColor]}>
                                <Image source={lockIcon} resizeMode="contain" style={styles.icon}/>
                            </View>
                            <TextInput style={[styles.input,styles.borderColor]} maxLength = {30} placeholderTextColor='#ffffff90' returnKeyType="done"
                                placeholder={t('register:pass_again_placeholder')} secureTextEntry={this.state.hidePassword_1}
                                onEndEditing={(e) => this.setState({password_1: e.nativeEvent.text.replace(/^\s+|\s+$/g, "")})}
                                onChange={(e) => this.setState({password_1: e.nativeEvent.text})}
                                underlineColorAndroid="transparent"  value={this.state.password_1}/>
                            <View style={[styles.iconWrap_Pass, styles.center, styles.borderColor]}>
                                <TouchableOpacity activeOpacity = { 0.8 } onPress = { this.managePasswordVisibility_1 }>
                                    <Image source={showPass} resizeMode="contain" style={styles.icon}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{height:120}}>
                            <Left style={{flex:1}}/>
                            <Body style={[{flex:5, width:200}, styles.colButton]}>
                                <Button style={styles.buttonLogin} rounded warning onPress={this._onPressRegister.bind(this)}>
                                    <Text uppercase={false} style={[styles.buttonText]}>{t('register:btn_register')}</Text>
                                </Button>
                            </Body>
                            <Right style={{flex:1}}/>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default translate(['register'], { wait: true })(register);