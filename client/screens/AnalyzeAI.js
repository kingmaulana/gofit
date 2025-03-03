import React from 'react';
import { ScrollView } from 'react-native';
import { Box } from '@gluestack-ui/themed';
import { VStack } from '@gluestack-ui/themed';
import { Heading } from '@gluestack-ui/themed';
import { Text } from '@gluestack-ui/themed';
import { Divider } from '@gluestack-ui/themed';
import { Center } from '@gluestack-ui/themed';
import { ButtonText, Button } from '@/components/ui/button';

export default function AnalyzeAI() {
    // Mock data for exercise recommendations
    const analyzeResult = {
        description:
            "To achieve your weight gain goal of 2.465 kg, starting from 51 kg, and break through your current plateau, focus on a combination of strength training and a slight caloric surplus. The exercises below target various muscle groups to promote overall muscle growth, which contributes to weight gain.",
        exercises: [
            "Barbell Squats",
            "Romanian Deadlifts",
            "Bench Press",
            "Overhead Press",
            "Pull-ups",
            "Bent-Over Rows",
            "Lunges",
        ],
    };

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            <VStack space={8} className="p-6 items-center">

                {/* Header Section */}
                <Box className="w-full">
                    <Center>
                        <Heading size="xl" className="text-center text-black text-xl font-semibold">
                            AI Analysis for Weight Gain
                        </Heading>
                    </Center>
                    <Center>
                        <Text className="text-lg text-white font-medium">
                            Goal: Weight Gain (2.465 kg)
                        </Text>
                    </Center>
                </Box>

                {/* Description Section */}
                <Box className="w-full mb-8">
                    <Text className="text-lg text-gray-800 leading-relaxed">
                        {analyzeResult.description}
                    </Text>
                </Box>

                {/* Exercises List */}
                <Box className="w-full mb-8">
                    <Heading size="lg" className="text-gray-900 mb-3">Recommended Exercises</Heading>
                    <Text className="text-gray-600 mb-4">
                        These exercises target different muscle groups to help you achieve your weight gain goal:
                    </Text>
                    <Divider my={4} />

                    <VStack space={3}>
                        {analyzeResult.exercises.map((exercise, index) => (
                            <Box key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <Text className="text-lg text-gray-800">{exercise}</Text>
                            </Box>
                        ))}
                    </VStack>
                </Box>

                {/* Update Exercises Button */}
                <Box className="w-full mt-6">
                    <Button size="md" variant="solid" action="primary" className="shadow-lg">
                        <ButtonText>Add Custom Exercise</ButtonText>
                    </Button>
                </Box>

            </VStack>
        </ScrollView>
    );
}
