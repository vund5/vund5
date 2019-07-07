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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Grid, Row, Col } from "react-native-easy-grid";
import Spinner from 'react-native-loading-spinner-overlay';
import { logout, update, update_pass } from './../../../redux/actions/auth';
import { connect } from 'react-redux';
import { Toolbar } from 'react-native-material-ui';
import DienBienAPI from '../../api/index';

const lockIcon = require('./../../../assets/login/ic_lock.png');
const showPass = require('./../../../assets/login/show-password.png');

const APIUrl = '/wp-json/v2/change-password';

class changePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            userName: '',
            password: '',
            password_1: '',
            password_2: '',
            hidePassword: true,
            hidePassword_1: true,
            hidePassword_2: true,
            loading_visible: false,
        };
    }

    getFullURL(url) {
      return DienBienAPI.getServerURL() + url;
    }
    _onPressUpdate (event) {
        event.preventDefault();
        if (this.state.loading_visible) {
            return;
        }
        const { t, i18n } = this.props;
        this.setState({loading_visible: true,});
        var rePass = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#\(\)])[A-Za-z\d@$!%*?&#\(\)]{8,30}$/;
        if (this.state.password == '' || this.state.password_1 == '' || this.state.password_2 == '') {
            Alert.alert(t('message:title'), t('changePassword:input_error'),[{text: t('message:text_ok')}],{ cancelable: false });
            this.setState({loading_visible: false});
        } else if (this.state.password_1.length < 8) {
            Alert.alert(t('message:title'), t('changePassword:error_password1'),[{text: t('message:text_ok')}],{ cancelable: false });
            this.setState({loading_visible: false});
        } else if (this.state.password_1.length > 30) {
            Alert.alert(t('message:title'), t('changePassword:error_password'),[{text: t('message:text_ok')}],{ cancelable: false });
            this.setState({loading_visible: false});
        } else if (!this.state.password_1.match(rePass)) {
            Alert.alert(t('message:title'), t('changePassword:error_password2'),[{text: t('message:text_ok')}],{ cancelable: false });
            this.setState({loading_visible: false});
        } else if (this.state.password_1 != this.state.password_2) {
            Alert.alert(t('message:title'), t('changePassword:again_password_error'),[{text: t('message:text_ok')}],{ cancelable: false });
            this.setState({loading_visible: false});
        } else if (this.state.password == this.state.password_1) {
            Alert.alert(t('message:title'), t('changePassword:password_new_duplicate'),[{text: t('message:text_ok')}],{ cancelable: false });
            this.setState({loading_visible: false});
        } else {
            this.getUserUpdateAPI();
        }
    }

    async getUserUpdateAPI() {
        let url = this.getFullURL(APIUrl);
        const { t, i18n } = this.props;
        try {
            let response = await DienBienAPI.fetch_timeout(
                url, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.props.tokenId
                    },
                    body: JSON.stringify({
                        old_pwd: this.state.password,
                        new_pwd: this.state.password_1,
                        re_new_pwd: this.state.password_2,
                    })
                }
            );
            let result = await response.json();
            this.checkResult(result);
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
            //this.checkResult(result);
        }
    }
    checkResult = (result) => {
        this.setState({loading_visible: false});
        const { t, i18n } = this.props;
        if (result.code == 'wrong_password') {
            setTimeout(() => {
                Alert.alert(t('message:title'), t('changePassword:old_password_incorrect'),[{text: t('message:text_ok')}],{ cancelable: false });
            }, 500);
        } else if (result.status == "password_changed") {
            this.setState({
                password: this.state.password_1
            });
            var user = {
                password: this.state.password_1,
            }
            this.props.onUpdatePass(user);
            setTimeout(() => {
                Alert.alert(t('message:title'), t('changePassword:change_success'),[{text: t('message:text_ok')}],{ cancelable: false });
            }, 500);
        } else if (result.code == "jwt_auth_invalid_token") {
            setTimeout(() => {
                Alert.alert(t('message:title'), 
                    t('changePassword:token_error'),
                    [
                        {text: t('message:text_ok'), onPress: () => this.userLogout()},
                    ],{ cancelable: false }
                );
            }, 500);
        } else {
            setTimeout(() => {
                Alert.alert(t('message:title'), result.message,[{text: t('message:text_ok')}],{ cancelable: false });
            }, 500);
        }
    }
    userLogout() {
        this.removeItemValue('user');
        this.props.onLogout();
        this.props.navigation.navigate('Home');
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
    goToBackScreen = () => {
        if (this.props.navigation.state.params && this.props.navigation.state.params.parrent == 'Menu') {
            this.props.navigation.navigate('accountManager');
        } else {
            this.props.navigation.navigate('Home_new', {indexTab:4});
        }
    };
    managePasswordVisibility = () => {
        this.setState({ hidePassword: !this.state.hidePassword });
    };
    managePasswordVisibility_1 = () => {
        this.setState({ hidePassword_1: !this.state.hidePassword_1 });
    };
    managePasswordVisibility_2 = () => {
        this.setState({ hidePassword_2: !this.state.hidePassword_2 });
    };
    render() {
        const { t, i18n } = this.props;
        return (
            <Container style={[styles.container]}>
                <Spinner visible={this.state.loading_visible} textContent={t('changePassword:text_loading')} textStyle={{color: '#FFF'}} />
                <Toolbar
                    leftElement={
                        <Button transparent onPress={this.goToBackScreen.bind(this)}>
                            <Icon style={{color:"#fff"}} name="md-arrow-back" />
                        </Button>
                    }
                    centerElement={t('changePassword:title', { lng: i18n.language })}
                    style={{container: [{ 
                            backgroundColor: '#00a680',
                            elevation:0,
                        },Platform.OS === 'ios' ? {height:"10%", paddingTop:25} : {}],
                    }}
                />
                <Content>
                    <Grid style={[styles.rowFull]}>
                        <Row size={3} style={[styles.areaInput, styles.whileColor, styles.borderColor, styles.shadow]}>
                            <Grid style={[styles.rowFull,]}>
                                <Row size={0.5}></Row>
                                <Row size={1} style={[styles.rowRegister, styles.borderBottomInput, styles.maxWidth_500, styles.inputWrap, styles.borderColor]}>
                                    <View style={[styles.iconWrap, styles.center, styles.borderColor]}>
                                        <Image source={lockIcon} resizeMode="contain" style={styles.icon}/>
                                    </View>
                                    <TextInput style={[styles.input,styles.borderColor]} maxLength = {30} placeholder={t('changePassword:old_pass_placeholder')} returnKeyType="done"
                                    secureTextEntry={this.state.hidePassword}
                                    onEndEditing={(e) => this.setState({password: e.nativeEvent.text.replace(/^\s+|\s+$/g, "")})}
                                    onChange={(e) => this.setState({password: e.nativeEvent.text})}
                                    underlineColorAndroid="transparent" value={this.state.password}/>
                                    <View style={[styles.iconWrap_Pass, styles.center, styles.borderColor]}>
                                        <TouchableOpacity activeOpacity = { 0.8 } onPress = { this.managePasswordVisibility }>
                                            <Image source={showPass} resizeMode="contain" style={styles.icon}/>
                                        </TouchableOpacity>
                                    </View>
                                </Row>
                                <Row size={1} style={[styles.rowRegister, styles.borderBottomInput, styles.maxWidth_500, styles.inputWrap, styles.borderColor]}>
                                    <View style={[styles.iconWrap, styles.center, styles.borderColor]}>
                                        <Image source={lockIcon} resizeMode="contain" style={styles.icon}/>
                                    </View>
                                    <TextInput style={[styles.input,styles.borderColor]} maxLength = {30} placeholder={t('changePassword:new_pass_placeholder')} returnKeyType="done"
                                    secureTextEntry={this.state.hidePassword_1}
                                    onEndEditing={(e) => this.setState({password_1: e.nativeEvent.text.replace(/^\s+|\s+$/g, "")})}
                                    onChange={(e) => this.setState({password_1: e.nativeEvent.text})}
                                    underlineColorAndroid="transparent" value={this.state.password_1}/>
                                    <View style={[styles.iconWrap_Pass, styles.center, styles.borderColor]}>
                                        <TouchableOpacity activeOpacity = { 0.8 } onPress = { this.managePasswordVisibility_1 }>
                                            <Image source={showPass} resizeMode="contain" style={styles.icon}/>
                                        </TouchableOpacity>
                                    </View>
                                </Row>
                                <Row size={1} style={[styles.rowRegister, styles.borderBottomInput, styles.maxWidth_500, styles.inputWrap, styles.borderColor]}>
                                    <View style={[styles.iconWrap, styles.center, styles.borderColor]}>
                                        <Image source={lockIcon} resizeMode="contain" style={styles.icon}/>
                                    </View>
                                    <TextInput style={[styles.input,styles.borderColor]} maxLength = {30} placeholder={t('changePassword:new_pass_again_placeholder')}
                                    returnKeyType="done" secureTextEntry={this.state.hidePassword_2}
                                    onEndEditing={(e) => this.setState({password_2: e.nativeEvent.text.replace(/^\s+|\s+$/g, "")})}
                                    onChange={(e) => this.setState({password_2: e.nativeEvent.text})}
                                    underlineColorAndroid="transparent" value={this.state.password_2}/>
                                    <View style={[styles.iconWrap_Pass, styles.center, styles.borderColor]}>
                                        <TouchableOpacity activeOpacity = { 0.8 } onPress = { this.managePasswordVisibility_2 }>
                                            <Image source={showPass} resizeMode="contain" style={styles.icon}/>
                                        </TouchableOpacity>
                                    </View>
                                </Row>
                                <Row size={2.5}>
                                    <Col size={1}/>
                                    <Col size={8} style={[styles.colButton, styles.borderColor]}>
                                        <Button style={styles.buttonUpdate} rounded warning onPress={this._onPressUpdate.bind(this)}>
                                            <Text uppercase={false} style={[styles.buttonText]}>{t('changePassword:btn_update')}</Text>
                                        </Button>
                                    </Col>
                                    <Col size={1}/>
                                </Row>
                            </Grid>
                        </Row>
                        <Row size={2} style={[styles.rowFull, styles.borderColor]}>
                        </Row>
                    </Grid>
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        tokenId: state.auth.tokenId,
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        onLogout: () => { dispatch(logout()); },
        onUpdate: (user) => { dispatch(update(user)); },
        onUpdatePass: (user) => { dispatch(update_pass(user)); }
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(translate(['changePassword'], { wait: true })(changePassword));