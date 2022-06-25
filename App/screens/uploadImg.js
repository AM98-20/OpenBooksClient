import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, BackHandler } from 'react-native';

export default function updatePassword({ navigation }) {
    const [imageFile, setImageFile] = useState("");

    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is
            setImageFile("");
            cargarUsuario();
            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, []));

    const [usuario, setUsuario] = useState(null);

    const cargarUsuario = async () => {
        var usuario = JSON.parse(await AsyncStorage.getItem('usuario'));
        setUsuario(usuario.usuario.idusuarios);
    }

    const guardar = async () => {
        var usuarioA = JSON.parse(await AsyncStorage.getItem('usuario'));
        if (!usuarioA) {
            console.log("Usuario no autenticado");
            Alert.alert("OpenBooks", "Usuario no autenticado");
        }
        else if (imageFile == null) {
            Alert.alert("OpenBooks", "Debe seleccionar una imagen.");
        } else {
            const image = new FormData();
            image.append('image', {
                uri: imageFile,
                type: 'image/jpg',
                name: 'image.jpg'
            });
            var token = usuarioA.token;
            try {
                const response = await fetch('http://192.168.1.72:3001/OpenBooks/files/image', {
                    method: 'POST',
                    headers: {
                        //'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + token,
                    },
                    body: image,
                });
                const json = await response.json();
                console.log(json);
                if (json.data.length == 0) {
                    console.log(json.msj);
                    Alert.alert("OpenBooks", json.msj);
                }
                else {
                    await AsyncStorage.mergeItem('usuario', JSON.stringify({usuario: {image: json.data.image}}));
                    console.log(JSON.parse(await AsyncStorage.getItem('usuario')));
                    Alert.alert("OpenBooks", json.msj);
                    navigation.navigate('Main');
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    let openImagePickerAsync = async () => {
        try {
            let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permissionResult.granted === false) {
                alert("Permission to access camera roll is required!");
                return;
            }
            //Alert.alert("OpenBooks", "Espere mientras carga el recurso.");
            let pickerResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                //base64: true, //<-- boolean base64
                aspect: [4, 4],
                quality: 1,
            });
            console.log("AQUI SE SUPONE");
            setImageFile((pickerResult.uri));//.
            if (!pickerResult.cancelled) {
                //console.log(pickerResult);
                //replace("file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FOpenBooksDemo-54a5b1cf-062a-4c34-9c34-c5dffa0b30f4/ImagePicker/", '')

                console.log(imageFile);

            } else if (imageFile != undefined) {
                Alert.alert("OpenBooks", "Recurso cargado.");

            } else {
                Alert.alert("OpenBooks", "El recurso no pudo cargar. Intente de nuevo.");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={{ width: 50 }} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back-circle-outline" size={40} />
                </TouchableOpacity>
            </View>
            <View style={styles.body}>
                <View style={styles.form}>

                    <TouchableOpacity onPress={openImagePickerAsync} style={styles.buttonFiles}>
                        <Text>Seleccione una imagen</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={guardar}>
                        <Text style={styles.btntext}>Establecer Imagen</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#272826',

    },
    body: {
        margin: 40,
        marginVertical: 10
    },
    header:
    {
        fontSize: 30,
        color: '#000',
        paddingBottom: 10,
        marginBottom: 40,
        borderBottomColor: '#199187',
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
        borderBottomColor: '#CAC3B2',
        borderBottomWidth: 1,
    },
    button:
    {
        alignSelf: 'stretch',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#808C5C',
        marginTop: 10,
    },
    buttonFiles: {
        alignSelf: 'stretch',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#2A9DF4',
        marginTop: 30,
    },

});