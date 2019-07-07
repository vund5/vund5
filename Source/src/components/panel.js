import React, { Component } from "react";
import { StyleSheet, Text, View, Image, TouchableHighlight, Animated } from 'react-native';
import { Icon } from "native-base";
import ToggleSwitch from 'toggle-switch-react-native'

const styles = StyleSheet.create({
    container: {
        // backgroundColor: '#fff',
        // margin:10,
        overflow:'hidden',
        height: 25
    },
    titleContainer : {
        flexDirection: 'row'
    },
    title: {
        flex    : 1,
        padding : 10,
        color   :'#2a2f43',
        fontWeight:'bold'
    },
    button: {
    },
    buttonImage : {
        width   : 30,
        height  : 25
    },
    body: {
        // padding     : 10,
        // paddingTop  : 0
    }
});

export default class Panel extends Component {
    constructor(props){
        super(props);

        this.icons = {
            'up'    : 'ios-arrow-up',
            'down'  : 'ios-arrow-down'
        };

        this.state = {
            title       : props.title,
            expanded    : false,
            animation   : new Animated.Value(25)
        };
    }

    toggle(){
        //Step 1
        let initialValue    = this.state.expanded? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
            finalValue      = this.state.expanded? this.state.minHeight : this.state.maxHeight + this.state.minHeight;
    
        this.setState({
            expanded : !this.state.expanded  //Step 2
        });
    
        this.state.animation.setValue(initialValue);  //Step 3
        Animated.spring(     //Step 4
            this.state.animation,
            {
                toValue: finalValue
            }
        ).start();  //Step 5
    }

    _setMaxHeight(event){
        this.setState({
            maxHeight   : event.nativeEvent.layout.height
        });
    }
    
    _setMinHeight(event){
        this.setState({
            minHeight   : event.nativeEvent.layout.height
        });
    }

    render(){
        let icon = this.icons['down'];

        if(this.state.expanded){
            icon = this.icons['up'];
        }
        return (
            <Animated.View 
                style={[styles.container,{height: this.state.animation}]}>
                <View style={styles.titleContainer} onLayout={this._setMinHeight.bind(this)}>
                    {/* <Text style={styles.title}>{this.state.title}</Text>
                    <TouchableHighlight 
                        style={styles.button} 
                        onPress={this.toggle.bind(this)}
                        underlayColor="#f1f1f1">
                        <Icon name={icon} style={{ color: '#00a87f' }} />
                        <Image
                            style={styles.buttonImage}
                            source={icon}
                        ></Image>
                    </TouchableHighlight> */}
                    <ToggleSwitch
                        isOn={this.state.expanded}
                        onColor='green'
                        offColor='#ddd'
                        label={this.state.title}
                        labelStyle={{color: '#fff', fontWeight: '900', marginLeft: 0}}
                        size='medium'
                        onToggle={this.toggle.bind(this)}
                    />
                </View>

                <View style={styles.body} onLayout={this._setMaxHeight.bind(this)}>
                    {this.props.children}
                </View>

            </Animated.View>
        );
    }
};