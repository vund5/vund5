import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Image, View, Dimensions, Platform } from 'react-native';
import { Container, Content, List, ListItem, Text, Button, Thumbnail, Item } from "native-base";
import { Icon } from 'react-native-elements';
import { Toolbar, ActionButton } from 'react-native-material-ui';
import HeaderImageScrollView from 'react-native-image-header-scroll-view';
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
import DienBienAPI from '../../api/index';
import ModalComment from "./modalComment";
import { translate } from 'react-i18next';
import i18n from 'i18next';
const iconPen = require("../../../assets/Icon/pen-icon.png");

var dateFormat = require('dateformat');
const MIN_HEIGHT = 56;
const MAX_HEIGHT = 270;
const SCREEN_WIDTH = Dimensions.get("window").width;
const APIComment = '/wp-json/wp/v2/comments?post=';

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      datasComment: [],
      visibleComment: true,
    };
  }

  getFullURL(url) {
    return DienBienAPI.getServerURL() + url;
  }
  componentDidMount(){
    const {state} = this.props.navigation;
    if (state.params) {
      if (state.params.data) {
        this.setState({data: state.params.data});
      }
      if (state.params.comments) {
        this.setState({datasComment: state.params.comments});
      }
    }
  }

  onOpenComment() {
    this.setState({visibleComment:true});
  }
  onCancelComment() {
    this.setState({visibleComment:false});
  }
  onReloadDataComment() {
    this.getListComments(this.state.data.id);
  }
  getListComments(postID) {
    let url = this.getFullURL(APIComment) + postID;
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        if (!!responseJson && responseJson.length > 0) {
          this.setState({
            datasComment: responseJson
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  decodeHTMLEntities(text) {
    var nontText = (text + '').replace(/<[^>]*>/g, "").replace(/\n/, '');
    return entities.decode(nontText)
  };

  renderComments() {
    const { t, i18n } = this.props;
    if (!!this.state.datasComment && this.state.datasComment.length > 0) {
      return (<View style={[styles.container]}>
        <List
          style={{}}
          dataArray={this.state.datasComment}
          renderRow={data =>
          <ListItem thumbnail button style={{ marginLeft: 0, justifyContent: 'center', alignItems: 'center' }}>
            <View style={ styles.viewContainer }>
                <View style={{ flexDirection: "row" }}>
                <Thumbnail small source={{ uri:data.author_avatar_urls['48'] }}/>
                <Item style={{ flexDirection: "column", paddingLeft: 10, borderColor: 'transparent', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <Text>{ data.author_name }</Text>
                    <Text note>{dateFormat(data.date , "dd/mm/yyyy HH:MM")}</Text>
                    {/* <Image source={data.rate} style={ styles.image }/> */}
                </Item>
                </View>
                <View style={styles.viewRow}>
                  {!!data.content.rendered && data.content.rendered.length > 0 &&
                    <Text note>{this.decodeHTMLEntities(data.content.rendered)}</Text>
                  }
                </View>
            </View>
          </ListItem>}>
        </List>
      </View>)
    } else {
      return (
        <View style={{height: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
          <Text note>{t('Common:text13')}</Text>
        </View>
      )
    }
  }

  render() {
    return (
      <Container style={{ flex: 1, backgroundColor: '#eee' }}>
        <HeaderImageScrollView
          minHeight={MIN_HEIGHT}
          maxHeight={MAX_HEIGHT}
          scrollViewBackgroundColor="#eee"
          headerImage={{ uri: this.state.data.featured_image_src }}
        >
          <View style={{flex: 1}}>
            <View style={[styles.container, {marginBottom: 5}]}>
              <View style={{flexDirection: 'row'}}>
                <View>
                  {this.state.data && this.state.data.title && this.state.data.title.rendered && this.state.data.title.rendered.length > 0 &&
                    <Text style={ styles.textTitle }>{ this.decodeHTMLEntities(this.state.data.title.rendered) }</Text>
                  }
                  {this.state.data && this.state.data._event_location && this.state.data._event_location.length > 0 &&
                    <Text note>{this.decodeHTMLEntities(this.state.data._event_location)}</Text>
                  }
                </View>
              </View>
            </View>

            {this.renderComments()}
          </View>
        </HeaderImageScrollView>

        <View style={[{ position: "absolute", flexDirection: "row", justifyContent: 'center', alignItems: 'center' }, Platform.OS !== 'ios' ? {top: 0}:{top: 25} ]}>
          <View style={{ flex: 1 }}>
            <Button transparent
              style={{width: 55, height: 55, justifyContent: 'center', alignItems: 'center'}}
              onPress={() => this.props.navigation.goBack()} >
              <Icon name="md-arrow-back" type="ionicon" color='#fff' />
            </Button>
          </View>
        </View>
        
        {/* <ActionButton
          icon={
            <Image square source={iconPen} style={{width: 32, height: 32}}/>
          }
          hidden={this.state.visibleComment}
          onPress={this.onOpenComment.bind(this)}
          style={{
            container: {backgroundColor:'#00a982'}
          }}
        /> */}
        <ModalComment idPost={this.state.data.id} visibleComment={this.state.visibleComment} onCancel={this.onCancelComment.bind(this)} onReload={this.onReloadDataComment.bind(this)}/>
      </Container>
    );
  }
}
export default translate(['Comments'], { wait: true })(Comments);
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: Dimensions.get('window').width,
    // borderRadius: 5
  },
  viewContainer: {
    padding: 10,
    width: Dimensions.get('window').width,
    borderBottomColor: '#00a87f',
    borderBottomWidth: 1
  },
  mb5: {
    marginBottom: 5
  },
  viewRow: {
    flexDirection: 'row',
    paddingTop: 5
  },
  image: {
    height: 20,
    width: 100
  }
});
