import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {gql, useMutation, useQuery} from "@apollo/client";
import capitalizeFirstChar from "@/helpers/capitalize-first-char";
import {Alert, AlertIcon, AlertText} from "@/components/ui/alert";
import {AlertCircleIcon} from "@/components/ui/icon";
import {GET_CUSTOM_CATEGORY} from "@/screens/CustomCategory";

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

const CREATE_CATEGORY = gql(`
    mutation AddUserExercise($name: String, $duration: Int, $restDuration: Int, $exerciseId: [String]) {
        addUserExercise(name: $name, duration: $duration, restDuration: $restDuration, exerciseId: $exerciseId) {
            _id
        }
    }
`)

const GET_EXERCISES = gql(`
    query ExerciseCategories($level: [String], $equipment: [String], $category: [String], $search: String) {
        getAllExercises(level: $level, equipment: $equipment, category: $category, search: $search) {
            _id
            name
            category
            equipment
            level
            force
            mechanic
            primaryMuscles
            secondaryMuscles
        }
    }
`)

export default function AddExercisePage() {
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [exercisesAdded, setExercisesAdded] = useState([]);

  const [categoryName, setCategoryName] = useState('');
  const [workoutDuration, setWorkoutDuration] = useState('');
  const [restDuration, setRestDuration] = useState('');

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

  const {data: exerciseData, loading: exerciseLoading} = useQuery(GET_EXERCISES, {
    variables: {
      level: filters.level.map(val => val.toLowerCase()),
      equipment: filters.equipment.map(val => val.toLowerCase()),
      category: filters.category.map(val => val.toLowerCase()),
      search: searchQuery
    }
  });
  const allExerciseData = exerciseData?.getAllExercises;

  // Filter options
  const levelOptions = ['Beginner', 'Intermediate', 'Expert'];
  const equipmentOptions = ['Body only', 'Bands', 'Barbell', 'Cable', 'Dumbbell', 'Exercise ball', "E-Z Curl Bar", "Foam roll", "Kettlebells", "Machine", "Medicine Ball", "Other"];
  const categories = ["Cardio", "Olympic Weightlifting", "Plyometrics", "Powerlifting", "Strength", "Stretching", "Strongman"];

  // Exercise data with level and equipment properties
  const allExercises = [
    {name: 'Push Ups', level: 'Beginner', equipment: 'None', category: 'Chest'},
  ];

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
  };

  // Toggle filter selection
  const toggleFilter = (type, value) => {
    const updatedFilters = {...filters};
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

  const [error, setError] = useState(null);

  // Function to handle form submission
  const [addExercise, {loading: loadingAddExercise, error: addExerciseError}] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [{query: GET_CUSTOM_CATEGORY}]
  });

  const handleSubmit = async () => {
    setError("");
    if (categoryName.trim() === '') {
      setError('Please enter a category name');
      return;
    }

    if (exercisesAdded.length === 0) {
      setError('Please add at least one exercise');
      return;
    }

    if (!workoutDuration) {
      setError('Please enter a workout duration');
      return;
    } else if (Number(workoutDuration) <= 0) {
      setError('Workout duration must be greater than 0');
      return;
    }

    if (!restDuration) {
      setError('Please enter a rest duration');
      return;
    } else if (Number(restDuration) <= 0) {
      setError('Rest duration must be greater than 0');
      return;
    }

    const body = {
      name: categoryName,
      exerciseId: exercisesAdded.map(exercise => exercise._id),
      duration: Math.round(Number(workoutDuration)),
      restDuration: Math.round(Number(restDuration))
    }
    await addExercise(({
      variables: body
    })).then(() => {
      navigation.reset({
        index: 1,
        routes: [{name: "Landing", state: {routes: [{name: "My Workout"}]}}],
      });
    }).catch(e => {
      setError(e.message);
    })

    // Clear form after submission
    // setCategoryName('');
    // setExercisesAdded([]);
    // alert('Workout created successfully!');
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
                <View key={`equipment-${index}`} style={[styles.filterChip, {
                  backgroundColor: 'rgba(107, 114, 128, 0.1)',
                  borderColor: COLORS.textSecondary
                }]}>
                  <Text style={[styles.filterChipText, {color: COLORS.textSecondary}]}>{equipment}</Text>
                </View>
              ))}

              {activeFilters.category.map((category, index) => (
                <View key={`category-${index}`} style={[styles.filterChip, {
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  borderColor: COLORS.accent
                }]}>
                  <Text style={[styles.filterChipText, {color: COLORS.accent}]}>{category}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Filtered Exercises or All Exercises */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Exercises</Text>
        {exerciseLoading ? <View className="justify-center">
          <ActivityIndicator size="large"/>
        </View> : allExerciseData.map((exercise, index) => index < 50 && (
          <View key={index} style={styles.exerciseCard}>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <View style={styles.exerciseDetails}>
                <View style={[
                  styles.levelBadge,
                  {
                    backgroundColor:
                      exercise.level === 'beginner' ? 'rgba(5, 150, 105, 0.1)' :
                        exercise.level === 'intermediate' ? 'rgba(217, 119, 6, 0.1)' :
                          'rgba(220, 38, 38, 0.1)'
                  },
                  {
                    borderColor:
                      exercise.level === 'beginner' ? COLORS.beginner :
                        exercise.level === 'intermediate' ? COLORS.intermediate :
                          COLORS.advanced
                  }
                ]}>
                  <Text style={[
                    styles.levelText,
                    {
                      color:
                        exercise.level === 'beginner' ? COLORS.beginner :
                          exercise.level === 'intermediate' ? COLORS.intermediate :
                            COLORS.advanced
                    }
                  ]}>{capitalizeFirstChar(exercise.level)}</Text>
                </View>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{capitalizeFirstChar(exercise.category)}</Text>
                </View>
                {exercise.equipment &&
                  <View style={styles.equipmentBadge}>
                    <Text style={styles.equipmentText}>{capitalizeFirstChar(exercise.equipment)}</Text>
                  </View>
                }
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
                          exercise.level === 'beginner' ? 'rgba(5, 150, 105, 0.1)' :
                            exercise.level === 'intermediate' ? 'rgba(217, 119, 6, 0.1)' :
                              'rgba(220, 38, 38, 0.1)'
                      },
                      {
                        borderColor:
                          exercise.level === 'beginner' ? COLORS.beginner :
                            exercise.level === 'intermediate' ? COLORS.intermediate :
                              COLORS.advanced
                      }
                    ]}>
                      <Text style={[
                        styles.levelText,
                        {
                          color:
                            exercise.level === 'beginner' ? COLORS.beginner :
                              exercise.level === 'intermediate' ? COLORS.intermediate :
                                COLORS.advanced
                        }
                      ]}>{capitalizeFirstChar(exercise.level)}</Text>
                    </View>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{capitalizeFirstChar(exercise.category)}</Text>
                    </View>
                    {exercise.equipment &&
                      <View style={styles.equipmentBadge}>
                        <Text style={styles.equipmentText}>{capitalizeFirstChar(exercise.equipment)}</Text>
                      </View>
                    }
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
            <Text style={styles.emptyStateSubText}>Search for exercises and tap 'Add' to include them in your
              workout</Text>
          </View>
        )}
      </View>

      {/* Duration */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Enter your duration in seconds: </Text>
        <Text style={[styles.sectionTitle, {marginBottom: "8px", fontWeight: 500}]}>Workout duration</Text>
        <TextInput
          style={[styles.categoryInput, {
            borderBottom: "solid 1px #000000 !important"
          }]}
          placeholder="(e.g. 30)"
          placeholderTextColor={COLORS.textSecondary}
          keyboardType="numeric"
          value={workoutDuration}
          onChangeText={setWorkoutDuration}
        />
        <Text style={[styles.sectionTitle, {marginTop: 8, marginBottom: "8px", fontWeight: 500}]}>Rest duration</Text>
        <TextInput
          style={styles.categoryInput}
          placeholder="(e.g. 30)"
          placeholderTextColor={COLORS.textSecondary}
          keyboardType="numeric"
          value={restDuration}
          onChangeText={setRestDuration}
        />
      </View>
      {/* Submit Button */}
      {error && <Alert className="mb-4" action="error">
        <AlertIcon as={AlertCircleIcon}/>
        <AlertText className="px-4">
          {error}
        </AlertText>
      </Alert>
      }
      <TouchableOpacity
        style={loadingAddExercise ? [styles.submitButton, styles.submitButtonDisabled] : [
          styles.submitButton,
          styles.submitButtonEnabled
        ]}
        disabled={loadingAddExercise}
        onPress={handleSubmit}
      >
        {loadingAddExercise && <ActivityIndicator/>}
        <Text style={[
          styles.submitButtonText,
          styles.submitButtonTextEnabled
        ]}>Create Workout</Text>
      </TouchableOpacity>

      {/* Extra padding to ensure submit button is visible */}
      <View style={{height: 120}}/>

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
                  setFilters({...activeFilters});
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
    flexDirection: "row",
    gap: 16,
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

