import OnboardingLayout from "@/components/screens/onboarding-layout";
import {Text, View, Animated} from "react-native";
import {useFormContext} from "react-hook-form";
import SelectionButton from "@/components/screens/onboarding-button-selection";
import {useState, useEffect} from "react";
import {Button, ButtonText} from "@/components/ui/button";
import {Alert, AlertIcon, AlertText} from "@/components/ui/alert";
import {InfoIcon} from "@/components/ui/icon";
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
    <View className="p-6 flex-1 flex-col gap-4">
      <Text className="text-white text-3xl text-center font-semibold tracking-wide" style={{
        marginVertical: 36,
        lineHeight: 40
      }}>Do you have any of the following injuries?</Text>
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 8,
        marginBottom: 24,
      }}>
        {["knee", "ankle", "back", "shoulder", "wrist", "elbow", "neck", "hip", "legs", "arms"].map((part) => (
          <View key={part} style={{
            width: '48%',
            marginBottom: 16,
            minHeight: 80,
            transform: [{scale: selected.includes(part) ? 1.02 : 1}],
            transition: 'all 0.2s ease-in-out'
          }}>
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
      {/* <Alert className="mt-6 rounded-xl" action="info" style={{
        padding: 16,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      }}>
        <AlertIcon as={InfoIcon} style={{marginRight: 12}}/>
        <AlertText style={{
          flex: 1,
          lineHeight: 20,
          opacity: 0.9
        }}>Your injury data will not be used to target you with ads.</AlertText>
      </Alert> */}
    </View>
    {/* <View style={{padding: 16}}>
      <Button 
        onPress={handleNext} 
        action="secondary"
        className="rounded-xl"
        style={{
          elevation: 2,
          shadowColor: "#000",
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}>
        <ButtonText style={{fontSize: 16, fontWeight: '600'}}>Next</ButtonText>
      </Button>
    </View> */}

      <View className="mt-4">
          <Button 
            onPress={handleNext}
            className="bg-blue-500 rounded-lg"
          >
            <View className="flex-row items-center justify-center gap-2">
              <ButtonText className="text-lg">Continue</ButtonText>
              <MaterialCommunityIcons name="arrow-right" size={20} color="white" />
            </View>
          </Button>
        </View>
  </OnboardingLayout>
}