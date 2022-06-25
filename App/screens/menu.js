import React from 'react';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function menu({ navigation }) {

  const [usuario, setUsuario] = useState(null);
  const [idusuario, setIdusuario] = useState(null);
  const [libros = [], setLibros] = useState(undefined);
  const [marcadores = [], setMarcadores] = useState(undefined);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      buscarUsuario();
      registroLibros();
      registroMarcadores();
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []));

  const buscarUsuario = async () => {
    var usuario = JSON.parse(await AsyncStorage.getItem('usuario'));
    if (!usuario) {
      console.log("Usuario no autenticado");
      setUsuario(null);
    }
    else {
      setUsuario(JSON.parse(await AsyncStorage.getItem('usuario')));
      console.log(usuario.usuario.nombe_usuario + " " + usuario.usuario.apellido_usuario);
      setIdusuario(usuario.usuario.idusuarios);
      console.log(usuario.usuario.image);
    }
  };
  const registroLibros = async () => {
    var usuario = JSON.parse(await AsyncStorage.getItem('usuario'));
    if (!usuario) {
      console.log("Usuario no autenticado");
      Alert.alert("OpenBooks", "Usuario no autenticado");
    }
    else {
      var token = usuario.token;
      console.log('Bearer ' + token)
      try {
        const response = await fetch('http://192.168.1.72:3001/OpenBooks/libro/lista', {
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
          // console.log(json.msj);
          //Alert.alert("OpenBooks", json.msj);
        }
        else {
          const libros = JSON.stringify(json.data);
          await AsyncStorage.setItem('libros', libros);
          // console.log(json.msj);
          //Alert.alert("OpenBooks", json.msj);
          setLibros(JSON.parse(await AsyncStorage.getItem('libros')));
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  const registroMarcadores = async () => {
    var usuario = JSON.parse(await AsyncStorage.getItem('usuario'));
    const usr = (usuario.usuario.idusuarios);
    if (!usuario) {
      console.log("Usuario no autenticado");
      Alert.alert("OpenBooks", "Usuario no autenticado");
    }
    else {
      var token = usuario.token;
      try {
        const response = await fetch('http://192.168.1.72:3001/OpenBooks/marcador/listar', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          body: JSON.stringify({
            usuario: usr,
          })
        });
        const json = await response.json();
        console.log(json);
        if (json.data.length == 0) {
          // console.log(json.msj);
          // Alert.alert("OpenBooks", json.msj);
        }
        else {
          const marcadores = JSON.stringify(json.data);
          await AsyncStorage.setItem('marcadores', marcadores);
          //console.log(json.msj);
          // Alert.alert("OpenBooks", json.msj);
          setMarcadores(JSON.parse(await AsyncStorage.getItem('marcadores')) || []);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <View style={styles.body}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Image source={{ uri: 'http://192.168.1.72:3001/OpenBooks/profile/img/Logo.png' }} style={styles.img}></Image>
        </TouchableOpacity>
        <Text style={styles.h1}>{idusuario}</Text>
        {!usuario ? (<Image />) : (usuario.usuario.image == null ? (<Image />) : (
          <Image source={{ uri: 'http://192.168.1.72:3001/OpenBooks/profile/img/' + usuario.usuario.image }} style={styles.imgProfile}></Image>
        ))}
      </View>
      <View style={styles.main}>
        <View style={{ flex: 1 }}>
          <View style={styles.viewHeader}>
            <Text style={styles.h2}>Mis Libros</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Bookmark')}>
              <Text style={styles.h4}>Ver Mas</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.slider}>
            <ScrollView style={{ flex: 1 }} horizontal showsHorizontalScrollIndicator={false}>
              {marcadores.length == 0 ? (<View><Text style={styles.nop}>No hay Marcadores</Text></View>) : (
                marcadores.map((item, key) => {
                  return (
                    <TouchableOpacity key={key} onPress={() => navigation.navigate('Preview', { id: item.idlibros })}>
                      <Image source={{ uri: item.img_libro }} style={styles.imgP} />
                    </TouchableOpacity>
                  )
                })
              )}

            </ScrollView>
          </View>
        </View>
        <View style={styles.list}>
          <View style={styles.viewHeader}>
            <Text style={styles.h2}>Libros</Text>
          </View>
          <ScrollView style={{ flex: 1 }}>
            {
              libros.map((item, key) => {
                return (
                  <TouchableOpacity key={key} onPress={() => navigation.navigate('Preview', { id: item.idlibros })}>
                    <View style={{ flexDirection: 'row' }}>
                      <Image source={{ uri: item.img_libro }} style={styles.imgPa} />
                      <View style={styles.sideDesc}>
                        <View>
                          <Text style={styles.h3}>{item.nombre_libro}</Text>
                          <Text style={styles.h4}>{item.autore.nombre_autor}</Text>
                        </View>
                        <View>
                          <Text style={styles.h4}>Paginas: {item.num_paginas}</Text>
                          <Text style={styles.genero}>{item.generos_literario.generos_literarios}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              })
            }
          </ScrollView>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    marginTop: 0,
    flex: 1,
    backgroundColor: '#272725',
  },
  header: {
    margin: 15,
    padding: 5,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
  },
  viewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    marginBottom: 5
  },
  main: {
    margin: 25,
    marginBottom: 0,
    flex: 6
  },
  slider: {
    flex: 1,
    flexDirection: "row",
  },
  list: {
    flex: 1,
  },
  footer: {
    margin: 0,
    backgroundColor: "#808c5c",
    flex: 0.8,
    flexDirection: "row",
    width: "100%"
  },
  h1: {
    color: '#fdffe5',
    fontSize: 25,
    fontWeight: "bold"
  },
  h2: {
    color: '#fdffe5',
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold"
  },
  h3: {
    color: '#fdffe5',
    fontSize: 16,
    fontWeight: "bold"
  },
  h4: {
    color: "#767676",
    fontSize: 16,
    fontWeight: "bold"
  },
  texto: {
    color: "#fefe",
    fontSize: 30,
    fontWeight: "bold",
    padding: 0
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: 45
  },
  imgProfile: {
    width: 50,
    height: 50,
    borderRadius: 45
  },
  imgP: {
    width: 130,
    height: 200,
    marginRight: 20,
    borderRadius: 10
  },
  imgPa: {
    width: 100,
    height: 150,
    marginBottom: 20,
    borderRadius: 10
  },
  sideDesc: {
    marginVertical: 20,
    marginLeft: 15,
    justifyContent: 'space-between'
  },
  genero: {
    color: 'grey',
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    textAlign: 'center',
    borderRadius: 40,
    paddingHorizontal: 10,
    paddingVertical: 2
  },
  nop: {
    justifyContent: 'center',
    color: '#FDFFE5',
    fontSize: 30
  }
});