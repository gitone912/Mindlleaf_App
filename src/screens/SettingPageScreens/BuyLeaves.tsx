import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Alert,
  Platform,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateUserLeaves } from "../../api/paymentApi";
import { 
  getProducts, 
  initConnection, 
  requestPurchase, 
  finishTransaction, 
  withIAPContext, 
  useIAP 
} from "react-native-iap";
import { AppDispatch, RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById } from '../../store/slices/authSlice';

// Define product SKUs
const productSkus = [
  "com.mindleaf.leaves10",
  "com.mindleaf.leaves25",
  "com.mindleaf.leaves50"
];

const BuyLeavesPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const initIAP = async () => {
      try {
        console.log("Initializing IAP...");
        const connected = await initConnection();
        if (!connected) throw new Error("IAP connection failed");
        await fetchProducts();
      } catch (error) {
        console.error("IAP Init Error:", error);
        Alert.alert("IAP Error", "Failed to initialize In-App Purchases");
      }
    };

    initIAP();
    
    return () => {
      console.log("Ending IAP connection...");
    };
  }, []);

  // Fetch products from Play Store
  const fetchProducts = async () => {
    try {
      console.log("Fetching products...");
      const items = await getProducts({ skus: productSkus });
      console.log("Products fetched:", items);
      setProducts(items); // <-- Corrected this line to set fetched products in state
    } catch (error) {
      console.error("Error fetching products:", error);
      Alert.alert("Error", "Failed to load products");
    }
  };

  // Handle product purchase
  const handlePurchase = async (sku: string) => {
    try {
      console.log("Initiating purchase for:", sku);
      if (!sku) {
        Alert.alert("Error", "Invalid product SKU");
        return;
      }

      const purchase = await requestPurchase({ skus: [sku] });

      if (purchase) {
        console.log("Purchase Success:", purchase);
        if (Array.isArray(purchase)) {
          for (const p of purchase) {
            await finishTransaction({ purchase: p, isConsumable: true });
          }
        } else {
          await finishTransaction({ purchase, isConsumable: true });
        }

        // Get user data from AsyncStorage
        const userDataString = await AsyncStorage.getItem('userData');
        if (!userDataString) {
          throw new Error('User data not found');
        }
        const userData = JSON.parse(userDataString);

        // Prepare payment payload
        const paymentPayload = {
          userId: userData.user_id,
          leafAdded: getLeafAmount(sku), // You'll need to implement this helper function
          packageName: Platform.OS === 'android' ? 'com.mindleaf' : 'com.mindleaf.ios',
          productId: sku,
          purchaseToken: Array.isArray(purchase) ? purchase[0].transactionReceipt : purchase.transactionReceipt,
          platform: Platform.OS,
          receipt: Platform.OS === 'ios' ? Array.isArray(purchase) ? purchase[0].transactionReceipt : purchase.transactionReceipt : undefined
        };

        // Call the update leaves API
        const response = await updateUserLeaves(paymentPayload);
        if (userData.user_id) {
                await dispatch(fetchUserById(userData.user_id)); // Fetch updated user data
              }
        Alert.alert("Success", "Leaves have been added to your account!");
      }
    } catch (error: any) {
      console.error("Purchase error:", error);
      Alert.alert("Purchase Failed", error.message || "Failed to add leaves to your account");
    }
  };

  // Helper function to determine leaf amount based on SKU
  const getLeafAmount = (sku: string): number => {
    switch (sku) {
      case 'com.mindleaf.leaves10':
        return 10;
      case 'com.mindleaf.leaves25':
        return 25;
      case 'com.mindleaf.leaves50':
        return 50;
      default:
        return 0;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.titleWrapper}>
            <View style={styles.logoContainer}>
              <Image source={require('../../assets/leaf.png')} style={styles.image} />
            </View>
            <Text style={styles.title}>Buy Leaves</Text>
          </View>
          <Text style={styles.subtitle}>Purchase leaves to unlock more covers, extra voice minutes, one time reports and many more</Text>
        </View>
        
        {products.length > 0 ? (
          <View style={styles.plansContainer}>
            {products.map((product) => (
              <TouchableOpacity
                key={product.productId}
                style={styles.planBox}
                onPress={() => handlePurchase(product.productId)}
              >
                <View style={styles.planContent}>
                  <Text style={styles.planName}>{product.title}</Text>
                  <Text style={styles.description}>
                    Get {getLeafAmount(product.productId)} leaves
                  </Text>
                  <Text style={styles.priceText}>{product.localizedPrice}</Text>
                  <View style={styles.buyButton}>
                    <Text style={styles.buyButtonText}>Purchase Now</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#D4AF37" />
            <Text style={styles.loadingText}>Loading packages...</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: '#FCFAF0',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  logoContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#FCFAF0',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  image: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Ovo',
    color: '#000',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#A6A6A6',
    fontFamily: 'Inter-Regular',
    marginTop: 8,
    letterSpacing: 0.3,
    textAlign: 'center', // ✅ Center the text
  alignSelf: 'center', // ✅ Ensures it doesn’t stretch full width
  },
  plansContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  planBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    marginBottom: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  planContent: {
    alignItems: 'center',
  },
  planName: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'Inter-Regular',
  },
  priceText: {
    fontSize: 20,
    color: '#D4AF37',
    fontFamily: 'Inter-Medium',
    marginBottom: 15,
  },
  buyButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  buyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
});

export default withIAPContext(BuyLeavesPage);
