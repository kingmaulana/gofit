import React, {useState, useCallback} from "react";
import {
  ScrollView,
  RefreshControl,
  SafeAreaView,
  Dimensions,
  Pressable,
  Alert,
  View,
  ActivityIndicator
} from "react-native";
import {Card} from "@/components/ui/card";
import {Heading} from "@/components/ui/heading";
import {HStack} from "@/components/ui/hstack";
import {VStack} from "@/components/ui/vstack";
import {Image} from "@/components/ui/image";
import {Text} from "@/components/ui/text";
import {Box} from "@/components/ui/box";
import {Icon, ClockIcon, PauseIcon, FlameIcon} from "@/components/ui/icon";
import {Button, ButtonText} from "@/components/ui/button";
import {useNavigation, useRoute} from "@react-navigation/native";
import {gql, useQuery} from "@apollo/client";

const WORKOUT_QUERY = gql(`
    query GetExerciseById($id: String) {
        getUserExerciseById(id: $id) {
            _id
            name
            restDuration
            userId
            duration
            exercises {
                name,
                images
            }
            exerciseId
        }
    }
`)

export default function WorkDetailByUser() {
  const [refreshing, setRefreshing] = useState(false);
  const {width} = Dimensions.get('window');
  const navigation = useNavigation();

  const {exerciseId} = useRoute().params;
  const {data: workoutData, loading, error} = useQuery(WORKOUT_QUERY, {
    variables: {id: exerciseId}
  });
  const workout = workoutData?.getUserExerciseById

  const onEdit = () => {
    // Navigate to EditExerciseCategory screen with workout parameters
    console.log("Edit button pressed - navigating to EditExerciseCategory");
    navigation.navigate("EditExerciseCategory", {
      categoryId: "tempId",
      categoryName: workout.name,
      exercises: workout.exercises
    });
  };

  const handleStartWorkout = () => {
    Alert.alert(`Start workout`, "Get ready to start the workout!", [
      {
        text: 'Cancel',
        onPress: () => {
        },
        style: 'cancel',
      },
      {
        text: 'Start',
        onPress: () => {
          navigation.navigate('CustomTrainingSession', {
            userExerciseId: workout._id,
            exercises: workout.exercises,
            duration: workout.duration,
            restDuration: workout.restDuration
          });
        },
      },
    ], {
      cancelable: true,
    });
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    // You would typically fetch updated data here
  }, [])

  // Handle loading and error states
  if (loading) {
    return <View className="h-full justify-center items-center">
      <ActivityIndicator size="large" color="black" />
    </View>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  // Generate image URL based on workout name using Pollinations AI
  const workoutImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(workout.name + " fitness workout gym")}?width=1000&height=1000&nologo=true&model=flux&enhance=true`;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{
          paddingVertical: 16,
          paddingHorizontal: 12,
          paddingBottom: 40, // Add bottom padding to prevent content from being cut off
        }}
        showsVerticalScrollIndicator={false}
        bounces={true}
        overScrollMode="always"
        scrollEventThrottle={16} // For smoother scrolling
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B82F6" // Blue-500 to match fitness theme
            colors={["#3B82F6", "#10B981", "#F97316"]} // Blue, Green, Orange to match the app theme
            title="Pull to refresh..."
            titleColor="#6B7280" // text-gray-500
          />
        }
      >
        <Card className="p-5 rounded-xl border border-gray-100 bg-white shadow-sm">
          <VStack space="md">
            <VStack space="sm">
              <HStack className="items-center justify-between mb-2">
                <Heading size="xl" className="text-gray-800 font-bold">
                  {workout.name}
                </Heading>
                <Button
                  onPress={onEdit}
                  variant="solid"
                  action="primary"
                  size="sm"
                >
                  <ButtonText>Edit</ButtonText>
                </Button>
              </HStack>
            </VStack>

            <Image
              source={{uri: workoutImage}}
              className="h-[220px] w-full rounded-xl mb-4"
              alt={workout.name}
            />

            <Card className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-100">
              <VStack space="sm">
                <HStack className="justify-between items-center">
                  <HStack space="xs" className="items-center">
                    <Icon as={ClockIcon} size="md" className="text-blue-500"/>
                    <Text className="text-gray-700 text-lg">Duration:</Text>
                  </HStack>
                  <Text className="text-blue-600 text-lg font-bold">{workout.duration} secs</Text>
                </HStack>

                <HStack className="justify-between items-center">
                  <HStack space="xs" className="items-center">
                    <Icon as={PauseIcon} size="md" className="text-blue-500"/>
                    <Text className="text-gray-700 text-lg">Rest:</Text>
                  </HStack>
                  <Text className="text-green-600 text-lg font-bold">{workout.restDuration} secs</Text>
                </HStack>
              </VStack>
            </Card>

            <Box className="mt-2">
              <HStack className="items-center mb-2">
                <Icon as={FlameIcon} size="md" className="text-orange-500 mr-2"/>
                <Heading size="md" className="text-gray-800">Exercises</Heading>
              </HStack>

              <VStack space="sm" className="pl-2">
                {workout.exercises.map((exercise, index) => (
                  <Card key={index} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 mb-2">
                    <Text className="text-gray-700 text-lg">• {exercise.name}</Text>
                  </Card>
                ))}
              </VStack>
            </Box>
          </VStack>
          <Pressable
            className="w-full bg-black rounded-md flex"
            onPress={handleStartWorkout}
          >
            <Text className="text-white font-medium text-center py-3">
              Start Workout
            </Text>
          </Pressable>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
