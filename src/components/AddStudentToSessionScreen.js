import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { db, storage } from './firebaseConfig';
import { doc, setDoc, collection, getDocs} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const AddStudentToSessionScreen = ({route, navigation}) => {

  const { sessionId } = route.params;
  const [studentName, setStudentName] = useState('');
  const [StudentList, setStudentList] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'students'));
        const studentList = querySnapshot.docs.map(doc => doc.data());
        setStudentList(studentList);
      } catch (error) {
        Alert.alert('Error', `Failed to load students: ${error.message}`);
      }
    };

    fetchStudents();
  }, []);

  const handleAddStudentToSession = async () => {
    try{
      const studentAndSession = {
        student : studentName,
        sessionId : sessionId
      }
      const docId = studentName + sessionId;
      const docRef = doc(db, "StudentsInSession", docId);
      await setDoc(docRef, studentAndSession);
      console.log("Document written with ID: ", docId);
    }catch{
      console.log("Error ");
    }
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Session Id : </Text>
      <Text style={styles.label}>{sessionId}</Text>
      <Text style={styles.label}>Student Name</Text>
      <Picker
        selectedValue={studentName}
        style={styles.input}
        onValueChange={(itemValue) => setStudentName(itemValue)}
      >
        <Picker.Item label="Select the Student" value="" />
        {StudentList.map((std, index) => (
          <Picker.Item key={index} label={std.firstName + " " + std.lastName} value={std.mobileNumber} />
        ))}
      </Picker>
      
      <Button title="Add Student" onPress={handleAddStudentToSession} />
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
