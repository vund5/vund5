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
    Platform,
    KeyboardAvoidingView
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
import DienBienAPI from '../../api/index';
import { Toolbar } from 'react-native-material-ui';
import Spinner from 'react-native-loading-spinner-overlay';
import IconZ from 'react-native-vector-icons/Zocial';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Grid, Row, Col } from "react-native-easy-grid";
import { connect } from 'react-redux';
import { login } from './../../../redux/actions/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin, GoogleSigninButton, statusCodes, User } from 'react-native-google-signin';

const lockIcon = require('./../../../assets/login/ic_lock_1.png');
const userIcon = require('./../../../assets/login/ic_user.png');
const imgLogo = require('./../../../assets/login/logo.png');
const iconFB = require('./../../../assets/login/icon-fb.png');
const showPass = require('./../../../assets/login/show-password-1.png');
const APIUrl = '/wp-json/jwt-auth/v1/token';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: '',
            hidePassword: true,
            loading_visible: false,
        };
    }

    getFullURL(url) {
      return DienBienAPI.getServerURL() + url;
    }
    async componentDidMount() {
        this._configureGoogleSignIn();
        //LoginManager.logOut();
        
    }
    saveData = (user) => {
        AsyncStorage.setItem("user", JSON.stringify(user));
    }
    userLogin (e) {
        e.preventDefault();
        const { t, i18n } = this.props;
        if (this.state.loading_visible) {
            return;
        }
        this.setState({loading_visible: true,});
        if (this.state.userName ==''
            || this.state.password =='') {
            this.setState({loading_visible: false,});
            Alert.alert(t('message:title'), t('login:input_error'),[{text: t('message:text_ok')}],{ cancelable: false });
        } else {
            if (this.state.userName.length > 24) {
                Alert.alert(t('message:title'), t('login:error_userName'),[{text: t('message:text_ok')}],{ cancelable: false });
                this.setState({loading_visible: false});
                return;
            }
            if (this.state.userName.length < 3) {
                Alert.alert(t('message:title'), t('login:error_userName1'),[{text: t('message:text_ok')}],{ cancelable: false });
                this.setState({loading_visible: false});
                return;
            }
            if (this.state.password.length > 30) {
                Alert.alert(t('message:title'), t('login:error_password'),[{text: t('message:text_ok')}],{ cancelable: false });
                this.setState({loading_visible: false});
                return;
            }
            if (this.state.password.length < 8) {
                Alert.alert(t('message:title'), t('login:error_password1'),[{text: t('message:text_ok')}],{ cancelable: false });
                this.setState({loading_visible: false});
                return;
            }
            this.getUserLoginAPI();
        }
        
    }
    async getUserLoginAPI() {
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
                        password: this.state.password,
                    })
                }
            );
            let userInf = await response.json();
            this.validateLogin(userInf);
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
    validateLogin(userInf) {
        const { t, i18n } = this.props;
        this.setState({loading_visible: false});
        if (userInf.token !== undefined) {
            var user = {
                email: userInf.user_email,
                // name: userInf.user_display_name,
                name: userInf.first_name + ' ' + userInf.last_name,
                firstname: userInf.first_name,
                lastname: userInf.last_name,
                birthday: '03/11/1993',
                username: userInf.user_username,
                phone: userInf.phone_number,
                sex: '',
                tokenId: userInf.token,
                password: this.state.password
            }
            this.props.onLogin(user);
            this.saveData(user);
            this.props.navigation.navigate('Home');
        } else {
            const { t, i18n } = this.props;
            Alert.alert(t('message:title'), t('login:message_error'),[{text: t('message:text_ok')}],{ cancelable: false });
        }
    }
    async _onPressLoginFB () {
        var self = this;
        const { t, i18n } = this.props;
        LoginManager.logOut();
        if(Platform.OS === 'ios'){
            LoginManager.setLoginBehavior('system_account');
        }else{
            LoginManager.setLoginBehavior('native_with_fallback');
        }
        LoginManager.logInWithReadPermissions(["public_profile", "email"]).then(
            function(result) {
              if (result.isCancelled) {
                console.log("Login cancelled");
                //Alert.alert(t('message:title'), t('login:message_login2'));
              } else {
                AccessToken.getCurrentAccessToken().then((data) => {
                    const { accessToken } = data
                    self.initFBUser(accessToken)
                });
              }
            },
            function(error) {
                console.log(error)
                // Alert.alert(t('message:title'), JSON.stringify(error));
                //console.log("Login fail with error: " + error);
            }
        );
    }

    initFBUser(token) {
        var self = this;
        const { t, i18n } = this.props;
        fetch('https://graph.facebook.com/v2.5/me?fields=email,first_name,last_name&access_token=' + token)
        .then((response) => response.json())
        .then((json) => {
            if(json){
                console.log(json);
                DienBienAPI.getAccountTokenSocial(json.id, json.email, json.first_name, json.last_name, "1", token).then((data) => {
                    console.log(data);
                    if(data.message){
                        if(data.code == 406){
                            Alert.alert(t('message:title'), t('login:message_login1'),[{text: t('message:text_ok')}],{ cancelable: false });
                        }else{
                            Alert.alert(t('message:title'), t('login:message_login2'),[{text: t('message:text_ok')}],{ cancelable: false });
                        }
                    }else{
                        self.validateLogin(data);
                    }
                })
            }else{
                Alert.alert(t('message:title'), t('login:message_login2'),[{text: t('message:text_ok')}],{ cancelable: false });
            }
        })
        .catch(() => {
          reject('ERROR GETTING DATA FROM FACEBOOK');
          Alert.alert(t('message:title'), t('login:message_login2'),[{text: t('message:text_ok')}],{ cancelable: false });
        })
    }

    _onPressLoginGmail = async () => {
        const { t, i18n } = this.props;
        try {
            var self = this;
            await this._signOutGmail();
            await GoogleSignin.hasPlayServices();
            console.log("call _getCurrentUser");
            const userInfo = await GoogleSignin.signIn();
            console.log(userInfo);
            console.log("call _getCurrentUser");
            //alert("Đã đăng nhập thành công account gmail " + userInfo.user.email);
            if(userInfo){
                console.log(userInfo);
                console.log(userInfo.user.id)
                console.log(userInfo.user.email)
                console.log(userInfo.user.givenName)
                console.log(userInfo.user.familyName)
                console.log(userInfo.accessToken)
                DienBienAPI.getAccountTokenSocial(userInfo.user.id, userInfo.user.email, userInfo.user.givenName, userInfo.user.familyName, "2", userInfo.accessToken).then((data) => {
                    console.log(data);
                    //self.validateLogin(data);
                    if(data.message){
                        if(data.code == 406){
                            Alert.alert(t('message:title'), t('login:message_login1'),[{text: t('message:text_ok')}],{ cancelable: false });
                        }else{
                            Alert.alert(t('message:title'), t('login:message_login2'),[{text: t('message:text_ok')}],{ cancelable: false });
                        }
                    }else{
                        self.validateLogin(data);
                    }
                });
            }else{
                Alert.alert(t('message:title'), t('login:message_login2'),[{text: t('message:text_ok')}],{ cancelable: false });
            }
            //await this._getCurrentUser();
            //this.setState({ userInfo, error: null });
        } catch (error) {
            console.log(error)
            // Alert.alert(t('message:title'), t('login:message_login2'));
            // Alert.alert(t('message:title'), JSON.stringify(error));
        }
      };

    _configureGoogleSignIn() {
        if(Platform.OS === 'ios'){
            GoogleSignin.configure({
                iosClientId: "735518065525-n6bnjskr3mig32l07clcomjssk64edp7.apps.googleusercontent.com",
                webClientId: "735518065525-jcfuq7shc4su7693umm0fnlabtfscb0u.apps.googleusercontent.com",
                offlineAccess: false,
            });
        }else{
            GoogleSignin.configure({
                webClientId: "735518065525-jcfuq7shc4su7693umm0fnlabtfscb0u.apps.googleusercontent.com",
                offlineAccess: false,
            });
        }
    }

    async _getCurrentUser() {
        try {
            const userInfo = await GoogleSignin.signInSilently();
            //alert("Đã đăng nhập thành công account gmail " + userInfo.email);
            //this.setState({ userInfo, error: null });
        } catch (error) {
            const errorMessage =
            error.code === statusCodes.SIGN_IN_REQUIRED ? 'Please sign in :)' : error.message;
            console.log(errorMessage);
            // this.setState({
            //     error: new Error(errorMessage),
            // });
        }
    }
    

    _signOutGmail = async () => {
        try {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
    
          //this.setState({ userInfo: null, error: null });
        } catch (error) {
        //   this.setState({
        //     error,
        //   });
        }
      };

    goToBackScreen = () => {
        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = {};
        }
        this.props.navigation.navigate('Home');
    };
    managePasswordVisibility = () => {
        this.setState({ hidePassword: !this.state.hidePassword });
    };
    render() {
        var { navigate } = this.props.navigation;
        const { t, i18n } = this.props;
        return (
            <KeyboardAwareScrollView>
                <Spinner visible={this.state.loading_visible} textContent={t('login:text_loading')} textStyle={{color: '#FFF'}} />
                <Container style={[styles.container]}>
                    <Toolbar
                        leftElement={
                            <Button transparent onPress={this.goToBackScreen.bind(this)}>
                                <Icon style={{color:"#fff"}} name="md-arrow-back" />
                            </Button>
                        }
                        centerElement={t('login:title', { lng: i18n.language })}
                        style={{container: [{ 
                                backgroundColor: '#00a680',
                                elevation:0,
                                borderBottomColor: '#2bb594',
                                borderBottomWidth: 1,
                            },Platform.OS === 'ios' ? {height:"10%", paddingTop:25} : {}],
                        }}
                    />
                    <Grid>
                        <Row size={3} style={[]}>
                            <Col size={1}></Col>
                            <Col size={3}>
                                <Image style={styles.logo} source={imgLogo} resizeMode="contain"/>
                            </Col>
                            <Col size={1}></Col>
                        </Row>
                        <Row size={4} style={[]}>
                            <Grid style={[styles.rowFull]}>
                                <Row size={1} style={[styles.rowLogin, styles.maxWidth_500, styles.alignItemsEnd, styles.inputWrap, styles.borderColor]}>
                                    <View style={[styles.iconWrap, styles.center, styles.borderColor]}>
                                        <Image source={userIcon} resizeMode="contain" style={styles.icon}/>
                                    </View>
                                    <TextInput  style={[styles.input, styles.borderColor]} maxLength = {24} placeholderTextColor='#ffffff90' returnKeyType="done" placeholder={t('login:user_name_placeholder')} onChangeText={(userName) =>
                                    this.setState({userName})} underlineColorAndroid="transparent" value={this.state.userName}/>
                                </Row>
                                <Row size={1} style={[styles.rowLogin, styles.maxWidth_500, styles.inputWrap, styles.borderColor]}>
                                    <View style={[styles.iconWrap, styles.center, styles.borderColor]}>
                                        <Image source={lockIcon} resizeMode="contain" style={styles.icon}/>
                                    </View>
                                    <TextInput style={[styles.input, styles.borderColor]} maxLength = {30} placeholderTextColor='#ffffff90' returnKeyType="done" placeholder={t('login:pass_placeholder')} secureTextEntry={this.state.hidePassword}  onChangeText={(password) =>
                                    this.setState({password})} underlineColorAndroid="transparent" value={this.state.password}/>
                                    <View style={[styles.iconWrap_Pass, styles.center, styles.borderColor]}>
                                        <TouchableOpacity activeOpacity = { 0.8 } onPress = { this.managePasswordVisibility }>
                                            <Image source={showPass} resizeMode="contain" style={styles.icon}/>
                                        </TouchableOpacity>
                                    </View>
                                </Row>
                            </Grid>
                        </Row>
                        <Row size={4} style={[]}>
                            <Grid>
                                <Row size={4}>
                                    <Col size={1}/>
                                    <Col size={10} style={[styles.colButton, styles.borderColor]}>
                                        <Button style={styles.buttonLogin} warning rounded onPress={(e) => this.userLogin(e)}>
                                            <Text uppercase={false} style={[styles.buttonText]}>{t('login:btn_login')}</Text>
                                        </Button>
                                    </Col>
                                    <Col size={1}/>
                                </Row>
                                <Row size={4}>
                                    <Col size={1} style={[styles.borderColor]}/>
                                    <Col size={10} style={[styles.colButton, styles.borderColor]}>
                                        <Left>
                                            <Button style={styles.buttonLoginFB} iconLeft rounded onPress={() => this._onPressLoginFB()}>
                                                <IconZ style={styles.iconFB} name='facebook' />
                                                <Text uppercase={false} style={[styles.loginFaceText]}>{t('login:btn_login_fb')}</Text>
                                            </Button>
                                        </Left>
                                        <Right>
                                            <Button style={styles.buttonLoginG} iconLeft rounded onPress={() => this._onPressLoginGmail()}>
                                                <IconZ style={styles.iconG} name='google' />
                                                <Text uppercase={false} style={[styles.loginFaceText]}>{t('login:btn_login_g')}</Text>
                                            </Button>
                                        </Right>
                                    </Col>
                                    <Col size={1} style={[styles.borderColor]}/>
                                </Row>
                                <Row size={4} style={[styles.rowFull, styles.borderColor]}>
                                    <Col>
                                        <TouchableOpacity activeOpacity={.5} onPress={() =>
                                            navigate('forgotPassword')}>
                                            <View >
                                                <Text style={styles.forgotPasswordText}>{t('login:forgot_password')}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col>
                                        <TouchableOpacity activeOpacity={.5} onPress={() =>
                                            navigate('register')}>
                                            <View >
                                                <Text style={styles.forgotPasswordText}>{t('login:register')}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </Col>
                                </Row>
                            </Grid>
                        </Row>
                    </Grid>
                </Container>
            </KeyboardAwareScrollView>
        );
    }

}
const mapStateToProps = (state, ownProps) => {
    return {
        isLoggedIn: state.auth.isLoggedIn
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (user) => { dispatch(login(user)); },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(translate(['login'], { wait: true })(Login));