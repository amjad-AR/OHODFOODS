import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../context/authSlice';
import { Ionicons } from '@expo/vector-icons';

const RegisterScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [dietaryConstraints, setDietaryConstraints] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRegister = async () => {
        // Check required fields
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        // Check password match
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        // Check password length
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        try {
            const payload = {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password,
                phone: phone.trim(),
                address: address.trim(),
                dietaryConstraints: dietaryConstraints
                    .split(',')
                    .map(item => item.trim())
                    .filter(item => item !== '')
            };

            console.log('Registering with payload:', payload);

            await dispatch(register(payload)).unwrap();

            Alert.alert('Registration Successful', 'Your account has been created successfully!');

            // Navigate to Main (TabNavigator) then Home
            navigation.navigate('Main', { screen: 'Home' });
        } catch (err) {
            console.error('Register failed:', err);
            Alert.alert(
                'Registration Failed',
                err?.message || err?.error || 'An error occurred during registration. Please try again'
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.logoContainer}>
                    <Ionicons name="person-add-outline" size={80} color="#e76f51" />
                </View>

                <Text style={styles.title}>Create New Account</Text>
                <Text style={styles.subtitle}>Join us now!</Text>

                {auth.error && (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={20} color="#e76f51" />
                        <Text style={styles.errorText}>{auth.error}</Text>
                    </View>
                )}

                {/* Name */}
                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        placeholder="Full Name *"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                        autoCapitalize="words"
                    />
                </View>

                {/* Email */}
                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        placeholder="Email *"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                {/* Password */}
                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        placeholder="Password (at least 6 characters) *"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        style={styles.input}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons
                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color="#666"
                        />
                    </TouchableOpacity>
                </View>

                {/* Confirm Password */}
                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        placeholder="Confirm Password *"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        style={styles.input}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <Ionicons
                            name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color="#666"
                        />
                    </TouchableOpacity>
                </View>

                {/* Phone */}
                <View style={styles.inputContainer}>
                    <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        placeholder="Phone Number (optional)"
                        value={phone}
                        onChangeText={setPhone}
                        style={styles.input}
                        keyboardType="phone-pad"
                    />
                </View>

                {/* Address */}
                <View style={styles.inputContainer}>
                    <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        placeholder="Address (optional)"
                        value={address}
                        onChangeText={setAddress}
                        style={styles.input}
                    />
                </View>

                {/* Dietary Constraints */}
                <View style={styles.inputContainer}>
                    <Ionicons name="nutrition-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        placeholder="Dietary Constraints (example: gluten-free, vegan)"
                        value={dietaryConstraints}
                        onChangeText={setDietaryConstraints}
                        style={styles.input}
                        multiline
                    />
                </View>

                <Text style={styles.hint}>
                    * Required fields
                </Text>

                {auth.loading ? (
                    <ActivityIndicator size="large" color="#e76f51" style={{ marginTop: 20 }} />
                ) : (
                    <TouchableOpacity style={styles.btn} onPress={handleRegister}>
                        <Text style={styles.btnText}>Create Account</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                    style={styles.loginLink}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.linkText}>Already have an account? </Text>
                    <Text style={styles.linkTextBold}>Login</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    scrollContent: {
        padding: 24,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
        color: '#264653'
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffe8e6',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    errorText: {
        color: '#e76f51',
        marginLeft: 8,
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
        backgroundColor: '#f9f9f9',
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
    },
    hint: {
        fontSize: 12,
        color: '#999',
        marginBottom: 8,
        fontStyle: 'italic',
    },
    btn: {
        backgroundColor: '#e76f51',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
        elevation: 2,
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#999',
    },
    loginLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    linkText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 15
    },
    linkTextBold: {
        color: '#e76f51',
        fontWeight: 'bold',
        fontSize: 15
    },
});

export default RegisterScreen;