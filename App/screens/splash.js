import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, Image, View, Button, TextInput } from 'react-native';
//import { Ionicons } from '@expo/vector-icons';
import Login from './src/components/login';


export default function Splash() {
    return (
    <View style={styles.body}>
        <Image source={require('./assets/Logo.png')} style={styles.img}></Image>
      <StatusBar style="auto" />
    </View>
    );
}