import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, FlatList } from 'react-native';

export default function ChatJournal() {
  const [messages, setMessages] = useState([
    { id: '1', text: "Hi, Ace. How’s your day?", sender: 'bot' },
    { id: '2', text: "It’s been rough.", sender: 'user' },
    { id: '3', text: "Why, what happened?", sender: 'bot' },
  ]);

  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim() !== '') {
      setMessages([...messages, { id: Date.now().toString(), text: inputText, sender: 'user' }]);
      setInputText('');
    }
  };

  const renderItem = ({ item }: { item: { id: string; text: string; sender: string } }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'bot' ? styles.botMessage : styles.userMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="The"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6F0',
  },
  chatContainer: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    maxWidth: '80%',
  },
  botMessage: {
    backgroundColor: '#394239',
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: '#ECE9E0',
    alignSelf: 'flex-end',
  },
  messageText: {
    color: '#000',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F7F6F0',
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#394239',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
