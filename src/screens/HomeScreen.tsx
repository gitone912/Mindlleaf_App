import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define screen types
type RootStackParamList = {
  HomeMain: undefined;
  Action: undefined;
  Mind: undefined;
  Therapy: undefined;
  Mood: undefined;
};

// Define navigation prop type for HomeScreen
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeMain'>;

// Define the structure of an action
type Action = {
  id: string;
  title: string;
  image: any; // Replace `any` with the correct type for your image assets if available
  screen: keyof RootStackParamList; // This ensures `screen` is one of the keys in `RootStackParamList`
};

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUserName(parsedData.name);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserName();
  }, []);

  const actions: Action[] = [
    { id: '1', title: 'Actions', image: require('../assets/actions.png'), screen: 'Action' },
    { id: '2', title: 'Mind', image: require('../assets/mind.png'), screen: 'Mind' },
    { id: '3', title: 'Therapy', image: require('../assets/therapy.png'), screen: 'Therapy' },
    { id: '4', title: 'Mood', image: require('../assets/mood.png'), screen: 'Mood' },
  ];
  return (
    <ScrollView style={styles.container}>
      <View style={styles.greeting}>
        {/* <Text style={styles.day}>Day 44</Text> */}
        <Text style={styles.title}>Hi, {userName}</Text>
        <Text style={styles.subtitle}>Want to Journal Today?.</Text>
      </View>
      <View style={styles.actionsContainer}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionItem}
            onPress={() => navigation.navigate(action.screen)}
          >
            <Image source={action.image} style={styles.actionImage} />
            <Text style={styles.actionText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFAF0',
    paddingHorizontal: 20,
  },
  greeting: {
    alignItems: 'center',
    marginVertical: 55,
  },
  day: {
    fontSize: 11,
    color: '#A6A6A6',
    fontFamily: 'Inter-Medium',
  },
  title: {
    fontSize: 35,
    marginVertical: 5,
    fontFamily: 'Ovo',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#A6A6A6',
    fontFamily: 'Inter-Regular',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  actionItem: {
    width: '50%',
    alignItems: 'center',
    marginVertical: 30,
  },
  actionImage: {
    width: 97,
    height: 97,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  actionText: {
    fontSize: 14,
    color: '#A6A6A6',
    fontFamily: 'Inter-Regular',
  },
});

export default HomeScreen;
