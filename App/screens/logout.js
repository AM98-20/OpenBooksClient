import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Button, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default ({ navigation }) => {

  const [usuario, setUsuario] = useState(null);
  const [password, setpassword] = useState(null);
  const [focusNombre, setFocusNombre] = useState(false);
  const presIniciarSesion = async () => {
    if (!usuario || !password) {
      console.log("Debe Escribir los datos completos");
      Alert.alert("OpenBooks", "Debe Escribir los datos completos");
    }
    else {
      try {
        const response = await fetch('http://10.0.0.226:3001/OpenBooks/login', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            usuario: usuario,
            password: password
          })
        });
        const json = await response.json();
        console.log(json);
        if (json.data.length == 0) {
          console.log(json.msj);
          Alert.alert("OpenBooks", json.msj);
        }
        else {
          const usuario = JSON.stringify(json.data);
          await AsyncStorage.setItem('usuario', usuario);
          console.log(json.msj);
          Alert.alert("OpenBooks", json.msj);
          AsyncStorage.getItem('usuario', (err, result) => {
            console.log(result);
          });
          navigation.navigate('Main');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  const verAlmacenamiento = async () => {
    var usuario = JSON.parse(await AsyncStorage.getItem('usuario'));
    if (!usuario) {
      console.log("Usuario no autenticado");
      Alert.alert("OpenBooks", "Usuario no autenticado");
    }
    else {
      var token = usuario.token;
      console.log('Bearer ' + token)
      try {
        const response = await fetch('http://192.168.1.72:3001/api/tipos/lista', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          }
        });
        const json = await response.json();
        console.log(json);
        if (json.data.length == 0) {
          Alert.alert("OpenBooks", json.msj);
        }
        else {
          Alert.alert("OpenBooks", json.msj);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  const cerrarSesion = async () => {
    await AsyncStorage.removeItem('usuario');
    await AsyncStorage.removeItem('libros');
    await AsyncStorage.removeItem('tempBook');
    await AsyncStorage.removeItem('marcadores');
    console.log("Sesion Cerrada");
    Alert.alert("OpenBooks", "Sesion Cerrada");
    navigation.navigate('Login');
  };

  return (
    <View style={styles.body}>
      <View style={styles.header}>
        <TouchableOpacity style={{ width: 50 }} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-circle-outline" size={40} style={styles.img} />
        </TouchableOpacity>
        <Text style={styles.h2}>Log Out</Text>
      </View>
      <View style={styles.main}>
        <Image source={require('../../assets/Logo.png')} style={styles.img}></Image>
        <TouchableOpacity style={styles.AppbuttonRed} onPress={cerrarSesion}>
          <Text style={styles.AppbuttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Appbutton} onPress={() => navigation.goBack()}>
          <Text style={styles.AppbuttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#272826',
  },
  header: {
    padding: 10,
    paddingTop: 30,
    flex: 0.3,
    flexDirection: 'row',
  },
  main: {
    margin: 25,
    marginBottom: 0,
    flex: 6
  },
  img: {
    width: 300,
    height: 300,
    top: -120,
  },
  h1: {
    color: 'blue',
    fontSize: 15,
    fontStyle: "italic",
    marginLeft: 20,
    marginTop: 8,
  },
  AppbuttonRed: {
    backgroundColor: '#a54a48',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginLeft: 50,
    marginTop: 20,
    width: 200,
    shadowColor: '#393E46',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.45,
  },
  Appbutton: {
    backgroundColor: '#fcfae5',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginLeft: 50,
    marginTop: 20,
    width: 200,
    shadowColor: '#393E46',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.45,
  },
  AppbuttonText: {
    fontSize: 14,
    color: "#272826",
    alignSelf: "center",
    textTransform: "uppercase",
    fontWeight: 'bold',
  },
});