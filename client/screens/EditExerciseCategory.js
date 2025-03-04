import React, { useState, useEffect } from 'react';
import { ScrollView, ActivityIndicator, Alert, Modal, TextInput, StyleSheet } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function EditExerciseCategory() {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoryId, categoryName: initialCategoryName, exercises: initialExercises } = route.params || {};
  
  const [categoryName, setCategoryName] = useState(initialCategoryName || '');
  
  // Normalize exercise data to handle different formats
  const normalizeExerciseData = (exercisesData) => {
    if (!exercisesData) return [];
    
    // If exercises is an array of strings (just exercise names)
    if (exercisesData.length > 0 && typeof exercisesData[0] === 'string') {
      return exercisesData.map((name, index) => ({
        id: `temp-${index}`,
        name: name,
        level: 'Beginner', // Default level
        equipment: 'None',  // Default equipment
        category: categoryName || 'General', // Use category name or default
      }));
    }
    
    // If exercises is already in the expected format or similar
    return exercisesData.map((exercise, index) => {
      // Handle if exercise is an object but missing some properties
      if (typeof exercise === 'object') {
        return {
          id: exercise.id || exercise._id || `temp-${index}`,
          name: exercise.name || exercise.exerciseName || 'Unknown Exercise',
          level: exercise.level || 'Beginner',
          equipment: exercise.equipment || 'None',
          category: exercise.category || categoryName || 'General',
        };
      }
      
      // Fallback for any other format
      return {
        id: `temp-${index}`,
        name: String(exercise),
        level: 'Beginner',
        equipment: 'None',
        category: categoryName || 'General',
      };
    });
  };
  
  const [exercises, setExercises] = useState(normalizeExerciseData(initialExercises || []));
  const [allExercises, setAllExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch all available exercises when component mounts
  useEffect(() => {
    fetchAllExercises();
  }, []);
  
  const fetchAllExercises = () => {
    try {
      setIsLoading(true);
      // Mock API call with setTimeout to simulate network request
      setTimeout(() => {
      const sampleExercises = [
        { id: '1', name: 'Push Ups', level: 'Beginner', equipment: 'None', category: 'Chest' },
        { id: '2', name: 'Pull Ups', level: 'Intermediate', equipment: 'None', category: 'Back' },
        { id: '3', name: 'Squats', level: 'Beginner', equipment: 'None', category: 'Legs' },
        { id: '4', name: 'Barbell Bench Press', level: 'Intermediate', equipment: 'Barbell', category: 'Chest' },
        { id: '5', name: 'Dumbbell Rows', level: 'Beginner', equipment: 'Dumbbells', category: 'Back' },
        { id: '6', name: 'Deadlift', level: 'Advanced', equipment: 'Barbell', category: 'Back' },
        { id: '7', name: 'Burpees', level: 'Intermediate', equipment: 'None', category: 'Core' },
        { id: '8', name: 'Lunges', level: 'Beginner', equipment: 'None', category: 'Legs' },
      ];
      
      setAllExercises(sampleExercises);
      setIsLoading(false);
      }, 1000); // Simulate a 1 second loading delay
    } catch (error) {
      console.error('Error fetching exercises:', error);
      setError('Failed to load exercises');
      setIsLoading(false);
    }
  };
  
  // Update the category name
  const updateCategoryName = () => {
    if (!categoryName.trim()) {
      Alert.alert('Error', 'Category name cannot be empty');
      return;
    }
    
    try {
      setIsLoading(true);
      // Mock the API call with setTimeout
      setTimeout(() => {
        // Simulate successful response
        setIsLoading(false);
        Alert.alert('Success', 'Category name updated successfully');
      }, 1000); // Simulate a 1 second delay
    } catch (error) {
      console.error('Error updating category name:', error);
      setError('Failed to update category name');
      setIsLoading(false);
    }
  };
  
  // Add an exercise to the category
  const addExerciseToCategory = (exerciseId) => {
    try {
      setIsLoading(true);
      // Mock the API call with setTimeout
      setTimeout(() => {
        // Update the local list of exercises
        const exerciseToAdd = allExercises.find(ex => ex.id === exerciseId);
        if (exerciseToAdd) {
          // Ensure we don't add duplicates
          if (!exercises.some(ex => ex.id === exerciseId)) {
            setExercises([...exercises, exerciseToAdd]);
          }
        }
        
        setIsLoading(false);
        setShowAddExerciseModal(false);
      }, 800); // Simulate a 0.8 second delay
    } catch (error) {
      console.error('Error adding exercise:', error);
      setError('Failed to add exercise');
      setIsLoading(false);
    }
  };
  
  // Remove an exercise from the category
  const removeExerciseFromCategory = (exerciseId) => {
    try {
      setIsLoading(true);
      // Mock the API call with setTimeout
      setTimeout(() => {
        // Update the local list of exercises
        setExercises(exercises.filter(ex => ex.id !== exerciseId));
        
        setIsLoading(false);
      }, 600); // Simulate a 0.6 second delay
    } catch (error) {
      console.error('Error removing exercise:', error);
      setError('Failed to remove exercise');
      setIsLoading(false);
    }
  };
  
  // Filter exercises based on search query
  const filteredExercises = allExercises.filter(exercise => 
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Check if an exercise is already in the category
  const isExerciseInCategory = (exerciseId) => {
    return exercises.some(ex => ex.id === exerciseId || `${ex.id}` === `${exerciseId}`);
  };
  
  // Get background color based on exercise level
  const getLevelBgColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'rgba(5, 150, 105, 0.1)';
      case 'Intermediate':
        return 'rgba(217, 119, 6, 0.1)';
      case 'Advanced':
        return 'rgba(220, 38, 38, 0.1)';
      default:
        return 'rgba(107, 114, 128, 0.1)';
    }
  };
  
  // Get text color based on exercise level
  const getLevelTextColor = (level) => {
    switch (level) {
      case 'Beginner':
        return '#059669';
      case 'Intermediate':
        return '#D97706';
      case 'Advanced':
        return '#DC2626';
      default:
        return '#6B7280';
    }
  };
  
  return (
    <ScrollView>
      <VStack className="flex w-full px-4 py-6 mb-20">
        {/* Header */}
        <HStack className="justify-between items-center mb-6">
          <Text className="font-bold text-2xl text-gray-800">Edit Category</Text>
          <Button 
            onPress={() => navigation.goBack()}
            variant="solid"
            action="secondary"
            size="sm"
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
        </HStack>
        
        {/* Category Name Section */}
        <Box className="mb-6">
          <Text className="font-bold text-lg mb-2 text-gray-800">Category Name</Text>
          <TextInput
            style={styles.input}
            value={categoryName}
            onChangeText={setCategoryName}
            placeholder="Update your category name"
            multiline={false}
            numberOfLines={1}
            maxLength={50}
            autoCapitalize="words"
            blurOnSubmit={true}
            scrollEnabled={false}
          />
          <Button 
            onPress={updateCategoryName}
            variant="solid"
            action="primary"
            className="mt-2"
          >
            <ButtonText>Update Name</ButtonText>
          </Button>
        </Box>
        
        {/* Current Exercises Section */}
        <Box className="mb-6">
          <HStack className="justify-between items-center mb-4">
            <Text className="font-bold text-lg text-gray-800">Current Exercises</Text>
            <Button 
              onPress={() => setShowAddExerciseModal(true)}
              variant="solid"
              action="primary"
              size="sm"
            >
              <ButtonText>Add Exercise</ButtonText>
            </Button>
          </HStack>
          
          {exercises.length === 0 ? (
            <Card className="bg-gray-100 p-4 rounded-xl mb-4">
              <Text className="text-gray-600 text-center">No exercises in this category yet</Text>
            </Card>
          ) : (
            <VStack className="space-y-3">
              {exercises.map((exercise, index) => (
                <Card key={index} className="bg-white rounded-xl p-4 shadow-sm">
                  <HStack className="justify-between items-center">
                    <VStack>
                      <Text className="font-bold text-gray-800">{exercise.name}</Text>
                      <HStack className="mt-2 flex-wrap">
                        {exercise.level && (
                          <Box className="px-2 py-1 rounded-full mr-2 mb-1" style={{ backgroundColor: getLevelBgColor(exercise.level) }}>
                            <Text style={{ color: getLevelTextColor(exercise.level), fontSize: 12 }}>{exercise.level}</Text>
                          </Box>
                        )}
                        {exercise.category && (
                          <Box className="px-2 py-1 rounded-full mr-2 mb-1 bg-blue-100">
                            <Text className="text-blue-800" style={{ fontSize: 12 }}>{exercise.category}</Text>
                          </Box>
                        )}
                        {exercise.equipment && exercise.equipment !== 'None' && (
                          <Box className="px-2 py-1 rounded-full mr-2 mb-1 bg-gray-100">
                            <Text className="text-gray-600" style={{ fontSize: 12 }}>{exercise.equipment}</Text>
                          </Box>
                        )}
                      </HStack>
                    </VStack>
                    <Button 
                      onPress={() => removeExerciseFromCategory(exercise.id)}
                      variant="solid"
                      action="negative"
                      size="sm"
                    >
                      <ButtonText>Remove</ButtonText>
                    </Button>
                  </HStack>
                </Card>
              ))}
            </VStack>
          )}
        </Box>
        
        {/* Save Button */}
        <Button 
          onPress={() => {
            Alert.alert('Success', 'All changes saved successfully');
            navigation.goBack();
          }}
          variant="solid"
          action="primary"
          size="lg"
          className="mt-4"
        >
          <ButtonText>Save All Changes</ButtonText>
        </Button>
        
        {/* Loading indicator */}
        {isLoading && (
          <Box className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <ActivityIndicator size="large" color="#2563EB" />
          </Box>
        )}
        
        {/* Add Exercise Modal */}
        <Modal
          visible={showAddExerciseModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAddExerciseModal(false)}
        >
          <Box className="flex-1 justify-end bg-black bg-opacity-50">
            <Box className="bg-white rounded-t-3xl p-5 h-2/3">
              <HStack className="justify-between items-center mb-4">
                <Text className="font-bold text-xl">Add Exercise</Text>
                <Button 
                  onPress={() => setShowAddExerciseModal(false)}
                  variant="solid"
                  action="secondary"
                  size="sm"
                >
                  <ButtonText>Close</ButtonText>
                </Button>
              </HStack>
              
              <TextInput
                style={styles.input}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search exercises"
                multiline={false}
                maxLength={100}
                blurOnSubmit={true}
                returnKeyType="search"
                scrollEnabled={false}
              />
              
              <ScrollView className="mb-4">
                <VStack className="space-y-3">
                  {filteredExercises.map((exercise, index) => (
                    <Card key={index} className="bg-white rounded-xl p-4 shadow-sm">
                      <HStack className="justify-between items-center">
                        <VStack>
                          <Text className="font-bold text-gray-800">{exercise.name}</Text>
                          <HStack className="mt-2 flex-wrap">
                            {exercise.level && (
                              <Box className="px-2 py-1 rounded-full mr-2 mb-1" style={{ backgroundColor: getLevelBgColor(exercise.level) }}>
                                <Text style={{ color: getLevelTextColor(exercise.level), fontSize: 12 }}>{exercise.level}</Text>
                              </Box>
                            )}
                            {exercise.category && (
                              <Box className="px-2 py-1 rounded-full mr-2 mb-1 bg-blue-100">
                                <Text className="text-blue-800" style={{ fontSize: 12 }}>{exercise.category}</Text>
                              </Box>
                            )}
                            {exercise.equipment && exercise.equipment !== 'None' && (
                              <Box className="px-2 py-1 rounded-full mr-2 mb-1 bg-gray-100">
                                <Text className="text-gray-600" style={{ fontSize: 12 }}>{exercise.equipment}</Text>
                              </Box>
                            )}
                          </HStack>
                        </VStack>
                        <Button 
                          onPress={() => addExerciseToCategory(exercise.id)}
                          variant="solid"
                          action="primary"
                          size="sm"
                          disabled={isExerciseInCategory(exercise.id)}
                        >
                          <ButtonText>
                            {isExerciseInCategory(exercise.id) ? 'Added' : 'Add'}
                          </ButtonText>
                        </Button>
                      </HStack>
                    </Card>
                  ))}
                  
                  {filteredExercises.length === 0 && (
                    <Card className="bg-gray-100 p-4 rounded-xl">
                      <Text className="text-gray-600 text-center">No exercises found</Text>
                    </Card>
                  )}
                </VStack>
              </ScrollView>
            </Box>
          </Box>
        </Modal>
      </VStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    color: '#1f2937',
  }
});
