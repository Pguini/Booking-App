import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Switch } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';  

const EditOrder = ({ route, navigation }) => {
    const { data } = route.params;

    if (!data) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error: Order data is missing!</Text>
            </View>
        );
    }

    const parseTime = (timeString) => {
        if (!timeString) return new Date();
        const now = new Date();
        const match = timeString.match(/(\d{1,2}):(\d{2}):(\d{2})\s?(AM|PM)?/);
        if (match) {
            let hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            const seconds = parseInt(match[3], 10);
            const ampm = match[4];

            if (ampm) {
                if (ampm === "PM" && hours !== 12) hours += 12;
                if (ampm === "AM" && hours === 12) hours = 0;
            }

            now.setHours(hours, minutes, seconds);
            return now;
        }
        return new Date();
    };

    const [name, setName] = useState(data.name || '');
    const [email, setEmail] = useState(data.email || '');
    const [service, setService] = useState(data.service || '');
    const [address, setAddress] = useState(data.address || '');
    const [status, setStatus] = useState(data.status || "On-Going");
    const [date, setDate] = useState(data.date ? new Date(data.date) : new Date());
    const [time, setTime] = useState(data.time ? parseTime(data.time) : new Date());
    const [isSaving, setIsSaving] = useState(false);
    const [isCompleted, setIsCompleted] = useState(status === "Completed");



  
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [role, setRole] = useState(null); 
    const [userEmail, setUserEmail] = useState(null);  

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
                        setUserEmail(storedEmail);  
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

    const formatDate = (date) => date.toISOString().split('T')[0];

    const formatTime = (time) => {
        let hours = time.getHours();
        const minutes = time.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12;

        let minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;

        return `${hours}:${minutesFormatted} ${ampm}`;
    };

    const editData = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(`http://localhost:5000/change/${data.id}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name, email, date: formatDate(date), time: formatTime(time), service, address, status
                }),
            });

            const responseData = await response.json();
            if (responseData) {
                setIsSaving(false);
                navigation.goBack();  
            } else {
                setIsSaving(false);
                Alert.alert("Error", "Something went wrong. Please try again.");
            }
        } catch (error) {
            setIsSaving(false);
            Alert.alert("Error", "Something went wrong. Please try again later.");
        }
    };

    const toggleStatus = () => {
        if (status === "On-Going") {
            setStatus("Completed");
            setIsCompleted(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Order</Text>

            <TextInput
                style={styles.input}
                label="Name"
                value={name}
                mode="outlined"
                onChangeText={setName}
                textColor='white'
                editable={!isCompleted}
                theme={{ colors: { primary: '#f5f5f5' } }}
            />

            
            <View style={styles.input}>
                <Text style={styles.inputText}>{email}</Text>
            </View>

            <TextInput
                style={styles.input}
                textColor='white'
                label="Address"
                value={address}
                mode="outlined"
                onChangeText={setAddress}
                editable={!isCompleted}
                theme={{ colors: { primary: '#f5f5f5', text: '#fff', label: '#f5f5f5' } }}
            />

            <View style={styles.disabledInput}>
                <Text style={styles.inputText}>Service: {service}</Text>
            </View>
            {(role == "owner") &&  (
            <View style={styles.statusContainer}>
                <Text style={styles.inputText}>Status: {status}</Text>
                <Switch
                    value={isCompleted}
                    onValueChange={toggleStatus}
                    disabled={isCompleted}
                />
            </View>)}

            <TouchableOpacity onPress={() => setShowDatePicker(!showDatePicker)} style={styles.input} disabled={isCompleted}>
                <Text style={styles.inputText}>Date: {date.toDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="spinner"
                    onChange={(_, selectedDate) => {
                        if (selectedDate) setDate(selectedDate);
                    }}
                    themeVariant="dark"
                />
            )}

            <TouchableOpacity onPress={() => setShowTimePicker(!showTimePicker)} style={styles.input} disabled={isCompleted}>
                <Text style={styles.inputText}>Time: {formatTime(time)}</Text>
            </TouchableOpacity>

            {showTimePicker && (
                <DateTimePicker
                    value={time}
                    mode="time"
                    display="spinner"
                    onChange={(_, selectedTime) => {
                        if (selectedTime) setTime(selectedTime);
                    }}
                    themeVariant="dark"
                />
            )}

            <Button
                style={styles.button}
                mode="contained"
                icon="update"
                onPress={editData}
                disabled={isCompleted}
            >
                {isSaving ? 'Saving...' : 'Update Order'}
            </Button>

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#0A2D37',
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#B64B4B',
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
    },
    disabledInput: {
        backgroundColor: '#B64B4B',
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
    },
    inputText: {
        fontSize: 16,
        color: '#fff',
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#B64B4B',
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#FF8C00',
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 10,
    },
    cancelButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    cancelText: {
        color: '#FF8C00',
        fontSize: 18,
        fontWeight: 'bold',
    },

});

export default EditOrder;
