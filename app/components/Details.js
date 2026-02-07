import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

function Details(props) {
  const { data } = props.route.params;
  const [role, setRole] = useState('null');
  const [email, setEmail] = useState();

  useFocusEffect(
    React.useCallback(() => {
      
      const fetchUserDetails = async () => {
        try {
          const storedRole = await AsyncStorage.getItem('userRole');
          const storedEmail = await AsyncStorage.getItem('userEmail');

          if (storedRole) {
            setRole(storedRole);  
          }
          if (storedEmail) {
            setEmail(storedEmail); 
          }

          console.log('Fetched role:', storedRole); 
          console.log('Fetched email:', storedEmail);
        } catch (error) {
          console.log('Error retrieving role and email:', error);
        }
      };

      fetchUserDetails();
    }, [])  
  );

  const deleteData = () => {
   
    if (role === "owner" || data.email === email) {
      fetch(`http://localhost:5000/delete/${data.id}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
      .then(() => {
        props.navigation.goBack();
        props.navigation.navigate('FeedbackPage', { refresh: true });
      })
      .catch(error => console.log(error));
    } else {
      alert("You do not have permission to delete this feedback.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.title}</Text>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.body}>Body: {data.body}</Text>
        <Text style={styles.service}>Service: {data.service}</Text>
        <Text style={styles.date}>Date: {data.date}</Text>

        <View style={styles.btnStyle}>
          {(data.email == email) && (
            <Button
              icon="pencil"
              mode="contained"
              onPress={() => props.navigation.navigate("Edit", { data: data })}
              style={styles.editButton}
            >
              Edit
            </Button>)}

         
          {(role === "owner" || data.email === email) && (
            <Button
              icon="delete"
              mode="contained"
              onPress={deleteData}
              style={styles.deleteButton}
            >
              Delete
            </Button>
          )}
        </View>
      </ScrollView>

     
      <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => props.navigation.goBack()} 
      >
        <Text style={styles.goBackButtonText}>Go Back</Text>
      </TouchableOpacity>
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
  goBackButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#FF8C00',
    paddingVertical: 15,
    paddingHorizontal: 25,
    paddingBottom: 15,
    borderRadius: 10,
    elevation: 5,
    marginBottom: 25 ,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  goBackButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  scrollViewContainer: {
    paddingTop: 70,  
    paddingBottom: 80,  
  },
  body: {
    fontSize: 16,
    color: '#fff', 
    marginBottom: 15,
    lineHeight: 24,
    marginTop:30,
  },
  service: {
    fontSize: 16,
    marginTop: 10,
    color: '#FF8C00',  
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: '#A6A6A6',  
    marginBottom: 20,
  },
  btnStyle: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
    width: '100%',
  },
  editButton: {
    backgroundColor: '#FF8C00',  
    paddingVertical: 12,
    borderRadius: 15,
    width: '45%',
  },
  deleteButton: {
    backgroundColor: '#B64B4B', 
    paddingVertical: 12,
    borderRadius: 15,
    width: '45%',
  },
});

export default Details;
