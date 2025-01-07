import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const StudentListScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const querySnapshot = await getDocs(collection(db, 'students'));
      const studentsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(studentsList);
      setFilteredStudents(studentsList);
    };

    const fetchClasses = async () => {
      const querySnapshot = await getDocs(collection(db, 'classes'));
      const classList = querySnapshot.docs.map(doc => doc.data().className);
      setClasses(classList);
    };

    fetchStudents();
    fetchClasses();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = students.filter(student => 
      student.firstName.toLowerCase().includes(query.toLowerCase()) ||
      student.lastName.toLowerCase().includes(query.toLowerCase()) ||
      student.className.toLowerCase().includes(query.toLowerCase()) ||
      student.mobileNumber.includes(query)
    );
    setFilteredStudents(filtered);
  };

  const handleSortByClass = (selectedClass) => {
    setSelectedClass(selectedClass);
    const sorted = students.filter(student => student.className === selectedClass);
    setFilteredStudents(sorted);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search students..."
      />
      <Picker
        selectedValue={selectedClass}
        style={styles.picker}
        onValueChange={(itemValue) => handleSortByClass(itemValue)}
      >
        <Picker.Item label="Select class" value="" />
        {classes.map((cls, index) => (
          <Picker.Item key={index} label={cls} value={cls} />
        ))}
      </Picker>
      <FlatList
        data={filteredStudents}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('StudentDetail', { student: item })}>
            <View style={styles.studentItem}>
              <Text>{item.firstName} {item.lastName}</Text>
              <Text>{item.className}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  searchInput: {
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
  picker: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  studentItem: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default StudentListScreen;
