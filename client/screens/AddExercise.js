import React, { useState } from 'react';
import { ScrollView, View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

// Color constants for better maintainability
const COLORS = {
  background: '#FFFFFF',         // White background
  cardBackground: '#F5F7FA',     // Light gray card background
  accent: '#1E40AF',            // Dark blue accent for buttons
  text: '#111827',              // Dark text for readability on light background
  textSecondary: '#6B7280',     // Medium gray for secondary text
  inputBackground: '#F3F4F6',   // Light gray input background
  border: '#E5E7EB',            // Light border color
}

export default function AddExercisePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [exercisesAdded, setExercisesAdded] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);

    // Daftar latihan
    const allExercises = [
        { name: 'Push Ups' },
        { name: 'Pull Ups' },
        { name: 'Squats' },
        { name: 'Burpees' },
        { name: 'Lunges' },
        { name: 'Plank' },
        { name: 'Mountain Climbers' },
        { name: 'Leg Raises' },
    ];

    // Fungsi untuk menambahkan latihan
    const handleAddExercise = (exercise) => {
        setExercisesAdded((prev) => [...prev, exercise]);
    };

    // Fungsi pencarian
    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query === '') {
            setFilteredExercises([]);
        } else {
            const results = allExercises.filter((exercise) =>
                exercise.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredExercises(results);
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Add Exercises</Text>
                <TouchableOpacity style={styles.doneButton} onPress={() => {}}>
                    <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Search exercises"
                    placeholderTextColor={COLORS.textSecondary}
                    value={searchQuery}
                    onChangeText={handleSearch}
                    style={styles.searchInput}
                />
            </View>

            {/* Filtered Exercises or All Exercises */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Exercises</Text>
                {(filteredExercises.length > 0 ? filteredExercises : allExercises).map((exercise, index) => (
                    <View key={index} style={styles.exerciseCard}>
                        <View style={styles.exerciseInfo}>
                            <Text style={styles.exerciseName}>{exercise.name}</Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.addButton} 
                            onPress={() => handleAddExercise(exercise)}
                        >
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            {/* Added Exercises */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Added Exercises</Text>
                {exercisesAdded.length > 0 ? (
                    exercisesAdded.map((exercise, index) => (
                        <View key={index} style={styles.addedExerciseCard}>
                            <Text style={styles.exerciseName}>{exercise.name}</Text>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyStateContainer}>
                        <Text style={styles.emptyStateText}>No Exercises Added</Text>
                        <Text style={styles.emptyStateSubText}>Search for exercises and tap 'Add' to include them in your workout</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        paddingVertical: 8,
    },
    headerTitle: {
        color: COLORS.text,
        fontSize: 22,
        fontWeight: 'bold',
    },
    doneButton: {
        backgroundColor: COLORS.accent,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    doneButtonText: {
        color: COLORS.background,
        fontWeight: 'bold',
    },
    searchContainer: {
        marginBottom: 24,
    },
    searchInput: {
        color: COLORS.text,
        backgroundColor: COLORS.inputBackground,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        fontSize: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    exerciseCard: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    exerciseInfo: {
        flex: 1,
    },
    exerciseName: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '500',
    },
    addButton: {
        backgroundColor: COLORS.accent,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    addButtonText: {
        color: COLORS.background,
        fontWeight: 'bold',
    },
    addedExerciseCard: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.accent,
    },
    emptyStateContainer: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.cardBackground,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
    },
    emptyStateText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    emptyStateSubText: {
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
});
