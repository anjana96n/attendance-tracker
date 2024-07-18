import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { db, storage } from './firebaseConfig';
import { doc, setDoc, collection, getDocs} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const AddSessionScreen = ({ route , navigation }) => {
  const [heldOnDate, setHeldOnDate] = useState(new Date())
  const {classId, className} = route.params;
  const [sessionName, setSessionName] = useState('');
  const auth = getAuth();

  const handleAddSession = async () => {
    if (className && sessionName && heldOnDate) {
      try {
        const user = auth.currentUser;
        if (!user) {
          Alert.alert('Error', 'User is not authenticated.');
          return;
        }
        // Add student to Firestore with QR code download URL
        const sessionId = classId + sessionName
        const sessionCollectionRef = doc(collection(db, 'sessions'),sessionId );
        

        const docData =  {
          sessionId,
          className,
          classId,
          sessionName,
          heldOnDate,
        };
    
        await setDoc(sessionCollectionRef, docData);
        setSessionName();
        setHeldOnDate();
        Alert.alert('Successfull', 'Add new session to the class');
      } catch (error) {
        Alert.alert('Error', `An error occurred: ${error.message}`);
      }
    } else {
      Alert.alert('Error', 'Please fill out all fields.');
    }
  };

  return (
    
    
    <View style={styles.container}>
      <Text style={styles.label}>Class Name</Text>
      <Text style={styles.label}>{classId}</Text>
      
      <Text style={styles.label}>Session Name</Text>
      <TextInput
        style={styles.input}
        value={sessionName}
        onChangeText={setSessionName}
        placeholder="Enter Session name"
      />

      <Text style={styles.label}>Select The Date</Text>
      <TextInput
        style={styles.input}
        value={heldOnDate}
        onChangeText={setHeldOnDate}
        placeholder="Enter Date"
      />
      
      <Button 
      title="Add Session"
      onPress={handleAddSession}
      />
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
});

export default AddSessionScreen;
