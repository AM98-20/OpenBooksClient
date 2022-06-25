import React from 'react';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';


import Login from '../screens/login';
import Loading from '../screens/Loading';
import Menu from '../screens/menu';
import Marcador from '../screens/Marcador';
import Recomendacion from '../screens/Recomendacion';
import Preview from '../screens/Preview';
import Logout from '../screens/logout';
import Settings from '../screens/Settings';
import Signup from '../screens/Signup';
import UpdatePass from '../screens/updatePassword';
import UpdateInfo from '../screens/updateInfo';
import Reset from '../screens/recuperacion';
import uploadImg from '../screens/uploadImg';

const MenuStack = createNativeStackNavigator();
const MenuStackScreen = () => (
  <MenuStack.Navigator screenOptions={{ headerShown: false }}>
    <MenuStack.Screen name="Menu" component={Menu} />
    <MenuStack.Screen name="Preview" component={Preview} />
    <MenuStack.Screen name="Bookmark" component={Marcador} />
    <MenuStack.Screen name="Recommend" component={Recomendacion} />
    <MenuStack.Screen name="Login" component={Login} />
    {/*<MenuStack.Screen name="UpdatePass" comInfoponent={UpdatePass} />*/}
    <MenuStack.Screen name="UpdateInfo" component={UpdateInfo} />
    <MenuStack.Screen name="Upload" component={uploadImg} />
  </MenuStack.Navigator>
);

const AppTabs = createBottomTabNavigator();

const AppTabsScreen = () => (
  <AppTabs.Navigator
    screenOptions={{ headerShown: false, }}>
    <AppTabs.Screen
      name="Books" component={MenuStackScreen}
      options={{
        tabBarIcon: (props) => (
          <Ionicons name="book" size={props.size} color={props.color} />
        ),
      }}
    />
    <AppTabs.Screen
      name="Bookmarks" component={Marcador}
      options={{
        tabBarIcon: (props) => (
          <Ionicons name="bookmark" size={props.size} color={props.color} />
        ),
      }}
    />
    <AppTabs.Screen
      name="What to Read" component={Recomendacion}
      options={{
        tabBarIcon: (props) => (
          <Ionicons name="reader" size={props.size} color={props.color} />
        ),
      }}
    />
  </AppTabs.Navigator>
);

const AppDrawer = createDrawerNavigator();
const AppDrawerScreen = () => (
  <AppDrawer.Navigator screenOptions={{ headerShown: false }}
    drawerPosition="right" initialRouteName="Home" drawerContent={props => {
      return (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          <DrawerItem label="Logout" onPress={() => props.navigation.navigate("Login")} />
        </DrawerContentScrollView>
      )
    }}
    drawerPosition="right">
    <AppDrawer.Screen
      name="Drawer"
      component={AppTabsScreen}
      options={{
        drawerLabel: 'Home',
      }}
    />
    <AppDrawer.Screen
      name="Settings"
      component={Settings}
      options={{
        gestureEnabled: false,
      }}
    />
  </AppDrawer.Navigator>
);

const AuthStack = createNativeStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={Login} />
    <AuthStack.Screen name="Main" component={AppDrawerScreen} />
    <AuthStack.Screen name="Preview" component={Preview} />
    <AuthStack.Screen name="Logout" component={Logout} />
    <AuthStack.Screen name="Signup" component={Signup} />
    <AuthStack.Screen name="Settings" component={Settings} />
    <AuthStack.Screen name="UpdatePass" component={UpdatePass} />
    <AuthStack.Screen name="UpdateInfo" component={UpdateInfo} />
    <AuthStack.Screen name="Reset" component={Reset} />
    <AuthStack.Screen name="Upload" component={uploadImg} />
  </AuthStack.Navigator>
);



export default () => {
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const buscarUsuario = async () => {
    await AsyncStorage.removeItem('usuario');
    await AsyncStorage.removeItem('libros');
    await AsyncStorage.removeItem('tempBook');
    await AsyncStorage.removeItem('marcadores');
    await AsyncStorage.removeItem('tempBookmark');

    const usuario = JSON.parse(await AsyncStorage.getItem('usuario'));

    if (!usuario) {
      console.log("Usuario no autenticado");
      setUsuario(null);
      setIsLoading(false);
    }
    else {
      console.log(usuario.usuario.nombe_usuario + " " + usuario.usuario.apellido_usuario);
      setUsuario(usuario.usuario.nombe_usuario + " " + usuario.usuario.apellido_usuari);
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    setTimeout(() => {
      buscarUsuario();
    }, 300);
  }, []);

  return (
    <NavigationContainer>
      {isLoading ? (<Loading />) : usuario ?
        (<AppDrawerScreen name="Main" />) : (<AuthStackScreen name="Auth" />)}
    </NavigationContainer>
  );
};