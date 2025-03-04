import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { Image } from '@/components/ui/image'

const exerciseData = {
    "_id": { "$oid": "67c17224970d2c811d846c0d" },
    "name": "Band Good Morning",
    "force": "pull",
    "level": "beginner",
    "mechanic": "compound",
    "equipment": "bands",
    "primaryMuscles": ["hamstrings"],
    "secondaryMuscles": ["glutes", "lower back"],
    "instructions": [
        "Using a 41 inch band, stand on one end, spreading your feet a small amount. Bend at the hips to loop the end of the band behind your neck. This will be your starting position.",
        "Keeping your legs straight, extend through the hips to come to a near vertical position.",
        "Ensure that you do not round your back as you go down back to the starting position."
    ],
    "category": "powerlifting",
    "images": [
        "Band_Good_Morning/0.jpg",
        "Band_Good_Morning/1.jpg"
    ],
    "id": "Band_Good_Morning"
}

export default function DetailsExercise() {
    return (
        <Box className="p-4">
            <Text className="text-lg font-bold">{exerciseData.name}</Text>
            <Text className="mt-2">Category: {exerciseData.category}</Text>
            <Text className="mt-1">Level: {exerciseData.level}</Text>
            <Text className="mt-1">Mechanic: {exerciseData.mechanic}</Text>
            <Text className="mt-1">Equipment: {exerciseData.equipment}</Text>
            <Text className="mt-1">Force: {exerciseData.force}</Text>

            <Text className="font-bold mt-4">Primary Muscles:</Text>
            <Text className="mt-1">{exerciseData.primaryMuscles.join(', ')}</Text>

            <Text className="font-bold mt-2">Secondary Muscles:</Text>
            <Text className="mt-1">{exerciseData.secondaryMuscles.join(', ')}</Text>

            <Text className="font-bold mt-4">Instructions:</Text>
            {exerciseData.instructions.map((instruction, index) => (
                <Text key={index} className="mt-1">- {instruction}</Text>
            ))}

            <Box className='flex-row gap-5 mt-10'>
            <Image
                source={{ uri: `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${exerciseData.images[0]}` }}
                alt={`Exercise Image`}
                size='xl'
            />
            <Image
                source={{ uri: `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${exerciseData.images[1]}` }}
                alt={`Exercise Image`}
                size='xl'
            />
            </Box>
        </Box>
    )
}
