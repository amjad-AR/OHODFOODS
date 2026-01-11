import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from 'react-redux';

// استيراد الشاشات
import HomeScreen from "../../screens/HomeScreen/HomeScreen";
import ProductsScreen from "../../screens/ProductsScreen/ProductsScreen";
import ProfileScreen from "../../screens/ProfileScreen/ProfileScreen";
import CartScreen from "../../screens/CartScreen/CartScreen";
import LoginScreen from "../../screens/Auth/LoginScreen";

// استيراد الثوابت
import COLORS from "../../constants/Colors";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  // الحصول على حالة تسجيل الدخول من Redux
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = !!user; // true إذا كان المستخدم مسجل دخول

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.jonquil,
        tabBarInactiveTintColor: COLORS.darkMossGreen,
        tabBarStyle: {
          backgroundColor: COLORS.vanilla,
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      {/* شاشة الرئيسية */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "الرئيسية",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      {/* 2. شاشة المنتجات */}
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          tabBarLabel: "المنتجات",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" color={color} size={size} />
          ),
        }}
      />

      {/* 3. شاشة السلة */}
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: "السلة",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" color={color} size={size} />
          ),
        }}
      />

      {/* ******************************************************
      4. التبديل الديناميكي: البروفايل (مسجل) أو تسجيل الدخول (غير مسجل)
      ****************************************************** */}
      {isLoggedIn ? (
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "البروفايل",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="person-circle-outline"
                color={color}
                size={size}
              />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name="Auth"
          component={LoginScreen}
          options={{
            tabBarLabel: "تسجيل الدخول", // تغيير النص إلى العربي
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="log-in-outline" color={color} size={size} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default TabNavigator;