import {Image} from "expo-image"
import {Box} from '@/components/ui/box'
import {Button, ButtonText} from '@/components/ui/button'
import {HStack} from '@/components/ui/hstack'
import {Icon, PlayIcon, ChevronsRightIcon} from '@/components/ui/icon'
// import { Image } from '@/components/ui/image'
import {Text} from '@/components/ui/text'
import {VStack} from '@/components/ui/vstack'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import {ActivityIndicator, Alert, Animated, BackHandler, TouchableHighlight, TouchableOpacity, View} from 'react-native'
import {gql, useMutation, useQuery} from "@apollo/client";
import {useNavigation, useRoute} from "@react-navigation/native";

const ADD_HISTORY_EXERCISE = gql(`
    mutation CreateHistoryCategory($categoryId: String, $userGoalId: String) {
        createHistoryCategory(categoryId: $categoryId, userGoalId: $userGoalId) {
            userId
            categoryId
        }
    }
`)

const GET_ALL_EXERCISE_DATA = gql(`
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
`)

export default function TrainingSession() {
  const {categoryId, usingGoalId} = useRoute().params;
  const {data: categoryData, loading, error} = useQuery(GET_ALL_EXERCISE_DATA, {
    variables: {
      idCategory: categoryId
    }
  });
  const data = categoryData?.getCategoryById;
  const exercises = data.exercises;
  const exercisesCount = exercises.length;
  const restTime = Math.round(data.duration / 3);
  const navigation = useNavigation();

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [time, setTime] = useState(data.duration);
  const [rest, setRest] = useState(false);
  const [isRunning, setIsRunning] = useState(true)
  const timerRef = useRef(null);

  const [createHistoryExercise, {loading: createLoading}] = useMutation(ADD_HISTORY_EXERCISE);

  const onFinish = useCallback(async () => {
    if (usingGoalId) {
      await createHistoryExercise({
        variables: {
          userGoalId: categoryId
        }
      })
    } else {
      await createHistoryExercise({
        variables: {
          categoryId: categoryId
        }
      })
    }
    navigation.reset({
      index: 1,
      routes: [{name: "Landing"}, {name: "HistoryExercise"}],
    });
  }, [navigation])

  useEffect(() => {
    if (isRunning && time > 0) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime - 1)
      }, 1000)
    } else if (time === 0) {
      if (!rest) {
        if (currentExerciseIndex === exercisesCount - 1) {
          onFinish();
        } else {
          setCurrentExerciseIndex(currentExerciseIndex + 1);
          setRest(true);
          setTime(restTime);
        }
      } else {
        setRest(false);
        setTime(data.duration);
      }
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current) // Cleanup
  }, [isRunning, time, rest])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  // handling skip button
  const handleSkipButton = () => {
    Alert.alert(`Confirm skip ${exercises[currentExerciseIndex].name}?`, "You cannot back to this exercise", [
        {
          text: 'Cancel',
          onPress: () => {
          },
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            setTime(0);
            setIsRunning(true);
          },
        }
      ]
    )
  }

  const handleCompleteButton = () => {
    Alert.alert("Confirm complete exercise?", "Your current exercise will be saved into your history", [
      {
        text: 'Cancel',
        onPress: () => {
        },
        style: 'cancel',
      },
      {
        text: 'Confirm',
        onPress: () => onFinish(),
      },
    ], {
      cancelable: true,
    })
  }


  useEffect(() => {
    const backAction = () => {
      Alert.alert("Confirm exit?", "You are in the middle of workout", [
        {
          text: 'Cancel',
          onPress: () => {
          },
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => navigation.goBack(),
        },
      ], {
        cancelable: true,
      });
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loopAnimation = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500, // 500ms fade-out
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500, // 500ms fade-in
          useNativeDriver: true,
        }),
      ]).start(() => loopAnimation()); // Loop animation
    };

    if (!rest) {
      loopAnimation();
    }
  }, [rest]);

  // Handle loading and error states
  if (loading || createLoading) {
    return <View className="h-full justify-center items-center">
      <ActivityIndicator size="large" color="black"/>
    </View>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <Box className='flex flex-col items-center justify-between h-[80%] w-full'>
      <VStack className='w-full items-center pt-10 flex-1 justify-center'>
        {!rest && <>
          <Animated.Image
            source={{
              uri: `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${exercises[currentExerciseIndex].images[0]}`,
            }}
            contentFit="cover"
            style={[{
              width: 320,
              height: 208,
              position: "absolute"
            }, {opacity: fadeAnim}]}
          />
          <Animated.Image
            source={{
              uri: `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${exercises[currentExerciseIndex].images[1]}`,
            }}
            contentFit="cover"
            style={[{
              width: 320,
              height: 208,
              position: "absolute"
            }, {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0], // Inverse fade effect
              })
            }]}
          />
        </>}
      </VStack>

      <VStack className='items-center w-full'>
        <Text
          className='font-black text-black text-3xl mb-5'>{rest ? "Rest" : exercises[currentExerciseIndex].name}</Text>
        <Text className='font-black text-7xl'>{formatTime(time)}</Text>
        <HStack className="flex w-[100%] justify-evenly items-center mt-4">
          <Button variant="outline" className="rounded-full" onPress={handleCompleteButton}>
            <ButtonText className="font-bold">Completed</ButtonText>
          </Button>

          <Button
            variant="outline"
            className="rounded-full"
            onPress={() => setIsRunning(!isRunning)} // Toggle start/pause
          >
            <ButtonText className="font-bold">
              {isRunning ? "Pause" : "Resume"}
            </ButtonText>
          </Button>

          <Box className="flex items-center justify-center">
            <TouchableOpacity onPress={handleSkipButton} className="w-20 h-20" disabled={rest}>
              <Icon as={ChevronsRightIcon} className="w-20 h-20 text-slate-600"/>
            </TouchableOpacity>
          </Box>
        </HStack>
      </VStack>
    </Box>
  )
}
