import React, { Component } from 'react';
import styles from "./styles";
import { translate } from 'react-i18next';
import i18n from 'i18next';
import { connect } from 'react-redux';
import { logout, login, setLanguage } from './../../../redux/actions/auth';
import { Toolbar } from 'react-native-material-ui';
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
} from "native-base";
import IconAW from 'react-native-vector-icons/FontAwesome';


class changeLanguage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            option1: this.props.language == 'vi' ? true : false,
            option2: this.props.language == 'en' ? true : false,
            language: 0,
        };
    }
    _onPressSettingLGOp1() {
        this.setState({
            option1: true,
            option2: false,
            option3: false,
        });
    }
    _onPressSettingLGOp2() {
        this.setState({
            option1: false,
            option2: true,
            option3: false,
        });
    }
    _onPressSettingLGOp3() {
        this.setState({
            option1: false,
            option2: false,
            option3: true,
        });
    }
    goToBackScreen = () => {
        this.props.navigation.navigate('setting');
    };
    async onChangeLang(lang) {
        switch (lang) {
            case 'vi':
                this._onPressSettingLGOp1();
                break;
            case 'en':
                this._onPressSettingLGOp2();
                break;
        }
        i18n.changeLanguage(lang);
        this.props.setLanguage(lang);
        try {
            await AsyncStorage.setItem('@APP:languageCode', lang);
        } catch (error) {
            console.log(` Hi Errorrrr : ${error}`);
        }
    }
    check_setting_language = () => {
        const STORAGE_KEY = '@APP:languageCode';
        AsyncStorage.getItem(STORAGE_KEY, (err, key) => {
            switch (key) {
                case 'vi':
                    if (!this.state.option1) {
                        this.setState({ option1: true });
                    }
                    break;
                case 'en':
                    if (!this.state.option2) {
                        this.setState({ option2: true });
                    }
                    break;
            }
        }).done();
    }
    render() {
        const { t, i18n } = this.props;
        // this.check_setting_language();
        return (
            <Container style={[styles.container]}>
                <Toolbar
                    leftElement={
                        <Button transparent onPress={this.goToBackScreen.bind(this)}>
                            <Icon style={{ color: "#fff" }} name="md-arrow-back" />
                        </Button>
                    }
                    centerElement={t('changeLanguage:title', { lng: i18n.language })}
                    style={{
                        container: [{
                            backgroundColor: '#00a680',
                            elevation: 0,
                        }, Platform.OS === 'ios' ? { height: "10%", paddingTop: 25 } : {}],
                    }}
                />
                <Content style={[styles.content]}>
                    <List style={[styles.listitem]}>
                        {this.state.option1 && <ListItem button >
                            <Left style={{ flex: 1 }}><IconAW style={styles.icon} name="check"></IconAW></Left>
                            <Body style={{ flex: 9 }}><Text>{t('changeLanguage:option1')}</Text></Body>
                        </ListItem>}
                        {!this.state.option1 && <ListItem button onPress={() => this.onChangeLang('vi')} >
                            <Left style={{ flex: 1 }}></Left>
                            <Body style={{ flex: 9 }}><Text>{t('changeLanguage:option1')}</Text></Body>
                        </ListItem>}
                        {this.state.option2 && <ListItem button >
                            <Left style={{ flex: 1 }}><IconAW style={styles.icon} name="check"></IconAW></Left>
                            <Body style={{ flex: 9 }}><Text>{t('changeLanguage:option2')}</Text></Body>
                        </ListItem>}
                        {!this.state.option2 && <ListItem button onPress={() => this.onChangeLang('en')} >
                            <Left style={{ flex: 1 }}></Left>
                            <Body style={{ flex: 9 }}><Text>{t('changeLanguage:option2')}</Text></Body>
                        </ListItem>}
                        {this.state.option3 && <ListItem button >
                            <Left style={{ flex: 1 }}><IconAW style={styles.icon} name="check"></IconAW></Left>
                            <Body style={{ flex: 9 }}><Text>{t('changeLanguage:option3')}</Text></Body>
                        </ListItem>}
                    </List>
                </Content>
            </Container>
        );
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        language: state.auth.language,
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        setLanguage: (language) => { dispatch(setLanguage(language)); }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(translate(['changeLanguage'], { wait: true })(changeLanguage));