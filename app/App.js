import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Create from './components/Create';
import Details from './components/Details';
import Edit from './components/Edit';
import Booking from './components/Booking';
import Service from './components/Service';
import Login from './components/LogIn';
import Registration from './components/Register';
import OpeningPage from './components/OpeningPage';
import Orders from './components/Order';
import EditOrder from './components/EditOrder';
import FeedbackPage from './components/FeedbackPage';

const Stack = createStackNavigator()


function App() {
  return (
    
    <View style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen name="OpeningPage" component={OpeningPage} options={{ headerShown: false }} />
        <Stack.Screen name="Service" component={Service} options={{ headerShown: false }} />
        <Stack.Screen name = "Orders" component={Orders} options={{ headerShown: false }} />
        <Stack.Screen name = "EditOrder" component={EditOrder} options={{ headerShown: false }} />
        <Stack.Screen name = "LogIn" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name = "Register" component={Registration} options={{ headerShown: false }} />
        <Stack.Screen name="Booking" component={Booking} options={{ headerShown: false }} />
        <Stack.Screen name="FeedbackPage" component={FeedbackPage} options={{ headerShown: false }} />
        <Stack.Screen name="Create" component={Create} options={{ headerShown: false }}  />
        <Stack.Screen name="Details" component={Details} options={{ headerShown: false }}  />
        <Stack.Screen name="Edit" component={Edit}  options={{ headerShown: false }} />
      </Stack.Navigator>
      
      <StatusBar style="inverted" />
    </View>
  );
}

export default() => {
  return(
    <NavigationContainer>
      <App/>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tan',
  },
});

