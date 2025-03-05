import {Card} from "@/components/ui/card";
import {Heading} from "@/components/ui/heading";
import {HStack} from "@/components/ui/hstack";
import {VStack} from "@/components/ui/vstack";
import {Image} from "@/components/ui/image";
import {Link, LinkText} from "@/components/ui/link";
import {Icon, ArrowRightIcon, TrashIcon} from "@/components/ui/icon";
import {ScrollView, Alert, TouchableOpacity, View, ActivityIndicator, Text} from "react-native";
import {SafeAreaView} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {gql, useMutation, useQuery} from "@apollo/client";
import React from "react";

export const GET_CUSTOM_CATEGORY = gql(`
    query GetCustomCategory {
        userExercises {
            _id
            name
            userId
            duration
            restDuration
            exerciseId
            exercises {
                _id
                name
                force
                level
                mechanic
                equipment
                primaryMuscles
                secondaryMuscles
                instructions
                category
                image
                images
            }
        }
    }
`)

const DELETE_CUSTOM_CATEGORY = gql(`
    mutation DeleteCollectionExercise($deleteCollectionExerciseId: String) {
        deleteCollectionExercise(id: $deleteCollectionExerciseId) {
            userId
        }
    }
`);

export default function CustomCategory() {
  const navigation = useNavigation();
  const {data, loading, error} = useQuery(GET_CUSTOM_CATEGORY);
  const [deleteCategoryById] = useMutation(DELETE_CUSTOM_CATEGORY, {
    refetchQueries: [{query: GET_CUSTOM_CATEGORY}]
  });
  const userCategories = data?.userExercises;

  const handleDelete = (categoryName, index) => {
    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete "${categoryName}"?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log(`Deletion cancelled for: "${categoryName}"`),
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            console.log(`Deleting category: "${categoryName}" with ID: ${index}`);
            await deleteCategoryById({
              variables: {
                deleteCollectionExerciseId: index
              }
            })
          },
          style: "destructive"
        }
      ]
    );
  };

  // Handle loading and error states
  if (loading) {
    return <View className="h-full justify-center items-center">
      <ActivityIndicator size="large" color="black"/>
    </View>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <SafeAreaView className="flex-1 bg-white-950">
      <ScrollView
        className="flex-1 px-4 py-6"
        contentContainerStyle={{paddingBottom: 20}}
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
                  source={{uri: `https://image.pollinations.ai/prompt/${encodeURIComponent(`${category.name} 500x500`)}`}}
                  size="lg"
                  alt={category.name}
                  className="rounded-lg border border-gray-600"
                />

                {/* Text & Button */}
                <VStack className="flex-1 ml-4">
                  <HStack className="justify-between items-center">
                    <Heading size="md" className="text-white">{category.name}</Heading>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleDelete(category.name, category._id)}
                      style={{
                        backgroundColor: 'rgba(254, 226, 226, 1)',
                        padding: 8,
                        borderRadius: 9999,
                        marginLeft: 8,
                        shadowColor: "#000",
                        shadowOffset: {width: 0, height: 1},
                        shadowOpacity: 0.2,
                        shadowRadius: 1.5,
                        elevation: 2
                      }}
                    >
                      <Icon
                        as={TrashIcon}
                        size="sm"
                        className="text-red-500"
                      />
                    </TouchableOpacity>
                  </HStack>
                  <Link onPress={() => navigation.navigate('WorkDetailByUser', {exerciseId: category._id})}>
                    <HStack className="items-center bg-600 px-3 py-2 rounded-lg mt-2">
                      <LinkText size="sm" className="text-white font-semibold mr-2">Start Training</LinkText>
                      <Icon as={ArrowRightIcon} size="sm" className="text-white"/>
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