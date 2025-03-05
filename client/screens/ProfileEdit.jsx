import {Controller, useForm} from "react-hook-form";
import {ScrollView, Text, TextInput, View} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import {Button, ButtonSpinner, ButtonText} from "@/components/ui/button";
import {gql, useMutation} from "@apollo/client";
import {Alert, AlertIcon, AlertText} from "@/components/ui/alert";
import {AlertCircleIcon} from "@/components/ui/icon";
import {HStack} from "@/components/ui/hstack";
import {Text as UIText} from "@/components/ui/text";
import {Link, LinkText} from "@/components/ui/link";
import {useState} from "react";

const EDIT_USER = gql(`
    mutation EditUser($name: String, $email: String, $username: String, $newPassword: String, $password: String) {
        editUser(name: $name, email: $email, username: $username, newPassword: $newPassword, password: $password) {
            name
        }
    }
`)

export default function ProfileEdit() {
  const [editUser, {data: resData, loading, error}] = useMutation(EDIT_USER, {
    refetchQueries: ["GetUserDetails"]
  });
  const {defaults} = useRoute().params;

  const form = useForm({
    defaulValues: {...defaults, password: "", newPassword: ""}
  });
  const navigation = useNavigation();

  const save = async (data) => {
    data.password = data.password ?? "";
    data.newPassword = data.newPassword ?? "";
    await editUser({variables: data});
    navigation.goBack();
  }

  return <ScrollView style={{
    paddingHorizontal: 8,
    marginVertical: 16
  }}>
    <View className="gap-2">
      <View className="justify-center">
        <Text className="font-bold text-2xl text-center" style={{
          marginVertical: 32
        }}>Change user profile</Text>
        <Text className="font-medium py-2">Name </Text>
        <Controller
          name="name"
          control={form.control}
          defaultValue={defaults.name}
          render={({field: {onChange, value}}) => (
            <TextInput
              className="mx-2 py-2 border-b border-b-black flex-1 rounded-md text-xl w-full"
              onChangeText={onChange}
              value={value}
            />
          )}
        />
      </View>
      <View className="justify-center">
        <Text className="font-medium py-2">Email </Text>
        <Controller
          name="email"
          control={form.control}
          defaultValue={defaults.email}
          render={({field: {onChange, value}}) => (
            <TextInput
              className="mx-2 py-2 border-b border-b-black flex-1 rounded-md text-xl w-full"
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          )}
        />
      </View>
      <View className="justify-center">
        <Text className="font-medium py-2">Username </Text>
        <Controller
          name="username"
          control={form.control}
          defaultValue={defaults.username}
          render={({field: {onChange, value}}) => (
            <TextInput
              className="mx-2 py-2 border-b border-b-black flex-1 rounded-md text-xl w-full"
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
            />
          )}
        />
      </View>
    </View>
    <View>
      <Text className="font-bold text-2xl text-center" style={{
        marginVertical: 32
      }}>I want to change my password</Text>
      <View className="justify-center">
        <Text className="font-medium py-2">To change your password, type your old password here: </Text>
        <Controller
          name="password"
          control={form.control}
          render={({field: {onChange, value}}) => (
            <TextInput
              className="mx-2 py-2 border-b border-b-black flex-1 rounded-md text-xl w-full"
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              secureTextEntry
            />
          )}
        />
      </View>
      <View className="justify-center">
        <Text className="font-medium py-2">then, enter your new password: </Text>
        <Controller
          name="newPassword"
          control={form.control}
          render={({field: {onChange, value}}) => (
            <TextInput
              className="mx-2 py-2 border-b border-b-black flex-1 rounded-md text-xl w-full"
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              secureTextEntry
            />
          )}/>
      </View>
    </View>
    <View style={{
      marginVertical: 24
    }}>
      {error && <Alert className="mb-4" action="error">
        <AlertIcon as={AlertCircleIcon}/>
        <AlertText className="px-4">
          {error.message}
        </AlertText>
      </Alert>
      }
      <Button onPress={form.handleSubmit(save)} disabled={loading}>
        {loading && <ButtonSpinner />}
        <ButtonText>Edit profile</ButtonText>
      </Button>
    </View>
  </ScrollView>
}