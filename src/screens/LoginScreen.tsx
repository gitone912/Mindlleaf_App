import React from "react";
import { Text, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { GoogleSignin, type User, statusCodes } from '@react-native-google-signin/google-signin';
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { googleSignIn } from "../store/slices/authSlice";

type GoogleSignInData = {
  user: User;
  idToken: string | null;
  serverAuthCode: string | null;
  scopes: string[];
};

const LoginPage = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { user, isNewUser } = useAppSelector((state) => state.auth);

  React.useEffect(() => {
    GoogleSignin.configure({
      webClientId: '496351300999-k2r1e0s31dm9s7imhobfhlusmdinkcck.apps.googleusercontent.com', // Get this from Google Cloud Console
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  React.useEffect(() => {
    if (user) {
      if (isNewUser || !user.is_onboarded) {
        navigation.navigate("HIW");
      } else {
        navigation.navigate("Main");
      }
    }
  }, [user, isNewUser]);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut(); // Clear existing sessions
      
      const signInResult = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      
      if (tokens.idToken) {
        await dispatch(googleSignIn(tokens.idToken)).unwrap();
      } else {
        throw new Error('No ID token received');
      }
    } catch (error: any) {
      console.log('Google Sign-In Error:', error);
      if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled sign-in');
      }
      await GoogleSignin.signOut();
    }
  };

  return (
    <View style={styles.loginPage}>
      {/* Logo */}
      <Image
        style={styles.logo}
        source={require("../assets/logo_leaf.png")} // Update the path to your image
        resizeMode="contain"
      />
      
      {/* Title and Subtitle */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Login or sign up</Text>
        <Text style={styles.subtitle}>
          Please select your preferred method{"\n"}to continue setting up your account
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.emailButton}
          onPress={() => navigation.replace("SigninEmail")} // Navigate to Main
        >
          <Text style={styles.emailButtonText}>Continue with Email</Text>
        </TouchableOpacity>
       
        <View style={styles.socialButtons}>
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={handleGoogleSignIn}
          >
            <Image
              style={styles.socialIcon}
              source={require("../assets/google-icon.png")} // Update the path to your Google icon
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              style={styles.socialIcon}
              source={require("../assets/apple-icon.png")} // Update the path to your Apple icon
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          If you are creating a new account,{" "}
          <Text style={styles.linkText}>Terms & Conditions</Text> and{" "}
          <Text style={styles.linkText}>Privacy Policy</Text> will apply.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginPage: {
    flex: 1,
    backgroundColor: "#fcfaf0",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  logo: {
    width: 50,
    height: 50,
    marginTop: 40,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Inter-Bold",
    color: "#1a1c29",
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Inter-Regular",
    color: "#797979",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center"
  },
  emailButton: {
    backgroundColor: "#474d41",
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },
  emailButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "SF Pro",
  },
  phoneButton: {
    backgroundColor: "#fff",
    borderColor: "#d7d7d7",
    borderWidth: 1,
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  phoneButtonText: {
    color: "#1a1c29",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "SF Pro",
  },
  socialButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    justifyContent: "space-evenly",
  },
  socialButton: {
    backgroundColor: "#fff",
    borderColor: "#d7d7d7",
    borderWidth: 1,
    borderRadius: 14,
    height: 54,
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  footer: {
    alignItems: "center",
    marginBottom: 16,
  },
  footerText: {
    fontSize: 12,
    fontFamily: "SF Pro",
    textAlign: "center",
    color: "#797979",
  },
  linkText: {
    textDecorationLine: "underline",
    color: "#1a1c29",
  },
});

export default LoginPage;
