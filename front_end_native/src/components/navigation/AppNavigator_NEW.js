import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from 'react-redux';

// Import screens
import HomeScreen from "../../screens/HomeScreen/HomeScreen";
import ProductsScreen from "../../screens/ProductsScreen/ProductsScreen";
import ProductDetailsScreen from "../../screens/ProductsScreen/ProductDetailsScreen";
import EditProductScreen from "../../screens/ProductsScreen/EditProductScreen";
import ProfileScreen from "../../screens/ProfileScreen/ProfileScreen";
import CartScreen from "../../screens/CartScreen/CartScreen";
import LoginScreen from "../../screens/Auth/LoginScreen";
import RegisterScreen from "../../screens/Auth/RegisterScreen";

// Import constants
import COLORS from "../../constants/Colors";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const cartItems = useSelector((state) => state.cart.items);
  const cartItemsCount = cartItems.reduce((total, item) => total + item.qty, 0);

  return (
    <View style={styles.bottomNav}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const getIconName = () => {
          switch (route.name) {
            case 'Home':
              return isFocused ? 'home' : 'home-outline';
            case 'Products':
              return isFocused ? 'list' : 'list-outline';
            case 'Cart':
              return isFocused ? 'cart' : 'cart-outline';
            case 'Profile':
              return isFocused ? 'person-circle' : 'person-circle-outline';
            case 'Auth':
              return isFocused ? 'log-in' : 'log-in-outline';
            default:
              return 'square-outline';
          }
        };

        const getLabel = () => {
          switch (route.name) {
            case 'Home': return 'Home';
            case 'Products': return 'Products';
            case 'Cart': return 'Cart';
            case 'Profile': return 'Profile';
            case 'Auth': return 'Login';
            default: return route.name;
          }
        };

        return (
          <View
            key={route.key}
            style={[
              styles.navItem,
              isFocused && styles.navItemActive
            ]}
          >
            <View
              style={styles.tabButton}
              onStartShouldSetResponder={() => true}
              onResponderRelease={onPress}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name={getIconName()}
                  size={24}
                  color={isFocused ? COLORS.jonquil : COLORS.darkMossGreen}
                />
                {route.name === 'Cart' && cartItemsCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>
                      {cartItemsCount > 9 ? '9+' : cartItemsCount}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[
                styles.navText,
                isFocused && styles.navTextActive
              ]}>
                {getLabel()}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

// Products Stack Navigator (includes ProductsScreen and ProductDetailsScreen)
const ProductsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProductsList" component={ProductsScreen} />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = !!user;

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Home Screen */}
      <Tab.Screen name="Home" component={HomeScreen} />

      {/* Products Screen with Stack Navigator for Details */}
      <Tab.Screen
        name="Products"
        component={ProductsStack}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Reset Products stack when tab is pressed
            navigation.navigate('Products', { screen: 'ProductsList' });
          },
        })}
      />

      {/* Cart Screen */}
      <Tab.Screen name="Cart" component={CartScreen} />

      {/* Dynamic switch between Profile and Login based on login state */}
      {isLoggedIn ? (
        <Tab.Screen name="Profile" component={ProfileScreen} />
      ) : (
        <Tab.Screen name="Auth" component={LoginScreen} />
      )}
    </Tab.Navigator>
  );
};

// Main Stack Navigator - Contains TabNavigator and additional screens
const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{
          animationEnabled: false,
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: COLORS.vanilla,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: COLORS.darkMossGreen,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 12,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(37, 78, 6, 0.1)',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemActive: {
    transform: [{ scale: 1.1 }],
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: COLORS.darkMossGreen,
    fontWeight: '500',
  },
  navTextActive: {
    color: COLORS.jonquil,
    fontWeight: 'bold',
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: COLORS.jonquil,
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.vanilla,
    shadowColor: COLORS.darkMossGreen,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cartBadgeText: {
    color: COLORS.darkMossGreen,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 12,
  },
});

export default AppNavigator;