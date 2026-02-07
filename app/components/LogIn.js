import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginUser = () => {
        if (email.length === 0) {
            alert("Email has left Blank!");
        } else if (password.length === 0) {
            alert("Password has left Blank!");
        } else {
            console.log('Email:', email);  
            console.log('Password:', password);  
    
            fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, password: password })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.error) {
                    alert(data.error);  
                } else {
                   
                    AsyncStorage.setItem('userEmail', email).then(() => {
                        AsyncStorage.setItem('userRole', data.role) 
                        .then(() => {
                            
                            props.navigation.reset({
                                index: 0,
                                routes: [{ name: 'Service' }], 
                            });
                        });
                    });
                }
            })
            .catch((error) => {
                console.log('Error:', error);
                alert("An error occurred. Please try again.");
            });
        }
    };
    
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.textInput}
                textContentType="emailAddress"
                placeholder="Email"
                value={email}
                placeholderTextColor="#888"
                onChangeText={email => setEmail(email)}
            />
            <TextInput
                style={styles.textInput}
                placeholder="Password"
                placeholderTextColor="#888"
                value={password}
                secureTextEntry
                onChangeText={password => setPassword(password)}
            />
            <TouchableOpacity style={styles.button} onPress={loginUser}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => props.navigation.navigate('Register')}>
                <Text style={styles.buttonText}>Go to Register</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#0A2D37',
        paddingTop: 100,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 30,
        color: 'white',
        textAlign: 'center',
        marginBottom: 40,
    },
    textInput: {
        paddingVertical: 15,
        width: 350,
        fontSize: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#B47C28',
        marginBottom: 30,
        color: 'white',
        textAlign: 'center',
    },
    button: {
        marginTop: 50,
        height: 60,
        width: 250,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: '#B64B4B',
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#fff',
    },
});
