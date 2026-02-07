import React from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OpeningPage = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      
      <Text style={styles.title}>Company_Name</Text>
      <Image
        source={require('../assets/logo.png')}  
        style={styles.logo}
      />
      <Text style={styles.subtitle}>Welcome to <Text style={styles.extra}>Company_Name </Text></Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.signInButton]}  
          onPress={() => navigation.navigate('LogIn')}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.signUpButton]}  
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A2D37',
  },
  logo: {
   alignItems:'center', 
    marginBottom: 20, 
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'white',
  },
  subtitle: {
    fontSize: 30,
    color: '#666',
    marginBottom: 40,
    color:'white',
  },
  buttonContainer: {
    width: '80%', 
    alignItems: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15, 
  },
  signInButton: {
    backgroundColor: '#B64B4B', 
  },
  signUpButton: {
    backgroundColor: '#B64B4B', 
  },
  buttonText: {
    color: '#fff', 
    fontSize: 18,
    fontWeight: 'bold',
  },
  extra:
  {
    fontWeight:'bold',
    color:'#B47C28',
  }
});

export default OpeningPage;
