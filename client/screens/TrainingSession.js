

import { Box } from '@/components/ui/box'
import { Button, ButtonText } from '@/components/ui/button'
import { HStack } from '@/components/ui/hstack'
import { Icon, PlayIcon, ChevronsRightIcon } from '@/components/ui/icon'
import { Image } from '@/components/ui/image'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import React from 'react'
import { View } from 'react-native'

export default function TrainingSession() {
  return (
    <Box className='flex flex-col items-center justify-between h-[80%] w-full'>
      <VStack className='w-full items-center pt-10'>
        <Image
          source={{
            uri: 'https://i.pinimg.com/originals/df/c5/92/dfc5926090f3fdd4ceefd08b43388360.gif',
          }}
          size='none'
          className='aspect-[320/208] w-full max-w-[320px]'
          alt="Workout"
        />
      </VStack>

      <VStack className='items-center w-full'>
        <Text className='font-black text-black text-3xl mb-5'>PUSH UP</Text>
        <Text className='font-black text-7xl'>00:38</Text>
        <HStack className="flex w-[100%] justify-evenly items-center mt-4">
          <Button variant="outline" className="rounded-full">
            <ButtonText className="font-bold">Completed</ButtonText>
          </Button>

          <Box className="flex items-center justify-center">
            <Icon as={PlayIcon} className="w-14 h-14 text-slate-600" />
          </Box>

          <Box className="flex items-center justify-center">
            <Icon as={ChevronsRightIcon} className="w-20 h-20 text-slate-600" />
          </Box>
        </HStack>
      </VStack>
    </Box>
  )
}
