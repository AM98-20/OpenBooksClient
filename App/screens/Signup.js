import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function Signup({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const [password, setpassword] = useState(null);
  const [nombre, setNombre] = useState(null);
  const [apellido, setApellido] = useState(null);
  const [mail, setMail] = useState(null);
  const guardar = async () => {
    if (!usuario || !password) {
      console.log("Debe Escribir los datos completos");
      Alert.alert("OpenBooks", "Debes Escribir los datos completos");

    }
    if (!nombre || !apellido) {
      console.log("Debe Escribir los datos completos");
      Alert.alert("OpenBooks", "Debes Escribir los datos completos");

    }
    if (!mail) {
      console.log("Debe Escribir los datos completos");
      Alert.alert("OpenBooks", "Debes Escribir los datos completos");

    } else {
      try {
        const response = await fetch('http://192.168.1.72:3001/OpenBooks/usuario/guardar', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            idusuarios: usuario,
            password: password,
            nombre_usuario: nombre,
            apellido_usuario: apellido,
            email: mail,
            rol: "CLIENT"
          })
        });
        const json = await response.json();
        console.log(json);
        if (json.data.length == 0) {
          console.log(json.msj);
          Alert.alert("OpenBooks", json.msj);
        }
        else {
          Alert.alert("OpenBooks", json.msj);
          navigation.goBack();
        }
      } catch (error) {
        console.error(error);
      }


    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <View style={styles.header}>
          <TouchableOpacity style={{ width: 50 }} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back-circle-outline" size={40} style={styles.img} />
          </TouchableOpacity>
          <Text style={styles.headerT}>Registro</Text>
        </View>
        <View style={styles.form}>
          <TextInput value={nombre}
            onChangeText={setNombre}
            style={styles.textinput}
            placeholder="Ingrese su Nombre"
            underlineColorAndroid={'transparent'} />
          <TextInput value={apellido}
            onChangeText={setApellido}
            style={styles.textinput} placeholder="Ingrese su Apellido"
            underlineColorAndroid={'transparent'} />
          <TextInput value={mail}
            onChangeText={setMail}
            style={styles.textinput} placeholder="Ingrese un Correo Electronico"
            underlineColorAndroid={'transparent'} />
          <TextInput value={usuario}
            onChangeText={setUsuario}
            style={styles.textinput} placeholder="Ingrese un usuario."
            underlineColorAndroid={'transparent'} />
          <TextInput value={password}
            onChangeText={setpassword}
            style={styles.textinput} placeholder="Ingrese una Contraseña"
            secureTextEntry={true} underlineColorAndroid={'transparent'} />
          <TouchableOpacity style={styles.button} onPress={guardar}>
            <Text style={styles.btntext}>Registrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FDFFE5',
  },
  body: {
    margin: 40
  },
  header:
  {
    fontSize: 30,
    color: '#000',
    paddingBottom: 10,
    marginBottom: 40,
    borderBottomColor: '#199187',
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  headerT:
  {
    fontSize: 30,
    color: '#000',
    alignSelf: 'center',
    alignContent: 'center'
  },
  textinput:
  {
    alignSelf: 'stretch',
    height: 50,
    marginBottom: 50,
    color: '#000',
    borderBottomColor: '#f8f8f8',
    borderBottomWidth: 1,
  },

  button:
  {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#DA694F',
    marginTop: 30,

  }

});