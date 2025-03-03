import OnboardingLayout from "@/components/screens/onboarding-layout";
import {useController, useFormContext} from "react-hook-form";
import {useEffect, useState} from "react";
import {Button, ButtonText} from "@/components/ui/button";
import {View, Text, TextInput, ScrollView} from "react-native";
import {Alert, AlertIcon, AlertText} from "@/components/ui/alert";
import {CheckIcon, ChevronDownIcon, ChevronUpIcon, InfoIcon} from "@/components/ui/icon";
import {HStack} from "@/components/ui/hstack";
import {
  Accordion,
  AccordionContent,
  AccordionContentText, AccordionHeader,
  AccordionIcon, AccordionItem,
  AccordionTitleText, AccordionTrigger
} from "@/components/ui/accordion";

export default function Step7({onNext}) {
  const {getValues, setValue, control} = useFormContext();
  const [bmi, setBmi] = useState(0);
  const [bmiColor, setBmiColor] = useState("bg-info-800");
  const [dWeight, setDWeight] = useState(0);

  const handleNext = () => {
    setValue("bmi", bmi);
    onNext();
  }

  const goalWeightController = useController({
    name: "goalWeight",
    control: control,
  })

  useEffect(() => {
    const weight = getValues("weight");
    const height = getValues("height") / 100;
    const bmi = weight / (height * height);
    setBmi(bmi.toFixed(2));

    if (bmi < 18.5) {
      setBmiColor("bg-info-700");
      const mustWeight = (18.5 * height * height).toFixed(2);
      setDWeight(mustWeight - weight);
      setValue("goalWeight", mustWeight);
    } else if (bmi >= 18.5 && bmi < 24.9) {
      setBmiColor("bg-success-700");
      setValue("goalWeight", weight);
    } else if (bmi >= 24.9 && bmi < 29.9) {
      setBmiColor("bg-warning-700");
      const mustWeight = (24.9 * height * height).toFixed(2);
      setDWeight(mustWeight - weight);
      setValue("goalWeight", mustWeight);
    } else {
      setBmiColor("bg-error-700");
      const mustWeight = (24.9 * height * height).toFixed(2);
      setDWeight(mustWeight - weight);
      setValue("goalWeight", mustWeight);
    }
  }, []);

  return <OnboardingLayout>
    <View className="p-4 flex-col gap-2 flex-1">
      <ScrollView>
        <View className="flex-1 gap-4">
          <View className={`flex-col gap-4 ${bmiColor} p-4 rounded-lg`}>
            <Text className="text-white text-xl">Your BMI is</Text>
            <Text className="text-white text-6xl font-black text-center">{bmi}</Text>
            <Accordion
              size="md"
              variant="filled"
              type="single"
              isCollapsible={true}
              isDisabled={false}
              className="m-5 w-[90%] border border-outline-200"
            >
              <AccordionItem value="a">
                <AccordionHeader>
                  <AccordionTrigger>
                    {({isExpanded}) => {
                      return (
                        <>
                          <AccordionTitleText>
                            What does that mean?
                          </AccordionTitleText>
                          {isExpanded ? (
                            <AccordionIcon as={ChevronUpIcon} className="ml-3"/>
                          ) : (
                            <AccordionIcon as={ChevronDownIcon} className="ml-3"/>
                          )}
                        </>
                      )
                    }}
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent>
                  <AccordionContentText>
                    BMI (Body Mass Index) is a measure that uses your height and weight to work out if your weight is
                    in a healthy range. It is calculated by dividing your weight in kilograms by the square of your height in meters.
                  </AccordionContentText>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Alert>
              <AlertIcon as={(bmi >= 18.5 && bmi < 24.9) ? CheckIcon : InfoIcon}/>
              <AlertText style={{
                marginRight: 20
              }}>{(bmi >= 18.5 && bmi < 24.9) ? "You are in a healthy weight range" : <>
                You are suggested to <Text
                className="font-bold">{dWeight > 0 ? `add weight by ${dWeight.toFixed(2)} kg` : `reduce weight by ${Math.abs(dWeight.toFixed(2))} kg`}</Text>
              </>
              }</AlertText>
            </Alert>
          </View>
          <View className="gap-4">
            <Text className="text-white text-xl">Pick your target weight</Text>
            <View className="items-center justify-center">
              <View className="flex-row gap-2 justify-center">
                <TextInput
                  value={goalWeightController.field.value}
                  onChangeText={goalWeightController.field.onChange}
                  className="p-2 border border-white text-white rounded-md text-xl"
                  style={{
                    width: 72
                  }}
                  keyboardType="number-pad"/>
                <Text className="text-white text-xl py-2">kg</Text>
              </View>
            </View>
          </View>
          <Text className="text-white text-center">
            Current weight: <Text className="font-bold">{getValues("weight")} kg</Text>
          </Text>
        </View>
      </ScrollView>
      <View>
        <Button onPress={handleNext} action="secondary">
          <ButtonText>Next</ButtonText>
        </Button>
      </View>
    </View>
  </OnboardingLayout>
}