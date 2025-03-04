import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Dimensions, StatusBar } from "react-native";
import { AntDesign, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { Svg, Circle, Text as SvgText } from 'react-native-svg';
import { gql, useQuery, useMutation } from "@apollo/client";
import { HStack } from "@/components/ui/hstack";

// GraphQL queries and mutation
const GET_GOAL_USER = gql(`
    query UserGoals($userId: String) {
        userGoals(userId: $userId) {
            _id
            goalName
            userId
            startWeight
            goalWeight
            startDate
            endGoal
        }
    }`);

const GET_LOGS_WEIGHT_USER = gql(`
    query GetWeightProgress($userId: String) {
        getWeightProgress(userId: $userId) {
            _id
            userId
            weight
            date
        }
    }`);

const UPDATE_WEIGHT_PROGRESS = gql(`
    mutation UpdateWeightProgress($userId: String, $weight: Float) {
        updateWeightProgress(userId: $userId, weight: $weight) {
            userId
            weight
            date
        }
    }`);

const GoalProgressCircle = ({ currentWeight, goalWeight }) => {
    const size = 200;
    const strokeWidth = 15;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    // Ensure currentWeight and goalWeight are valid numbers
    const validCurrentWeight = isNaN(currentWeight) ? 0 : currentWeight;
    const validGoalWeight = isNaN(goalWeight) ? 1 : goalWeight; // Avoid dividing by zero

    const progress = (validCurrentWeight / validGoalWeight) * 100;
    const progressStrokeDashoffset = circumference - (progress / 100) * circumference;
    const center = size / 2;

    return (
        <View className="items-center my-3">
            <Svg width={size} height={size}>
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="#E5E7EB"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="#000000"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={progressStrokeDashoffset}
                    fill="transparent"
                    strokeLinecap="round"
                />
                <SvgText
                    x={center}
                    y={center}
                    fontSize="28"
                    fontWeight="bold"
                    fill="#000000"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                >
                    {Math.round(progress)}%
                </SvgText>
            </Svg>
            <Text className="text-lg font-semibold text-black mt-2">
                {progress > 100 ? 'Goal Exceeded!' : 'Goal Progress'}
            </Text>

            <HStack className="mt-2 gap-2">
                <Text className="text-lg font-semibold text-black">Current Weight : {currentWeight} kg</Text>
                <Text className="text-lg font-semibold text-black">Goal Weight : {goalWeight} kg</Text>
            </HStack>
        </View>
    );
};

export default function ProgressWeight() {
    // Fetch data
    const { data: goalData, loading: goalLoading, error: goalError } = useQuery(GET_GOAL_USER, {
        variables: { userId: "67c6a7d8be60228e126ec03e" },
    });
    const { data: progressData, loading: progressLoading, error: progressError } = useQuery(GET_LOGS_WEIGHT_USER, {
        variables: { userId: "67c6a7d8be60228e126ec03e" },
    });

    // Define mutation hook
    const [updateWeightProgress, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_WEIGHT_PROGRESS, {
        refetchQueries: [GET_LOGS_WEIGHT_USER], // Refetch the weight logs after mutation
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [weight, setWeight] = useState("");
    const [goalWeight, setGoalWeight] = useState(goalData?.userGoals?.goalWeight);
    const [progress, setProgress] = useState([]); // Initialize with empty array

    useEffect(() => {
        if (progressData) {
            setProgress(progressData.getWeightProgress); // Update progress when data is fetched
        }
    }, [progressData]); // Trigger when progressData is available

    const handleSubmit = () => {
        const newWeight = parseFloat(weight);
        const userId = "67c6a7d8be60228e126ec03e"; // Replace with the actual user ID if dynamic

        // Call mutation to update weight
        updateWeightProgress({ variables: { userId, weight: newWeight } })
            .then(response => {
                console.log("Weight updated successfully:", response);
                setProgress([...progress, { weight: newWeight, date: new Date().toISOString() }]); // Add new entry to progress state
            })
            .catch(error => {
                console.error("Error updating weight:", error);
            });

        setModalVisible(false);
        setWeight("");
    };

    const getChartData = () => {
        const sortedData = [...progress].sort((a, b) => new Date(a.date) - new Date(b.date));
        return {
            labels: sortedData.map(item => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
            datasets: [
                {
                    data: sortedData.map(item => item.weight),
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    strokeWidth: 2
                }
            ]
        };
    };

    const calculateWeightDifference = () => {
        if (progress.length < 2) return null;

        const sortedData = [...progress].sort((a, b) => new Date(a.date) - new Date(b.date));
        const firstWeight = sortedData[0].weight;
        const lastWeight = sortedData[sortedData.length - 1].weight;
        const difference = lastWeight - firstWeight;

        return {
            difference: difference.toFixed(1),
            isLoss: difference < 0
        };
    };

    const weightDifference = calculateWeightDifference();
    const screenWidth = Dimensions.get('window').width;

    return (
        <ScrollView className="flex-1 bg-backgroundLight p-5 pb-20 mb-10">
            <StatusBar barStyle="light-content" />

            {/* Button to trigger the modal */}
            
            {/* Modal for updating weight */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View className="absolute inset-0 bg-black/50 justify-center items-center z-[1000]">
                    <View className="bg-white rounded-2xl p-5 w-[85%] shadow-lg">
                        <View className="flex-row justify-between items-center border-b border-gray-200 pb-4 mb-5">
                            <Text className="text-xl font-bold text-gray-800">Add Weight Entry</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <AntDesign name="close" size={24} color="#4A5568" />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            placeholder="Enter weight in kg"
                            keyboardType="numeric"
                            value={weight}
                            onChangeText={setWeight}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-base mb-4"
                            placeholderTextColor="#A0AEC0"
                        />

                        <View className="flex-row justify-between mt-3">
                            <TouchableOpacity
                                className="py-3 px-4 rounded-lg w-[48%] items-center bg-gray-100"
                                onPress={() => setModalVisible(false)}
                            >
                                <Text className="text-gray-700 font-semibold">Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="py-3 px-4 rounded-lg w-[48%] items-center bg-black"
                                onPress={handleSubmit}
                            >
                                <Text className="text-white font-semibold">Save Entry</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Main Content */}
            <View className="flex-1 flex-col justify-between">
                {/* Goal Progress Circle */}
                {progress.length > 0 && (
                    <GoalProgressCircle
                        currentWeight={progress[progress.length - 1].weight} // Use latest weight
                        goalWeight={goalData?.userGoals?.goalWeight}
                    />
                )}

            <TouchableOpacity
                className="bg-black p-3 rounded-full mb-5"
                onPress={() => setModalVisible(true)}
            >
                <Text className="text-white font-semibold text-center">Add Weight</Text>
            </TouchableOpacity>

                {/* Line Chart */}
                {progress.length > 1 && (
                    <LineChart
                        data={getChartData()}
                        width={screenWidth - 40}
                        height={180}
                        chartConfig={{
                            backgroundColor: '#ffffff',
                            backgroundGradientFrom: '#ffffff',
                            backgroundGradientTo: '#ffffff',
                            decimalPlaces: 1,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(60, 60, 60, ${opacity})`,
                            style: { borderRadius: 16 },
                        }}
                        bezier
                    />
                )}


                {/* Weight Difference */}
                {weightDifference && (
                    <View className="bg-blue-50 rounded-xl p-4 mb-3 mt-3 border-l-4 border-black">
                        <View className="flex-row items-center">
                            <MaterialCommunityIcons
                                name={weightDifference.isLoss ? "trending-down" : "trending-up"}
                                size={24}
                                color={weightDifference.isLoss ? "#38A169" : "#E53E3E"}
                            />
                            <Text className="text-base text-gray-800 ml-2">
                                {weightDifference.isLoss ? 'Lost ' : 'Gained '}
                                <Text className="font-bold text-black">
                                    {Math.abs(weightDifference.difference)} kg
                                </Text>
                                since you started
                            </Text>
                        </View>
                    </View>
                )}

                {/* History Section */}
                <Text className="text-lg font-bold mb-2">History Weight</Text>
                <ScrollView
                    className="bg-white rounded-xl p-3 shadow-sm"
                    showsVerticalScrollIndicator={true}
                >
                    {[...progress]
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map(item => (
                            <View key={item._id} className="flex-row items-center justify-between">
                                <Text>{item.weight} kg</Text>
                            </View>
                        ))}
                </ScrollView>
            </View>
        </ScrollView>
    );
}
