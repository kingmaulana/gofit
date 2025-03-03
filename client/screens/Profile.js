import React from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
    const user = {
        username: "nunung",
        email: "nunung@mail.com",
        weight: 50,
        age: 25,
        height: 170,
        createdAt: "2025-03-03T06:25:58.318Z"
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleLogout = () => {
        console.log("User logged out");
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <LinearGradient
                    colors={['#FFFFFF', '#EEF2FF']}
                    style={styles.headerContainer}
                >
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: `https://image.pollinations.ai/prompt/${user.username}` }}
                                style={styles.avatar}
                                onError={(e) => console.log("Image Load Error:", e)}
                            />
                        </View>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.nameText}>{user.username}</Text>
                        <Text style={styles.emailText}>{user.email}</Text>
                        <Text style={styles.joinedText}>
                            <Feather name="calendar" size={14} color="#666666" style={styles.iconStyle} />
                            {" "}Joined {formatDate(user.createdAt)}
                        </Text>
                    </View>
                </LinearGradient>

                <Text style={styles.sectionTitle}>Personal Stats</Text>
                <View style={styles.unifiedStatsContainer}>
                    <View style={styles.statItem}>
                        <View style={styles.statIconContainer}>
                            <Feather name="user" size={20} color="#FFFFFF" />
                        </View>
                        <Text style={styles.statValue}>{user.age}</Text>
                        <Text style={styles.statLabel}>Age</Text>
                    </View>

                    <View style={styles.statDivider} />

                    <View style={styles.statItem}>
                        <View style={styles.statIconContainer}>
                            <Feather name="anchor" size={20} color="#FFFFFF" />
                        </View>
                        <Text style={styles.statValue}>{user.weight} kg</Text>
                        <Text style={styles.statLabel}>Weight</Text>
                    </View>

                    <View style={styles.statDivider} />

                    <View style={styles.statItem}>
                        <View style={styles.statIconContainer}>
                            <Feather name="align-justify" size={20} color="#FFFFFF" />
                        </View>
                        <Text style={styles.statValue}>{user.height} cm</Text>
                        <Text style={styles.statLabel}>Height</Text>
                    </View>
                </View>

                <View style={styles.actionsContainer}>
                    {/* Logout Button */}
                    <TouchableOpacity style={styles.actionButtonLogout} onPress={handleLogout}>
                        <Feather name="log-out" size={20} color="#FFFFFF" style={styles.actionIcon} />
                        <Text style={styles.actionText}>Logout</Text>
                    </TouchableOpacity>

                    {/* Edit Profile Button */}
                    <TouchableOpacity style={styles.actionButton}>
                        <Feather name="edit-2" size={20} color="#FFFFFF" style={styles.actionIcon} />
                        <Text style={styles.actionText}>Edit Profile</Text>
                    </TouchableOpacity>

                    {/* Settings Button */}
                    <TouchableOpacity style={styles.actionButton}>
                        <Feather name="settings" size={20} color="#FFFFFF" style={styles.actionIcon} />
                        <Text style={styles.actionText}>Settings</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
    },
    headerContainer: {
        padding: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: "center",
        paddingTop: 60,
        paddingBottom: 30,
    },
    profileHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        width: '100%',
    },
    avatarContainer: {
        borderWidth: 3,
        borderColor: "#4361EE",
        borderRadius: 50,
        padding: 5,
        shadowColor: "#4361EE",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 5,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F7F9F9',
        resizeMode: 'cover',
    },
    logoutButton: {
        position: "absolute",
        right: 0,
        top: 5,
        backgroundColor: "#E63946",
        padding: 12,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    profileInfo: {
        alignItems: "center",
        marginTop: 16,
    },
    nameText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 8,
    },
    emailText: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 10,
    },
    joinedText: {
        fontSize: 14,
        color: '#666666',
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconStyle: {
        marginRight: 4,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000000',
        marginVertical: 20,
        marginLeft: 24,
    },
    unifiedStatsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#E6EDFF",
        borderRadius: 20,
        padding: 24,
        marginHorizontal: 24,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    statItem: {
        flex: 1,
        alignItems: "center",
    },
    statDivider: {
        width: 1,
        height: 60,
        backgroundColor: "rgba(67, 97, 238, 0.2)",
        marginHorizontal: 8,
    },
    statIconContainer: {
        backgroundColor: "#4361EE",
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    statValue: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000000",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: "#666666",
    },
    actionsContainer: {
        paddingHorizontal: 24,
        marginBottom: 30,
        paddingBottom: 40,
    },
    actionButton: {
        backgroundColor: "#4361EE",
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 0,
        shadowColor: "#4361EE",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    actionIcon: {
        marginRight: 16,
    },
    actionText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: '500',
    },
    actionButtonLogout: {
        backgroundColor: "#E63946",
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 0,
        shadowColor: "#E63946",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
});
