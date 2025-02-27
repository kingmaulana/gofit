
import React from 'react'
import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { HStack } from "@/components/ui/hstack"
import { VStack } from "@/components/ui/vstack"
import { Image } from "@/components/ui/image"
import { Text } from "@/components/ui/text"
import { Icon, ClockIcon, CheckCircleIcon, AlertCircleIcon } from "@/components/ui/icon"
import { Button } from "@/components/ui/button"
import { ScrollView } from 'react-native'

export default function Training() {
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
        <Image
          source={{
            uri: "https://image.pollinations.ai/prompt/fullbody%20workout%20black%20and%20white%20500x500",
          }}
          className="mb-4 h-[180px] w-full rounded-md"
          alt="Workout"
        />

        <Heading size="xl" className="mb-4">
          Full Body Workout
        </Heading>

        <HStack className="mb-6 justify-between">
          <HStack>
            <Icon as={ClockIcon} size="md" className="text-primary-600 mr-1" />
            <Text className="text-sm font-bold text-typography-700">
              60 minutes
            </Text>
          </HStack>
          <HStack>
            <Icon as={CheckCircleIcon} size="md" className="text-primary-600 mr-1" />
            <Text className="text-sm font-bold text-typography-700">
              10 exercises
            </Text>
          </HStack>
        </HStack>

        <Heading size="sm" className="mb-3">
          Exercises
        </Heading>

        <VStack className="mb-6 space-y-2">
          {exercises.map((exercise) => (
            <Card key={exercise.id} className="p-3">
              <HStack className="gap-5 items-center">
                <Image
                  source={{
                    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI2Gvl3_X7DNc2gfZUfwdGhO_WmAd0fnwyxg&s',
                  }}
                  className="rounded-md fit-cover h-20 w-20"
                  alt="Workout"
                />
                <VStack>
                  <Text className="font-bold text-xl">{exercise.name}</Text>
                  <Text className="text-sm text-typography-600">
                    {exercise.minute} minutes
                  </Text>

                </VStack>
                <Icon as={AlertCircleIcon} size="xl" className="text-primary-600 ml-auto" />
              </HStack>
            </Card>
          ))}
        </VStack>

        <Button className="w-full bg-black rounded-md">
          <Text className="text-white font-medium">
            Start Workout
          </Text>
        </Button>
      </Card>
    </ScrollView>
  )
}
