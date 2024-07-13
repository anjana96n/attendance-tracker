import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { db } from './firebaseConfig';
import { getDocs, collection } from 'firebase/firestore';


const Item = ({item, onPress, backgroundColor, textColor}) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
    <Text style={[styles.title, {color: textColor}]}>{item.className}</Text>
  </TouchableOpacity>
);

const ClassListScreen = ({ user, handleAuthentication, navigation }) => {
  const [selectedId, setSelectedId] = useState();
  const [loading, setLoading] = useState(true);
  const [classList, setClassList] = useState([]);

  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.id)
          navigation.navigate('ClassDetails',{ classId : item.id , className: item.className})
        }}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  // fetching data from firebase

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'classes'));
        const dataList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), ref: doc.ref }));
        setClassList(dataList);
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
    <SafeAreaView style={styles.container}>
      <FlatList
        data={classList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectedId}
      />
    </SafeAreaView>
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

export default ClassListScreen;