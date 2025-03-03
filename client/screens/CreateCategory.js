import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CreateCategoryPage() {
    const [categoryName, setCategoryName] = useState('');
    const navigation = useNavigation();

    const handleCreateCategory = () => {
        if (categoryName.trim() === '') {
            alert('Please enter a category name');
            return;
        }
        // Navigate to AddExercisePage with the new category name
        navigation.navigate('AddExercisePage', { category: categoryName });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create a New Category</Text>
            <TextInput
                value={categoryName}
                onChangeText={setCategoryName}
                placeholder="Enter category name"
                style={styles.input}
            />
            <Button title="Create Category" onPress={handleCreateCategory} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
        paddingLeft: 8,
    },
});
