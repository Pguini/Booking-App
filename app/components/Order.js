import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

function Orders(props) {
    const [orders, setOrders] = useState([]);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("Current Orders");
    const [searchQuery, setSearchQuery] = useState("");  

    useFocusEffect(
        useCallback(() => {
            fetchOrders();
        }, [])
    );

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:5000/orders', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'No Orders to Display');
            }

            const data = await response.json();
            setOrders(data.orders || []);
            setRole(data.role);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const clickedItem = (item) => {
        props.navigation.navigate('EditOrder', { data: item });
    };

    let filteredOrders = orders;
    if (role === "customer") {
        filteredOrders = orders.filter(order => order.email === props.userEmail);
    }

    const currentOrders = filteredOrders.filter(order => order.status === "On-Going");
    const completedOrders = filteredOrders.filter(order => order.status === "Completed");

    const displayedOrders = (activeTab === "Current Orders" ? currentOrders : completedOrders).filter(order =>
        order.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderOrderItem = ({ item }) => (
        <Card style={styles.orderContainer}>
            <TouchableOpacity onPress={() => clickedItem(item)}>
                <Text style={styles.orderText}>Service: {item.service}</Text>
                <Text style={styles.orderText}>Name: {item.name}</Text>
                <Text style={styles.orderText}>Date: {item.date}</Text>
                <Text style={styles.orderText}>Time: {item.time}</Text>
                <Text style={styles.orderText}>Address: {item.address}</Text>
                <Text style={styles.orderText}>Email: {item.email}</Text>
                <Text style={styles.orderText}>Status: {item.status}</Text>
            </TouchableOpacity>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Orders</Text>

            <TextInput
                style={styles.searchBar}
                placeholder="Search by name..."
                placeholderTextColor="#ccc"
                value={searchQuery}
                onChangeText={text => setSearchQuery(text)}
            />

            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === "Current Orders" && styles.activeTab]}
                    onPress={() => setActiveTab("Current Orders")}
                >
                    <Text style={styles.tabText}>Current Orders</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === "Order History" && styles.activeTab]}
                    onPress={() => setActiveTab("Order History")}
                >
                    <Text style={styles.tabText}>Order History</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={displayedOrders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={<Text style={styles.noOrdersText}>No orders found.</Text>}
            />

           
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
        paddingTop: 50,
        backgroundColor: '#0A2D37',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: "#f5f5f5",
        marginBottom: 20,
        textAlign: 'center',
    },
    searchBar: {
        backgroundColor: '#1F4F59',
        color: "#fff",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
        marginBottom: 15,
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        backgroundColor: "#1F4F59",
    },
    activeTab: {
        backgroundColor: "#FF8C00",
    },
    tabText: {
        fontSize: 16,
        color: "#f5f5f5",
    },
    orderContainer: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    orderText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    noOrdersText: {
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
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
});

export default Orders;
