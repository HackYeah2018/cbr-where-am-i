// NAVIGATION !!
// react-navigation...

import React, { Component } from 'react';
import { Button as RNButton, View, Text, TextInput, Image, StyleSheet, NativeModules, LayoutAnimation, TouchableOpacity } from 'react-native';
import { StackNavigator } from 'react-navigation'; // Version can be specified in package.json

import { Constants, MapView, Location, Permissions } from 'expo';
import { Button, Icon } from 'react-native-elements'; // Version can be specified in package.json
import { Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

// Define UIManager const
const { UIManager } = NativeModules;

// Enable Animation Experimental
//UIManager.setLayoutAnimationEnabledExperimental &&
  //UIManager.setLayoutAnimationEnabledExperimental(true);

import { DetailsScreen } from './components/Details'

const rating = <Ionicons name='ios-star-outline' />

const iconName = (text) => {
  return <Text style={{textAlign: 'center', flex: 1}}>{text}</Text>  
}

const buttons = [

  {icon: <Entypo raised name='air' type={'entypo'} style={{paddingTop: 3, fontSize: 20}} color='#fff'/>, 
    title: 'Family',
    description: 'Please the facility...',
    text: 'BBQ, Playground',
    url: '/act_sport_grounds_locations/query?rows=1000&q=',
    options: [
      {icon: iconName('BBQ'), type: 'CATEGORY:"BBQ"'},
      {icon: iconName('Playground'), type: 'CATEGORY:"Playground"'},
    ]    
  },
  {icon: <View style={{flexDirection: 'row'}}><Ionicons raised name='md-man' style={{paddingTop: 3, fontSize: 20}} color='#fff'/><Ionicons raised name='md-woman' style={{paddingTop: 3, paddingLeft: 2, fontSize: 20}} color='#fff'/></View>, 
    title: 'Amenities',
    text: 'Drinking Fountains & Toilets',
    url: '/act_amenities/query?rows=1000&q=',
    description: 'Please rate your experience...',
    options: [
      {icon: iconName('Drinking Fountains'), type: 'CATEGORY:"Drinking Fountain"'},
      {icon: iconName('Toilets'), type: 'CATEGORY:Toilet'}
    ]
  },
  {icon: <View style={{flexDirection: 'row'}}><Ionicons raised name='ios-tennisball' style={{paddingTop: 3, fontSize: 20}} color='#fff'/></View>, 
    title: 'Sports', 
    text: 'Basketball, Fitness, Skate Parks',
    url: '/act_sport_grounds_locations/query?f=type:*&rows=1000&q=',
    description: 'Please rate this facility...',
    options: [
      {icon: iconName('Basketball'), type: 'CATEGORY:"Basketball Court"'},
      {icon: iconName('Skate Park'), type: 'CATEGORY:"Skate Park"'},
    ]
  },
  {icon: <View style={{flexDirection: 'row'}}><MaterialCommunityIcons raised name='recycle' style={{paddingTop: 3, fontSize: 20}} color='#fff'/></View>, 
    title: 'Recycling',
    text: 'Batteries, Lightbulbs, Soft Plastics',
    description: 'Please rate this facility...',
    url: '/act_recycling/query?f=type:*&rows=1000&q=',    
    options: [
      {icon: iconName('Batteries'), type: 'CATEGORY:"Battery Disposal"'},
      {icon: iconName('Lightbulbs'), type: 'CATEGORY:"Lightbulbs"'},
      {icon: iconName('Soft Plastics'), type: 'CATEGORY:"Soft Plastics'}
    ]
  }  


]

const styles = StyleSheet.create({
 
 MainContainer: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   width: '100%',
   opacity: 0.8,
   top: -60,
   height: '112%',
   position: 'absolute'
 }
 
});

class HomeScreen extends Component {

  state = {
    buttons: []
  }

  static navigationOptions = (options) => {
    return {
      header: null
    }
  }

  componentDidMount() {
    if(!this.state.buttons.length) {
      setTimeout(()=>{
            // Call animation method prior to state change
      LayoutAnimation.spring();
      this.setState({buttons})
      }, 500)
    }
  }

  render() {
    let { navigation: { navigate } } = this.props
    
    const im = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Parliament_House_Canberra_Dusk_Panorama.jpg/800px-Parliament_House_Canberra_Dusk_Panorama.jpg'
    
    return (
      <View style={{ flex: 1 }}>
        
        <Image source={ {uri: im} } style={styles.MainContainer} />   
        
        <View style={{top: 150}}>
          <Text style={{textAlign: 'center', fontSize:25, width: '100%', color:'white'}}>I want to find:</Text>
          {this.state.buttons.map(button=>{
            const { icon, title, text } = button

            return (
              <View style={{opacity: 0.8, paddingTop: 15}}>
                  <TouchableOpacity 
                    onPress={()=>navigate('Details', button)}
                    style={{marginLeft: 15, marginRight: 15, backgroundColor: '#f44', padding: 15, borderRadius: 5}}
                    >
                  <View>
                    <View style={{flexDirection: 'row', width:220, alignItems:'center'}}>
                      {icon}
                      <Text style={{paddingLeft: 10, fontSize:20, color: '#fff'}}>{title}</Text></View>{text && <Text style={{color: 'white'}}>{text}</Text>}</View>
                  </TouchableOpacity>              
                
              </View>
            )
          })}
          {this.state.buttons.length > 0 && 
          <Text style={{paddingTop: 10, textAlign: 'center', fontSize:18, width: '100%', color:'#ccc'}}>Make a Suggestion | view more...</Text>}
        </View>
        
      </View>

    );
  }
}



const RootStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Details: {
      screen: DetailsScreen,
    },
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}