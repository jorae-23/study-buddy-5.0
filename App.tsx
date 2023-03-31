import React, {useState}from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import { Alert } from 'react-native';
import axios from 'axios';
import SearchCourse from './screens/SearchCourse';
import {NavigationContainer} from '@react-navigation/native';
import WelcomePage from './screens/WelcomePage'
import { createDrawerNavigator } from '@react-navigation/drawer';
import LibFloorPlan from './screens/LibFloorPlan';
import MyTable from './screens/MyTable';

const Drawer = createDrawerNavigator()
// Pre-step, call this before any NFC operations
export default function App(){
   return(
         <NavigationContainer>
            <Drawer.Navigator initialRouteName='Home' screenOptions={{
               headerStyle: {backgroundColor: '#5488a5'}, // changes the text color of the title bar
               headerTintColor: '#ecf0e4', // changes the background of the title bar
               drawerActiveTintColor: '#ecf0e4', // changes text color of current tab
               drawerActiveBackgroundColor: '#86cba6', // changes the background of selected tab
               drawerInactiveTintColor: '#ecf0e4', // changes the text color of unsed tabs
               drawerInactiveBackgroundColor: '#5488a5', // changes the backgorund of the unused tabs
               drawerStyle: {backgroundColor: '#5488a5'} // changes the background of the whole bar
               }}>
               <Drawer.Screen name= 'Home' component={WelcomePage}/>
               <Drawer.Screen name= 'Library Floor Plan' component={LibFloorPlan}/>
               <Drawer.Screen name= 'My Table' component={MyTable}/>
               <Drawer.Screen name= 'Search Course' component={SearchCourse}/>
            </Drawer.Navigator>
         </NavigationContainer>
   );
};