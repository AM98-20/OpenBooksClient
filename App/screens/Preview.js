import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Updates } from 'expo';

import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';

export default function Preview({ route, navigation }) {

  const saveFile = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {

      FileSystem.downloadAsync(libro.libro, FileSystem.documentDirectory + libro.nombre_libro + ".pdf")
        .then(async ({ uri }) => {
          await MediaLibrary.createAssetAsync(uri);
          Alert.alert("Descarga completada");
        }).catch((err) => {
          console.log(err);
        })
    }
  }
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
          console.log(json.msj);
          Alert.alert("OpenBooks", json.msj);
        }
        else {
          const marcadores = JSON.stringify(json.data);
          await AsyncStorage.setItem('marcadores', marcadores);
          console.log(json.msj);
          Alert.alert("OpenBooks", json.msj);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const { id } = route.params;
  const [libro = [], setLibro] = useState(undefined);
  const [marcador, setMarcador] = useState(null);

  React.useEffect(() => {
    setTimeout(() => {
      verAlmacenamiento();
    }, 300);
  }, []);

  const verAlmacenamiento = async () => {
    var usuario = JSON.parse(await AsyncStorage.getItem('usuario'));
    if (!usuario) {
      console.log("Usuario no autenticado");
      Alert.alert("OpenBooks", "Usuario no autenticado");
    }
    else {
      var token = usuario.token;
      //console.log('Bearer ' + token)
      try {
        const response = await fetch('http://192.168.1.72:3001/OpenBooks/libro/preview', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          body: JSON.stringify({
            id: id
          })
        });
        const json = await response.json();
        //console.log(json);
        if (json.data.length == 0) {
          Alert.alert("OpenBooks", json.msj);
        }
        else {
          const temp = JSON.stringify(json.data)
          await AsyncStorage.setItem('tempBook', temp);
          setLibro(JSON.parse(await AsyncStorage.getItem('tempBook')));
          //console.log(libro.autore)
        }
      } catch (error) {
        console.log(error);
      }
      //marcador
      try {
        const response = await fetch('http://192.168.1.72:3001/OpenBooks/marcador/buscar', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          body: JSON.stringify({
            idlibros: id,
            idusr: usuario.usuario.idusuarios
          })
        });
        const json = await response.json();
        //console.log(json);
        if (json.data == null) {
          //Alert.alert("OpenBooks", json.msj);
          console.log('no hay marcador');
        }
        else {
          const temp = JSON.stringify(json.data)
          await AsyncStorage.setItem('tempBookmark', temp);
          setMarcador(JSON.parse(await AsyncStorage.getItem('tempBookmark')));
          if (marcador != undefined) {
            console.log(" EL MARMACOR ES ....... " + marcador.nombre_libro);
          }else{
            console.log(' regitro guardado previamente');
          }
        }

      } catch (error) {
        console.log(error);
      }
    }
  };

  const switchMarcador = async () => {
    var usuario = JSON.parse(await AsyncStorage.getItem('usuario'));
    if (!usuario) {
      console.log("Usuario no autenticado");
      Alert.alert("OpenBooks", "Usuario no autenticado");
    }
    else {
      var token = usuario.token;
      if (marcador == null) {
        try {
          const response = await fetch('http://192.168.1.72:3001/OpenBooks/marcador/guardar', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
              idlibros: id,
              idusr: usuario.usuario.idusuarios
            })
          });
          const json = await response.json();
          //console.log(json);
          if (json.data == null) {
            //Alert.alert("OpenBooks", json.msj);
            console.log('no hay marcador');
          }
          else {
            const temp = JSON.stringify(json.data)
            await AsyncStorage.setItem('tempBookmark', temp);
            setMarcador(JSON.parse(await AsyncStorage.getItem('tempBookmark')));
            console.log(" EL MARMACOR ES ....... " + marcador.nombre_libro);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          Alert.alert("OpenBooks", "no se puede eliminar?")
          const response = await fetch('http://192.168.1.72:3001/OpenBooks/marcador/eliminar', {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
              idlibros: id,
              idusr: usuario.usuario.idusuarios
            })
          });
          const json = await response.json();
          //console.log(json);
          if (json.data.length == 0) {
            Alert.alert("OpenBooks", json.msj);
            console.log('no hay marcador');
          }
          else {
            const temp = JSON.stringify(json.data)
            await AsyncStorage.setItem('tempBookmark', temp);
            setMarcador(JSON.parse(await AsyncStorage.getItem('tempBookmark')));
            console.log(" EL MARMACOR ES ....... " + marcador.nombre_libro);
          }
        } catch (error) {
          console.log(error);
        }
      }

    }
    //registroMarcadores();
    verAlmacenamiento();
  }

  return (
    <View style={styles.body}>
      <View style={styles.header}>
        <TouchableOpacity style={{ width: 50 }} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-circle-outline" size={40} style={styles.img} />
        </TouchableOpacity>
        <Text style={styles.h2}>Detalles del Libro</Text>
      </View>
      <View style={styles.container1}>
        <Image source={{ uri: libro.img_libro }} style={{ width: 150, height: 250, borderRadius: 10 }} />
        <Text style={styles.h2}>{libro.nombre_libro}</Text>
        <Text style={styles.sub}>{libro.autore == undefined ? "" : libro.autore.nombre_autor} - Editorial: {libro.editorial}</Text>
      </View>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.h3}>Descripcion</Text>
          <Text></Text>
          <Text style={styles.text}>
            {libro.descripcion}
          </Text>
        </ScrollView>
      </View>

      <View style={styles.containerBotones}>
        <View style={styles.fixToText}>
          <FontAwesome.Button style={{ width: 100, height: 50, justifyContent: 'center', borderColor: '#A54A48' }} name="bookmark" backgroundColor={marcador ? '#A54A48' : '#a9a9a91c'} onPress={switchMarcador}></FontAwesome.Button>
          <FontAwesome.Button style={{ width: 200, height: 50, justifyContent: 'center' }} name="download" backgroundColor="#A54A48" onPress={saveFile}>   Descargar</FontAwesome.Button>

        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#FDFFE5',
  },
  header: {
    padding: 10,
    paddingTop: 30,
    flex: 0.3,
    flexDirection: 'row',
  },
  h2: {
    color: '#000000',
    fontSize: 25,
    fontWeight: "bold",
    alignItems: 'center',
    paddingTop: 6,
    justifyContent: 'center'
  },
  sub: {
    color: '#767676',
    fontSize: 15,
    fontWeight: "bold",
    alignItems: 'center',
    paddingTop: 6,
    justifyContent: 'center'
  },
  h3: {
    color: '#FFF',
    fontSize: 25,
    fontWeight: "bold",
    alignItems: 'center'
  },
  container1: {
    flex: 2,
    backgroundColor: '#FDFFE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#272725',
    color: '#000',
    margin: 0,
    padding: 20,
    paddingHorizontal: 50
  },
  scrollView: {

  },
  text: {
    fontSize: 15,
    color: '#FFF'
  },
  containerBotones: {
    flex: 0.3,
    backgroundColor: '#272725',
    paddingHorizontal: 20
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
