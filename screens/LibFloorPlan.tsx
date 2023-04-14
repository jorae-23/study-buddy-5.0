//import React, {useState}from 'react';
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ImageBackground, Image, Dimensions} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import { Alert } from 'react-native';
import axios from 'axios';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Box, Canvas, Rect, SkImage, rect, rrect, translate, transformOrigin } from '@shopify/react-native-skia';
import FirstFloor from './../screens/FirstLevelCropped.png';
//import {Dimensions} from 'react-native';
//import Image from 'react-native-scalable-image';


//<ImageBackground source={require('./FirstLevelCropped.png')} style= {[styles.background]}>
//</ImageBackground>  

const {width, height} = Dimensions.get('window'); 

const screenWidth = width;
const screenHieght = height;

export default function LibFloorPlan(){
   
    return(
        
        <SafeAreaView style = {styles.SafeAreaViewContainer}>

            <Image 
                style= {styles.floor}
                source={require('./FirstLevelCropped.png')} 
            />
            <View style = {styles.tables}>
                
                
                <Canvas style={styles.tables}>
                    <Box color = "yellow" box= {rrect(rect(screenWidth/2 -10, screenHieght/2 -10, 20, 20), 5, 5)}></Box>
                    <Box color = "red" box= {rrect(rect(322, 540, 20, 20), 5, 5)}></Box>
                    <Box color = "blue" box= {rrect(rect(322, 493, 20, 20), 5, 5)}></Box>
                    <Box color = "red" box= {rrect(rect(330, 454, 10, 10), 2, 2)}></Box>
                    <Box color = "green" box= {rrect(rect(330, 443, 10, 10), 2, 2)}></Box>
                </Canvas>
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
   SafeAreaViewContainer:{
    flex: 1,
    //minWidth: '100%',
    //minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    //backgroundColor: '#ECF0E4'
   },

   background:{
    flex: 1,
    resizeMode: 'contain',
    //margin: '3%'
   },

   floor:{
    height: 500,
    width: 500/1.5,
    position: 'absolute',
    top: screenHieght/2 -250,
    left: screenWidth/2 - 166.5,
   
   },

   tables:{
    ... StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    
    //position: 'absolute',

   }, 

   table1:{
    height: 20,
    width: 20,
    color: 'red',
   }

});