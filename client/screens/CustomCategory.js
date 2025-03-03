import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Image } from "@/components/ui/image";
import { Link, LinkText } from "@/components/ui/link";
import { Icon, ArrowRightIcon } from "@/components/ui/icon";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function CustomCategory() {
    const navigation = useNavigation();

    const userCategories = [
        { name: "Leg Training", image: `https://image.pollinations.ai/prompt/${encodeURIComponent("Leg Training 500x500")}` },
        { name: "Arm Training", image: `https://image.pollinations.ai/prompt/${encodeURIComponent("Arm Training 500x500")}` },
        { name: "HIIT", image: `https://image.pollinations.ai/prompt/${encodeURIComponent("HIIT 500x500")}` },
        { name: "Dumbbell Only", image: `https://image.pollinations.ai/prompt/${encodeURIComponent("Dumbbell Only 500x500")}` },
        { name: "Core Workout", image: `https://image.pollinations.ai/prompt/${encodeURIComponent("Core Workout 500x500")}` },
        { name: "Full Body", image: `https://image.pollinations.ai/prompt/${encodeURIComponent("Full Body Workout 500x500")}` },
        { name: "Cardio", image: `https://image.pollinations.ai/prompt/${encodeURIComponent("Cardio Workout 500x500")}` },
        { name: "Strength Training", image: `https://image.pollinations.ai/prompt/${encodeURIComponent("Strength Training 500x500")}` },
        { name: "Yoga Flow", image: `https://image.pollinations.ai/prompt/${encodeURIComponent("Yoga Flow 500x500")}` }
    ];


    return (
        <SafeAreaView className="flex-1 bg-white-950">
            <ScrollView 
                className="flex-1 px-4 py-6"
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                <Heading size="lg" className="text-black mb-6">My Custom Plans</Heading>
    
                <VStack space="md" className="pb-20">
                    {userCategories.map((category, index) => (
                        <Card
                            key={index}
                            className="bg-gray-800 rounded-2xl border border-gray-700 shadow-lg overflow-hidden"
                        >
                            <HStack className="items-center p-4">
                                {/* Image */}
                                <Image
                                    source={{ uri: category.image }}
                                    size="lg"
                                    alt={category.name}
                                    className="rounded-lg border border-gray-600"
                                />
    
                                {/* Text & Button */}
                                <VStack className="flex-1 ml-4">
                                    <Heading size="md" className="text-white">{category.name}</Heading>
                                    <Link onPress={() => navigation.navigate('CategoryDetail', { category: category.name })}>
                                        <HStack className="items-center bg-600 px-3 py-2 rounded-lg mt-2">
                                            <LinkText size="sm" className="text-white font-semibold mr-2">Start Training</LinkText>
                                            <Icon as={ArrowRightIcon} size="sm" className="text-white" />
                                        </HStack>
                                    </Link>
                                </VStack>
                            </HStack>
                        </Card>
                    ))}
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
}