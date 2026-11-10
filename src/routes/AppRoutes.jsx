import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LandingScreen from '../screens/LandingScreens';
import { LoginScreen } from '../screens/LoginScreen';
import { UserTypeScreen } from '../screens/UserTypeScreen';
import RegisterTypeScreen from '../screens/RegisterTypeScreen';
import { RegisterBrigadistaScreen } from '../screens/RegisterBrigadistaScreen';
import { RegisterFuncionarioScreen } from '../screens/RegisterFuncionarioScreen';
import { CadastroScreen } from '../screens/CadastroScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ListaAlertasScreen } from '../screens/ListaAlertasScreen';
import { StatusOcorrenciaScreen } from '../screens/StatusOcorrenciaScreen';

const Stack = createNativeStackNavigator();

export function AppRoutes() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="UserType" component={UserTypeScreen} />
        <Stack.Screen name="RegisterType" component={RegisterTypeScreen} />
        <Stack.Screen name="RegisterBrigadista" component={RegisterBrigadistaScreen} />
        <Stack.Screen name="RegisterFuncionario" component={RegisterFuncionarioScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="ListaAlertas" component={ListaAlertasScreen} />
        <Stack.Screen name="StatusOcorrencia" component={StatusOcorrenciaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppRoutes;
