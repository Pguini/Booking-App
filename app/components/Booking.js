import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const Booking = (props) => {
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [name, setName] = useState('');
    const [emailAddress, setEmail] = useState(null);  
    const { serviceName } = props.route.params;  
    const [address, setAddress] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('userEmail')
            .then(storedEmail => {
                if (storedEmail) {
                    setEmail(storedEmail);
                }
            })
            .catch(error => console.log('Error retrieving email:', error));
    }, []);

    const handleBooking = () => {
        if (!name || !emailAddress || !serviceName || !address) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        const bookingDetails = {
            date: date.toISOString().split('T')[0], 
            time: time.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),  
            name,
            address,
            email: emailAddress, 
            service: serviceName,
        };

        fetch('http://localhost:5000/ordering', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingDetails),
        })
        .then((response) => response.json())
        .then(() => {
            Alert.alert('Success', 'Your booking has been saved.');
            setName('');
            setAddress('');
            setDate(new Date());
            setTime(new Date());
        })
        .catch((error) => {
            console.error('Booking error:', error);
            Alert.alert('Error', 'Failed to book. Please try again.');
        });
    };

    const toggleDatePicker = () => {
        setShowDatePicker(!showDatePicker);
        if (showTimePicker) setShowTimePicker(false); 
    };

    const toggleTimePicker = () => {
        setShowTimePicker(!showTimePicker);
        if (showDatePicker) setShowDatePicker(false); 
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <Text style={styles.title}>Book a Service</Text>
                
                
                <TextInput
                    style={styles.input}
                    placeholder="Enter Your Name"
                    placeholderTextColor="#fff"
                    value={name}
                    onChangeText={setName}
                />

            
                <TextInput
                    style={[styles.input, styles.addressInput]}
                    placeholder='Enter Your Address'
                    placeholderTextColor="#fff"
                    value={address}
                    multiline
                    onChangeText={setAddress}            
                />

                
                <View style={styles.nonEditableBox}>
                    <Text style={styles.displayText}>{emailAddress || "Loading..."}</Text>
                </View>

              
                <View style={styles.nonEditableBox}>
                    <Text style={styles.displayText}>{serviceName}</Text>
                </View>

                <TouchableOpacity onPress={toggleDatePicker} style={styles.input}>
                    <Text style={styles.inputText}>Selected Date: {date.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker 
                        value={date} 
                        mode="date" 
                        display="spinner" 
                        textColor="#fff" 
                        onChange={(_, selectedDate) => {
                            if (selectedDate) {
                                setDate(selectedDate);
                            }
                        }} 
                    />
                )}

                
                <TouchableOpacity onPress={toggleTimePicker} style={styles.input}>
                    <Text style={styles.inputText}>Selected Time: {time.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</Text>
                </TouchableOpacity>
                {showTimePicker && (
                    <DateTimePicker 
                        value={time} 
                        mode="time" 
                        display="spinner" 
                        textColor="#fff"  
                        onChange={(_, selectedTime) => {
                            if (selectedTime) {
                                setTime(selectedTime);
                            }
                        }} 
                    />
                )}

               
                <TouchableOpacity style={styles.button} onPress={handleBooking}>
                    <Text style={styles.buttonText}>Book Now</Text>
                </TouchableOpacity>

               
                <TouchableOpacity
                    style={styles.goBackButton}
                    onPress={() => props.navigation.goBack()}  
                >
                    <Text style={styles.goBackButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20, 
        backgroundColor: '#0A2D37', 
        justifyContent: 'center' 
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#fff', 
        marginBottom: 20, 
        textAlign: 'center' 
    },
    input: { 
        padding: 15, 
        backgroundColor: '#B64B4B', 
        borderRadius: 10, 
        marginBottom: 15, 
        color: '#fff', 
        fontSize: 16, 
        borderColor: '#ddd', 
        borderWidth: 1 
    },
    addressInput: { 
        height: 100, 
        textAlignVertical: 'top' 
    },
    inputText: { 
        color: '#fff', 
        fontSize: 16 
    },
    displayText: {
        fontSize: 16, 
        color: '#fff',  
        marginBottom: 15, 
        fontWeight: '400'
    },
    nonEditableBox: {
        padding: 15,
        backgroundColor: '#B64B4B',  
        borderRadius: 10,
        marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'flex-start', 
    },
    button: { 
        backgroundColor: '#FF8C00',  
        padding: 15, 
        borderRadius: 10, 
        alignItems: 'center' 
    },
    buttonText: { 
        color: '#fff', 
        fontSize: 18, 
        fontWeight: 'bold' 
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
        marginBottom: 25,
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
});

export default Booking;
