import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const SessionDetailsScreen = ({ route , navigation }) => {
  const { sessionId } = route.params; // Get the sessionId from the route parameters
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const docRef = doc(db, 'sessions', sessionId); // Reference to the document
        const docSnap = await getDoc(docRef); // Fetch the document
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
          <Text>Session Name: {sessionData.sessionName}</Text>
          <Text>Class Name: {sessionData.className}</Text>
          <Text>Held On Date: {sessionData.heldOnDate}</Text>
        </View>
      ) : (
        <Text>No data available</Text>
      )}

        <Button
          title="Add Students"
          onPress={() => navigation.navigate('AddStudentToSession')}
          color="#3498db"
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

export default SessionDetailsScreen;
