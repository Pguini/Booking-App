import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const servicesData = [
    { id: '1', name: 'Car Wash Services', price: '$50' },
    { id: '2', name: 'Electrical Services', price: '$60' },
    { id: '3', name: 'Plumbing Services', price: '$30' },
    { id: '4', name: 'Painting Services', price: '$40' },
    { id: '5', name: 'Carpentry Services', price: '$60' },
    { id: '6', name: 'Gym Equipment Services', price: '$53' },
];

const Service = (props) => {
    const navigation = useNavigation();

    const handleServicePress = (service) => {
        navigation.navigate('Booking', { serviceName: service.name });
    };


    const logout = () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                {
                    text: 'No',
                    onPress: () => console.log('Cancel logout'),
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('user_data'); 
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'OpeningPage' }] 
                            });
                        } catch (error) {
                            console.error('Error logging out:', error);
                        }
                    },
                },
            ],
            { cancelable: false } 
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Available Services</Text>

            <FlatList
                data={servicesData}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.serviceItem} 
                        onPress={() => handleServicePress(item)} 
                    >
                        <Text style={styles.serviceName}>{item.name}</Text>
                        <Text style={styles.servicePrice}>{item.price}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
            />
            <Button
                style={styles.feedbackButton}
                mode="contained"
                icon="comment"
                onPress={() => props.navigation.navigate("FeedbackPage")}
                labelStyle={styles.buttonText}
            >
                Feedback
            </Button>

            <View style={styles.bottomButtons}>
                <Button
                    style={styles.viewOrdersButton}
                    mode="contained"
                    icon="view-list"
                    onPress={() => props.navigation.navigate("Orders")}
                    labelStyle={styles.buttonText}
                > View Orders</Button>
                <Button
                    style={styles.logoutButton}
                    mode="contained"
                    icon="exit-to-app"
                    onPress={logout}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 30,
        paddingHorizontal: 20,
        backgroundColor: '#0A2D37',
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 30,
        marginBottom: 30,
        textAlign: 'center',
    },
    listContainer: {
        width: '100%',
        alignItems: 'center',
    },
    serviceItem: {
        backgroundColor: '#B64B4B',
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderRadius: 15,
        marginBottom: 15,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    serviceName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    servicePrice: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '400',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    feedbackButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 20,
        width: '90%',
        alignItems: 'center',
    },
    bottomButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginTop: 20,
    },
    viewOrdersButton: {
        flex: 3,
        backgroundColor: '#FF8C00',
        paddingVertical: 12,
        borderRadius: 10,
    },
    logoutButton: {
        flex: 1,
        backgroundColor: '#FF0000',
        paddingVertical: 12,
        borderRadius: 10,
    },
});

export default Service;
