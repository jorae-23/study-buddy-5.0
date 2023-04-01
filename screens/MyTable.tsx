import React, {useState}from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import { Alert } from 'react-native';
import axios from 'axios';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Canvas, rect, Rect,Box, SkiaView,Text as SkiaText, useFont, SkFont} from '@shopify/react-native-skia';
import DeviceInfo from 'react-native-device-info';


 async function PutUniqueDeviceId(){
    const uniqueId =  await DeviceInfo.getUniqueId()
    const tableNum = 10
    await axios.put(`http://44.203.31.97:3001/practi/${uniqueId}/${tableNum}`)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.error(error)
      })
}

function ok(){
    PutUniqueDeviceId()
    return(
        <Text>Yummy</Text>
    )
}

export default function MyTable(){
    return(
    <View>
        <Text>My table</Text>
        <Text>Broad Cast</Text>
        <Canvas style={{width: 500, height: 500}}>
            <Box box={rect(115,350,150,150)}></Box>
        </Canvas>
        {ok()}
    </View>
    )
}
