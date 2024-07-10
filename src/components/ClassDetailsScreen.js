import React, { useEffect, useState } from 'react';
import { db } from './firebaseConfig';
import { getDocs, collection, query, where } from 'firebase/firestore';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Button
} from 'react-native';

const Item = ({item, onPress, backgroundColor, textColor}) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
    <Text style={[styles.title, {color: textColor}]}>{item.sessionName}</Text>
  </TouchableOpacity>
);

const ClassDetailsScreen = ({ route, navigation }) => {
  const { classId, className } = route.params;
  const [selectedId, setSelectedId] = useState();
  const [loading, setLoading] = useState(true);
  const [sessionList, setSessionList] = useState([]);

  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.id)
          navigation.navigate('SessionDetails',{ 
            classId : classId,
            sessionId: item.id})
        }}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'sessions'), where('className', '==', className));
        const querySnapshot = await getDocs(q);
        const dataList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSessionList(dataList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }


  return (
    <View style={styles.container}>
      <Text style={styles.label}>{classId}</Text>
      <Text style={styles.label}>{className}</Text>

      <SafeAreaView style={styles.container}>
      <FlatList
        data={sessionList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectedId}
      />
      </SafeAreaView>
      <Button
      onPress={()=>navigation.navigate("AddStudent")}
      title="Add Student"
      >
      </Button>
     
    </View>
  );
};


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    item: {
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 32,
    },
  });


export default ClassDetailsScreen;
