import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const AuthenticatedScreen = ({ user, handleAuthentication, navigation }) => {
  const menuItems = [
    {
      title: 'Add Students',
      icon: 'person-add',
      screen: 'AddStudent',
      color: '#6c5ce7'
    },
    {
      title: 'Student List', 
      icon: 'people',
      screen: 'StudentList',
      color: '#00b894'
    },
    {
      title: 'Create a Class',
      icon: 'add-box',
      screen: 'AddClass', 
      color: '#00cec9'
    },
    {
      title: 'Class List',
      icon: 'list-alt',
      screen: 'Class',
      color: '#0984e3'
    },
    {
      title: 'Add A Session',
      icon: 'event',
      screen: 'AddSession',
      color: '#6c5ce7'
    }
  ];

  return (
    <View style={styles.authContainer}>
      <View style={styles.userInfo}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.emailText}>{user.email}</Text>
      </View>

      <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { backgroundColor: item.color }]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <MaterialIcons name={item.icon} size={32} color="#fff" />
              <Text style={styles.menuText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleAuthentication}
      >
        <MaterialIcons name="logout" size={24} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    padding: 16,
  },
  userInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  welcomeText: {
    fontSize: 20,
    color: '#2d3436',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  mainContainer: {
    flex: 1,
    marginVertical: 10,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 8,
  },
  menuItem: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    elevation: 4,
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default AuthenticatedScreen;