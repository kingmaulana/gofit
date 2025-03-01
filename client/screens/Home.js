import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { HStack } from "@/components/ui/hstack"
import { VStack } from "@/components/ui/vstack"
import { Image } from "@/components/ui/image"
import { Link, LinkText } from "@/components/ui/link"
import { Text } from "@/components/ui/text"
import { Icon, ArrowRightIcon, DumbbellIcon, BellIcon } from "@/components/ui/icon"
import { ScrollView, TouchableWithoutFeedback } from "react-native"
import { Box } from "@/components/ui/box"
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Divider } from "@/components/ui/divider"
import { useNavigation } from "@react-navigation/native"

export default function Home() {

  const navigation = useNavigation()

  const exerciseCategories = [
    { name: "Strength", image: "https://image.pollinations.ai/prompt/weightlifting%20black%20and%20white%20500x500" },
    { name: "Cardio", image: "https://image.pollinations.ai/prompt/running%20black%20and%20white%20500x500" },
    { name: "Flexibility", image: "https://image.pollinations.ai/prompt/yoga%20black%20and%20white%20500x500" },
    { name: "HIIT", image: "https://image.pollinations.ai/prompt/hiit%20workout%20black%20and%20white%20500x500" }
  ];

  const workoutsOfDay = [
    { name: "Full Body Power", difficulty: "Advanced", time: "45 min", image: "https://image.pollinations.ai/prompt/muscle%20man20gym%20500x500" },
    { name: "Core Crusher", difficulty: "Intermediate", time: "30 min", image: "https://image.pollinations.ai/prompt/core%20workout%20black%20and%20white%20500x500" }
  ];

  return (
    <ScrollView className="flex-1">
      <Box className=" px-4 pt-12 pb-4">
        <HStack className="justify-between items-center my-3 mx-3">

          <HStack space="sm" className="items-end">
            <Icon as={DumbbellIcon} size="lg" className="" />
            <Heading size="xl" className=" font-bold">Oman Maulana</Heading>
          </HStack>

          <HStack space="md" className="items-center">
            <Icon as={BellIcon} size="md" className="" />
            <Avatar size="md">
              <AvatarFallbackText>Jane Doe</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: "https://image.pollinations.ai/prompt/handsome%20man%20500x500",
                }}
              />
              <AvatarBadge />
            </Avatar>
          </HStack>
        </HStack>
      </Box>

      <Box className="px-4 py-2">
        <HStack className="justify-between items-center mb-3">
          <Heading size="md" className="">Today's Workouts</Heading>
          <Link>
            <HStack className="items-center">
              <LinkText size="sm" className="text-gray-600 no-underline">View All</LinkText>
              <Icon as={ArrowRightIcon} size="sm" className="text-gray-600" />
            </HStack>
          </Link>
        </HStack>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {workoutsOfDay.map((workout, index) => (
            <Card key={index} className="bg-gray-900 rounded-xl mr-4 w-[280px] overflow-hidden border-0">
                <Image
                  source={{ uri: workout.image }}
                  size="2xl"
                  alt={workout.name}
                />
              <TouchableWithoutFeedback onPress={() => navigation.navigate("Training")}>
                <Box className="p-3">
                  <Heading size="sm" className="text-white mb-1">{workout.name}</Heading>
                  <HStack className="justify-between">
                    <Text className="text-gray-400 text-xs">{workout.difficulty}</Text>
                    <Text className="text-gray-400 text-xs">{workout.time}</Text>
                  </HStack>
                  <Button size="sm" variant="solid" className="bg-white mt-3 rounded-lg">
                    <Text className="text-black font-medium">Start Workout</Text>
                  </Button>
                </Box>
              </TouchableWithoutFeedback>
            </Card>
          ))}
        </ScrollView>
      </Box>

      <Divider className="bg-gray-800 my-3" />

      <Box className="px-4 py-2 mb-6">
        <Heading size="md" className=" mb-4">Exercise Categories</Heading>

        <VStack space="md">
          {exerciseCategories.map((category, index) => (
            <Card key={index} className="bg-gray-900 rounded-xl border-0 overflow-hidden">
              <HStack>
                <Image
                  source={{ uri: category.image }}
                  size="md"
                  alt={category.name}
                />
                <HStack className="flex-1 justify-between items-center px-4">
                  <Heading size="sm" className="text-white">{category.name}</Heading>
                  <Link>
                    <HStack className="items-center">
                      <LinkText size="sm" className="text-gray-300 no-underline">Explore</LinkText>
                      <Icon as={ArrowRightIcon} size="sm" className="text-gray-300" />
                    </HStack>
                  </Link>
                </HStack>
              </HStack>
            </Card>
          ))}
        </VStack>
      </Box>
    </ScrollView>
  );
}
