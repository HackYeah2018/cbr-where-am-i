
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigator } from 'react-navigation'; // 1.0.3

import { Constants, MapView, Location, Permissions } from 'expo';

import { Button, Icon } from 'react-native-elements'; // 0.19.1

import "@expo/vector-icons"; // 6.3.1

export class DetailsScreen extends Component {
  
  state = {
    mapRegion: null,
    hasLocationPermissions: false,
    locationResult: null,
    markers: {},
    initialRegion: null,
    selected: false
  };

  static navigationOptions = (options) => {
    return {
      headerTitle: options.navigation.state.params.title,
      headerTitleStyle: {flex: 1, padding: 0, width: '100%'},
      headerStyle: {flex: 1, padding: 0}
    }
  }
  _getLocationAsync = async () => {
   let { status } = await Permissions.askAsync(Permissions.LOCATION);
   if (status !== 'granted') {
     this.setState({
       locationResult: 'Permission to access location was denied',
     });
   } else {
     this.setState({ hasLocationPermissions: true });
   }

   let location = await Location.getCurrentPositionAsync({});
   this.setState({ locationResult: location });
   
   // Center the map on the location we just fetched.
    this.setState({initialRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922 / 4, longitudeDelta: 0.0421 / 4 }});
  };
  
  componentWillMount() {
    this._getLocationAsync()
    this.getData(this.props.navigation.state.params.url + '*:*')
  }

  getData = async (url) => {
//    alert(url)
    let markers = await fetch('http://cdh-dhs-dn2.australiaeast.cloudapp.azure.com:8983/solr' + url)

    let responseJson = await markers.json();
    //alert(JSON.stringify(responseJson))
    this.setState({markers: responseJson})

  }

  subData = (item) => {
    this.getData(this.props.navigation.state.params.url + item.type)
  }

  setMarkers() {
    if(this.state.markers.response) {
      return (
      this.state.markers.response.docs.map((item, index)=> {
        return <MapView.Marker
          key={index}
          title={item.TYPE ? item.TYPE : this.props.navigation.state.params.title}
          description={this.props.navigation.state.params.description}
          pinColor={'blue'}
          coordinate={{latitude: item.LATITUDE, longitude: item.LONGITUDE}}
          />
      })
      )
    }
  }
  _handleMapRegionChange = mapRegion => {
    console.log(mapRegion);
    this.setState({ mapRegion });
  };
  
  render() {
    const options = this.props.navigation.state.params.options
    
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

        <MapView
          initialRegion={this.state.initialRegion}
          style={{ alignSelf: 'stretch', flex: 1}}
          showsUserLocation={true}
        >
          {this.setMarkers()}
        </MapView>
        {options && options.length > 0 &&
        <View style={{height: 60, alignItems: 'center', flexDirection: 'row'}}>
          {options.map((opt, idx)=>{
            const style = (idx == options.length - 1 ? {} : 
                {borderRightWidth: 1, borderColor: '#ccc'})
            if(idx === this.state.selected) {
              style.backgroundColor = '#aac'
            }
            return <TouchableOpacity
            onPress={()=>{ this.setState({selected: (this.state.selected === idx ? false : idx)}); this.subData(opt) }}
            style={{...style, ...{height: 60, flex: 1, alignItems: 'center', alignContent: 'center', flexDirection: 'row'}}}>
                  <View style={{flex: 1, alignContent: 'center', alignItems: 'center', flexDirection: 'row'}}>{opt.icon}</View></TouchableOpacity>
          })}
        </View>
        }
      </View>
    );
  }
}