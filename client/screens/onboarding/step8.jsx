import OnboardingLayout from "@/components/screens/onboarding-layout";
import {Text, View} from "react-native";
import {useController, useFormContext} from "react-hook-form";
import {Slider, SliderFilledTrack, SliderThumb, SliderTrack} from "@/components/ui/slider";
import {useEffect} from "react";
import {Button, ButtonText} from "@/components/ui/button";

export default function Step7({onNext}) {
  const {setValue, getValues, control} = useFormContext();
  const routineController = useController({
    name: "routine",
    control: control,
    defaultValue: 4,
  })

  const handleNext = () => {
    const routine = getValues("routine");
    if (routine < 1 || routine > 7) {
      return;
    }
    if (!routine) setValue("routine", 4);
    onNext();
  }

  return <OnboardingLayout>
    <View className="p-4 flex-col gap-2 flex-1">
      <View className="flex-1">
        <Text className="text-white">How often do you usually work out?</Text>
        <View className="items-center" style={{
          marginTop: 20,
          marginHorizontal: 40
        }}>
          <Text className="text-white text-4xl">{getValues("routine") || 4}</Text>
          <Slider
            minValue={1}
            maxValue={7}
            step={1}
            value={routineController.field.value}
            onChange={routineController.field.onChange}
            size="md"
            orientation="horizontal"
            className="mt-8"
          >
            <SliderTrack style={{backgroundColor: "#777"}}>
              <SliderFilledTrack className="!bg-white"/>
            </SliderTrack>
            <SliderThumb className="!bg-white w-8 h-8"/>
          </Slider>
        </View>
      </View>
      <View>
        <Button onPress={handleNext} action="secondary">
          <ButtonText>Next</ButtonText>
        </Button>
      </View>
    </View>
  </OnboardingLayout>
}