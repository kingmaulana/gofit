import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Button, TextInput, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';

// Color constants for better maintainability
const COLORS = {
    background: '#FFFFFF',         // White background
    cardBackground: '#F5F7FA',     // Light gray card background
    accent: '#1E40AF',            // Dark blue accent for buttons
    accentLight: '#2563EB',        // Light blue for secondary actions
    text: '#111827',              // Dark text for readability on light background
    textSecondary: '#6B7280',     // Medium gray for secondary text
    inputBackground: '#F3F4F6',   // Light gray input background
    border: '#E5E7EB',            // Light border color
    modalOverlay: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent overlay for modals
    success: '#10B981',           // Green for success indicators
    filterChip: '#EEF2FF',        // Light blue for filter chips
    beginner: '#059669',          // Green for beginner level
    intermediate: '#D97706',      // Orange for intermediate level
    advanced: '#DC2626',          // Red for advanced level
}

export default function AddExercisePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [exercisesAdded, setExercisesAdded] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [categoryName, setCategoryName] = useState('');

    // Filter states
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [filters, setFilters] = useState({
        level: [],
        equipment: [],
        category: []
    });
    const [activeFilters, setActiveFilters] = useState({
        level: [],
        equipment: [],
        category: []
    });

    // Filter options
    const levelOptions = ['Beginner', 'Intermediate', 'Advanced'];
    const equipmentOptions = ['None', 'Dumbbells', 'Barbell', 'Resistance Bands', 'Kettlebell', 'Machine'];
    const categories = ['Chest', 'Back', 'Legs', 'Core', 'Shoulders', 'Arms'];

    // Exercise data with level and equipment properties
    const allExercises = [
        { name: 'Push Ups', level: 'Beginner', equipment: 'None', category: 'Chest' },
        { name: 'Pull Ups', level: 'Intermediate', equipment: 'None', category: 'Back' },
        { name: 'Squats', level: 'Beginner', equipment: 'None', category: 'Legs' },
        { name: 'Barbell Bench Press', level: 'Intermediate', equipment: 'Barbell', category: 'Chest' },
        { name: 'Dumbbell Rows', level: 'Beginner', equipment: 'Dumbbells', category: 'Back' },
        { name: 'Deadlift', level: 'Advanced', equipment: 'Barbell', category: 'Back' },
        { name: 'Burpees', level: 'Intermediate', equipment: 'None', category: 'Core' },
        { name: 'Lunges', level: 'Beginner', equipment: 'None', category: 'Legs' },
        { name: 'Plank', level: 'Beginner', equipment: 'None', category: 'Core' },
        { name: 'Resistance Band Pull Apart', level: 'Beginner', equipment: 'Resistance Bands', category: 'Shoulders' },
        { name: 'Kettlebell Swings', level: 'Intermediate', equipment: 'Kettlebell', category: 'Legs' },
        { name: 'Leg Press', level: 'Beginner', equipment: 'Machine', category: 'Legs' },
        { name: 'Mountain Climbers', level: 'Intermediate', equipment: 'None', category: 'Core' },
        { name: 'Leg Raises', level: 'Beginner', equipment: 'None', category: 'Core' },
        { name: 'Overhead Press', level: 'Intermediate', equipment: 'Barbell', category: 'Shoulders' },
        { name: 'Bicep Curls', level: 'Beginner', equipment: 'Dumbbells', category: 'Arms' },
    ];

    // Initialize filter state when component mounts
    useEffect(() => {
        // Initialize filtered exercises with all exercises
        setFilteredExercises(allExercises);
    }, []);
    // We've removed the useEffect that auto-filters when categoryName changes
    // This allows the user to input a category name without automatically filtering

    // Function to add an exercise
    const handleAddExercise = (exercise) => {
        setExercisesAdded((prev) => [...prev, exercise]);
    };

    // Function to remove an exercise from exercisesAdded array
    const handleRemoveExercise = (index) => {
        // Create a new array without the exercise at the specified index
        const updatedExercises = [...exercisesAdded];
        updatedExercises.splice(index, 1);
        setExercisesAdded(updatedExercises);
    };

    // Search function
    const handleSearch = (query) => {
        setSearchQuery(query);
        filterExercises(query, activeFilters);
    };
    // Apply filters function - improved to create a deep copy of filters
    const applyFilters = () => {
        // Create a deep copy of filters to avoid reference issues
        const updatedFilters = {
            level: [...filters.level],
            equipment: [...filters.equipment],
            category: [...filters.category]
        };
        setActiveFilters(updatedFilters);
        setFilterModalVisible(false);
        filterExercises(searchQuery, updatedFilters);
    };

    // Reset filters
    const resetFilters = () => {
        const emptyFilters = {
            level: [],
            equipment: [],
            category: []
        };
        setFilters(emptyFilters);
        setActiveFilters(emptyFilters);

        // If a category was selected, deselect it
        // If a category was entered, clear it
        if (categoryName) {
            setCategoryName('');
        }
        filterExercises(searchQuery, emptyFilters);
    };
    // Function to filter exercises based on search query and filters
    const filterExercises = (query, currentFilters) => {
        let results = [...allExercises];

        // Apply search filter
        if (query !== '') {
            results = results.filter((exercise) =>
                exercise.name.toLowerCase().includes(query.toLowerCase())
            );
        }

        // Apply level filter
        if (currentFilters.level.length > 0) {
            results = results.filter(exercise =>
                currentFilters.level.includes(exercise.level)
            );
        }

        // Apply equipment filter
        if (currentFilters.equipment.length > 0) {
            results = results.filter(exercise =>
                currentFilters.equipment.includes(exercise.equipment)
            );
        }

        // Apply category filter
        if (currentFilters.category.length > 0) {
            results = results.filter(exercise =>
                currentFilters.category.includes(exercise.category)
            );
        }
        // Removed the condition that auto-filtered based on categoryName

        setFilteredExercises(results);
    };

    // Toggle filter selection
    const toggleFilter = (type, value) => {
        const updatedFilters = { ...filters };
        const index = updatedFilters[type].indexOf(value);

        if (index === -1) {
            updatedFilters[type] = [...updatedFilters[type], value];

            // If adding a category filter, update category name
            if (type === 'category' && categoryName !== value) {
                setCategoryName(value);
            }
        } else {
            updatedFilters[type] = updatedFilters[type].filter(item => item !== value);

            // If removing a category that was entered, clear the category name
            if (type === 'category' && categoryName === value) {
                setCategoryName('');
            }
        }

        setFilters(updatedFilters);
    };
    // Function to handle form submission
    const handleSubmit = () => {
        if (categoryName.trim() === '') {
            alert('Please enter a category name');
            return;
        }

        if (exercisesAdded.length === 0) {
            alert('Please add at least one exercise');
            return;
        }

        // Here you would typically save the data
        console.log('Category:', categoryName);
        console.log('Exercises:', exercisesAdded);

        // Clear form after submission
        setCategoryName('');
        setExercisesAdded([]);
        alert('Workout created successfully!');
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Create Custom Workout</Text>
            </View>

            {/* Custom Category Input */}
            <View style={styles.categoryContainer}>
                <Text style={styles.sectionTitle}>Custom Category Name</Text>
                <TextInput
                    style={styles.categoryInput}
                    placeholder="Enter category name (e.g., 'Morning Routine', 'Chest Day')"
                    placeholderTextColor={COLORS.textSecondary}
                    value={categoryName}
                    onChangeText={setCategoryName}
                />
            </View>

            {/* Search Bar and Filter */}
            <View style={styles.searchContainer}>
                <View style={styles.searchRow}>
                    <TextInput
                        placeholder="Search exercises"
                        placeholderTextColor={COLORS.textSecondary}
                        value={searchQuery}
                        onChangeText={handleSearch}
                        style={styles.searchInput}
                    />
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setFilterModalVisible(true)}
                    >
                        <Text style={styles.filterButtonText}>Filter</Text>
                    </TouchableOpacity>
                </View>

                {/* Active Filters Display */}
                {(activeFilters.level.length > 0 ||
                    activeFilters.equipment.length > 0 ||
                    activeFilters.category.length > 0) && (
                        <View style={styles.activeFiltersContainer}>
                            <View style={styles.activeFiltersHeader}>
                                <Text style={styles.activeFiltersTitle}>Active Filters:</Text>
                                <TouchableOpacity onPress={resetFilters}>
                                    <Text style={styles.clearFiltersText}>Clear All</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.filterChipsContainer}>
                                {activeFilters.level.map((level, index) => (
                                    <View key={`level-${index}`} style={[
                                        styles.filterChip,
                                        {
                                            backgroundColor:
                                                level === 'Beginner' ? 'rgba(5, 150, 105, 0.1)' :
                                                    level === 'Intermediate' ? 'rgba(217, 119, 6, 0.1)' :
                                                        'rgba(220, 38, 38, 0.1)'
                                        },
                                        {
                                            borderColor:
                                                level === 'Beginner' ? COLORS.beginner :
                                                    level === 'Intermediate' ? COLORS.intermediate :
                                                        COLORS.advanced
                                        }
                                    ]}>
                                        <Text style={[
                                            styles.filterChipText,
                                            {
                                                color:
                                                    level === 'Beginner' ? COLORS.beginner :
                                                        level === 'Intermediate' ? COLORS.intermediate :
                                                            COLORS.advanced
                                            }
                                        ]}>
                                            {level}
                                        </Text>
                                    </View>
                                ))}
                                {activeFilters.equipment.map((equipment, index) => (
                                    <View key={`equipment-${index}`} style={[styles.filterChip, { backgroundColor: 'rgba(107, 114, 128, 0.1)', borderColor: COLORS.textSecondary }]}>
                                        <Text style={[styles.filterChipText, { color: COLORS.textSecondary }]}>{equipment}</Text>
                                    </View>
                                ))}

                                {activeFilters.category.map((category, index) => (
                                    <View key={`category-${index}`} style={[styles.filterChip, { backgroundColor: 'rgba(37, 99, 235, 0.1)', borderColor: COLORS.accent }]}>
                                        <Text style={[styles.filterChipText, { color: COLORS.accent }]}>{category}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
            </View>

            {/* Filtered Exercises or All Exercises */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Exercises</Text>
                {(filteredExercises.length > 0 ? filteredExercises : allExercises).map((exercise, index) => (
                    <View key={index} style={styles.exerciseCard}>
                        <View style={styles.exerciseInfo}>
                            <Text style={styles.exerciseName}>{exercise.name}</Text>
                            <View style={styles.exerciseDetails}>
                                <View style={[
                                    styles.levelBadge,
                                    {
                                        backgroundColor:
                                            exercise.level === 'Beginner' ? 'rgba(5, 150, 105, 0.1)' :
                                                exercise.level === 'Intermediate' ? 'rgba(217, 119, 6, 0.1)' :
                                                    'rgba(220, 38, 38, 0.1)'
                                    },
                                    {
                                        borderColor:
                                            exercise.level === 'Beginner' ? COLORS.beginner :
                                                exercise.level === 'Intermediate' ? COLORS.intermediate :
                                                    COLORS.advanced
                                    }
                                ]}>
                                    <Text style={[
                                        styles.levelText,
                                        {
                                            color:
                                                exercise.level === 'Beginner' ? COLORS.beginner :
                                                    exercise.level === 'Intermediate' ? COLORS.intermediate :
                                                        COLORS.advanced
                                        }
                                    ]}>{exercise.level}</Text>
                                </View>
                                <View style={styles.categoryBadge}>
                                    <Text style={styles.categoryText}>{exercise.category}</Text>
                                </View>
                                <View style={styles.equipmentBadge}>
                                    <Text style={styles.equipmentText}>{exercise.equipment}</Text>
                                </View>
                            </View>
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
                            <View style={styles.exerciseInfoWithDelete}>
                                <View style={styles.exerciseInfo}>
                                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                                    <View style={styles.exerciseDetails}>
                                        <View style={[
                                            styles.levelBadge,
                                            {
                                                backgroundColor:
                                                    exercise.level === 'Beginner' ? 'rgba(5, 150, 105, 0.1)' :
                                                        exercise.level === 'Intermediate' ? 'rgba(217, 119, 6, 0.1)' :
                                                            'rgba(220, 38, 38, 0.1)'
                                            },
                                            {
                                                borderColor:
                                                    exercise.level === 'Beginner' ? COLORS.beginner :
                                                        exercise.level === 'Intermediate' ? COLORS.intermediate :
                                                            COLORS.advanced
                                            }
                                        ]}>
                                            <Text style={[
                                                styles.levelText,
                                                {
                                                    color:
                                                        exercise.level === 'Beginner' ? COLORS.beginner :
                                                            exercise.level === 'Intermediate' ? COLORS.intermediate :
                                                                COLORS.advanced
                                                }
                                            ]}>{exercise.level}</Text>
                                        </View>
                                        <View style={styles.categoryBadge}>
                                            <Text style={styles.categoryText}>{exercise.category}</Text>
                                        </View>
                                        <View style={styles.equipmentBadge}>
                                            <Text style={styles.equipmentText}>{exercise.equipment}</Text>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleRemoveExercise(index)}
                                >
                                    <Text style={styles.deleteButtonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyStateContainer}>
                        <Text style={styles.emptyStateText}>No Exercises Added</Text>
                        <Text style={styles.emptyStateSubText}>Search for exercises and tap 'Add' to include them in your workout</Text>
                    </View>
                )}
            </View>
            {/* Submit Button */}
            <TouchableOpacity
                style={[
                    styles.submitButton,
                    styles.submitButtonEnabled
                ]}
                onPress={handleSubmit}
            >
                <Text style={[
                    styles.submitButtonText, 
                    styles.submitButtonTextEnabled
                ]}>Create Workout</Text>
            </TouchableOpacity>
            
            {/* Extra padding to ensure submit button is visible */}
            <View style={{ height: 120 }} />

            {/* Filter Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={filterModalVisible}
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.filterModalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filter Exercises</Text>
                        </View>

                        <ScrollView style={styles.filterScrollView}>
                            {/* Level Filter */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>Level</Text>
                                <View style={styles.filterOptionContainer}>
                                    {levelOptions.map((level, index) => (
                                        <TouchableOpacity
                                            key={`level-${index}`}
                                            style={[
                                                styles.filterOption,
                                                filters.level.includes(level) && styles.filterOptionSelected,
                                                {
                                                    backgroundColor: filters.level.includes(level) ?
                                                        (level === 'Beginner' ? 'rgba(5, 150, 105, 0.1)' :
                                                            level === 'Intermediate' ? 'rgba(217, 119, 6, 0.1)' :
                                                                'rgba(220, 38, 38, 0.1)') :
                                                        COLORS.cardBackground
                                                },
                                                {
                                                    borderColor: filters.level.includes(level) ?
                                                        (level === 'Beginner' ? COLORS.beginner :
                                                            level === 'Intermediate' ? COLORS.intermediate :
                                                                COLORS.advanced) :
                                                        COLORS.border
                                                }
                                            ]}
                                            onPress={() => toggleFilter('level', level)}
                                        >
                                            <Text style={[
                                                styles.filterOptionText,
                                                filters.level.includes(level) && {
                                                    color: level === 'Beginner' ? COLORS.beginner :
                                                        level === 'Intermediate' ? COLORS.intermediate :
                                                            COLORS.advanced
                                                }
                                            ]}>
                                                {level}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            {/* Equipment Filter */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>Equipment</Text>
                                <View style={styles.filterOptionContainer}>
                                    {equipmentOptions.map((equipment, index) => (
                                        <TouchableOpacity
                                            key={`equipment-${index}`}
                                            style={[
                                                styles.filterOption,
                                                filters.equipment.includes(equipment) && styles.filterOptionSelectedEquipment,
                                                filters.equipment.includes(equipment) && {
                                                    backgroundColor: 'rgba(107, 114, 128, 0.1)',
                                                    borderColor: COLORS.textSecondary
                                                }
                                            ]}
                                            onPress={() => toggleFilter('equipment', equipment)}
                                        >
                                            <Text style={[
                                                styles.filterOptionText,
                                                filters.equipment.includes(equipment) && {
                                                    color: COLORS.textSecondary,
                                                    fontWeight: '600'
                                                }
                                            ]}>
                                                {equipment}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            {/* Category Filter */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>Category</Text>
                                <View style={styles.filterOptionContainer}>
                                    {categories.map((category, index) => (
                                        <TouchableOpacity
                                            key={`category-${index}`}
                                            style={[
                                                styles.filterOption,
                                                filters.category.includes(category) && styles.filterOptionSelectedCategory,
                                                filters.category.includes(category) && {
                                                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                                                    borderColor: COLORS.accent
                                                }
                                            ]}
                                            onPress={() => toggleFilter('category', category)}
                                        >
                                            <Text style={[
                                                styles.filterOptionText,
                                                filters.category.includes(category) && {
                                                    color: COLORS.accent,
                                                    fontWeight: '600'
                                                }
                                            ]}>
                                                {category}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </ScrollView>

                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={() => {
                                    // Reset filters to the active filters before opening the modal
                                    setFilters({ ...activeFilters });
                                    setFilterModalVisible(false);
                                }}
                            >
                                <Text style={styles.modalCancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modalApplyButton}
                                onPress={applyFilters}
                            >
                                <Text style={styles.modalApplyButtonText}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    // Submit button styles
    submitButton: {
        backgroundColor: COLORS.inputBackground,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        marginBottom: 40,
        borderWidth: 1,
        borderColor: COLORS.border,
        elevation: 2,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonEnabled: {
        backgroundColor: COLORS.accent,
        borderColor: COLORS.accent,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    submitButtonText: {
        color: COLORS.textSecondary,
        fontWeight: 'bold',
        fontSize: 18,
    },
    submitButtonTextEnabled: {
        color: COLORS.background,
    },
    // Filter option selected styles
    filterOption: {
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.cardBackground,
    },
    filterOptionSelected: {
        borderWidth: 1.5,
    },
    filterOptionSelectedEquipment: {
        borderWidth: 1.5,
        shadowColor: COLORS.textSecondary,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    filterOptionSelectedCategory: {
        borderWidth: 1.5,
        shadowColor: COLORS.accent,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    filterOptionText: {
        color: COLORS.text,
        fontWeight: '500',
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 16,
        paddingBottom: 150, // Increased padding at the bottom for the submit button
    },
    categoryContainer: {
        marginBottom: 24,
    },
    selectedCategoryContainer: {
        marginBottom: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: COLORS.cardBackground,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.success,
    },
    selectedCategoryText: {
        color: COLORS.text,
        fontSize: 16,
    },
    categoryNameText: {
        fontWeight: 'bold',
        color: COLORS.accent,
    },
    selectCategoryPrompt: {
        marginBottom: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: COLORS.cardBackground,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
    },
    selectCategoryText: {
        color: COLORS.textSecondary,
        fontSize: 15,
    },
    categoriesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    categoryChip: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        margin: 4,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    selectedCategoryChip: {
        backgroundColor: COLORS.accent,
        borderColor: COLORS.accent,
    },
    categoryChipText: {
        color: COLORS.text,
        fontWeight: '500',
    },
    selectedCategoryChipText: {
        color: COLORS.background,
    },
    createCategoryButton: {
        backgroundColor: COLORS.inputBackground,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        margin: 4,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
    },
    createCategoryButtonText: {
        color: COLORS.accentLight,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.modalOverlay,
    },
    modalContainer: {
        width: '85%',
        backgroundColor: COLORS.background,
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
    },
    filterModalContainer: {
        width: '90%',
        backgroundColor: COLORS.background,
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
        maxHeight: '80%',
    },
    modalHeader: {
        marginBottom: 20,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
    },
    modalInput: {
        backgroundColor: COLORS.inputBackground,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 24,
        color: COLORS.text,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalCancelButton: {
        flex: 1,
        backgroundColor: COLORS.inputBackground,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
        height: 46,
    },
    modalCancelButtonText: {
        color: COLORS.textSecondary,
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalCreateButton: {
        flex: 1,
        backgroundColor: COLORS.accent,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginLeft: 8,
        alignItems: 'center',
        justifyContent: 'center',
        height: 46,
    },
    modalCreateButtonDisabled: {
        backgroundColor: COLORS.inputBackground,
    },
    modalCreateButtonText: {
        color: COLORS.background,
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalApplyButton: {
        flex: 1,
        backgroundColor: COLORS.accent,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginLeft: 8,
        alignItems: 'center',
        justifyContent: 'center',
        height: 46,
        elevation: 3,
        shadowColor: COLORS.accent,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalApplyButtonText: {
        color: COLORS.background,
        fontWeight: 'bold',
        fontSize: 16,
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
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    filterScrollView: {
        maxHeight: 400,
    },
    filterSection: {
        marginBottom: 20,
    },
    filterSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 12,
    },
    filterOptionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
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
        flex: 1,
    },
    filterButton: {
        backgroundColor: COLORS.accent,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginLeft: 12,
    },
    filterButtonText: {
        color: COLORS.background,
        fontWeight: 'bold',
    },
    activeFiltersContainer: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    activeFiltersHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    activeFiltersTitle: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: 'bold',
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
    exerciseInfoWithDelete: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    deleteButton: {
        backgroundColor: '#DC2626', // Red color for delete
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginLeft: 8,
    },
    deleteButtonText: {
        color: COLORS.background, // White text
        fontWeight: 'bold',
        fontSize: 12,
    },
    emptyStateSubText: {
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    exerciseDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    levelBadge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        borderWidth: 1,
        marginRight: 8,
        marginBottom: 4,
    },
    categoryBadge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        borderWidth: 1,
        marginRight: 8,
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderColor: COLORS.accent,
        marginBottom: 4,
    },
    equipmentBadge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        borderWidth: 1,
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        borderColor: COLORS.textSecondary,
        marginBottom: 4,
    },
    levelText: {
        fontSize: 11,
        fontWeight: '600',
    },
    categoryText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.accent,
    },
    equipmentText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    emptyStateContainer: {
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
});

