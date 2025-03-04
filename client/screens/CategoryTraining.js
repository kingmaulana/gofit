import { Box } from '@/components/ui/box';
import { Image } from '@/components/ui/image';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { FlatList, Dimensions, Animated, StyleSheet } from 'react-native';
import { gql, useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRef, useEffect, useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const GET_CATEGORY = gql(`
  query ExerciseCategories {
    exerciseCategories {
      _id
      name
      duration
      exerciseId
    }
  }
`);
const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2; // 2 columns with slightly reduced padding
const CARD_HEIGHT = 200; // Increased height for better aspect ratio

export default function CategoryTraining() {
  const { data, loading, error } = useQuery(GET_CATEGORY);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Create scale animation values for each item
  const scaleAnims = useMemo(() => {
    if (!data?.exerciseCategories) return [];
    return data.exerciseCategories.map(() => 
      new Animated.Value(1)
    );
  }, [data?.exerciseCategories]);

  // Press animation handlers
  const onPressIn = (index) => {
    Animated.spring(scaleAnims[index], {
      toValue: 0.95,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  
  const onPressOut = (index) => {
    Animated.spring(scaleAnims[index], {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [data]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  const newExerciseCategories = data.exerciseCategories?.map((category) => ({
    id: category._id,
    name: category.name,
    duration: category.duration,
    lengthExercises: category.exerciseId.length,
    image: `https://image.pollinations.ai/prompt/a%20workout%20category%20called%20${category.name}%20in%20black%20and%20white%20500x500?nologo=true`
  }));
  console.log("🚀 ~ newExerciseCategories ~ newExerciseCategories:", newExerciseCategories)
  return (
    <FlatList
      data={newExerciseCategories}
      renderItem={({ item, index }) => {
        return (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                { translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0]
                  })
                },
                { scale: scaleAnims[index] }
              ],
              margin: 6, // Reduced margin for tighter grid
            }}
          >
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => navigation.navigate("Training", { categoryId: item.id })}
              onPressIn={() => onPressIn(index)}
              onPressOut={() => onPressOut(index)}
              style={styles.cardContainer}
            >
              <Box style={styles.card}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.cardImage}
                  alt={item.name}
                  size="full"
                  resizeMode="cover"
                />
                
                <LinearGradient
                  colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.85)']}
                  style={styles.gradient}
                >
                  <Text style={styles.categoryName}>{item.name}</Text>
                  
                  <Box style={styles.durationContainer}>
                    <Text style={styles.durationText}>
                    {Math.floor(item?.duration / 60) * item?.lengthExercises} mins
                    </Text>
                  </Box>
                </LinearGradient>
                
                <Box style={styles.playButtonContainer}>
                  <Box style={styles.playButton}>
                    <Ionicons name="play" size={22} color="white" />
                  </Box>
                </Box>
              </Box>
            </TouchableOpacity>
          </Animated.View>
        );
      }}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      ListHeaderComponent={() => (
        <VStack style={styles.header}>
          <Animated.Text 
            style={[
              styles.headerText,
              {
                opacity: fadeAnim,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0]
                  })
                }]
              }
            ]}
          >
            Workout Categories
          </Animated.Text>
          <Text style={styles.subHeaderText}>
            Choose your training category
          </Text>
        </VStack>
      )}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 14,
    paddingBottom: 24,
    backgroundColor: '#f8f9fa',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginHorizontal: 2, // Add slight horizontal margin
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: 14, // Reduced bottom margin for tighter layout
    borderRadius: 16,
    overflow: 'hidden', // Important to keep
    position: 'relative', // Ensure proper stacking context
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8, // Enhanced shadow for better depth
    position: 'relative', // Ensure proper stacking context
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1, // Ensure proper stacking order
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%', // Full height coverage
    paddingHorizontal: 12,
    paddingBottom: 12,
    justifyContent: 'flex-end',
    zIndex: 2, // Higher than image but lower than play button
    borderRadius: 16, // Match card border radius
  },
  categoryName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textTransform: 'capitalize'
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  playButtonContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10, // Highest z-index to stay on top
  },
  playButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 44, // Slightly larger
    height: 44, // Slightly larger
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5, // Add shadow to play button for better visibility
  },
});
