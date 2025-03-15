import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  Pressable, 
  View, 
  ScrollView, 
  Alert,
  Platform 
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

// Define product SKUs
const productSkus = [
  "com.mindleaf.leaves10",
  "com.mindleaf.leaves25",
  "com.mindleaf.leaves50"
];

const SubscriptionPage = () => {
  const [products, setProducts] = useState<any[]>([]);

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Buy Leaves</Text>
      
      {products.length > 0 ? (
        products.map((product) => (
          <Pressable key={product.productId} style={styles.productCard} onPress={() => handlePurchase(product.productId)}>
            <Text style={styles.productName}>{product.title}</Text>
            <Text style={styles.productPrice}>{product.localizedPrice}</Text>
          </Pressable>
        ))
      ) : (
        <Text>Loading products...</Text>
      )}
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  productCard: {
    backgroundColor: "#ffeb3b",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
});

export default withIAPContext(SubscriptionPage);
