import React, { useEffect, useState } from 'react'
import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { HStack } from "@/components/ui/hstack"
import { VStack } from "@/components/ui/vstack"
import { Image } from "@/components/ui/image"
import { Text } from "@/components/ui/text"
import { Icon, ClockIcon, CheckCircleIcon, AlertCircleIcon } from "@/components/ui/icon"
import { Button } from "@/components/ui/button"
import { ScrollView, TouchableWithoutFeedback } from 'react-native'
import { Link, useNavigation, useRoute } from '@react-navigation/native'
import { Pressable } from '@/components/ui/pressable'
import { gql, useQuery } from '@apollo/client';

// GraphQL Query to fetch category details by ID
const GET_CATEGORY_BY_ID = gql`
  query GetCategoryById($idCategory: String) {
  getCategoryById(idCategory: $idCategory) {
    _id
    name
    duration
    exercises {
      _id
      name
      images
    }
  }
}
`;

export default function Training() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Getting the category ID from route params
  const { categoryId } = route.params;
  // console.log("🚀 ~ Training ~ categoryId:", categoryId)

  // Using Apollo's useQuery hook to fetch data
  const { data, loading, error } = useQuery(GET_CATEGORY_BY_ID, {
    variables: { 
      idCategory: categoryId
     }, // Pass the ID as a variable to the query
  });

  // Handle loading and error states
  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  // Extract the data from the response
  const category = data?.getCategoryById;
  console.log("🚀 ~ Training ~ data?.getCategoryById;:", data?.getCategoryById)

  // Dummy exercises to display
  const exercises = [
    { id: 1, name: "Push-ups", minute: 10 },
    { id: 2, name: "Squats", minute: 5 },
    { id: 3, name: "Lunges", minute: 10 },
    { id: 4, name: "Plank", minute: 10 },
    { id: 5, name: "Shoulder Press", minute: 5 },
  ];

  return (
    <ScrollView className="flex-1">
      <Card className="p-5 rounded-lg max-w-[400px] m-3 mb-20">
        {/* Image (you can set a dynamic image source if required) */}
        <Image
          source={{
            uri: `https://image.pollinations.ai/prompt/a%20workout%20category%20called%20${category?.name}%20in%20black%20and%20white%20500x500?nologo=true`, // Use dynamic URL if needed
          }}
          className="mb-4 h-[180px] w-full rounded-md"
          alt="Workout"
        />

        {/* Display Category Name */}
        <Heading size="xl" className="mb-4 capitalize">
          {category?.name || "Full Body Workout"}  {/* Display category name or default name */}
        </Heading>

        {/* Display Category Details */}
        <HStack className="mb-6 justify-between">
          <HStack>
            <Icon as={ClockIcon} size="md" className="text-primary-600 mr-1" />
            <Text className="text-sm font-bold text-typography-700">
              {Math.floor(category?.duration / 60) * category?.exercises.length} minutes {/* Convert duration from seconds to minutes */}
            </Text>
          </HStack>
          <HStack>
            <Icon as={CheckCircleIcon} size="md" className="text-primary-600 mr-1" />
            <Text className="text-sm font-bold text-typography-700">
              {category?.exercises?.length} exercises {/* Display number of exercises */}
            </Text>
          </HStack>
        </HStack>

        <Heading size="sm" className="mb-3">
          Exercises
        </Heading>

        {/* Display exercises (replace with data if needed) */}
        <VStack className="mb-6 space-y-2">
          {category?.exercises?.map((exercise) => (
            <Card key={exercise._id} className="p-3">
              <HStack className="gap-5 items-center">
                <Image
                  source={{
                    uri: `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${exercise.images[0]}`,
                  }}
                  className="rounded-md fit-cover h-20 w-20"
                  alt="Workout"
                />
                <VStack>
                  <Text className="font-bold text-xl capitalize">{exercise.name}</Text>
                  <Text className="text-sm text-typography-600">
                    {Math.floor(category?.duration / 60)} minutes
                  </Text>
                </VStack>
                <Icon as={AlertCircleIcon} size="xl" className="text-primary-600 ml-auto" />
              </HStack>
            </Card>
          ))}
        </VStack>

        {/* Start Workout Button */}
        <Pressable
          className="w-full bg-black rounded-md flex"
          onPress={() => {
            // Handle the press event here
            navigation.navigate('TrainingSession');
          }}
        >
          <Text className="text-white font-medium text-center py-3">
            Start Workout
          </Text>
        </Pressable>
      </Card>
    </ScrollView>
  );
}
