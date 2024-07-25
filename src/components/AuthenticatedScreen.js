import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const AuthenticatedScreen = ({ user, handleAuthentication, navigation }) => {
  return (
    <View style={styles.authContainer}>
      <View style={styles.userInfo}>
        <Text style={styles.emailText}>{user.email}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Class List"
          onPress={() => navigation.navigate('Class')}
          color="#3498db"
        />
      </View>

      <View style={styles.logoutButton}>
        <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  userInfo: {
    alignItems: 'center',
  },
  emailText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 16,
    alignSelf: 'stretch',
  },
  logoutButton: {
    alignSelf: 'stretch',
  },
});

export default AuthenticatedScreen;