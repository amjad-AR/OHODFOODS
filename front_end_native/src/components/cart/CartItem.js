import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CartItem = ({ item, onRemove }) => {
    const { product, qty } = item;

    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                <Text style={styles.qty}>الكمية: {qty}</Text>
            </View>
            <View style={styles.rightContainer}>
                <Text style={styles.total}>${(product.price * qty).toFixed(2)}</Text>
                <TouchableOpacity onPress={() => onRemove(product._id)}>
                    <Ionicons name="trash-outline" size={24} color="#e76f51" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#264653',
    },
    price: {
        fontSize: 14,
        color: '#2a9d8f',
    },
    qty: {
        fontSize: 14,
        color: '#666',
    },
    rightContainer: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#264653',
    },
});

export default CartItem;
