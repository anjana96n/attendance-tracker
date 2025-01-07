import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const AuthenticatedScreen = ({ user, handleAuthentication, navigation }) => {
  return (
    <View style={styles.authContainer}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Icon name="user" size={40} color="white" />
          <Text style={styles.emailText}>{user.email}</Text>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.cardRow}>
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#FF6B6B' }]} 
            onPress={() => navigation.navigate('AddStudent')}
          >
            <View style={styles.cardContent}>
              <Icon name="user-plus" size={28} color="white" />
              <Text style={styles.cardText}>Add Students</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#4ECDC4' }]} 
            onPress={() => navigation.navigate('StudentList')}
          >
            <View style={styles.cardContent}>
              <Icon name="users" size={28} color="white" />
              <Text style={styles.cardText}>Student List</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.cardRow}>
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#45B7D1' }]} 
            onPress={() => navigation.navigate('AddClass')}
          >
            <View style={styles.cardContent}>
              <Icon name="book" size={28} color="white" />
              <Text style={styles.cardText}>Create a Class</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#96CEB4' }]} 
            onPress={() => navigation.navigate('Class')}
          >
            <View style={styles.cardContent}>
              <Icon name="book-open" size={28} color="white" />
              <Text style={styles.cardText}>Class List</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.cardRow}>
          <TouchableOpacity 
            style={[styles.card, styles.fullWidthCard, { backgroundColor: '#FFEEAD' }]} 
            onPress={() => navigation.navigate('AddSession')}
          >
            <View style={styles.cardContent}>
              <Icon name="clock" size={28} color="#333" />
              <Text style={[styles.cardText, { color: '#333' }]}>Add A Session</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleAuthentication}
      >
        <View style={styles.logoutButtonContent}>
          <Icon name="log-out" size={20} color="white" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: '#4c669f',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfo: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  emailText: {
    fontSize: 20,
    marginTop: 10,
    color: 'white',
    fontWeight: '600',
    fontFamily: 'System',
  },
  cardContainer: {
    flex: 1,
    padding: 20,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  card: {
    width: '48%',
    height: 120,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fullWidthCard: {
    width: '100%',
  },
  cardContent: {
    alignItems: 'center',
  },
  cardText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  logoutButton: {
    margin: 20,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#FF512F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  }
});

export default AuthenticatedScreen;