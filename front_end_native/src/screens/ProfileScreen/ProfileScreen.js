import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../context/authSlice';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to log out of your account?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                onPress: () => {
                    dispatch(logout());
                    navigation.navigate('Home');
                },
                style: 'destructive',
            },
        ]);
    };

    if (!user) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.notLoggedIn}>
                    <View style={styles.userIconContainer}>
                        <Ionicons name="person-circle-outline" size={90} color="#EAD465" />
                    </View>
                    <Text style={styles.notLoggedTitle}>Welcome!</Text>
                    <Text style={styles.notLoggedText}>Log in to access your account</Text>
                    <TouchableOpacity
                        style={styles.loginBtn}
                        onPress={() => navigation.navigate('Auth')}
                    >
                        <Ionicons name="log-in-outline" size={20} color="#F5EAB9" />
                        <Text style={styles.loginBtnText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person-circle" size={90} color="#254E06" />
                        <View style={styles.onlineIndicator} />
                    </View>
                    <Text style={styles.name}>{user.name || 'User'}</Text>
                    <Text style={styles.email}>{user.email}</Text>
                    <View style={styles.membershipBadge}>
                        <Ionicons name="diamond-outline" size={16} color="#F5EAB9" />
                        <Text style={styles.membershipText}>Premium Member</Text>
                    </View>
                </View>

                {/* Personal Information Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="person-outline" size={22} color="#254E06" />
                        <Text style={styles.sectionTitle}>Personal Information</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                                <Ionicons name="call-outline" size={20} color="#254E06" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Phone Number</Text>
                                <Text style={styles.infoValue}>{user.phone || 'Not added'}</Text>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                                <Ionicons name="location-outline" size={20} color="#254E06" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Address</Text>
                                <Text style={styles.infoValue}>{user.address || 'Not added'}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Dietary Constraints Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="nutrition-outline" size={22} color="#254E06" />
                        <Text style={styles.sectionTitle}>Dietary Constraints</Text>
                    </View>
                    <View style={styles.constraintsCard}>
                        {user.dietaryConstraints && user.dietaryConstraints.length > 0 ? (
                            <View style={styles.tagsContainer}>
                                {user.dietaryConstraints.map((constraint, idx) => (
                                    <View key={idx} style={styles.constraintTag}>
                                        <Ionicons name="checkmark-circle" size={16} color="#254E06" />
                                        <Text style={styles.constraintText}>{constraint}</Text>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <View style={styles.noConstraints}>
                                <Ionicons name="information-circle-outline" size={24} color="#EAD465" />
                                <Text style={styles.noConstraintsText}>No dietary constraints specified</Text>
                            </View>
                        )}
                        <Text style={styles.helpText}>
                            We offer gluten-free products to meet your health needs
                        </Text>
                    </View>
                </View>

                {/* Settings Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="settings-outline" size={22} color="#254E06" />
                        <Text style={styles.sectionTitle}>Settings</Text>
                    </View>
                    <View style={styles.menuCard}>
                        <TouchableOpacity style={styles.menuItem}>
                            <View style={styles.menuIcon}>
                                <Ionicons name="document-text-outline" size={22} color="#254E06" />
                            </View>
                            <Text style={styles.menuText}>My Orders</Text>
                            <Ionicons name="chevron-forward" size={18} color="#EAD465" />
                        </TouchableOpacity>

                        <View style={styles.menuDivider} />

                        <TouchableOpacity style={styles.menuItem}>
                            <View style={styles.menuIcon}>
                                <Ionicons name="create-outline" size={22} color="#254E06" />
                            </View>
                            <Text style={styles.menuText}>Edit Profile</Text>
                            <Ionicons name="chevron-forward" size={18} color="#EAD465" />
                        </TouchableOpacity>

                        <View style={styles.menuDivider} />

                        <TouchableOpacity style={styles.menuItem}>
                            <View style={styles.menuIcon}>
                                <Ionicons name="notifications-outline" size={22} color="#254E06" />
                            </View>
                            <Text style={styles.menuText}>Notifications</Text>
                            <Ionicons name="chevron-forward" size={18} color="#EAD465" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={22} color="#F5EAB9" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F2ED'
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40
    },
    header: {
        alignItems: 'center',
        paddingVertical: 30,
        marginBottom: 20
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 16,
        height: 16,
        backgroundColor: '#254E06',
        borderWidth: 2,
        borderColor: '#F5EAB9',
        borderRadius: 8
    },
    name: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#254E06',
        marginBottom: 4
    },
    email: {
        fontSize: 16,
        color: '#254E06',
        opacity: 0.7,
        marginBottom: 12
    },
    membershipBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#254E06',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 6
    },
    membershipText: {
        color: '#F5EAB9',
        fontSize: 14,
        fontWeight: '600'
    },
    section: {
        marginBottom: 24
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
        paddingHorizontal: 4
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#254E06'
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        elevation: 4,
        shadowColor: '#254E06',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(234, 212, 101, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    infoContent: {
        flex: 1
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2
    },
    infoValue: {
        fontSize: 16,
        color: '#254E06',
        fontWeight: '500'
    },
    divider: {
        height: 1,
        backgroundColor: '#E8E6E1',
        marginVertical: 12
    },
    constraintsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        elevation: 4,
        shadowColor: '#254E06',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12
    },
    constraintTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(37, 78, 6, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        marginRight: 8,
        marginBottom: 8
    },
    constraintText: {
        fontSize: 14,
        color: '#254E06',
        fontWeight: '500',
        marginLeft: 4
    },
    noConstraints: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16
    },
    noConstraintsText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic'
    },
    helpText: {
        fontSize: 13,
        color: '#254E06',
        textAlign: 'center',
        lineHeight: 20,
        opacity: 0.7
    },
    menuCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        elevation: 4,
        shadowColor: '#254E06',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        overflow: 'hidden'
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 16
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(234, 212, 101, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    menuText: {
        fontSize: 16,
        color: '#254E06',
        flex: 1,
        fontWeight: '500'
    },
    menuDivider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginHorizontal: 16
    },
    logoutBtn: {
        flexDirection: 'row',
        backgroundColor: '#254E06',
        padding: 18,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        elevation: 4,
        shadowColor: '#254E06',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        gap: 8
    },
    logoutText: {
        color: '#F5EAB9',
        fontSize: 18,
        fontWeight: 'bold'
    },
    notLoggedIn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40
    },
    userIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#254E06',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8
    },
    notLoggedTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#254E06',
        marginBottom: 8
    },
    notLoggedText: {
        fontSize: 16,
        color: '#254E06',
        opacity: 0.7,
        marginBottom: 30,
        textAlign: 'center'
    },
    loginBtn: {
        backgroundColor: '#254E06',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        elevation: 4,
        shadowColor: '#254E06',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8
    },
    loginBtnText: {
        color: '#F5EAB9',
        fontSize: 16,
        fontWeight: 'bold'
    },
});

export default ProfileScreen;