import * as React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";

const VerifyOTP = ({ route, navigation }: any) => {
    const { email, password } = route.params || {};

    React.useEffect(() => {
        console.log('Email received:', email);
        console.log('Password received:', password);
    }, []);

    const handleVerify = () => {
        navigation.replace('HIW');
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify your email</Text>
      <View style={styles.otpContainer}>
        <View style={styles.otpBox} />
        <View style={styles.otpBox} />
        <View style={styles.otpBox} />
        <View style={styles.otpBox} />
      </View>
      <Text style={styles.description} onPress={handleVerify}>
        We’ve sent a code to your email. Please enter it here to confirm.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfaf0",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32, // Space on left and right of the screen
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "SF Pro",
    color: "#000",
    textAlign: "center",
    marginBottom: 40, // Space between title and OTP boxes
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 40, // Space between OTP boxes and description
  },
  otpBox: {
    width: 54,
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d7d7d7",
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "Inter-Regular",
    color: "#797979",
    textAlign: "center",
  },
});

export default VerifyOTP;
