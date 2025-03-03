import React from 'react';
import { View, FlatList, Text, StyleSheet, Dimensions } from 'react-native';

// Mock data for exercise history
const exerciseHistory = [
  { id: '1', name: 'Running', date: '2023-12-15',  },
  { id: '2', name: 'Push-ups', date: '2023-12-13',  },
  { id: '3', name: 'Cycling', date: '2023-12-10', },
  { id: '4', name: 'Swimming', date: '2023-12-08',},
  { id: '5', name: 'Weightlifting', date: '2023-12-05',  },
  { id: '6', name: 'Yoga', date: '2023-12-03',  },
  { id: '7', name: 'HIIT Workout', date: '2023-11-30',  },
  { id: '8', name: 'Pilates', date: '2023-11-27',  },
  { id: '9', name: 'Jogging', date: '2023-11-25', },
  { id: '10', name: 'Jump Rope', date: '2023-11-22',  }
];

// Format date to a more readable format (e.g., "Dec 15, 2023")
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export default function ExerciseHistory() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Exercise History</Text>
        <Text style={styles.subHeaderText}>{exerciseHistory.length} Exercises Completed</Text>
      </View>

      {/* List of exercises */}
      <FlatList
        data={exerciseHistory}
        renderItem={({ item }) => (
          <View style={styles.exerciseItem}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <Text style={styles.exerciseDate}>{formatDate(item.date)}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
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
    backgroundColor: '#4F46E5',
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
