import OnboardingLayout from "@/components/screens/onboarding-layout";
import {Text, View} from "react-native";
import {useController, useFormContext} from "react-hook-form";
import {Button, ButtonText} from "@/components/ui/button";
import {useState} from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from "dayjs";

export default function Step9({onNext}) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {setValue, getValues, control} = useFormContext();
  const endGoalController = useController({
    name: "endGoal",
    control: control,
    defaultValue: dayjs().format("YYYY-MM-DD")
  })

  const handleChange = (val) => {
    const date = dayjs(val.nativeEvent.timestamp).format("YYYY-MM-DD");
    endGoalController.field.onChange(date);
    setShowDatePicker(false);
  }

  const handleNext = () => {
    setValue("endGoal", dayjs(getValues("endGoal")).startOf("day").format("YYYY-MM-DDT00:00:00.000") + "Z");
    onNext();
  }

  return <OnboardingLayout>
    <View className="flex-1 justify-center items-center">
      <Text className="text-white text-2xl font-bold">Select your end goal target</Text>
      <View className="items-center justify-center mt-4">
        <View className="gap-2 justify-center">
          <Button onPress={() => setShowDatePicker(true)} action="secondary" size="xl">
            <ButtonText>Choose date</ButtonText>
          </Button>
          <Text className="text-white">Currently selected
            date: {dayjs(getValues("endGoal")).format("DD MMM YYYY")}</Text>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date(endGoalController.field.value)}
              mode="date"
              onChange={handleChange}
              minimumDate={new Date()}
            />
          )}
        </View>
      </View>
    </View>
    <View>
      <Button onPress={handleNext} action="secondary">
        <ButtonText>Next</ButtonText>
      </Button>
    </View>
  </OnboardingLayout>
}