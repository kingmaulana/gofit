import OnboardingLayout from "@/components/screens/onboarding-layout";
import {Text, View} from "react-native";
import {useFormContext} from "react-hook-form";
import SelectionButton from "@/components/screens/onboarding-button-selection";
import {useState} from "react";
import {Button, ButtonText} from "@/components/ui/button";
import {Alert, AlertIcon, AlertText} from "@/components/ui/alert";
import {InfoIcon} from "@/components/ui/icon";

export default function Step10({onNext}) {
  const [selected, setSelected] = useState([]);

  const {setValue, getValues} = useFormContext();

  const handlePartClick = (value) => {
    if (selected.includes(value)) {
      setSelected((prev) => prev.filter((v) => v !== value));
    } else {
      setSelected((prev) => [...prev, value]);
    }
  }

  const handleNext = () => {
    setValue("injuries", selected);
    onNext();
  }

  return <OnboardingLayout>
    <View className="p-4 flex-1 flex-col gap-2">
      <Text className="text-white text-3xl text-center" style={{
        marginVertical: 32
      }}>One more thing, are you have any injuries of one of the following: </Text>
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}>
        {["knee", "ankle", "back", "shoulder", "wrist", "elbow", "neck", "hip", "legs", "arms"].map((part) => (
          <View key={part} style={{width: '48%', marginBottom: 8, minHeight: 75}}>
            <SelectionButton
              key={part}
              value={part}
              selectedValue={selected}
              onPress={handlePartClick}
              verticalMode
              multipleMode
            >
              {part === "back" ? "Back (Lower and Upper)" : part.charAt(0).toUpperCase() + part.slice(1)}
            </SelectionButton>
          </View>
        ))}
      </View>
      <Alert className="mt-4" action="info">
        <AlertIcon as={InfoIcon}/>
        <AlertText style={{
          marginRight: 20
        }}>Your injury data is not be used to target you with ads.</AlertText>
      </Alert>
    </View>
    <View>
      <Button onPress={handleNext} action="secondary">
        <ButtonText>Next</ButtonText>
      </Button>
    </View>
  </OnboardingLayout>
}