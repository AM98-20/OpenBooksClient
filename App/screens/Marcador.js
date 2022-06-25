import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


export default function Marcador({ navigation }) {

  const [marcadores = [], setMarcadores] = useState(undefined);
  const [imageUrl, setImageUrl] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
          listaMarcadores();
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []));

  const listaMarcadores = async () => {
    setMarcadores(JSON.parse(await AsyncStorage.getItem('marcadores')) || []);
  };

  return (
    <View style={styles.body}>
      <View style={styles.header}>
        <Text style={styles.h1}>Marcadores</Text>
      </View>
      <View style={styles.list}>
        <View style={styles.viewHeader}>
          <Text style={styles.h2}>Libros</Text>
        </View>
        <ScrollView style={{ flex: 1 }}>
          {marcadores.length == 0 ? (<View><Text style={styles.nop}>No hay Marcadores</Text></View>) : (

            marcadores.map((item, key) => {
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
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })
          )}

        </ScrollView>
      </View>
      <StatusBar style="auto" />
    </View>
  );

}

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
  },
  containerBotones: {
    backgroundColor: '#272715',
    marginHorizontal: 20,
    bottom: 80
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  body: {
    marginTop: 0,
    flex: 1,
    backgroundColor: '#272725',
  },
  header: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    marginBottom: 5,
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
    flex: 2,
    margin: 20,
    marginTop: 0
  },
  footer: {
    margin: 0,
    backgroundColor: "#808c5c",
    flex: 0.8,
    flexDirection: "row",
    width: "100%"
  },
  h1: {
    marginTop: 35,
    color: '#FDFFE5',
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
    alignContent: 'center',
    color: '#FDFFE5',
    fontSize: 30
  }
});