import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { fetchProductById } from '../../api/productsApi';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../context/cartSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ProductDetailsScreen = ({ route, navigation }) => {
    const { productId, localImage } = (route && route.params) || {};
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addedToCart, setAddedToCart] = useState(false);

    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    useEffect(() => {
        let mounted = true;
        const loadProduct = async () => {
            setLoading(true);
            try {
                const res = await fetchProductById(productId);
                if (!mounted) return;
                if (res && res.success && res.data) setProduct(res.data);
                else setProduct(res || null);
            } catch (err) {
                console.error('loadProduct error', err);
                if (mounted) setProduct(null);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        if (productId) loadProduct();
        else setLoading(false);
        return () => { mounted = false; };
    }, [productId]);

    const handleAddToCart = () => {
        if (!user) {
            // Navigate to Auth tab (Login screen)
            navigation.navigate('Auth');
            return;
        }
        if (!product || !product._id) return;
        const cartItem = {
            product: {
                _id: product._id,
                name: product.name,
                price: product.price,
                category: product.category,
                description: product.description,
                image: product.image || localImage || null,
            },
            qty: 1,
        };
        dispatch(addToCart(cartItem));
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#254E06" />
                    <Text style={styles.loadingText}>Loading product...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const displayImage = localImage || (product && product.image) || null;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#254E06" />
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                    <View style={styles.headerRight}>
                        {user && (user.role === 'admin' || user.isAdmin) && (
                            <TouchableOpacity 
                                style={styles.editButton} 
                                onPress={() => navigation.navigate('EditProduct', { productId: product?._id, product: product })}
                            >
                                <Ionicons name="create-outline" size={22} color="#254E06" />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity style={styles.shareButton}>
                            <Ionicons name="share-outline" size={22} color="#254E06" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                    <View style={styles.imageContainer}>
                        {displayImage ? (
                            <Image source={displayImage} style={{ width: width * 0.7, height: width * 0.7, borderRadius: 20 }} resizeMode="cover" />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Ionicons name="cube-outline" size={80} color="#EAD465" />
                            </View>
                        )}
                        <View style={styles.imageBadge}>
                            <Text style={styles.badgeText}>Gluten-free</Text>
                        </View>
                    </View>

                    <View style={styles.contentContainer}>
                        <View style={styles.titleRow}>
                            <Text style={styles.title}>{product?.name || 'Product'}</Text>
                            <View style={styles.ratingContainer}>
                                <Ionicons name="star" size={16} color="#EAC800" />
                                <Text style={styles.ratingText}>4.8</Text>
                            </View>
                        </View>

                        <Text style={styles.category}>{product?.category || 'General Product'}</Text>

                        <View style={styles.priceContainer}>
                            <Text style={styles.price}>${product && product.price ? product.price.toFixed(2) : '0.00'}</Text>
                            {product && product.originalPrice && (
                                <Text style={styles.originalPrice}>${product.originalPrice.toFixed(2)}</Text>
                            )}
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Product Description</Text>
                            <Text style={styles.description}>{product?.description || 'No description available for this product.'}</Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Features</Text>
                            <View style={styles.featuresList}>
                                <View style={styles.featureItem}>
                                    <Ionicons name="checkmark-circle" size={18} color="#254E06" />
                                    <Text style={styles.featureText}>Gluten-free</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Ionicons name="checkmark-circle" size={18} color="#254E06" />
                                    <Text style={styles.featureText}>100% Natural</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Ionicons name="checkmark-circle" size={18} color="#254E06" />
                                    <Text style={styles.featureText}>Healthy & Safe</Text>
                                </View>
                            </View>
                        </View>

                        {product && product.tags && product.tags.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Categories</Text>
                                <View style={styles.tagsContainer}>
                                    {product.tags.map((tag, index) => (
                                        <View key={index} style={styles.tag}>
                                            <Text style={styles.tagText}>{tag}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.addToCartButton, addedToCart && styles.addedToCartButton]}
                        onPress={handleAddToCart}
                        disabled={addedToCart}
                    >
                        {addedToCart ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name="checkmark" size={22} color="#F3F2ED" />
                                <Text style={[styles.addToCartText, { color: '#F3F2ED' }]}>Added to Cart</Text>
                            </View>
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name="cart" size={22} color="#254E06" />
                                <Text style={styles.addToCartText}>Add to Cart</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F3F2ED',
    },
    container: {
        flex: 1,
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
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    editButton: {
        padding: 8,
    },
    shareButton: {
        padding: 8,
    },
    imageContainer: {
        alignItems: 'center',
        paddingVertical: 30,
        position: 'relative',
    },
    imagePlaceholder: {
        width: width * 0.7,
        height: width * 0.7,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#EAD465',
        borderStyle: 'dashed',
        elevation: 8,
        shadowColor: '#254E06',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    imageBadge: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#254E06',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgeText: {
        color: '#F3F2ED',
        fontSize: 12,
        fontWeight: '600',
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#254E06',
        flex: 1,
        marginRight: 12,
        textAlign: 'right',
        lineHeight: 32,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    ratingText: {
        fontSize: 14,
        color: '#254E06',
        fontWeight: '600',
    },
    category: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
        textAlign: 'right',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 24,
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#254E06',
        backgroundColor: '#EAD465',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    originalPrice: {
        fontSize: 18,
        color: '#999',
        textDecorationLine: 'line-through',
        fontWeight: '500',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#254E06',
        marginBottom: 12,
        textAlign: 'right',
    },
    description: {
        fontSize: 16,
        color: '#444',
        lineHeight: 24,
        textAlign: 'right',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#EAC800',
    },
    featuresList: {
        gap: 10,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E8E6E1',
    },
    featureText: {
        fontSize: 15,
        color: '#254E06',
        fontWeight: '500',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        backgroundColor: '#EAD465',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    tagText: {
        fontSize: 13,
        color: '#254E06',
        fontWeight: '500',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#F3F2ED',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#E8E6E1',
        elevation: 8,
        shadowColor: '#254E06',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    addToCartButton: {
        backgroundColor: '#EAC800',
        paddingVertical: 16,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        elevation: 4,
        shadowColor: '#254E06',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    addedToCartButton: {
        backgroundColor: '#254E06',
    },
    addToCartText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#254E06',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F2ED',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#254E06',
        fontWeight: '500',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
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
});

export default ProductDetailsScreen;