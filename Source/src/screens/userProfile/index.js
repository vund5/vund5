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
    DatePicker,
    Radio,
} from "native-base";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Grid, Row, Col } from "react-native-easy-grid";
import { connect } from 'react-redux';
import DatePickerLIP from 'react-native-datepicker';
import { logout, update } from './../../../redux/actions/auth';
import Spinner from 'react-native-loading-spinner-overlay';
import { Toolbar } from 'react-native-material-ui';
import DienBienAPI from '../../api/index';
const iconPhone = require('./../../../assets/login/phone.png');
const iconDate = require('./../../../assets/login/date.png');
const iconUser = require('./../../../assets/login/ic_user_1.png');
const iconEmail = require('./../../../assets/login/mail-icon-1.png');

class userProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.user_redux.userId,
            email: this.props.user_redux.email,
            name: this.props.user_redux.name,
            firstname: this.props.user_redux.firstname,
            lastname: this.props.user_redux.lastname,
            birthday: this.props.user_redux.birthday,
            sex: this.props.user_redux.sex,
            username: this.props.user_redux.username,
            password: this.props.user_redux.password,
            phone: this.props.user_redux.phone,
            tokenId: this.props.user_redux.tokenId,
            radio1: this.props.user_redux.sex == '1'?true:false,
            radio2: this.props.user_redux.sex == '0'?true:false,
            radio3: this.props.user_redux.sex == ''?true:false,
            loading_visible: false,
        };
        
        this.setDate = this.setDate.bind(this);
    }
    toggleRadio1() {
        this.setState({
          radio1: true,
          radio2: false,
          radio3: false,
          sex: '1',
        });
      }
      toggleRadio2() {
        this.setState({
          radio1: false,
          radio2: true,
          radio3: false,
          sex: '0',
        });
      }
      toggleRadio3() {
        this.setState({
          radio1: false,
          radio2: false,
          radio3: true,
          sex: '',
        });
      }
    setDate(newDate) {
        this.setState({ birthday: newDate });
    }
    _onPressUpdate (event) {
        event.preventDefault();
        const { t, i18n } = this.props;
        this.setState({
            firstname: this.state.firstname,
            lastname: this.state.lastname,
        });
        this.setState({loading_visible: true,});
        if (this.state.firstname == '' || this.state.lastname == '' || this.state.phone == '') {
            Alert.alert(t('message:title'), t('userProfile:input_error'),[{text: t('message:text_ok')}],{ cancelable: false });
            this.setState({loading_visible: false,});
        } else {
            if (this.state.firstname.length > 200) {
                Alert.alert(t('message:title'), t('userProfile:error_firstname'),[{text: t('message:text_ok')}],{ cancelable: false });
                this.setState({loading_visible: false});
                return;
            }
            if (this.state.lastname.length > 200) {
                Alert.alert(t('message:title'), t('userProfile:error_lastname'),[{text: t('message:text_ok')}],{ cancelable: false });
                this.setState({loading_visible: false});
                return;
            }
            var numbers = /^[0-9]+$/;
            if(!this.state.phone.match(numbers)) {
                Alert.alert(t('message:title'), t('userProfile:error_phone'),[{text: t('message:text_ok')}],{ cancelable: false });
                this.setState({loading_visible: false});
                return;
            } else if (this.state.phone.length > 20 || this.state.phone.length < 9) {
                Alert.alert(t('message:title'), t('userProfile:error_phone1'),[{text: t('message:text_ok')}],{ cancelable: false });
                this.setState({loading_visible: false});
                return;
            }
            this.getUserUpdateAPI();
        }
    }
    async getUserUpdateAPI() {
        let url = DienBienAPI.getServerURL() + '/wp-json/v2/user-update';
        const { t, i18n } = this.props;
        try {
            let response = await DienBienAPI.fetch_timeout(
                url, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.state.tokenId
                    },
                    body: JSON.stringify({
                        firstname: this.state.firstname,
                        lastname: this.state.lastname,
                        phone_number: this.state.phone,
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
        }
    }
    checkResult = (result) => {
        this.setState({loading_visible: false});
        const { t, i18n } = this.props;
        if (result.code == 200) {
            this.setState({
                name: this.state.firstname + ' ' + this.state.lastname
            });
            var user = {
                email: this.state.email,
                name: this.state.name,
                firstname: this.state.firstname,
                lastname: this.state.lastname,
                birthday: this.state.birthday,
                username: this.state.username,
                phone: this.state.phone,
                sex: this.state.sex,
                tokenId: this.state.tokenId,
                password: this.state.password
            }
            this.props.onUpdate(user);
            setTimeout(() => {
                Alert.alert(t('message:title'), t('userProfile:change_success'),[{text: t('message:text_ok')}],{ cancelable: false });
            }, 500);
        } else if (result.code == "jwt_auth_invalid_token") {
            setTimeout(() => {
                Alert.alert(
                    t('message:title'), 
                    t('userProfile:token_error'),
                    [
                        {text: t('message:text_ok'), onPress: () => this.userLogout()},
                    ],{ cancelable: false }
                );
            }, 500);
        } else if (result.code == "rest_invalid_param") {
            setTimeout(() => {
                Alert.alert(t('message:title'), result.message,[{text: t('message:text_ok')}],{ cancelable: false });
            }, 500);
        } else if (result.code == "rest_forbidden") {
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
    getDate(givenDate) {
        return moment(givenDate).format(DATE_FORMAT_DAY);
    }
    render() {
        const { t, i18n } = this.props;
        return (
            <Container style={[styles.container]}>
                <Spinner visible={this.state.loading_visible} textContent={t('userProfile:text_loading')} textStyle={{color: '#FFF'}} />
                <Toolbar
                    leftElement={
                        <Button transparent onPress={this.goToBackScreen.bind(this)}>
                            <Icon style={{color:"#fff"}} name="md-arrow-back" />
                        </Button>
                    }
                    centerElement={t('userProfile:title', { lng: i18n.language })}
                    style={{container: [{ 
                            backgroundColor: '#00a680',
                            elevation:0,
                        },Platform.OS === 'ios' ? {height:"10%", paddingTop:25} : {}],
                    }}
                />
                <Content>
                    <Grid style={[styles.rowFull]}>
                        <Row size={5} style={[styles.areaInput, styles.shadow, styles.whileColor, styles.borderColor]}>
                            <Grid style={[styles.rowFull]}>
                                <Row size={0.5}></Row>
                                <Row size={1} style={[styles.rowRegister, styles.borderBottomInput, styles.maxWidth_500, styles.inputWrap, styles.borderColor]}>
                                    <View style={[styles.iconWrap, styles.center, styles.borderColor]}>
                                        <Image source={iconEmail} resizeMode="contain" style={styles.icon}/>
                                    </View>
                                    <TextInput style={[styles.input,styles.borderColor]} placeholder={t('userProfile:email_placeholder')} returnKeyType="done"
                                    onEndEditing={(e) => this.setState({email: e.nativeEvent.text.replace(/^\s+|\s+$/g, "")})}
                                    onChange={(e) => this.setState({email: e.nativeEvent.text})}
                                    underlineColorAndroid="transparent" editable={false} selectTextOnFocus={false} value={this.state.email}/>
                                </Row>
                                <Row size={1} style={[styles.rowRegister, styles.borderBottomInput, styles.maxWidth_500, styles.inputWrap, styles.borderColor]}>
                                    <View style={[styles.iconWrap, styles.center, styles.borderColor]}>
                                        <Image source={iconUser} resizeMode="contain" style={styles.icon}/>
                                    </View>
                                    <TextInput style={[styles.input,styles.borderColor]} maxLength = {200}
                                    placeholder={t('userProfile:first_name_placeholder')} returnKeyType="done"
                                    onEndEditing={(e) => this.setState({firstname: e.nativeEvent.text.replace(/^\s+|\s+$/g, "")})}
                                    onChange={(e) => this.setState({firstname: e.nativeEvent.text})}
                                    underlineColorAndroid="transparent" value={this.state.firstname}/>
                                </Row>
                                <Row size={1} style={[styles.rowRegister, styles.borderBottomInput, styles.maxWidth_500, styles.inputWrap, styles.borderColor]}>
                                    <View style={[styles.iconWrap, styles.center, styles.borderColor]}>
                                        <Image source={iconUser} resizeMode="contain" style={styles.icon}/>
                                    </View>
                                    <TextInput style={[styles.input,styles.borderColor]} maxLength = {200}
                                    placeholder={t('userProfile:last_name_placeholder')} returnKeyType="done"
                                    onEndEditing={(e) => this.setState({lastname: e.nativeEvent.text.replace(/^\s+|\s+$/g, "")})}
                                    onChange={(e) => this.setState({lastname: e.nativeEvent.text})}
                                    underlineColorAndroid="transparent" value={this.state.lastname}/>
                                </Row>
                                <Row size={1} style={[styles.rowRegister, styles.borderBottomInput, styles.maxWidth_500, styles.inputWrap, styles.borderColor]}>
                                    <View style={[styles.iconWrap, styles.center, styles.borderColor]}>
                                        <Image source={iconPhone} resizeMode="contain" style={styles.icon}/>
                                    </View>
                                    <TextInput style={[styles.input,styles.borderColor]} maxLength = {20}
                                    placeholder={t('userProfile:phone_placeholder')} returnKeyType="done" keyboardType="numeric"
                                    onEndEditing={(e) => this.setState({phone: e.nativeEvent.text.replace(/^\s+|\s+$/g, "")})}
                                    onChange={(e) => this.setState({phone: e.nativeEvent.text})}
                                    underlineColorAndroid="transparent" value={this.state.phone}/>
                                </Row>
                                {/* <Row size={1} style={[styles.rowRegister, styles.borderBottomInput, styles.maxWidth_500, styles.inputWrap]}>
                                    <View style={[styles.iconWrap, styles.center]}>
                                        <Image source={iconDate} resizeMode="contain" style={styles.icon}/>
                                    </View>
                                    <View style={[styles.center_1, styles.inputDate]}>
                                    <DatePickerLIP
                                        style={{width: 200}}
                                        date={this.state.birthday}
                                        mode="date"
                                        placeholder={t('userProfile:birthday_placeholder')}
                                        format="DD/MM/YYYY"
                                        minDate="01/01/1950"
                                        maxDate="31/12/2050"
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        showIcon={false}
                                        customStyles={{
                                            dateInput: {
                                                marginLeft: 0,
                                                borderWidth:0,
                                                alignItems: 'flex-start',
                                                paddingHorizontal: 10,
                                            }
                                        }}
                                        onDateChange={(date) => {this.setState({birthday: date})}}
                                    />
                                    </View>
                                </Row>
                                <Row size={1} style={[styles.rowRegister, styles.borderBottomInput, styles.maxWidth_500, styles.inputWrap, styles.borderColor]}>
                                    <Col style={[styles.colRadio, styles.borderColor]} selected={this.state.radio1} onPress={() => this.toggleRadio1()}>
                                        <Radio
                                            color={"#f0ad4e"}
                                            selectedColor={"#5cb85c"}
                                            selected={this.state.radio1}
                                            onPress={() => this.toggleRadio1()}
                                        />
                                        <Text style={[styles.colRadioText]}>{t('userProfile:radio1')}</Text>
                                    </Col>
                                    <Col style={[styles.colRadio, styles.borderColor]} selected={this.state.radio1} onPress={() => this.toggleRadio2()}>
                                        <Radio
                                            color={"#f0ad4e"}
                                            selectedColor={"#5cb85c"}
                                            selected={this.state.radio2}
                                            onPress={() => this.toggleRadio2()}
                                        />
                                        <Text style={[styles.colRadioText]}>{t('userProfile:radio2')}</Text>
                                    </Col>
                                    <Col style={[styles.colRadio, styles.borderColor]} selected={this.state.radio1} onPress={() => this.toggleRadio3()}>
                                        <Radio
                                            color={"#f0ad4e"}
                                            selectedColor={"#5cb85c"}
                                            selected={this.state.radio3}
                                            onPress={() => this.toggleRadio3()}
                                        />
                                        <Text style={[styles.colRadioText]}>{t('userProfile:radio3')}</Text>
                                    </Col>
                                </Row> */}
                                <Row size={2.5}>
                                    <Col size={1}/>
                                    <Col size={8} style={[styles.colButton, styles.borderColor]}>
                                        <Button style={styles.buttonUpdate} rounded warning onPress={this._onPressUpdate.bind(this)}>
                                            <Text uppercase={false} style={[styles.buttonText]}>{t('userProfile:btn_update')}</Text>
                                        </Button>
                                    </Col>
                                    <Col size={1}/>
                                </Row>
                            </Grid>
                        </Row>
                        <Row size={3} style={[styles.rowFull, styles.borderColor]}>
                        </Row>
                    </Grid>
                </Content>
            </Container>
        );
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        user_redux: state.auth,
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        onLogout: () => { dispatch(logout()); },
        onUpdate: (user) => { dispatch(update(user)); }
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(translate(['userProfile'], { wait: true })(userProfile));