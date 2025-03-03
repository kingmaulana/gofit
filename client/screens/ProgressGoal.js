import { Text } from '@/components/ui/text'
import { View, StyleSheet, FlatList, ScrollView, Dimensions } from 'react-native'
import { Box, VStack, HStack, Center, Heading, Divider, Icon } from '@gluestack-ui/themed'
import { Svg, Circle, Text as SvgText } from 'react-native-svg'
import { ArrowUpIcon, ArrowDownIcon } from '@/components/ui/icon'

export default function ProgressGoal() {
  // Get screen dimensions
  const screenHeight = Dimensions.get('window').height;
  // Progress data
  const goalWeight = 90;
  const currentWeight = 80.3;
  
  // Mock weight history data
  const weightHistory = [
    { date: '2023-09-25', weight: 83.7, change: -0.4 },
    { date: '2023-10-10', weight: 82.9, change: -0.8 },
    { date: '2023-10-25', weight: 82.1, change: -0.8 },
    { date: '2023-11-08', weight: 81.5, change: -0.6 },
    { date: '2023-11-22', weight: 81.0, change: -0.5 },
    { date: '2023-12-06', weight: 80.3, change: -0.7 },
  ];
  
  // Debug: Log weight history items
  console.log('Weight History Items:', weightHistory);
  console.log('Weight History Count:', weightHistory.length);

  // Corrected progress calculation
  const progress = (currentWeight / goalWeight) * 100;

  // SVG properties
  const size = 200;
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressStrokeDashoffset = circumference - (progress / 100) * circumference;
  const center = size / 2;

  return (
    <ScrollView 
      className="flex-1 bg-gray-50" 
      contentContainerStyle={{ minHeight: screenHeight }}
    >
      <VStack space={6} className="p-6 items-center">
        <Heading size="xl" className="text-center font-bold text-gray-800">
          Goal Progress
        </Heading>
        
        {/* Progress Circle */}
        <Center className="my-4">
          <Svg width={size} height={size}>
            {/* Background Circle */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#E5E7EB"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            
            {/* Progress Circle */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#4F46E5"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={progressStrokeDashoffset}
              fill="transparent"
              strokeLinecap="round"
            />
            
            {/* Percentage Text */}
            <SvgText
              x={center}
              y={center}
              fontSize="28"
              fontWeight="bold"
              fill="#4F46E5"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {Math.round(progress)}%
            </SvgText>
          </Svg>
        </Center>
        
        {/* Weight Information */}
        <VStack space={4} className="w-full items-center">
          <HStack className="w-full justify-between px-4">
            <VStack className="items-center">
              <Text className="text-lg text-gray-500">Current</Text>
              <Text className="text-2xl font-bold text-gray-800">{currentWeight} kg</Text>
            </VStack>
            
            <VStack className="items-center">
              <Text className="text-lg text-gray-500">Goal</Text>
              <Text className="text-2xl font-bold text-gray-800">{goalWeight} kg</Text>
            </VStack>
          </HStack>
          
          <Box className="mt-4 w-full rounded-lg bg-gray-100 p-4">
            <Text className="text-center text-gray-700">
              You've achieved {Math.round(progress)}% of your weight goal! Keep up the good work!
            </Text>
          </Box>
        </VStack>
        
        {/* Weight History Section */}
        <Box className="w-full">
          <VStack space={4} className="px-3">
            <Heading size="lg" className="text-gray-800">Weight History</Heading>
            <Text className="text-gray-600 font-medium">Total Items: {weightHistory.length}</Text>
            <Divider />
            
            {/* Replace FlatList with a non-scrollable version to avoid VirtualizedLists nesting warning */}
            
            {/* Debug: Show raw data as a fallback */}
            <Box className="mt-4 p-3 border border-yellow-400 bg-yellow-50 rounded-md">
              <Text className="font-bold">Debug Data:</Text>
              {weightHistory.map((item, idx) => (
                <Text key={item.date} className="text-sm">
                  {idx + 1}. Date: {item.date}, Weight: {item.weight}kg, Change: {item.change}kg
                </Text>
              ))}
            </Box>
          </VStack>
        </Box>
      </VStack>
    </ScrollView>
  );
}
