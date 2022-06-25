import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { useState, useRef } from 'react';
import { Alert, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Button, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default ({ navigation }) => {
  const [IMG, setIMG] = useState()

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []));

  const [usuario, setUsuario] = useState(null);
  const [password, setpassword] = useState(null);
  const [focusNombre, setFocusNombre] = useState(false);
  const presIniciarSesion = async () => {
    setUsuario(null);
    setpassword(null);
    if (!usuario || !password) {
      console.log("Debe Escribir los datos completos");
      Alert.alert("OpenBooks", "Debe Escribir los datos completos");
    }
    else {
      try {
        const response = await fetch('http://192.168.1.72:3001/OpenBooks/login', {
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
          navigation.navigate('Main');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const passwordRef = useRef();
  const buttonRef = useRef();

  return (
    <View style={styles.body}>
      <View >
        <Image source={require('../../assets/Logo.png')} style={styles.img}></Image>

        <TextInput
          placeholderTextColor='#fdffe5'
          value={usuario}
          onChangeText={setUsuario}
          placeholder="Usuario o Correo"
          style={styles.Usuario}
          autoFocus={focusNombre}
          returnKeyType="next"
          onSubmitEditing={() => {
            passwordRef.current.focus();
          }}
        >
        </TextInput>
        <TextInput
          placeholderTextColor='#fdffe5'
          value={password}
          onChangeText={setpassword}
          placeholder="Contraseña"
          style={styles.Contraseña}
          passwordRules=""
          secureTextEntry={true}
          ref={passwordRef}
          returnKeyType="next"
          onSubmitEditing={() => {
            buttonRef.current.focus();
          }}
        >
        </TextInput>
        <TouchableOpacity ref={buttonRef} onSubmitEditing={() => presIniciarSesion} style={styles.Appbutton} onPress={presIniciarSesion}>
          <Text style={styles.AppbuttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.reg}>¿No tienes cuenta? Registrate!</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 5 }} onPress={() => navigation.navigate('Reset')}>
          <Text style={styles.reg}>¿Olvidaste tu contraseña?</Text>
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
  img: {
    width: 300,
    height: 300,
    top: -50,
  },
  Usuario: {
    color: '#FDFFE5',
    fontSize: 18,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    fontWeight: '600',
    paddingLeft: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#F2F2EA',
    paddingRight: 12,
    height: 50,
  },
  Contraseña: {
    color: '#FDFFE5',
    fontSize: 18,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    fontWeight: '600',
    paddingLeft: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#F2F2EA',
    paddingRight: 12,
    height: 50,

  },
  reg: {
    color: 'white',
    fontSize: 15,
    fontStyle: "italic",
    marginLeft: 20,
    marginTop: 10,
    alignContent: 'center',
    justifyContent: 'center'
  },
  Appbutton: {
    backgroundColor: '#da694f',
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