import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../context/cartSlice';

const ProductCard = ({ product, user }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [added, setAdded] = useState(false);

    const handleDetails = () => {
        // Navigate to ProductDetails within the Products Stack Navigator
        navigation.navigate('ProductDetails', { 
            productId: product._id,
            localImage: product.localImage 
        });
    };

    const handleAddToCart = () => {
        if (!user) {
            // Navigate user to Login screen
            navigation.navigate('Auth');
            return;
        }
        dispatch(addToCart({ product, qty: 1 }));
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <View style={styles.card}>
            {product.localImage && (
                <View style={{ alignItems: 'center', marginBottom: 8 }}>
                    <Image source={product.localImage} style={{ width: 80, height: 80, borderRadius: 12 }} resizeMode="cover" />
                </View>
            )}
            <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.detailsBtn} onPress={handleDetails} activeOpacity={0.8}>
                    <Text style={styles.detailsText}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.cartBtn, added && styles.addedBtn]}
                    onPress={handleAddToCart}
                    disabled={added}
                >
                    <Text style={[styles.cartText, added && styles.cartTextActive]}>{added ? 'Added' : 'Add to Cart'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        alignItems: 'center',
        minWidth: 110,
        maxWidth: 420,
        height: 250,
        justifyContent: 'center',
        paddingBlockEnd: 16,
        elevation: 6,
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        borderWidth: 1,
        borderColor: '#F0E9C8',
    },
    name: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 6,
        textAlign: 'center',
        color: '#254E06',
        lineHeight: 18,
    },
    price: {
        color: '#254E06',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8,
        backgroundColor: '#EAD465',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        overflow: 'hidden',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 8,
        gap: 4,
    },
    detailsBtn: {
        backgroundColor: '#254E06',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 10,
        flex: 1,
        marginRight: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailsText: {
        color: '#F5EAB9',
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '600',
    },
    cartBtn: {
        backgroundColor: '#EAC800',
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 8,
        flex: 1,
        marginLeft: 2,
    },
    addedBtn: {
        backgroundColor: '#28a745',
        borderColor: '#1e7e34',
    },
    cartText: {
        color: '#254E06',
        fontSize: 13,
        fontWeight: '700',
        textAlign: 'center',
    },
    cartTextActive: {
        color: '#FFFFFF',
    },
});

export default ProductCard;