
import { Image } from "expo-image"
import { Box } from '@/components/ui/box'
import { Button, ButtonText } from '@/components/ui/button'
import { HStack } from '@/components/ui/hstack'
import { Icon, PlayIcon, ChevronsRightIcon } from '@/components/ui/icon'
// import { Image } from '@/components/ui/image'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'

export default function TrainingSession() {
  const [time, setTime] = useState(38)
  const [isRunning, setIsRunning] = useState(true)
  const timerRef = useRef(null)

  useEffect(() => {
    if (isRunning && time > 0) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime - 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }

    return () => clearInterval(timerRef.current) // Cleanup
  }, [isRunning, time])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <Box className='flex flex-col items-center justify-between h-[80%] w-full'>
      <VStack className='w-full items-center pt-10'>
        {/* <Image
          source={{
            uri: 'https://i.pinimg.com/originals/df/c5/92/dfc5926090f3fdd4ceefd08b43388360.gif',
          }}
          size='none'
          className='aspect-[320/208] w-full max-w-[320px]'
          alt="Workout"
        /> */}
        <Image
          source={{
            uri: 'https://i.pinimg.com/originals/df/c5/92/dfc5926090f3fdd4ceefd08b43388360.gif',
          }}
          contentFit="cover"
          style={{
            width: 320,
            height: 208,
          }}
        />
      </VStack>

      <VStack className='items-center w-full'>
        <Text className='font-black text-black text-3xl mb-5'>PUSH UP</Text>
        <Text className='font-black text-7xl'>{formatTime(time)}</Text>
        <HStack className="flex w-[100%] justify-evenly items-center mt-4">
          <Button variant="outline" className="rounded-full">
            <ButtonText className="font-bold">Completed</ButtonText>
          </Button>

          <Button
            variant="outline"
            className="rounded-full"
            onPress={() => setIsRunning(!isRunning)} // Toggle start/pause
          >
            <ButtonText className="font-bold">
              {isRunning ? "Pause" : "Resume"}
            </ButtonText>
          </Button>

          <Box className="flex items-center justify-center">
            <Icon as={ChevronsRightIcon} className="w-20 h-20 text-slate-600" />
          </Box>
        </HStack>
      </VStack>
    </Box>
  )
}
