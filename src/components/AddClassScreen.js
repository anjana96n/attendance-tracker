import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db } from './firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

const AddClassScreen = ({ navigation }) => {
  const [className, setClassName] = useState('');

  const handleAddClass = async () => {
    if (className) {
      try {
        await addDoc(collection(db, 'classes'), { className });
        Alert.alert('Success', 'Class added successfully!');
        setClassName('');
        navigation.navigate('AddStudent'); // Navigate to AddStudent screen after adding class
      } catch (error) {
        Alert.alert('Error', `An error occurred: ${error.message}`);
      }
    } else {
      Alert.alert('Error', 'Please enter a class name.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Class Name</Text>
      <TextInput
        style={styles.input}
        value={className}
        onChangeText={setClassName}
        placeholder="Enter class name"
      />
      <Button title="Add Class" onPress={handleAddClass} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
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
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#ffffff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default AddClassScreen;
