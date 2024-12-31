import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Header from './Header';

const HomeScreen = () => {
  const actions = [
    { id: '1', title: 'Actions', image: require('../assets/actions.png') },
    { id: '2', title: 'Mind', image: require('../assets/mind.png') },
    { id: '3', title: 'Therapy', image: require('../assets/therapy.png') },
    { id: '4', title: 'Mood', image: require('../assets/mood.png') },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <Header points={206} />

      {/* Greeting Section */}
      <View style={styles.greeting}>
        <Text style={styles.day}>Day 44</Text>
        <Text style={styles.title}>Hi, Ace</Text>
        <Text style={styles.subtitle}>These days you feel anxious.</Text>
      </View>

      {/* Actions Section */}
      <View style={styles.actionsContainer}>
        {actions.map((action) => (
          <TouchableOpacity key={action.id} style={styles.actionItem}>
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
    marginVertical: 55, // Increased space below header
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
    marginVertical: 30, // Increased vertical space between rows
  },
  actionImage: {
    width: 97,
    height: 97,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2, // Creates the ring effect
    borderColor: '#D4AF37', // Gold-like color for the border
  },
  actionText: {
    fontSize: 14,
    color: '#A6A6A6',
    fontFamily: 'Inter-Regular',
  },
});

export default HomeScreen;
