import React, { useState } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    Modal, 
    FlatList, 
    StyleSheet, 
    Dimensions,
    StatusBar,
    ScrollView
} from "react-native";
import { AntDesign, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

export default function ProgressWeight() {
    const [modalVisible, setModalVisible] = useState(false);
    const [weight, setWeight] = useState("");
    const [progress, setProgress] = useState([
        { _id: "1", userId: "user123", weight: 70, date: "2025-03-02T05:20:11.087Z" },
        { _id: "2", userId: "user123", weight: 68.5, date: "2025-03-02T06:15:22.087Z" },
    ]);

    const handleSubmit = () => {
        const newEntry = {
            _id: (progress.length + 1).toString(),
            userId: "user123",
            weight: parseFloat(weight),
            date: new Date().toISOString(),
        };
        setProgress([...progress, newEntry]);
        setModalVisible(false);
        setWeight("");
    };

    // Function to prepare chart data
    const getChartData = () => {
        const sortedData = [...progress].sort((a, b) => new Date(a.date) - new Date(b.date));
        return {
            labels: sortedData.map(item => new Date(item.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})),
            datasets: [
                {
                    data: sortedData.map(item => item.weight),
                    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                    strokeWidth: 2
                }
            ]
        };
    };

    // Function to calculate weight difference
    const calculateWeightDifference = () => {
        if (progress.length < 2) return null;
        
        const sortedData = [...progress].sort((a, b) => new Date(a.date) - new Date(b.date));
        const firstWeight = sortedData[0].weight;
        const lastWeight = sortedData[sortedData.length - 1].weight;
        const difference = lastWeight - firstWeight;
        
        return {
            difference: difference.toFixed(1),
            isLoss: difference < 0
        };
    };

    const weightDifference = calculateWeightDifference();
    const screenWidth = Dimensions.get('window').width;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            {/* Two main sections with independent scrolling */}
            <View style={styles.mainLayout}>
                {/* History Section - Independently Scrollable */}
                <View style={styles.historySection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>History</Text>
                        <TouchableOpacity 
                            style={styles.addButton} 
                            onPress={() => setModalVisible(true)}
                        >
                            <AntDesign name="plus" size={20} color="white" />
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {/* Scrollable history list with ScrollView */}
                    <ScrollView 
                        style={styles.historyScrollView}
                        showsVerticalScrollIndicator={true}
                    >
                        {[...progress]
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map(item => (
                                <View key={item._id} style={styles.weightCard}>
                                    <View style={styles.weightInfoContainer}>
                                        <View style={styles.weightCircle}>
                                            <Text style={styles.weightValue}>{item.weight}</Text>
                                            <Text style={styles.weightUnit}>kg</Text>
                                        </View>
                                        <View style={styles.dateContainer}>
                                            <Text style={styles.dateText}>
                                                {new Date(item.date).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </Text>
                                            <Text style={styles.timeText}>
                                                {new Date(item.date).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </Text>
                                        </View>
                                    </View>
                                    <FontAwesome5 name="weight" size={18} color="#718096" />
                                </View>
                            ))}
                    </ScrollView>
                </View>
                
                {/* Weight Progress Section - Independently Scrollable */}
                <View style={styles.weightProgressSection}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Weight Progress</Text>
                        <Text style={styles.headerSubtitle}>Track your weight journey</Text>
                    </View>
                    
                    {/* ScrollView for weight progress section */}
                    <ScrollView 
                        style={styles.progressScrollView}
                        showsVerticalScrollIndicator={true}
                    >
                        {progress.length > 1 && (
                            <View style={styles.chartContainer}>
                                <LineChart
                                    data={getChartData()}
                                    width={screenWidth - 40}
                                    height={180}
                                    chartConfig={{
                                        backgroundColor: '#ffffff',
                                        backgroundGradientFrom: '#ffffff',
                                        backgroundGradientTo: '#ffffff',
                                        decimalPlaces: 1,
                                        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        style: {
                                            borderRadius: 16
                                        },
                                        propsForDots: {
                                            r: '6',
                                            strokeWidth: '2',
                                            stroke: '#3182CE'
                                        }
                                    }}
                                    bezier
                                    style={styles.chart}
                                />
                            </View>
                        )}
                        
                        {weightDifference && (
                            <View style={styles.summaryCard}>
                                <View style={styles.summaryRow}>
                                    <MaterialCommunityIcons 
                                        name={weightDifference.isLoss ? "trending-down" : "trending-up"} 
                                        size={24} 
                                        color={weightDifference.isLoss ? styles.lossBadge.color : styles.gainBadge.color} 
                                    />
                                    <Text style={styles.summaryText}>
                                        {weightDifference.isLoss ? 'Lost ' : 'Gained '}
                                        <Text style={styles.highlightText}>
                                            {Math.abs(weightDifference.difference)} kg
                                        </Text> since you started
                                    </Text>
                                </View>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add Weight Entry</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <AntDesign name="close" size={24} color="#4A5568" />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.modalIcon}>
                            <FontAwesome5 name="weight" size={40} color="#3182CE" />
                        </View>
                        
                        <TextInput
                            placeholder="Enter weight in kg"
                            keyboardType="numeric"
                            value={weight}
                            onChangeText={setWeight}
                            style={styles.input}
                            placeholderTextColor="#A0AEC0"
                        />
                        
                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelButton]} 
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.submitButton]} 
                                onPress={handleSubmit}
                            >
                                <Text style={styles.submitButtonText}>Save Entry</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7FAFC",
        padding: 20,
        paddingBottom: 80, // Added padding at the bottom to prevent overlap with navbar
    },
    mainLayout: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    historySection: {
        flex: 0.5, // Take half of the available space
        marginBottom: 20,
    },
    historyScrollView: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2.22,
        elevation: 3,
        height: '100%',
    },
    progressScrollView: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2.22,
        elevation: 3,
    },
    weightProgressSection: {
        flex: 0.5, // Take half of the available space
    },
    progressContainer: {
        marginBottom: 20,
    },
    header: {
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "700",
        color: "#2D3748",
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: "#718096",
    },
    chartContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 10,
    },
    chart: {
        borderRadius: 16,
        paddingRight: 15,
    },
    summaryCard: {
        backgroundColor: "#EBF8FF",
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: "#3182CE",
    },
    summaryRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    summaryText: {
        fontSize: 16,
        color: "#2D3748",
        marginLeft: 10,
    },
    highlightText: {
        fontWeight: "700",
        color: "#3182CE",
    },
    lossBadge: {
        color: "#38A169",
    },
    gainBadge: {
        color: "#E53E3E",
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#2D3748",
        borderBottomWidth: 2,
        borderBottomColor: "#3182CE",
        paddingBottom: 5,
    },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#3182CE",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addButtonText: {
        color: "#FFFFFF",
        fontWeight: "600",
        marginLeft: 5,
    },
    historyList: {
        height: 300, // Fixed height for scrollable container
        paddingBottom: 10,
        marginBottom: 10,
        overflow: 'scroll', // Enable CSS scrolling
    },
    weightCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2.22,
        elevation: 3,
    },
    weightInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    weightCircle: {
        backgroundColor: "#EBF8FF",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#BEE3F8",
    },
    weightValue: {
        fontSize: 18,
        fontWeight: "700",
        color: "#3182CE",
    },
    weightUnit: {
        fontSize: 12,
        color: "#3182CE",
    },
    dateContainer: {
        marginLeft: 15,
    },
    dateText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2D3748",
    },
    timeText: {
        fontSize: 14,
        color: "#718096",
        marginTop: 2,
    },
    modalOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modalContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        width: "85%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#E2E8F0",
        paddingBottom: 15,
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#2D3748",
    },
    modalIcon: {
        alignItems: "center",
        marginVertical: 20,
    },
    input: {
        backgroundColor: "#F7FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 15,
    },
    modalButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    modalButton: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        width: "48%",
        alignItems: "center",
    },
    cancelButton: {
        backgroundColor: "#EDF2F7",
    },
    submitButton: {
        backgroundColor: "#3182CE",
    },
    cancelButtonText: {
        color: "#4A5568",
        fontWeight: "600",
    },
    submitButtonText: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
});