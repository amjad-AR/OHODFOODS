import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
    Dimensions,
    Animated
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const SECTION_PADDING = 24;
const CARD_SPACING = 16;
const CARD_WIDTH = (width - SECTION_PADDING * 2 - CARD_SPACING * 2) / 3;

const Colors = {
    LightBackground: "#F5EAB9",
    PrimaryAccent: "#EAC800",
    DarkGreen: "#254E06",
    MutedGreen: "#8C9531",
    White: "#FFFFFF",
    Gold: "#EAD465",
    LightGold: "#FFF9E6"
};

const DUMMY_DATA = [
    {
        id: "1",
        name: "Premium Almond Flour",
        desc: "Gluten Free • Organic",
        price: "45.99",
        rating: "4.8",
        img: require('../../../assets/photo/T11.jpg'),
    },
    {
        id: "2",
        name: "Artisan Bread",
        desc: "Multigrain • Fresh",
        price: "32.50",
        rating: "4.9",
        img: require('../../../assets/photo/T12.jpg'),
    },
    {
        id: "3",
        name: "Cold Pressed Juice",
        desc: "100% Natural • No Sugar",
        price: "28.75",
        rating: "4.7",
        img: require('../../../assets/photo/T13.jpg'),
    },
    {
        id: "4",
        name: "Oat Delight Cake",
        desc: "Healthy • Delicious",
        price: "38.25",
        rating: "4.6",
        img: require('../../../assets/photo/T14.jpg'),
    },
];

const ProductCard = ({ item, index }) => {
    const scaleAnim = new Animated.Value(1);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View
            style={[
                styles.cardContainer,
                {
                    width: CARD_WIDTH,
                    marginRight: CARD_SPACING,
                    transform: [{ scale: scaleAnim }]
                },
            ]}
        >
            <TouchableOpacity
                activeOpacity={0.9}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                {/* Premium Badge */}
                <View style={styles.premiumBadge}>
                    <Ionicons name="diamond" size={12} color={Colors.White} />
                    <Text style={styles.premiumText}>PREMIUM</Text>
                </View>

                {/* Product Image */}
                <View style={styles.imageWrapper}>
                    <Image
                        source={item.img}
                        style={styles.productImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Card Content */}
                <View style={styles.cardContent}>
                    {/* Rating Row */}
                    <View style={styles.ratingRow}>
                        <View style={styles.starContainer}>
                            <Ionicons name="star" size={14} color={Colors.PrimaryAccent} />
                            <Text style={styles.ratingText}>{item.rating}</Text>
                        </View>
                        <View style={styles.favoriteIcon}>
                            <Ionicons name="heart-outline" size={16} color={Colors.MutedGreen} />
                        </View>
                    </View>

                    {/* Product Info */}
                    <View style={styles.textContainer}>
                        <Text style={styles.productName} numberOfLines={2}>
                            {item.name}
                        </Text>
                        <Text style={styles.productDescription} numberOfLines={1}>
                            {item.desc}
                        </Text>
                    </View>

                    {/* Price & Action */}
                    <View style={styles.priceRow}>
                        <Text style={styles.productPrice}>${item.price}</Text>
                        <TouchableOpacity style={styles.addButton}>
                            <Ionicons name="add" size={18} color={Colors.DarkGreen} />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const ProductSection = ({ title, data, navigation }) => {
    const flatListRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = prevIndex + 1;
                if (nextIndex > data.length - 3) {
                    flatListRef.current?.scrollToIndex({ animated: true, index: 0 });
                    return 0;
                } else {
                    flatListRef.current?.scrollToIndex({
                        animated: true,
                        index: nextIndex,
                    });
                    return nextIndex;
                }
            });
        }, 4000);

        return () => clearInterval(interval);
    }, [data.length]);

    return (
        <Animated.View style={[styles.productSection, { opacity: fadeAnim }]}>
            <View style={styles.sectionHeader}>
                <View style={styles.titleContainer}>
                    <Text style={styles.sectionTitle}>{title}</Text>
                    <View style={styles.titleUnderline} />
                </View>
                <TouchableOpacity
                    style={styles.seeAllButton}
                    onPress={() => navigation.navigate('Products')}
                >
                    <Text style={styles.seeAllText}>View All</Text>
                    <Ionicons
                        name="arrow-forward"
                        size={16}
                        color={Colors.DarkGreen}
                    />
                </TouchableOpacity>
            </View>

            <FlatList
                ref={flatListRef}
                data={data}
                horizontal
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => <ProductCard item={item} index={index} />}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatListContent}
                snapToInterval={CARD_WIDTH + CARD_SPACING}
                decelerationRate="fast"
                getItemLayout={(data, index) => ({
                    length: CARD_WIDTH + CARD_SPACING,
                    offset: (CARD_WIDTH + CARD_SPACING) * index,
                    index,
                })}
            />
        </Animated.View>
    );
};

const HomeScreen = ({ navigation }) => {
    const [activeCategory, setActiveCategory] = useState('All');
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    const categories = ['All', 'Raw Materials', 'Ready Meals', 'Beverages', 'Snacks'];

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.scrollContainer, { opacity: fadeAnim }]}>
                <ScrollView
                    contentContainerStyle={styles.scrollViewContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Premium Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <View style={styles.logoContainer}>
                                <Ionicons name="leaf" size={28} color={Colors.DarkGreen} />
                                <Text style={styles.logoText}>OHODFOODS</Text>
                            </View>
                            <Text style={styles.headerSubtitle}>Premium Quality</Text>
                        </View>
                        <View style={styles.headerRight}>
                            <TouchableOpacity style={styles.iconButton}>
                                <Ionicons name="search" size={24} color={Colors.DarkGreen} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cartIcon}>
                                <Ionicons name="cart" size={24} color={Colors.DarkGreen} />
                                <View style={styles.cartBadge}>
                                    <Text style={styles.cartBadgeText}>3</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Hero Section */}
                    <View style={styles.heroSection}>
                        <View style={styles.heroBackground} />
                        <View style={styles.heroContent}>
                            <View style={styles.heroTextContainer}>
                                <Text style={styles.heroTitle}>Elevate Your{"\n"}Health Journey</Text>
                                <Text style={styles.heroSubtitle}>
                                    Discover premium gluten-free products crafted for your wellness
                                </Text>
                                <TouchableOpacity style={styles.heroButton}>
                                    <Text style={styles.heroButtonText}>Explore Collection</Text>
                                    <Ionicons name="arrow-forward" size={18} color={Colors.White} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.heroImageContainer}>
                                <Ionicons name="nutrition" size={90} color={Colors.DarkGreen} />
                            </View>
                        </View>
                    </View>

                    {/* Categories */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.categoriesScroll}
                        contentContainerStyle={styles.categoriesContainer}
                    >
                        {categories.map((category, index) => (
                            <TouchableOpacity
                                key={category}
                                style={[
                                    styles.categoryButton,
                                    activeCategory === category && styles.categoryButtonActive
                                ]}
                                onPress={() => setActiveCategory(category)}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    activeCategory === category && styles.categoryTextActive
                                ]}>
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Featured Products */}
                    <ProductSection title="Featured Products" data={DUMMY_DATA} navigation={navigation} />

                    {/* Premium Quality Section */}
                    <View style={styles.premiumSection}>
                        <View style={styles.premiumContent}>
                            <Ionicons name="diamond" size={40} color={Colors.DarkGreen} />
                            <Text style={styles.premiumTitle}>Premium Quality</Text>
                            <Text style={styles.premiumDescription}>
                                All our products are certified gluten-free and made with the finest ingredients
                            </Text>
                        </View>
                    </View>

                    {/* Best Sellers */}
                    <ProductSection title="Best Sellers" data={DUMMY_DATA} navigation={navigation} />
                </ScrollView>
            </Animated.View>
            {/* Premium Bottom Navigation */}
            {/* <View style={styles.bottomNav}>
                {['home', 'grid', 'cart', 'person'].map((icon, index) => (
                    <TouchableOpacity
                        key={icon}
                        style={[
                            styles.navItem,
                            index === 0 && styles.navItemActive
                        ]}
                    >
                        <Ionicons
                            name={index === 0 ? icon : `${icon}-outline`}
                            size={24}
                            color={index === 0 ? Colors.DarkGreen : Colors.MutedGreen}
                        />
                        <Text style={[
                            styles.navText,
                            index === 0 && styles.navTextActive
                        ]}>
                            {icon === 'home' ? 'Home' :
                                icon === 'grid' ? 'Products' :
                                    icon === 'cart' ? 'Cart' : 'Profile'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F2ED',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 100,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: SECTION_PADDING,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerLeft: {
        flexDirection: 'column',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    logoText: {
        fontSize: 28,
        fontWeight: "bold",
        color: Colors.DarkGreen,
        marginLeft: 8,
        fontFamily: 'System',
    },
    headerSubtitle: {
        fontSize: 14,
        color: Colors.MutedGreen,
        fontWeight: '500',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconButton: {
        padding: 8,
    },
    cartIcon: {
        padding: 8,
        position: 'relative',
    },
    cartBadge: {
        backgroundColor: Colors.PrimaryAccent,
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        top: 4,
        right: 4,
        borderWidth: 2,
        borderColor: Colors.LightBackground,
    },
    cartBadgeText: {
        color: Colors.DarkGreen,
        fontSize: 10,
        fontWeight: "bold",
    },
    heroSection: {
        marginHorizontal: SECTION_PADDING,
        borderRadius: 30,
        marginBottom: 30,
        height: 200,
        overflow: 'hidden',
        position: 'relative',
    },
    heroBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.Gold,
    },
    heroContent: {
        flexDirection: "row",
        alignItems: "center",
        padding: 30,
        height: '100%',
    },
    heroTextContainer: {
        flex: 1,
    },
    heroTitle: {
        fontSize: 26,
        fontWeight: "bold",
        color: Colors.DarkGreen,
        marginBottom: 8,
        lineHeight: 32,
    },
    heroSubtitle: {
        fontSize: 14,
        color: Colors.DarkGreen,
        opacity: 0.8,
        marginBottom: 20,
        lineHeight: 20,
    },
    heroButton: {
        backgroundColor: Colors.DarkGreen,
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        shadowColor: Colors.DarkGreen,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    heroButtonText: {
        color: Colors.White,
        fontSize: 14,
        fontWeight: "bold",
    },
    heroImageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.White,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.DarkGreen,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    categoriesScroll: {
        marginBottom: 30,
    },
    categoriesContainer: {
        paddingHorizontal: SECTION_PADDING,
        gap: 12,
    },
    categoryButton: {
        backgroundColor: Colors.White,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: Colors.DarkGreen,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    categoryButtonActive: {
        backgroundColor: Colors.DarkGreen,
        borderColor: Colors.DarkGreen,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.MutedGreen,
    },
    categoryTextActive: {
        color: Colors.White,
    },
    productSection: {
        marginBottom: 40,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: SECTION_PADDING,
        marginBottom: 25,
    },
    titleContainer: {
        alignItems: 'flex-start',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: Colors.DarkGreen,
        marginBottom: 6,
    },
    titleUnderline: {
        width: 40,
        height: 3,
        backgroundColor: Colors.PrimaryAccent,
        borderRadius: 2,
    },
    seeAllButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.White,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        shadowColor: Colors.DarkGreen,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    seeAllText: {
        fontSize: 14,
        color: Colors.DarkGreen,
        marginRight: 6,
        fontWeight: '600',
    },
    flatListContent: {
        paddingHorizontal: SECTION_PADDING,
    },
    cardContainer: {
        height: 220,
        borderRadius: 24,
        backgroundColor: "transparent",
        position: "relative",
        marginTop: 40,
        shadowColor: Colors.DarkGreen,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    premiumBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: Colors.DarkGreen,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        zIndex: 10,
        gap: 4,
    },
    premiumText: {
        color: Colors.White,
        fontSize: 10,
        fontWeight: 'bold',
    },
    cardContent: {
        width: "100%",
        height: "100%",
        backgroundColor: Colors.White,
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 50,
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: 'rgba(37, 78, 6, 0.1)',
    },
    imageWrapper: {
        position: "absolute",
        top: -30,
        left: (CARD_WIDTH - 80) / 2,
        zIndex: 5,
        shadowColor: Colors.DarkGreen,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 10,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: Colors.White,
        backgroundColor: Colors.White,
    },
    ratingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    starContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.LightGold,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: "bold",
        color: Colors.DarkGreen,
    },
    favoriteIcon: {
        padding: 4,
    },
    textContainer: {
        marginBottom: 12,
    },
    productName: {
        fontSize: 15,
        fontWeight: "bold",
        color: Colors.DarkGreen,
        marginBottom: 6,
        lineHeight: 18,
    },
    productDescription: {
        fontSize: 12,
        color: Colors.MutedGreen,
        lineHeight: 16,
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    productPrice: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.DarkGreen,
    },
    addButton: {
        backgroundColor: Colors.PrimaryAccent,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.DarkGreen,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    premiumSection: {
        marginHorizontal: SECTION_PADDING,
        backgroundColor: Colors.White,
        borderRadius: 24,
        padding: 30,
        marginBottom: 40,
        alignItems: 'center',
        shadowColor: Colors.DarkGreen,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    premiumContent: {
        alignItems: 'center',
    },
    premiumTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.DarkGreen,
        marginTop: 12,
        marginBottom: 8,
    },
    premiumDescription: {
        fontSize: 14,
        color: Colors.MutedGreen,
        textAlign: 'center',
        lineHeight: 20,
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: Colors.White,
        paddingVertical: 16,
        paddingHorizontal: SECTION_PADDING,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: Colors.DarkGreen,
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 12,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navItemActive: {
        transform: [{ scale: 1.1 }],
    },
    navText: {
        fontSize: 12,
        color: Colors.MutedGreen,
        marginTop: 6,
        fontWeight: '500',
    },
    navTextActive: {
        color: Colors.DarkGreen,
        fontWeight: 'bold',
    },
 
});

export default HomeScreen;