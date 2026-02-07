import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const Registration = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const registerUser = () => {
        console.log('Email:', email);  
        console.log('Password:', password);  

        fetch('http://localhost:5000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(resp => resp.json())
        .then(data => {
            if (data.error) {
                
                Alert.alert('Registration Failed', data.error);
            } 
            else {
                AsyncStorage.setItem('userEmail', email).then(() => {
                    props.navigation.navigate('Service');
                });
            }
        })
        .catch(error => {
            console.log(error);
            Alert.alert('Thank You for Registering, You can login using the Log In portal')
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
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
            <TouchableOpacity style={styles.button} onPress={registerUser}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Registration;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#0A2D37',
        paddingTop: 50,
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
