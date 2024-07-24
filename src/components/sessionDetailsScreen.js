import React, { useEffect, useState } from 'react';
import {TouchableOpacity,SafeAreaView, FlatList,View, Text, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { doc, getDoc, getDocs, collection,query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';
//import { query, where } from '@react-native-firebase/firestore';


const Item = ({item, onPress, backgroundColor, textColor}) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
    <Text style={[styles.title, {color: textColor}]}>{item.student.firstName + " " +item.student.lastName }</Text>
    <Text style={[styles.title, {color: textColor}]}>{item.student.mobileNumber }</Text>
    <Text style={[styles.title, {color: textColor}]}>{item.id}</Text>
  </TouchableOpacity>
);


const SessionDetailsScreen = ({ route , navigation }) => {
  const { classId, sessionId } = route.params; // Get the sessionId from the route parameters
  const [selectedId, setSelectedId] = useState();
  const [sessionData, setSessionData] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(true);

  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
    const color = item.id === selectedId ? 'white' : 'black';
  
    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.id)
          navigation.navigate('StudentInSessionDetails',{sessionId : sessionId, mobileNumber : item.student.mobileNumber, docId: item.id})
        }}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const q = query(collection(db, 'StudentsInSession'), where('sessionId', '==', sessionId ));
        const querySnapshot = await getDocs(q);
        const studentsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStudentList(studentsList);

        const sessionDocRef = doc(db, 'sessions', sessionId); // Reference to the document
        const docSnap = await getDoc(sessionDocRef); // Fetch the document
        if (docSnap.exists()) {
          setSessionData(docSnap.data()); // Set the document data to state
        } else {
          console.log('No such document!');
        }
        setLoading(false); // Update the loading state
      } catch (error) {
        console.error('Error fetching document: ', error);
        setLoading(false); // Update the loading state in case of an error
      }
    };

    fetchSessionDetails();
  }, [sessionId]); // Dependency array includes sessionId

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  

  return (
    <View style={styles.container}>
      {sessionData ? (
        <View>
          <Text>Session Name: {sessionId}</Text>
          <Text>Class Name: {sessionData.className}</Text>
          <Text>Held On Date: {sessionData.heldOnDate}</Text>
        </View>
      ) : (
        <Text>No data available</Text>
      )}

        <Button
          title="Add Students"
          onPress={() => navigation.navigate('AddStudentToSession', {
            classId : classId,
            sessionId : sessionId
          })}
          color="#3498db"
        />
      <SafeAreaView style = {styles.studentContainer}>
      <FlatList
        data={studentList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectedId}
      />
    </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  studentContainer: {
    paddingTop: 16,
  },
  item:{
    padding :5
  }
});

export default SessionDetailsScreen;
