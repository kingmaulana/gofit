import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { Image } from '@/components/ui/image'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import { HStack } from '@gluestack-ui/themed'
import { gql, useQuery } from '@apollo/client'
import { useRoute } from '@react-navigation/native'

const GET_DETAIL_EXERCISE = gql(`
    query WorkoutById($workoutByIdId: ID!) {
    workoutById(id: $workoutByIdId) {
        _id
        name
        force
        level
        mechanic
        equipment
        primaryMuscles
        instructions
        category
        images
    }
}`)

// const exerciseData = {
//     "_id": { "$oid": "67c17224970d2c811d846c0d" },
//     "name": "Band Good Morning",
//     "force": "pull",
//     "level": "beginner",
//     "mechanic": "compound",
//     "equipment": "bands",
//     "primaryMuscles": ["hamstrings"],
//     "secondaryMuscles": ["glutes", "lower back"],
//     "instructions": [
//         "Using a 41 inch band, stand on one end, spreading your feet a small amount. Bend at the hips to loop the end of the band behind your neck. This will be your starting position.",
//         "Keeping your legs straight, extend through the hips to come to a near vertical position.",
//         "Ensure that you do not round your back as you go down back to the starting position."
//     ],
//     "category": "powerlifting",
//     "images": [
//         "Band_Good_Morning/0.jpg",
//         "Band_Good_Morning/1.jpg"
//     ],
//     "id": "Band_Good_Morning"
// }

export default function DetailsExercise() {

     const route = useRoute();

    const { workoutByIdId } = route.params;
    // console.log("🚀 ~ DetailsExercise ~ workoutByIdId:", workoutByIdId)

    const { data, loading, error } = useQuery(GET_DETAIL_EXERCISE, {
        variables: { workoutByIdId: workoutByIdId }
    });
    // console.log("🚀 ~ DetailsExercise ~ data:", data)
    const exerciseData = data?.workoutById

    if (loading) {
        return <View className="h-full justify-center items-center">
          <ActivityIndicator size="large" color="black" />
        </View>;
      }
    
      if (error) {
        return <Text>Error: {error.message}</Text>;
      }

    return (
        <ScrollView className="p-6 bg-gray-100 rounded-lg shadow-lg max-w-3xl mx-auto">
        {/* Title Section */}
        <View className="w-full">
            <Text className="text-2xl font-extrabold text-center text-slate-700">{exerciseData.name}</Text>

            <Box className="mt-4 flex flex-col gap-3">
                {/* Exercise Metadata */}
                <Text className="text-lg font-medium text-gray-700">Category: <Text className="font-semibold capitalize"> - {exerciseData.category}</Text></Text>
                <Text className="text-lg font-medium text-gray-700">Level: <Text className="font-semibold capitalize"> - {exerciseData.level}</Text></Text>
                <Text className="text-lg font-medium text-gray-700">Mechanic: <Text className="font-semibold capitalize"> - {exerciseData.mechanic}</Text></Text>
                <Text className="text-lg font-medium text-gray-700">Equipment: <Text className="font-semibold capitalize"> - {exerciseData.equipment}</Text></Text>
                <Text className="text-lg font-medium text-gray-700">Force: <Text className="font-semibold capitalize"> - {exerciseData.force}</Text></Text>
            </Box>

            {/* Muscles Section */}
            <Box className="mt-6">
                <Text className="text-xl font-semibold text-gray-800 capitalize">Primary Muscles:</Text>
                <Text className="text-lg font-normal text-gray-700 capitalize">{exerciseData.primaryMuscles.join(', ')}</Text>
            </Box>

            {/* Instructions Section */}
            <Box className="mt-6 mr-4">
                <Text className="text-xl font-semibold text-gray-800">Instructions:</Text>
                {exerciseData.instructions.map((instruction, index) => (
                    <Text key={index} className="mt-2 text-md text-gray-700">- {instruction}</Text>
                ))}
            </Box>

            {/* Images Section */}
            <Box className="mt-2 flex-row justify-center gap-2 mb-24">
                <Image
                    source={{ uri: `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${exerciseData.images[0]}` }}
                    alt={`Exercise Image 1`}
                    size="2xl"
                    className="rounded-lg shadow-md border-2 border-gray-300"
                />
                <Image
                    source={{ uri: `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${exerciseData.images[1]}` }}
                    alt={`Exercise Image 2`}
                    size="2xl"
                    className="rounded-lg shadow-md border-2 border-gray-300"
                />
            </Box>
            </View>
        </ScrollView>
    )
}
