import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Create(props) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState(""); 

  useEffect(() => {
    AsyncStorage.getItem('userEmail')
        .then(storedEmail => {
            if (storedEmail) {
                setEmail(storedEmail);
            }
        })
        .catch(error => console.log('Error retrieving email:', error));
}, []);

 
  const insertData = () => {
    if (!title || !body || !service) {
      return; 
    }

    fetch('http://localhost:5000/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title, body: body, service: service, email:email}),  
    })
      .then((resp) => resp.json())
      .then(() => {
        props.navigation.goBack();
        props.navigation.navigate('FeedbackPage', { refresh: true });
      })
      .catch((error) => console.log(error));
  };

  const isFormValid = title && body && service;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Feedback</Text>
      <Text style={styles.subtitle}>Title</Text>
      <TextInput
        style={styles.inputStyle}
        value={title}
        mode="outlined"
        onChangeText={(text) => setTitle(text)}
        theme={{
            colors: {
              primary: '#FF8C00', 
              placeholder: '#B64B4B', 
              text: '#FFF', 
              background: '#fff', 
              underlineColor: 'transparent', 
              label: '#FF8C00', 
            }
          }}
      />
      <Text style={styles.subtitle}>Description</Text>
      <TextInput
        style={styles.textArea}
        value={body}
        mode="outlined"
        multiline
        numberOfLines={10}
        onChangeText={(text) => setBody(text)}
        theme={{
            colors: {
              primary: '#FF8C00', 
              placeholder: '#B64B4B', 
              text: '#FFF', 
              background: '#fff', 
              underlineColor: 'transparent', 
              label: '#FF8C00', 
            }
          }}
      />
      <Text style={styles.subtitle}>Service</Text>
      <TextInput
        style={styles.inputStyle}
        value={service}
        mode="outlined"
        onChangeText={(text) => setService(text)}
        theme={{
            colors: {
              primary: '#FF8C00',
              placeholder: '#B64B4B', 
              text: '#FFF', 
              background: '#fff', 
              underlineColor: 'transparent',
              label: '#FF8C00',
            }
          }}
      />
        <View style={styles.nonEditableBox}>
            <Text style={styles.displayText}>{email || "Loading..."}</Text>
        </View>

      <Button
        style={styles.button}
        icon="pencil"
        mode="contained"
        onPress={insertData}
        disabled={!isFormValid} 
      >
        Insert Feedback
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A2D37',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  subtitle: {
    color: '#fff',
    marginBottom: 10,
  },
  title: {
    color: "#fff",
    textAlign: "center",
    marginTop: 25,
    marginBottom: 15,
    fontSize: 25,
    fontWeight: "600",
  },
  inputStyle: {
    backgroundColor: '#fff',
    color: '#fff', 
    marginBottom: 15,
    borderRadius: 50,  
    paddingVertical: 10,
  },
  textArea: {
    backgroundColor: '#fff', 
    marginBottom: 15,
    borderRadius: 50,  
    height: 150,
    paddingVertical: 10,
  },
  button: {
    backgroundColor: '#FF8C00',  
    paddingVertical: 12,
    borderRadius: 15,  
    marginTop: 15,
  },
  nonEditableBox: {
    padding: 15,
    backgroundColor: '#fff',  
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'flex-start',  
},
});

export default Create;

