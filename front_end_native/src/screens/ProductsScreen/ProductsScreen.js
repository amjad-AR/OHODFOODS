import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, TouchableOpacity, ScrollView } from 'react-native';
import { fetchAllProducts, fetchProductsByCategory } from '../../api/productsApi';
import ProductCard from '../../components/product/ProductCard';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const Colors = {
    LightBackground: "#F3F2ED",
    AccentBackground: "#F3F2ED",
    PrimaryAccent: "#FFDE57",
    DarkGreen: "#515E1B",
    MutedGreen: "#8C9531",
};
const ProductsScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const user = useSelector((state) => state.auth.user);

    // Preload photo images from assets/photo
    const photoImages = [
        require('../../../assets/photo/T11.jpg'),
        require('../../../assets/photo/T12.jpg'),
        require('../../../assets/photo/T13.jpg'),
        require('../../../assets/photo/T14.jpg'),
        require('../../../assets/photo/T15.jpg'),
        require('../../../assets/photo/T16.jpg'),
    ];

    const getRandomPhoto = () => photoImages[Math.floor(Math.random() * photoImages.length)];

    const categories = [
        { id: 'all', name: 'All', icon: 'apps-outline', color: '#254E06' },
        { id: 'raw_ingredients', name: 'Raw Ingredients', icon: 'leaf-outline', color: '#254E06' },
        { id: 'ready_products', name: 'Ready Products', icon: 'fast-food-outline', color: '#254E06' },
        { id: 'beverages', name: 'Beverages', icon: 'cafe-outline', color: '#254E06' },
    ];

    useEffect(() => {
        loadProducts();
    }, [selectedCategory]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            let res;
            if (selectedCategory === 'all') {
                res = await fetchAllProducts({ limit: 100 });
            } else {
                res = await fetchProductsByCategory(selectedCategory);
            }

            // Normalize response into an array
            let productsArray = [];
            if (res && res.success !== undefined) {
                if (res.success && res.data) productsArray = Array.isArray(res.data) ? res.data : [];
            } else if (Array.isArray(res)) productsArray = res;
            else if (res && res.data && Array.isArray(res.data)) productsArray = res.data;

            // Assign a random local image to each product
            productsArray = productsArray.map(p => ({ ...p, localImage: getRandomPhoto() }));
            setProducts(productsArray);
        } catch (err) {
            console.error('❌ Error loading products:', err);
            setError(err.message || 'Failed to load products');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryPress = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Ionicons name="warning-outline" size={60} color="#EAC800" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={loadProducts}>
                        <Text style={styles.retryBtnText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Products</Text>
                <Text style={styles.headerSubtitle}>Gluten-free products</Text>
            </View>

            {/* Categories Filter */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScroll}
                contentContainerStyle={styles.categoriesContainer}
            >
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat.id}
                        style={[
                            styles.categoryBtn,
                            selectedCategory === cat.id && styles.categoryBtnActive,
                        ]}
                        onPress={() => handleCategoryPress(cat.id)}
                    >
                        <Ionicons
                            name={cat.icon}
                            size={24}
                            color={selectedCategory === cat.id ? '#fff' : '#254E06'}
                        />
                        <Text
                            style={[
                                styles.categoryBtnText,
                                selectedCategory === cat.id && styles.categoryBtnTextActive
                            ]}
                        >
                            {cat.name}
                        </Text>
                        {selectedCategory === cat.id && (
                            <View style={styles.activeDot} />
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#254E06" />
                    <Text style={styles.loadingText}>Loading products...</Text>
                </View>
            ) : products.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="basket-outline" size={80} color="#EAD465" />
                    <Text style={styles.emptyText}>No products in this category</Text>
                </View>
            ) : (
                <>
                    <Text style={styles.productsCount}>
                        {products.length} products
                    </Text>
                    <FlatList
                        data={products}
                        keyExtractor={(item) => item._id || item.id || Math.random().toString()}
                        numColumns={2}
                        renderItem={({ item }) => (
                            <ProductCard
                                product={item}
                                navigation={navigation}
                                user={user}
                            />
                        )}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                    />
                </>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F2Ed',
    },
    header: {
        padding: 16,
        backgroundColor: '#e9e3c7ff',
        borderBottomWidth: 1,
        borderBottomColor: '#8a8984ff',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#254E06',
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#254E06',
        marginTop: 4,
        textAlign: 'center',
        opacity: 0.8,
    },
    categoriesScroll: {
        maxHeight: 80,
        minHeight: 80,
        borderBottomWidth: 1,
        borderBottomColor: '#EAC800',
        backgroundColor: '#F5EAB9',
    },
    categoriesContainer: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        gap: 1,
    },
    categoryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        borderWidth: 2,
        marginRight: 8,
        backgroundColor: '#F5EAB9',
        borderColor: '#254E06',
        gap: 6,
    },
    categoryBtnActive: {
        backgroundColor: '#254E06',
        borderColor: '#254E06',
    },
    categoryBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#254E06',
    },
    categoryBtnTextActive: {
        color: '#F5EAB9',
    },
    activeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginLeft: 4,
        backgroundColor: '#e9e3c7ff',
    },
    productsCount: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#254E06',
        fontWeight: '600',
        backgroundColor: '#e9e3c7ff',
        textAlign: 'center',
    },
    list: {
        paddingHorizontal: 6,
        paddingBottom: 20,
        backgroundColor: '#F3F2ED',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F2ED',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#254E06',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F3F2ED',
    },
    emptyText: {
        fontSize: 18,
        color: '#254E06',
        marginTop: 16,
        textAlign: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F3F2ED',
    },
    errorText: {
        fontSize: 18,
        color: '#254E06',
        marginTop: 16,
        marginBottom: 24,
        textAlign: 'center',
        fontWeight: '600',
    },
    retryBtn: {
        backgroundColor: '#254E06',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    retryBtnText: {
        color: '#F5EAB9',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProductsScreen;