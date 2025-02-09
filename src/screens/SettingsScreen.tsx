import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, Pressable, View, Modal, Linking } from "react-native";
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SettingsStackParamList = {
  SettingsMain: undefined;
  AITherapy: undefined;
  Language : undefined;
  Voice : undefined;
  Subscription : undefined;
  Logout: undefined;
};

type SettingsScreenNavigationProp = StackNavigationProp<SettingsStackParamList, 'SettingsMain'>;
const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUserName(parsedData.name);
          setUserEmail(parsedData.email);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      {/* User Profile Image */}
      <View style={styles.userProfileImageContainer}>
        {/* <Image
          style={styles.userProfileImage}
          source={require("../assets/settingsIcons/userprofile.png")}
        /> */}
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* User Info Section */}
      <View style={styles.userInfoContainer}>
        <Image
          style={styles.profileImage}
          source={require("../assets/settingsIcons/user.png")}
        />
        <View style={styles.userInfoTextContainer}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
        </View>
        <Pressable style={styles.editButton}>
          <Image
            style={styles.editIcon}
            source={require("../assets/settingsIcons/edit.png")}
          />
        </Pressable>
      </View>

      {/* Options List */}
      <View style={styles.menuContainer}>
        {menuOptions.map((option, index) => (
          <Pressable
            key={index}
            style={styles.menuItem}
            onPress={() => {
              if (option.title === "Log out") {
                setShowLogoutModal(true);
              } else if (option.title === "AI Therapy Type") {
                navigation.navigate("AITherapy");
              } else if (option.title === "Language") {
                navigation.navigate("Language");
              } else if (option.title === "Voice") {
                navigation.navigate("Voice");
              } else if (option.title === "Subscription") {
                navigation.navigate("Subscription");
              } else if (option.title === "Join Discord Community" || 
                        option.title === "Write a review" || 
                        option.title === "Contact support") {
                Linking.openURL('https://discord.gg/ZXegVRduP3');
              }
            }}
          >
            <View style={styles.menuItemLeft}>
              <Image
                style={styles.menuIcon}
                source={option.icon}
              />
              <Text style={styles.menuText}>{option.title}</Text>
            </View>
            <Image
              style={styles.arrowIcon}
              source={require("../assets/settingsIcons/sidearrow.png")}
            />
          </Pressable>
        ))}
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalText}>Are you sure you want to log out?</Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.logoutButton]}
                onPress={() => {
                  setShowLogoutModal(false);
                  navigation.navigate("Logout");
                }}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const menuOptions = [
  {
    title: "Subscription",
    icon: require("../assets/settingsIcons/1.png"),
  },
  {
    title: "Language",
    icon: require("../assets/settingsIcons/2.png"),
  },
  {
    title: "AI Therapy Type",
    icon: require("../assets/settingsIcons/3.png"),
  },
  {
    title: "Voice",
    icon: require("../assets/settingsIcons/4.png"),
  },
  {
    title: "Join Discord Community",
    icon: require("../assets/settingsIcons/5.png"),
  },
  {
    title: "Write a review",
    icon: require("../assets/settingsIcons/6.png"),
  },
  {
    title: "Contact support",
    icon: require("../assets/settingsIcons/7.png"),
  },
  {
    title: "Log out",
    icon: require("../assets/settingsIcons/8.png"),
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfaf0",
    paddingHorizontal: 30, // Increased padding
    justifyContent: "center", // Centered the list vertically
  },
  userProfileImageContainer: {
    alignItems: "center", // Center the image horizontally
    marginBottom: 20, // Add some spacing below the image
  },
  userProfileImage: {
    width: 342, // Set width
    height: 160, // Set height
    resizeMode: "cover", // Ensure the image fills the dimensions properly
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20, // Reduced spacing below user info
  },
  profileImage: {
    width: 45, // Reduced size
    height: 45,
    borderRadius: 22.5,
  },
  userInfoTextContainer: {
    flex: 1,
    marginLeft: 10, // Reduced margin
  },
  userName: {
    fontSize: 12, // Reduced font size
    fontWeight: "600",
    color: "#000",
  },
  userEmail: {
    fontSize: 12, // Reduced font size
    color: "#6d6d6d",
  },
  editButton: {
    padding: 4, // Reduced padding
  },
  editIcon: {
    width: 16, // Reduced size
    height: 16,
  },
  menuContainer: {
    width: "100%",
    alignSelf: "center",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8, // Reduced vertical padding
    paddingHorizontal: 15, // Added horizontal padding
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    width: 18, // Reduced size
    height: 18,
    marginRight: 10, // Reduced margin
  },
  menuText: {
    fontSize: 13, // Reduced font size
    color: "#000",
  },
  arrowIcon: {
    width: 14, // Reduced size
    height: 14,
    tintColor: "#6d6d6d",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  logoutButton: {
    backgroundColor: "#ff3b30",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
});

export default SettingsScreen;
