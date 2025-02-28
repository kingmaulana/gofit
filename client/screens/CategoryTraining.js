
import { Box } from '@/components/ui/box'
import { Image } from '@/components/ui/image'
import { VStack } from '@/components/ui/vstack'
import { Text } from '@/components/ui/text'
import { FlatList, SafeAreaView } from 'react-native'
import { ScrollView } from 'react-native'

export default function CategoryTraining() {
  return (
    <ScrollView>
      <VStack className="flex w-full px-4 py-6 mb-20">
        <Text className="font-bold text-2xl mb-4 text-gray-800 self-start">Workouts</Text>
        <Box className="flex flex-row flex-wrap w-full mb-6">
          <Box className="w-1/2 p-2">
            <Box className="bg-white rounded-xl overflow-hidden shadow-md">
              <Box className="relative">
                <Image
                  source={{
                    uri: "https://image.pollinations.ai/prompt/fullbody%20workout%20black%20and%20white%20500x500",
                  }}
                  className="h-[160px] w-full rounded-t-xl"
                  alt="One Round HIIT"
                />
                <Box className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <Text className="absolute bottom-3 left-3 font-bold text-white">One Round HIIT</Text>
              </Box>
            </Box>
          </Box>

          <Box className="w-1/2 p-2">
            <Box className="bg-white rounded-xl overflow-hidden shadow-md">
              <Box className="relative">
                <Image
                  source={{
                    uri: "https://image.pollinations.ai/prompt/fullbody%20workout%20black%20and%20white%20500x500",
                  }}
                  className="h-[160px] w-full rounded-t-xl"
                  alt="Fatburning HIIT"
                />
                <Box className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <Text className="absolute bottom-3 left-3 font-bold text-white">Fatburning HIIT</Text>
              </Box>
            </Box>
          </Box>

          <Box className="w-1/2 p-2">
            <Box className="bg-white rounded-xl overflow-hidden shadow-md">
              <Box className="relative">
                <Image
                  source={{
                    uri: "https://image.pollinations.ai/prompt/fullbody%20workout%20black%20and%20white%20500x500",
                  }}
                  className="h-[160px] w-full rounded-t-xl"
                  alt="Push Ups HIIT"
                />
                <Box className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <Text className="absolute bottom-3 left-3 font-bold text-white">Push Ups HIIT</Text>
              </Box>
            </Box>
          </Box>

          <Box className="w-1/2 p-2">
            <Box className="bg-white rounded-xl overflow-hidden shadow-md">
              <Box className="relative">
                <Image
                  source={{
                    uri: "https://image.pollinations.ai/prompt/fullbody%20workout%20black%20and%20white%20500x500",
                  }}
                  className="h-[160px] w-full rounded-t-xl"
                  alt="Full Body Burn"
                />
                <Box className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <Text className="absolute bottom-3 left-3 font-bold text-white">Full Body Burn</Text>
              </Box>
            </Box>
          </Box>

          <Box className="w-1/2 p-2">
            <Box className="bg-white rounded-xl overflow-hidden shadow-md">
              <Box className="relative">
                <Image
                  source={{
                    uri: "https://image.pollinations.ai/prompt/fullbody%20workout%20black%20and%20white%20500x500",
                  }}
                  className="h-[160px] w-full rounded-t-xl"
                  alt="Upper-Body Routine"
                />
                <Box className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <Text className="absolute bottom-3 left-3 font-bold text-white">Upper-Body Routine</Text>
              </Box>
            </Box>
          </Box>

          <Box className="w-1/2 p-2">
            <Box className="bg-white rounded-xl overflow-hidden shadow-md">
              <Box className="relative">
                <Image
                  source={{
                    uri: "https://image.pollinations.ai/prompt/fullbody%20workout%20black%20and%20white%20500x500",
                  }}
                  className="h-[160px] w-full rounded-t-xl"
                  alt="Strength Focused HIIT"
                />
                <Box className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <Text className="absolute bottom-3 left-3 font-bold text-white">Strength Focused HIIT</Text>
              </Box>
            </Box>
          </Box>
        </Box>

        <Text className="font-bold text-2xl mt-8 mb-4 text-gray-800 self-start">Target Area</Text>
        <Box className="flex flex-row flex-wrap w-full mb-6">
          <Box className="w-1/3 p-2">
            <Box className="bg-white rounded-xl overflow-hidden shadow-md">
              <Box className="relative">
                <Image
                  source={{
                    uri: "https://image.pollinations.ai/prompt/fullbody%20workout%20black%20and%20white%20500x500",
                  }}
                  className="h-[120px] w-full rounded-t-xl"
                  alt="Abs"
                />
                <Box className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <Text className="absolute bottom-3 left-3 font-bold text-white">Abs</Text>
              </Box>
            </Box>
          </Box>

          <Box className="w-1/3 p-2">
            <Box className="bg-white rounded-xl overflow-hidden shadow-md">
              <Box className="relative">
                <Image
                  source={{
                    uri: "https://image.pollinations.ai/prompt/fullbody%20workout%20black%20and%20white%20500x500",
                  }}
                  className="h-[120px] w-full rounded-t-xl"
                  alt="Arms"
                />
                <Box className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <Text className="absolute bottom-3 left-3 font-bold text-white">Arms</Text>
              </Box>
            </Box>
          </Box>

          <Box className="w-1/3 p-2">
            <Box className="bg-white rounded-xl overflow-hidden shadow-md">
              <Box className="relative">
                <Image
                  source={{
                    uri: "https://image.pollinations.ai/prompt/fullbody%20workout%20black%20and%20white%20500x500",
                  }}
                  className="h-[120px] w-full rounded-t-xl"
                  alt="Chest"
                />
                <Box className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <Text className="absolute bottom-3 left-3 font-bold text-white">Chest</Text>
              </Box>
            </Box>
          </Box>

          <Box className="w-1/3 p-2">
            <Box className="bg-white rounded-xl overflow-hidden shadow-md">
              <Box className="relative">
                <Image
                  source={{
                    uri: "https://image.pollinations.ai/prompt/fullbody%20workout%20black%20and%20white%20500x500",
                  }}
                  className="h-[120px] w-full rounded-t-xl"
                  alt="Legs"
                />
                <Box className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <Text className="absolute bottom-3 left-3 font-bold text-white">Legs</Text>
              </Box>
            </Box>
          </Box>

          <Box className="w-1/3 p-2">
            <Box className="bg-white rounded-xl overflow-hidden shadow-md">
              <Box className="relative">
                <Image
                  source={{
                    uri: "https://image.pollinations.ai/prompt/fullbody%20workout%20black%20and%20white%20500x500",
                  }}
                  className="h-[120px] w-full rounded-t-xl"
                  alt="Back"
                />
                <Box className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <Text className="absolute bottom-3 left-3 font-bold text-white">Back</Text>
              </Box>
            </Box>
          </Box>

          <Box className="w-1/3 p-2">
            <Box className="bg-white rounded-xl overflow-hidden shadow-md">
              <Box className="relative">
                <Image
                  source={{
                    uri: "https://image.pollinations.ai/prompt/fullbody%20workout%20black%20and%20white%20500x500",
                  }}
                  className="h-[120px] w-full rounded-t-xl"
                  alt="Shoulders"
                />
                <Box className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <Text className="absolute bottom-3 left-3 font-bold text-white">Shoulders</Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </VStack>
    </ScrollView>
  );
}
