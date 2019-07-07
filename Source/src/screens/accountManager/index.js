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
    List,
    ListItem,
    Thumbnail
} from "native-base";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Toolbar } from 'react-native-material-ui';
import ImagePicker from 'react-native-image-picker';
import { Grid, Row, Col } from "react-native-easy-grid";
import { connect } from 'react-redux';
import { logout } from './../../../redux/actions/auth';
import IconAW from 'react-native-vector-icons/FontAwesome';

const background = require('./../../../assets/login/background.png') ;
const avantar = require('./../../../assets/login/avantar.jpg');
const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
class accountManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: '',
            hidePassword: true,
            avatarSource: avantar,
        };
    }
    selectPhotoTapped() {
        const options = {
          quality: 1.0,
          maxWidth: 500,
          maxHeight: 500,
          storageOptions: {
            skipBackup: true
          }
        };
    
        ImagePicker.showImagePicker(options, (response) => {
          console.log('Response = ', response);
    
          if (response.didCancel) {
            console.log('User cancelled photo picker');
          }
          else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          }
          else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          }
          else {
            let source = { uri: response.uri };
    
            // You can also display the image using data:
            // let source = { uri: 'data:image/jpeg;base64,' + response.data };
    
            this.setState({
              avatarSource: source
            });
          }
        });
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
    userLogout() {
        this.removeItemValue('user');
        this.props.onLogout();
        if (this.props.hidden_header) {
            this.props.setIndexTab(1);
        }
        this.props.navigation.navigate('Home');
    }
    goToHomeScreen = () => {
        this.props.navigation.navigate('Home', {indexTab:1});
    };
    goToProfileScreen = () => {
        if (this.props.navigation.state.routeName && this.props.navigation.state.routeName == 'Home_new') {
            this.props.navigation.navigate('userProfile', {parrent:"Home_new"});
        } else {
            this.props.navigation.navigate('userProfile', {parrent:"Menu"});
        }
    };
    goToChangePassScreen = () => {
        if (this.props.navigation.state.routeName && this.props.navigation.state.routeName == 'Home_new') {
            this.props.navigation.navigate('changePassword', {parrent:"Home_new"});
        } else {
            this.props.navigation.navigate('changePassword', {parrent:"Menu"});
        }
    };
    goToLogoutScreen = (e) => {
        const { t, i18n } = this.props;
        Alert.alert(t('message:title'), 
            t('accountManager:logout_message'),
            [
                {text: t('message:text_ok'), onPress: () => this.userLogout()},
                {text: t('message:text_cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            ],
            { cancelable: false }
          )
        
    };
    managePasswordVisibility = () => {
        this.setState({ hidePassword: !this.state.hidePassword });
    };
    componentDidMount(){
        if (!this.props.isLoggedIn) {
            this.props.navigation.navigate('login');
        }
    }
    render() {
        const { t, i18n } = this.props;
        if (!this.props.isLoggedIn) {
            return (
              null
            )
        } else {
            return (
                <Container style={[styles.container]}>
                    {!this.props.hidden_header && <Toolbar
                        leftElement={
                            <Button transparent onPress={this.goToHomeScreen.bind(this)}>
                                <Icon style={{color:"#fff"}} name="md-arrow-back" />
                            </Button>
                        }
                        centerElement={t('accountManager:title', { lng: i18n.language })}
                        style={{container: [{ 
                                backgroundColor: '#00a680',
                                elevation:0,
                            },Platform.OS === 'ios' ? {height:"10%", paddingTop:25} : {}],
                        }}
                    />}
                    <Content style={{backgroundColor:'#fff'}}>
                        <View style={[{height:160, width:'100%'}]}>
                            <Image style={[styles.imageAcount]} source={background} ></Image>
                            <View style={[{position:'absolute', flexDirection:'row', height:'100%', width:'100%', padding:20}]}>
                                <Left style={{maxWidth:70}}>
                                    <Thumbnail style={[styles.avantar]} source={this.state.avatarSource} />
                                    {/* <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)} style={{position:"absolute", bottom:0, right:0}}>
                                        <IconAW name="camera" size={20}/>
                                    </TouchableOpacity> */}
                                </Left>
                                <Right style={[{justifyContent:'center', alignItems: 'flex-start'}]}>
                                    <Text numberOfLines = { 1 } style={[styles.Username, {marginLeft:10, marginRight:10}]}>{this.props.name}</Text>
                                    <Text note numberOfLines = { 1 } style={[{color: '#fff', marginLeft:10, marginRight:10}]}>{this.props.email}</Text>
                                </Right>
                            </View>
                        </View>
                        <Grid style={[styles.rowFull]}>
                            <Row size={1} style={[styles.rowLogin,styles.menuItem]}>
                                <TouchableOpacity style={[styles.center_alignItems, styles.fullWidth]} activeOpacity = { 0.8 } onPress = { this.goToProfileScreen }>
                                    <Col size={2} style={[styles.padding_5]}>
                                        <Text style={[styles.textMenu]}>{t('accountManager:option1')}</Text>
                                    </Col>
                                    <Col size={1} style={[styles.col2, styles.borderColor]}>
                                        <View style={[styles.iconWrap_Item, styles.center, styles.borderColor]}>
                                            <Icon style={[styles.colorOrigin]} name="ios-arrow-forward" />  
                                        </View>
                                    </Col>
                                </TouchableOpacity>
                            </Row>
                            <Row size={1} style={[styles.rowLogin, styles.menuItem, styles.borderColor]}>
                                <TouchableOpacity style={[styles.center_alignItems, styles.fullWidth]} activeOpacity = { 0.8 } onPress = { this.goToChangePassScreen }> 
                                    <Col size={2} style={[styles.padding_5]}>
                                        <Text style={[styles.textMenu]}>{t('accountManager:option2')}</Text>
                                    </Col>
                                    <Col size={1} style={[styles.col2, styles.borderColor]}>
                                        <View style={[styles.iconWrap_Item, styles.center, styles.borderColor]}>
                                            <TouchableOpacity activeOpacity = { 0.8 } onPress = { this.managePasswordVisibility }>
                                                <Icon style={[styles.colorOrigin]} name="ios-arrow-forward" />  
                                            </TouchableOpacity>
                                        </View>
                                    </Col>
                                </TouchableOpacity>
                            </Row>
                            <Row size={1} style={[styles.rowLogin, styles.menuItem, styles.borderColor]}>
                                <TouchableOpacity style={[styles.center_alignItems, styles.fullWidth]} activeOpacity = { 0.8 } onPress = { this.goToLogoutScreen }> 
                                    <Col size={2} style={[styles.padding_5]}>
                                        <Text style={[styles.textMenu]}>{t('accountManager:option3')}</Text>
                                    </Col>
                                    <Col size={1} style={[styles.col2, styles.borderColor]}>
                                        <View style={[styles.iconWrap_Item, styles.center, styles.borderColor]}>
                                            <TouchableOpacity activeOpacity = { 0.8 } onPress = { this.managePasswordVisibility }>
                                                <Icon style={[styles.colorOrigin]} name="ios-arrow-forward" />  
                                            </TouchableOpacity>
                                        </View>
                                    </Col>
                                </TouchableOpacity>
                            </Row>
                        </Grid>
                    </Content>
                </Container>
            );
        }
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        isLoggedIn: state.auth.isLoggedIn,
        name: state.auth.name,
        phone: state.auth.phone,
        email: state.auth.email,
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        onLogout: () => { dispatch(logout()); }
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(translate(['accountManager'], { wait: true })(accountManager));