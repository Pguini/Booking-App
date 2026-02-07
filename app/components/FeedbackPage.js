import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card, FAB, ActivityIndicator } from "react-native-paper";

function FeedbackPage(props) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); 
  const [loading, setIsLoading] = useState(true);
  const [email, setEmail] = useState();
  const [role, setRole] = useState();
  const [searchQuery, setSearchQuery] = useState(""); 
  const [activeTab, setActiveTab] = useState("All Feedback"); 

  useEffect(() => {
    AsyncStorage.getItem('userEmail')
      .then(storedEmail => {
        if (storedEmail) {
          setEmail(storedEmail);
        }
      })
      .catch(error => console.log('Error retrieving email:', error));
    
    AsyncStorage.getItem('userRole') 
      .then(storedRole => {
        if (storedRole) {
          setRole(storedRole);
        }
        console.log(role);
      })
      .catch(error => console.log('Error retrieving role:', error));
  }, []);

  const loadData = () => {
    setIsLoading(true);
    fetch('http://localhost:5000/get', { method: 'GET' })
      .then((resp) => resp.json())
      .then((feedback) => {
        setData(feedback);
        setFilteredData(feedback); 
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

 
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item =>
        item.service.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };


  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === "All Feedback") {
      setFilteredData(data); 
    } else {
     
      const userFeedback = data.filter(item => item.email === email);
      setFilteredData(userFeedback);
    }
  };

  const clickedItem = (item) => {
    props.navigation.navigate('Details', { data: item });
  };

  const renderData = ({ item }) => (
    <Card style={styles.cardStyle}>
      <TouchableOpacity onPress={() => clickedItem(item)}>
        <Text style={styles.textStyle}>{item.title}</Text>
        <Text style={styles.bodyText}>Body: {item.body}</Text>
        <Text style={styles.serviceText}>Service: {item.service}</Text>
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feedback</Text>

      
      <TextInput
        style={styles.searchBar}
        placeholder="Search by service..."
        placeholderTextColor="#ccc"
        value={searchQuery}
        onChangeText={handleSearch}
      />

     
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "All Feedback" && styles.activeTab]}
          onPress={() => handleTabSwitch("All Feedback")}
        >
          <Text style={styles.tabText}>All Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "Your Feedback" && styles.activeTab]}
          onPress={() => handleTabSwitch("Your Feedback")}
        >
          <Text style={styles.tabText}>Your Feedback</Text>
        </TouchableOpacity>
      </View>

      
      {loading ? (
        <ActivityIndicator size="large" color="#FF8C00" />
      ) : (
        <FlatList
          data={filteredData} 
          renderItem={renderData}
          onRefresh={loadData}
          refreshing={loading}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text style={styles.noResults}>No feedback found.</Text>}
        />
      )}

      <FAB
        style={styles.fab}
        small={false}
        icon="plus"
        theme={{ colors: { accent: "green" } }}
        onPress={() => props.navigation.navigate('Create')}
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
    backgroundColor: '#0A2D37',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    color: "#fff",
    textAlign: "center",
    marginTop: 25,
    marginBottom: 15,
    fontSize: 25,
    fontWeight: "600",
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
  textStyle: {
    color: "#fff",
    padding: 7,
    fontSize: 18,
    fontWeight: "600",
  },
  bodyText:{
    color: "#fff",
    padding: 5,
    fontSize: 16,
    fontWeight: "400",
  },
  serviceText: {
    color: "#fff",
    padding: 5,
    fontSize: 16,
    fontWeight: "400",
  },
  cardStyle: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#B64B4B",
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  fab: {
    position: 'absolute',
    margin: 20,
    right: 0,
    bottom: 20,
    backgroundColor: '#FF8C00',
  },
  noResults: {
    color: "#888",
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
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

export default FeedbackPage;
