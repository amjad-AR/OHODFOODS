import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { updateProduct, fetchProductById } from '../../api/productsApi';

const EditProductScreen = ({ route, navigation }) => {
    const { productId, product: initialProduct } = route.params || {};
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!productId && !initialProduct);
    const [product, setProduct] = useState(initialProduct || {
        name: '',
        description: '',
        price: '',
        category: 'raw_ingredients',
        tags: [],
    });

    useEffect(() => {
        if (productId && !initialProduct) {
            loadProduct();
        }
    }, [productId]);

    const loadProduct = async () => {
        try {
            setFetching(true);
            const res = await fetchProductById(productId);
            if (res && res.success && res.data) {
                setProduct({
                    ...res.data,
                    price: res.data.price?.toString() || '',
                });
            } else if (res && res.data) {
                setProduct({
                    ...res.data,
                    price: res.data.price?.toString() || '',
                });
            }
        } catch (error) {
            console.error('Error loading product:', error);
            Alert.alert('Error', 'Failed to load product details');
            navigation.goBack();
        } finally {
            setFetching(false);
        }
    };

    const handleUpdate = async () => {
        // Validation
        if (!product.name || !product.name.trim()) {
            Alert.alert('Error', 'Product name is required');
            return;
        }
        if (!product.price || isNaN(parseFloat(product.price)) || parseFloat(product.price) <= 0) {
            Alert.alert('Error', 'Valid price is required');
            return;
        }
        if (!product.description || !product.description.trim()) {
            Alert.alert('Error', 'Product description is required');
            return;
        }

        try {
            setLoading(true);
            const productData = {
                name: product.name.trim(),
                description: product.description.trim(),
                price: parseFloat(product.price),
                category: product.category,
                tags: product.tags || [],
            };

            console.log('📝 Updating product with data:', productData);
            const res = await updateProduct(productId, productData, token);

            if (res && (res.success || res.data)) {
                Alert.alert('Success', 'Product updated successfully', [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.goBack();
                            // Refresh product details if needed
                            navigation.navigate('ProductDetails', { productId });
                        },
                    },
                ]);
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update product';
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#254E06" />
                    <Text style={styles.loadingText}>Loading product...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const categories = [
        { value: 'raw_ingredients', label: 'Raw Ingredients' },
        { value: 'ready_products', label: 'Ready Products' },
        { value: 'beverages', label: 'Beverages' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#254E06" />
                    <Text style={styles.backButtonText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Product</Text>
                <View style={{ width: 80 }} />
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {/* Product Name */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Product Name *</Text>
                    <TextInput
                        style={styles.input}
                        value={product.name}
                        onChangeText={(text) => setProduct({ ...product, name: text })}
                        placeholder="Enter product name"
                        placeholderTextColor="#999"
                    />
                </View>

                {/* Price */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Price ($) *</Text>
                    <TextInput
                        style={styles.input}
                        value={product.price}
                        onChangeText={(text) => setProduct({ ...product, price: text })}
                        placeholder="0.00"
                        placeholderTextColor="#999"
                        keyboardType="decimal-pad"
                    />
                </View>

                {/* Category */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Category *</Text>
                    <View style={styles.categoryContainer}>
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat.value}
                                style={[
                                    styles.categoryButton,
                                    product.category === cat.value && styles.categoryButtonActive,
                                ]}
                                onPress={() => setProduct({ ...product, category: cat.value })}
                            >
                                <Text
                                    style={[
                                        styles.categoryButtonText,
                                        product.category === cat.value && styles.categoryButtonTextActive,
                                    ]}
                                >
                                    {cat.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Description */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description *</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={product.description}
                        onChangeText={(text) => setProduct({ ...product, description: text })}
                        placeholder="Enter product description"
                        placeholderTextColor="#999"
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                    />
                </View>

                {/* Tags (optional) */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Tags (comma separated)</Text>
                    <TextInput
                        style={styles.input}
                        value={product.tags?.join(', ') || ''}
                        onChangeText={(text) => {
                            const tags = text.split(',').map((tag) => tag.trim()).filter((tag) => tag);
                            setProduct({ ...product, tags });
                        }}
                        placeholder="gluten-free, organic, etc."
                        placeholderTextColor="#999"
                    />
                </View>

                {/* Update Button */}
                <TouchableOpacity
                    style={[styles.updateButton, loading && styles.updateButtonDisabled]}
                    onPress={handleUpdate}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#F5EAB9" />
                    ) : (
                        <>
                            <Ionicons name="checkmark-circle" size={22} color="#F5EAB9" />
                            <Text style={styles.updateButtonText}>Update Product</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F2ED',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#F3F2ED',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E6E1',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 8,
    },
    backButtonText: {
        fontSize: 16,
        color: '#254E06',
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#254E06',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#254E06',
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#254E06',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#254E06',
        borderWidth: 1,
        borderColor: '#E8E6E1',
    },
    textArea: {
        minHeight: 120,
        paddingTop: 12,
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#254E06',
    },
    categoryButtonActive: {
        backgroundColor: '#254E06',
        borderColor: '#254E06',
    },
    categoryButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#254E06',
    },
    categoryButtonTextActive: {
        color: '#F5EAB9',
    },
    updateButton: {
        backgroundColor: '#254E06',
        paddingVertical: 16,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 20,
        elevation: 4,
        shadowColor: '#254E06',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    updateButtonDisabled: {
        opacity: 0.6,
    },
    updateButtonText: {
        color: '#F5EAB9',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default EditProductScreen;

