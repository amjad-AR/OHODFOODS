import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart, updateCartItemQty } from '../../context/cartSlice';
import { Ionicons } from '@expo/vector-icons';
import { createOrder } from '../../api/ordersApi';

const CartScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const [isLoading, setIsLoading] = useState(false);

    const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

    const handleRemove = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const handleUpdateQty = (productId, newQty) => {
        if (newQty < 1) {
            handleRemove(productId);
            return;
        }
        dispatch(updateCartItemQty({ productId, qty: newQty }));
    };

    const handleClearCart = () => {
        Alert.alert('Clear Cart', 'Are you sure you want to delete all products from the cart?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear', onPress: () => dispatch(clearCart()), style: 'destructive' },
        ]);
    };

    const handleCheckout = async () => {
        if (!user) {
            Alert.alert(
                'تسجيل الدخول مطلوب',
                'يجب تسجيل الدخول لإتمام عملية الشراء',
                [
                    { text: 'إلغاء', style: 'cancel' },
                    { text: 'تسجيل الدخول', onPress: () => navigation.navigate('Auth') }
                ]
            );
            return;
        }

        // تأكيد الطلب
        Alert.alert(
            'تأكيد الطلب',
            `هل تريد إتمام طلب ${totalItems} منتج بقيمة $${totalPrice.toFixed(2)}؟`,
            [
                { text: 'إلغاء', style: 'cancel' },
                {
                    text: 'تأكيد',
                    onPress: async () => {
                        setIsLoading(true);
                        try {
                            // الحصول على معرف المستخدم
                            const userId = user.id || user._id;
                            
                            if (!userId) {
                                throw new Error('معرف المستخدم غير موجود. يرجى تسجيل الدخول مرة أخرى.');
                            }
                            
                            // تحضير بيانات الطلب مع معرف المستخدم
                            const orderData = {
                                userId: userId, // إضافة معرف المستخدم
                                items: cartItems.map(item => ({
                                    productId: item.product._id,
                                    quantity: item.qty,
                                    price: item.product.price
                                })),
                                totalAmount: totalPrice,
                                shippingAddress: user.address || 'Default Address',
                                notes: ''
                            };

                            console.log('📦 User ID:', userId);
                            console.log('📦 Sending order to backend:', orderData);
                            
                            // إرسال الطلب للـ Backend
                            const response = await createOrder(orderData, token);
                            
                            console.log('✅ Order response:', response);
                            
                            // عرض رسالة نجاح
                            Alert.alert(
                                'تم الطلب بنجاح! ✅',
                                `تم إنشاء طلبك بنجاح.\nعدد المنتجات: ${totalItems}\nالمجموع: $${totalPrice.toFixed(2)}`,
                                [
                                    {
                                        text: 'حسناً',
                                        onPress: () => {
                                            dispatch(clearCart());
                                            navigation.navigate('Home');
                                        }
                                    }
                                ]
                            );
                        } catch (error) {
                            console.error('❌ Checkout error:', error);
                            Alert.alert(
                                'خطأ في الطلب',
                                error.response?.data?.error || error.message || 'حدث خطأ أثناء إنشاء الطلب. حاول مرة أخرى.',
                                [{ text: 'حسناً' }]
                            );
                        } finally {
                            setIsLoading(false);
                        }
                    }
                }
            ]
        );
    };

    if (cartItems.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIcon}>
                        <Ionicons name="cart-outline" size={70} color="#EAD465" />
                    </View>
                    <Text style={styles.emptyTitle}>Cart is Empty</Text>
                    <Text style={styles.emptySubtitle}>You haven't added any products yet</Text>
                    <TouchableOpacity
                        style={styles.shopBtn}
                        onPress={() => navigation.navigate('Products')}
                    >
                        <Ionicons name="storefront-outline" size={20} color="#F5EAB9" />
                        <Text style={styles.shopBtnText}>Browse Products</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const renderItem = ({ item }) => (
        <View style={styles.cartItem}>
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.product.name}</Text>
                <Text style={styles.itemPrice}>${item.product.price.toFixed(2)}</Text>

                {item.product.tags && item.product.tags.length > 0 && (
                    <View style={styles.tagsContainer}>
                        {item.product.tags.slice(0, 2).map((tag, idx) => (
                            <View key={idx} style={styles.tag}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            <View style={styles.itemActions}>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => handleUpdateQty(item.product._id, item.qty - 1)}
                    >
                        <Ionicons name="remove" size={16} color="#254E06" />
                    </TouchableOpacity>
                    <Text style={styles.qtyValue}>{item.qty}</Text>
                    <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => handleUpdateQty(item.product._id, item.qty + 1)}
                    >
                        <Ionicons name="add" size={16} color="#254E06" />
                    </TouchableOpacity>
                </View>

                <View style={styles.priceRemoveContainer}>
                    <Text style={styles.itemTotal}>
                        ${(item.product.price * item.qty).toFixed(2)}
                    </Text>
                    <TouchableOpacity
                        style={styles.removeBtn}
                        onPress={() => handleRemove(item.product._id)}
                    >
                        <Ionicons name="trash-outline" size={20} color="#EAC800" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTitleContainer}>
                    <Ionicons name="cart" size={24} color="#254E06" />
                    <Text style={styles.title}>Shopping Cart</Text>
                </View>
                <TouchableOpacity style={styles.clearBtn} onPress={handleClearCart}>
                    <Ionicons name="trash-bin-outline" size={18} color="#EAC800" />
                    <Text style={styles.clearText}>Clear All</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.product._id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.footer}>
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Number of Items:</Text>
                        <Text style={styles.summaryValue}>{totalItems} items</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total:</Text>
                        <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
                    </View>
                </View>

                <TouchableOpacity 
                    style={[styles.checkoutBtn, isLoading && styles.checkoutBtnDisabled]} 
                    onPress={handleCheckout}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <ActivityIndicator size="small" color="#F5EAB9" />
                            <Text style={styles.checkoutText}>جاري الإرسال...</Text>
                        </>
                    ) : (
                        <>
                            <Ionicons name="checkmark-circle" size={20} color="#F5EAB9" />
                            <Text style={styles.checkoutText}>Checkout</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
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
        padding: 20,
        backgroundColor: '#F3F2ED',
        borderBottomWidth: 2,
        borderBottomColor: '#EAC800',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#254E06',
    },
    clearBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#254E06',
        borderRadius: 8,
    },
    clearText: {
        color: '#F5EAB9',
        fontSize: 14,
        fontWeight: '600',
    },
    listContent: {
        padding: 16,
        paddingBottom: 20,
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 3,
        shadowColor: '#254E06',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#EAD465',
    },
    itemInfo: {
        flex: 1,
        marginRight: 12,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#254E06',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 15,
        color: '#254E06',
        fontWeight: '600',
        marginBottom: 6,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
    },
    tag: {
        backgroundColor: '#EAD465',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginRight: 6,
        marginTop: 4,
    },
    tagText: {
        fontSize: 11,
        color: '#254E06',
        fontWeight: '500',
    },
    itemActions: {
        alignItems: 'flex-end',
        gap: 12,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5EAB9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#EAC800',
        padding: 2,
    },
    qtyBtn: {
        width: 28,
        height: 28,
        borderRadius: 6,
        backgroundColor: '#EAD465',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qtyValue: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#254E06',
        paddingHorizontal: 12,
        minWidth: 30,
        textAlign: 'center',
    },
    priceRemoveContainer: {
        alignItems: 'center',
        gap: 8,
    },
    itemTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#254E06',
        backgroundColor: '#EAD465',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    removeBtn: {
        padding: 6,
        backgroundColor: '#F5EAB9',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#EAC800',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(234, 212, 101, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#254E06',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#254E06',
        opacity: 0.7,
        textAlign: 'center',
        marginBottom: 24,
    },
    shopBtn: {
        backgroundColor: '#254E06',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    shopBtnText: {
        color: '#F5EAB9',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 2,
        borderTopColor: '#EAC800',
        elevation: 8,
        shadowColor: '#254E06',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    summaryContainer: {
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 16,
        color: '#254E06',
        fontWeight: '500',
    },
    summaryValue: {
        fontSize: 16,
        color: '#254E06',
        fontWeight: '600',
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#254E06',
        backgroundColor: '#EAD465',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    checkoutBtn: {
        backgroundColor: '#254E06',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        elevation: 4,
        shadowColor: '#254E06',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    checkoutText: {
        color: '#F5EAB9',
        fontSize: 18,
        fontWeight: 'bold',
    },
    checkoutBtnDisabled: {
        backgroundColor: '#8a8a8a',
        opacity: 0.7,
    },
});

export default CartScreen;