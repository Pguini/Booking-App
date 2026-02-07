import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Edit(props) {
  const data = props.route.params.data; 
  const [title, setTitle] = useState(data.title);
  const [body, setBody] = useState(data.body);
  const [email, setEmail] =useState("")
  const [service, setService] = useState(data.service); 

  useEffect(() => {
    AsyncStorage.getItem('userEmail')
        .then(storedEmail => {
            if (storedEmail) {
                setEmail(storedEmail);
            }
        })
        .catch(error => console.log('Error retrieving email:', error));
}, []);

  const updateData = () => {
    fetch(`http://localhost:5000/update/${data.id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title, body: body, service: service, email:email }),
    })
      .then((resp) => resp.json())
      .then(() => {
       
        props.navigation.goBack();

        props.navigation.navigate('Details', { data: { ...data, title, body, service } });
      })
      .catch((error) => console.log(error));
  };

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Edit Comment</Text>
      <TextInput
        style={styles.inputStyle}
        label="Title"
        value={title}
        mode="outlined"
        onChangeText={(text) => setTitle(text)}
      />
      <TextInput
        style={styles.body}
        label="Description"
        value={body}
        mode="outlined"
        multiline
        numberOfLines={10}
        onChangeText={(text) => setBody(text)}
      />
      <TextInput
        style={styles.service}
        label="Service"
        value={service}
        mode="outlined"
        onChangeText={(text) => setService(text)}  
      />
      <Button
        style={styles.buttonStyle}
        icon="pencil"
        mode="contained"
        onPress={updateData}>
        Update Feedback
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#0A2D37', 
    paddingHorizontal: 20,
    paddingTop: 25,
    },
title: {
    color: "#fff",
    textAlign: "center",
    fontSize: 25,
    fontWeight: "600",
    marginBottom: 15,
    marginTop: 50,
    position: 'absolute',
    top: 25,
    left: 0,
    right: 0,
    zIndex: 1, 
    },
inputStyle: {
    padding: 10,
    borderRadius: 10,
    marginTop: 100,
    backgroundColor: 'white', 
},
body: {
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: 'white', 
},
service: {
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: 'white', 
},
buttonStyle: {
    marginTop: 20, 
    backgroundColor: '#FF8C00',  
},
});

export default Edit;
