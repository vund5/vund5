import React, { Component } from 'react';
import styles from "./styles";
import { translate } from 'react-i18next';
import i18n from 'i18next';
import { Platform, View, TouchableOpacity, TouchableHighlight, AsyncStorage } from "react-native";
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
import ModalDropdown from 'react-native-modal-dropdown';
import stylesPicker from "./stylesPicker";
import RNPickerSelect from '../../components/pickerSelect';
import { Toolbar } from 'react-native-material-ui';
import IconAW from 'react-native-vector-icons/FontAwesome';
const OPTION_SELECT = ['15', '30', '45', '60', '90', '120'];
class setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            version: "1.0",
            timeScheduleList: [
                { value: '15', label: '15 phút' },
                { value: '30', label: '30 phút' },
                { value: '45', label: '45 phút' },
                { value: '60', label: '60 phút' },
            ],
            timeSchedule: '15'
        };

        this.inputRefs = {};
    }
    componentDidMount() {
        var self = this;
        AsyncStorage.getItem('SettingNotificationTime', (err, data) => {
            if (data !== null) {
                self.setState({
                    timeSchedule: data
                });
            }
        }).done();
    }

    _onPressSettingLG(event) {
        var { navigate } = this.props.navigation;
        navigate('changeLanguage');
    }
    goToBackScreen = () => {
        this.props.navigation.navigate('Home');
    };
    render() {
        const { t, i18n } = this.props;
        return (
            <Container style={[styles.container]}>
                <Toolbar
                    leftElement={
                        <Button transparent onPress={this.goToBackScreen.bind(this)}>
                            <Icon style={{ color: "#fff" }} name="md-arrow-back" />
                        </Button>
                    }
                    centerElement={t('setting:title', { lng: i18n.language })}
                    style={{
                        container: [{
                            backgroundColor: '#00a680',
                            elevation: 0,
                        }, Platform.OS === 'ios' ? { height: "10%", paddingTop: 25 } : {}],
                    }}
                />

                <Content style={[styles.content]}>
                    <List style={[styles.listitem]}>
                        <ListItem
                            button
                            onPress={() => this._onPressSettingLG()}
                        >
                            <Left>
                                <Text>{t('setting:option1')}</Text>
                            </Left>
                            <Right>
                                <IconAW name="chevron-right"></IconAW>
                            </Right>
                        </ListItem>
                        <ListItem
                            button
                        >
                            <Left>
                                <Text>{t('setting:option3')}</Text>
                            </Left>
                            <Right>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                    <Text numberOfLines={1} style={styles.oGridBodyLeft}>{this.state.timeSchedule} {t('date:minute')}</Text>
                                    <IconAW name="caret-down" size={20} style={{ left: 10, marginRight: 10 }}></IconAW>
                                </View>
                                <ModalDropdown ref="dropdown_2"
                                    style={styles.dropdown_2}
                                    textStyle={styles.dropdown_2_text}
                                    dropdownStyle={styles.dropdown_2_dropdown}
                                    options={OPTION_SELECT}
                                    renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
                                    renderRow={this._dropdown_2_renderRow.bind(this)}
                                    renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                                />
                            </Right>
                        </ListItem>
                        <ListItem>
                            <Left>
                                <Text>{t('setting:option2')}</Text>
                            </Left>
                            <Right>
                                <Text>{this.state.version}</Text>
                            </Right>
                        </ListItem>
                    </List>
                </Content>
            </Container>
        );
    }
    _dropdown_2_renderButtonText(rowData) {
        this.setState({
            timeSchedule: rowData
        })
        AsyncStorage.setItem('SettingNotificationTime', parseInt(rowData).toString(), () => { });
        return rowData;
    }
    _dropdown_2_renderRow(rowData, rowID, highlighted) {
        const { t, i18n } = this.props;
        let color_icon = highlighted ? '#00a680' : '#fff';
        return (
            <TouchableHighlight underlayColor='#cacaca'>
                <View icon style={[{ marginLeft: 10, marginRight: 10 }, styles.dropdown_2_row]}>
                    <Left style={[{ flex: 5 }, styles.center]}>
                        <IconAW name='check' size={15} color={color_icon} />
                    </Left>
                    <Body style={[{ flex: 7, alignItems: "flex-start", }]}>
                        <Text style={[styles.dropdown_2_row_text, highlighted && { color: 'mediumaquamarine' }]}>
                            {rowData} {t('date:minute')}
                        </Text>
                    </Body>
                </View>
            </TouchableHighlight>
        );
    }

    _dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        if (rowID == OPTION_SELECT.length - 1) return;
        let key = `spr_${rowID}`;
        return (<View style={styles.dropdown_2_separator}
            key={key}
        />);
    }
}

export default translate(['setting'], { wait: true })(setting);
