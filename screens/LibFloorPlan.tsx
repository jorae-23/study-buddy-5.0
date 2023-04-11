import React, {useState}from 'react';
import {View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ImageBackground} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import { Alert } from 'react-native';
import axios from 'axios';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Box, Canvas, Image, Rect, rect, rrect } from '@shopify/react-native-skia';

export default function LibFloorPlan(){
    return(
        <SafeAreaView style = {styles.container}>
            
            <ImageBackground source={require('./FirstLevelCropped.png')} style= {[styles.background]}>
            <Canvas style={{flex: 1}}>
            <Box color = "red" box= {rrect(rect(322, 540, 20, 20), 5, 5)}></Box>
            <Box color = "red" box= {rrect(rect(322, 493, 20, 20), 5, 5)}></Box>
            <Box color = "red" box= {rrect(rect(330, 454, 10, 10), 2, 2)}></Box>
            <Box color = "green" box= {rrect(rect(330, 443, 10, 10), 2, 2)}></Box>
            </Canvas>
            </ImageBackground>     

        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
   container:{
    flex: 1,
    backgroundColor: '#ecf0e4',
   },

   background:{
    flex: 1,
    margin: '3%',
    resizeMode: 'contain'
   }

});