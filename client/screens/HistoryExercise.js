import { Button } from '@/components/ui/button';
import { gql, useQuery } from '@apollo/client';
import React from 'react';
import {ActivityIndicator, FlatList, StyleSheet, Text, View} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const GET_HISTORY_EXERCISE = gql(`query HistoryUser {
  historyCategory {
    _id
    userId
    categoryId
    userGoalId
    createdAt
    categoryName
    goalName
  }
}
`);

// Format date to a more readable format (e.g., "Dec 15, 2023")
const formatDate = (dateString) => {
  const timestamp = parseInt(dateString, 10); // Convert the string to a number if it's not already a number
  if (isNaN(timestamp)) return "Invalid Date"; // Handle invalid cases

  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(timestamp).toLocaleDateString('en-US', options);
};


export default function ExerciseHistory() {
  const navigation = useNavigation();
  const { data, loading, error } = useQuery(GET_HISTORY_EXERCISE);
  // console.log("🚀 ~ ExerciseHistory ~ data:", data)

  const exerciseHistory = data?.historyCategory
  // console.log("🚀 ~ ExerciseHistory ~ exerciseHistory:", exerciseHistory)

  if (loading) {
    return <View className="h-full justify-center items-center">
      <ActivityIndicator size="large" color="black" />
    </View>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Exercise History</Text>
        <Text style={styles.subHeaderText}>{exerciseHistory?.length} Collection Exercises Completed</Text>
      </View>

      <Button
                onPress={() => navigation.navigate("ProgressWeight")}
                size="sm" variant="solid" className="bg-black mt-3 mb-3 rounded-lg">
                    <Text className="text-white font-medium">See Progress</Text>
                    <Ionicons name="analytics" size={24} color="white" />
      </Button>

      {/* List of exercises */}
      <FlatList
        data={exerciseHistory}
        renderItem={({ item }) => (
          <View style={styles.exerciseItem}>
            <Text style={styles.exerciseName}>{(item?.categoryName) ? `${item?.categoryName} collections` : `${item?.goalName} Powered By AI`}</Text>
            <Text style={styles.exerciseDate}>{formatDate(item.createdAt)}</Text>
          </View>
        )}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    backgroundColor: '#334155',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
  },
  exerciseItem: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
  },
  exerciseDate: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  exerciseDetails: {
    marginTop: 8,
  },
  exerciseDuration: {
    fontSize: 14,
    color: '#333',
  },
  exerciseCalories: {
    fontSize: 14,
    color: '#333',
  },
});
