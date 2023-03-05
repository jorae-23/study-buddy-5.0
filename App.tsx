import React, {useState}from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import { Alert } from 'react-native';
import axios from 'axios';
import SearchCourse from './components/SearchCourse';
import {NavigationContainer} from '@react-navigation/native';
import WelcomePage from './components/WelcomePage'
import { createDrawerNavigator } from '@react-navigation/drawer';
import LibFloorPlan from './components/LibFloorPlan';
import MyTable from './components/MyTable';




const Drawer = createDrawerNavigator()
// Pre-step, call this before any NFC operations
export default function App(){
   return(
      <NavigationContainer>
         <Drawer.Navigator initialRouteName='Welcome'>
            <Drawer.Screen name= 'Welcome' component={WelcomePage}/>
            <Drawer.Screen name= 'Library Floor Plan' component={LibFloorPlan}/>
            <Drawer.Screen name= 'My Table' component={MyTable}/>
            <Drawer.Screen name= 'Search Course' component={SearchCourse}/>
         </Drawer.Navigator>
      </NavigationContainer>
      
   )
}
