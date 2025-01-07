import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { db, storage } from './firebaseConfig';
import { doc, setDoc, collection, getDocs} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddSessionScreen = () => {
  const [heldOnDate, setHeldOnDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [className, setClassName] = useState('');
  const [sessionName, setSessionName] = useState('');
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
    if (className && sessionName && heldOnDate) {
      try {
        const user = auth.currentUser;
        if (!user) {
          Alert.alert('Error', 'User is not authenticated.');
          return;
        }

        const classDocRef = doc(collection(db, 'classes'), className);
        const newSessionDocRef = doc(collection(db, 'sessions'));
        
        const docData =  {
          classDocRef,
          className,
          sessionName,
          heldOnDate,
        };
        docData.docRef = newSessionDocRef;
        await setDoc(newSessionDocRef, docData);

        setSessionName('');
        setHeldOnDate(new Date());
        setClassName('');
        Alert.alert('Success', 'Session added successfully!');
      } catch (error) {
        Alert.alert('Error', `An error occurred: ${error.message}`);
      }
    } else {
      Alert.alert('Error', 'Please fill out all fields.');
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(heldOnDate);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setHeldOnDate(newDate);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(heldOnDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setHeldOnDate(newDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Session</Text>
      
      <Text style={styles.label}>Class Name</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={className}
          style={styles.picker}
          onValueChange={(itemValue) => setClassName(itemValue)}
        >
          <Picker.Item label="Select a class" value="" />
          {classes.map((cls, index) => (
            <Picker.Item key={index} label={cls} value={cls} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Session Name</Text>
      <TextInput
        style={styles.input}
        value={sessionName}
        onChangeText={setSessionName}
        placeholder="Enter Session name"
        placeholderTextColor="#666"
      />

      <Text style={styles.label}>Session Date</Text>
      <TouchableOpacity 
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateButtonText}>
          {heldOnDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Session Time</Text>
      <TouchableOpacity 
        style={styles.dateButton}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={styles.dateButtonText}>
          {heldOnDate.toLocaleTimeString()}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={heldOnDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={heldOnDate}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddSession}
      >
        <Text style={styles.addButtonText}>Add Session</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4c669f',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: '#4c669f',
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#ffffff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  picker: {
    height: 50,
  },
  dateButton: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4c669f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
});

export default AddSessionScreen;
