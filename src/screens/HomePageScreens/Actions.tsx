import * as React from "react";
import { Image, StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppDispatch, RootState } from '../../store';
import { getTodaysTasks, updateTaskCompletion } from '../../store/slices/actionSlice';
import { fetchUserById } from '../../store/slices/authSlice';

interface UserData {
  user_id: string;
  email: string;
  name: string;
  // ... other fields
}

const ActionScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const [userId, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    getUserData();
  }, []);

  React.useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  const getUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        // Remove the 'userData|' prefix and then parse
        const jsonStr = userDataString.replace('userData|', '');
        const userData: UserData = JSON.parse(jsonStr);
        setUserId(userData.user_id);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchTasks = () => {
    if (userId) {
      dispatch(getTodaysTasks(userId));
    }
  };

  const handleTaskCompletion = async (taskId: string) => {
    try {
      await dispatch(updateTaskCompletion({ taskId, isCompleted: true }));
      if (userId) {
        await dispatch(fetchUserById(userId)); // Fetch updated user data
      }
      fetchTasks(); // Refresh tasks after updating
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const renderActionItem = ({ item }: { item: any }) => (
    <View style={styles.actionRow}>
      <View style={[styles.actionItem, item.is_completed && styles.highlightedAction]}>
        <Text style={item.is_completed ? styles.actionTextHighlighted : styles.actionText}>
          {item.task_name}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.tickBox}
        onPress={() => !item.is_completed && handleTaskCompletion(item.task_id)}
      >
        <Image
          style={styles.actionIcon}
          resizeMode="cover"
          source={
            item.is_completed
              ? require("../../assets/tickmark.png")
              : require("../../assets/tickmarkgrey.png")
          }
        />
      </TouchableOpacity>
    </View>
  );

  if (!userId || loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#41ad49" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Actions</Text>
      <Text style={styles.subheaderText}>
        Based on your journal entries, here are recommended actions that you need to complete to improve your mental health.
      </Text>

      <FlatList
        data={tasks}
        renderItem={renderActionItem}
        keyExtractor={(item) => item.task_id}
        contentContainerStyle={styles.actionsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfaf0",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
    fontFamily:'Ova'
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    
  },
  subheaderText: {
    fontSize: 14,
    color: "#979797",
    textAlign: "center",
    marginBottom: 20,
  },
  actionsList: {
    flexGrow: 1,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft:10
  },
  actionItem: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 7,
borderStyle: "solid",
borderColor: "#a7a7a7",
borderWidth: 0.5,
width: "100%",
height: 54,
  },
  highlightedAction: {
    backgroundColor: "#41ad49",
    borderColor: "#41ad49",
  },
  actionText: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Inter-Regular",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
display: "flex",
  },
  actionTextHighlighted: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Inter-Regular",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
display: "flex",
  },
  tickBox: {
    width: 54,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#a7a7a7",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  actionIcon: {
    width: 24,
    height: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eaeaea",
  },
  footerButton: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#6d6d6d",
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ActionScreen;
