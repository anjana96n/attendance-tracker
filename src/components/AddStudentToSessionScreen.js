import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { db, storage } from './firebaseConfig';
import { doc, setDoc, collection, getDocs} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const AddStudentToSessionScreen = () => {

  const [className, setStudentName] = useState('');
  const [classes, setClasses] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'classes'));
        const classList = querySnapshot.docs.map(doc => doc.data().className);
        setClasses(classList);
      } catch (error) {
        Alert.alert('Error', `Failed to load classes: ${error.message}`);
      }
    };

    fetchClasses();
  }, []);

  const handleAddSession = async () => {
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Student Name</Text>
      <Picker
        selectedValue={className}
        style={styles.input}
        onValueChange={(itemValue) => setStudentName(itemValue)}
      >
        <Picker.Item label="Select the Student" value="" />
        {classes.map((cls, index) => (
          <Picker.Item key={index} label={cls} value={cls} />
        ))}
      </Picker>
      
      <Button title="Add Student" onPress={handleAddSession} />
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

export default AddStudentToSessionScreen;
