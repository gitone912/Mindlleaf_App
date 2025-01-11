import * as React from "react";
import { StyleSheet, View, Text, TextInput, Pressable } from "react-native";

const SignInEmail = ({ navigation }: any) => {
  const handleSignUp = () => {
    navigation.replace('VerifyOTP');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter your email</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#d7d7d7" />
      
      <Text style={styles.label}>Enter your password</Text>
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#d7d7d7" secureTextEntry />

      <Text style={styles.label}>Confirm password</Text>
      <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#d7d7d7" secureTextEntry />

      <Pressable style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign up</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfaf0",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  label: {
    width: "100%",
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
    fontFamily: "SF Pro",
    textAlign: "left",
  },
  input: {
    width: "100%",
    height: 54,
    borderWidth: 1,
    borderColor: "#d7d7d7",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: "SF Pro",
    color: "#000",
  },
  button: {
    width: "100%",
    height: 54,
    backgroundColor: "#474d41",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "SF Pro",
  },
});

export default SignInEmail;
