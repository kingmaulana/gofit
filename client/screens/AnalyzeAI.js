import React from 'react';
import { ScrollView } from 'react-native';
import { Box } from '@gluestack-ui/themed';
import { VStack } from '@gluestack-ui/themed';
import { Heading } from '@gluestack-ui/themed';
import { Text } from '@gluestack-ui/themed';
import { Divider } from '@gluestack-ui/themed';
import { Center } from '@gluestack-ui/themed';
import { ButtonText, Button } from '@/components/ui/button';
import { useNavigation } from '@react-navigation/native';

export default function AnalyzeAI() {
    // Mock data for exercise recommendations
    const analyzeResult = {
        description:
            "To gain weight, you need a caloric surplus and a strength training program focusing on compound exercises that work multiple muscle groups simultaneously.  From your provided categories, we will prioritize those most effective for overall muscle growth and weight gain. This will help you build muscle mass, leading to a higher overall weight.",
        exercises:  ["Compound Strength", "Barbell Power", "Leg Strength"],
    };

    const navigation = useNavigation();

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
                </Box>

                {/* Description Section */}
                <Box className="w-full mb-8">
                    <Text className="text-lg text-gray-800 leading-relaxed">
                        {analyzeResult.description}
                    </Text>
                </Box>

                {/* Exercises List */}
                <Box className="w-full mb-8">
                    <Heading size="lg" className="text-gray-900 mb-3">Recommended Collection Exercises</Heading>
                    <Text className="text-gray-600 mb-4">
                        These exercises target different muscle groups to help you achieve your weight gain goal:
                    </Text>
                    <Divider my={4} />

                    <VStack space={3}>
                        {analyzeResult.exercises.map((exercise, index) => (
                            <Box key={index} className="bg-white flex-row justify-between p-4 rounded-lg border border-gray-200 shadow-sm">
                                <Text className="text-lg text-gray-800">{exercise}</Text>
                                <Button
                                 onPress={() => navigation.navigate("TrainingByAI")}>
                                    <ButtonText>Start</ButtonText>
                                </Button>
                            </Box>
                        ))}
                    </VStack>
                </Box>

            </VStack>
        </ScrollView>
    );
}
