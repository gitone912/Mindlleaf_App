import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import {
  isIosStorekit2,
  PurchaseError,
  requestSubscription,
  useIAP,
  initConnection,
  endConnection,
  finishTransaction,
  getAvailablePurchases,
  deepLinkToSubscriptions,
  SubscriptionPlatform,
  SubscriptionAndroid
} from 'react-native-iap';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Button, Heading } from '../../components';
import {
  constants,
  contentContainerStyle,
  errorLog,
  isAmazon,
  isIos,
  isPlay,
  colors,
} from '../../utils';
import { verifySubscription } from '../../api/paymentApi';
import { setLoading, setError, setSuccess } from '../../store/slices/paymentSlice';

// Storage keys
const STORAGE_KEYS = {
  OWNED_SUBSCRIPTIONS: 'owned_subscriptions',
  PURCHASE_HISTORY: 'purchase_history'
};

export const SubscriptionManager = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: { payment: { isLoading: boolean; error: string | null } }) => state.payment);
  const {
    connected,
    subscriptions,
    getSubscriptions,
    currentPurchase,
    availablePurchases,
    getAvailablePurchases: getAvailablePurchasesIAP,
  } = useIAP();
  
  const [ownedSubscriptions, setOwnedSubscriptions] = useState<string[]>([]);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize IAP connection and fetch subscriptions
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsInitializing(true);
        
        // Load any cached owned subscriptions
        const storedSubscriptions = await AsyncStorage.getItem(STORAGE_KEYS.OWNED_SUBSCRIPTIONS);
        if (storedSubscriptions) {
          setOwnedSubscriptions(JSON.parse(storedSubscriptions));
        }
        
        if (connected) {
          await fetchSubscriptions();
          await checkPurchaseHistory();
        }
      } catch (error) {
        errorLog({ message: 'Failed to initialize subscriptions', error });
        dispatch(setError('Failed to initialize subscription system'));
      } finally {
        setIsInitializing(false);
      }
    };

    initialize();
    
    // Clean up connection on unmount
    return () => {
      // Note: In a real app, you might want to manage IAP connection at a higher level
      // rather than ending it when this component unmounts
    };
  }, [connected]);

  // Fetch available subscriptions
  const fetchSubscriptions = async () => {
    try {
      await getSubscriptions({ skus: constants.subscriptionSkus });
    } catch (error) {
      errorLog({ message: 'Failed to fetch subscriptions', error });
      dispatch(setError('Failed to load subscription options'));
    }
  };

  // Check purchase history to restore subscriptions
  const checkPurchaseHistory = async () => {
    try {
      await getAvailablePurchasesIAP();
    } catch (error) {
      errorLog({ message: 'Failed to check purchase history', error });
    }
  };

  // Handle new purchases
  useEffect(() => {
    const processPurchase = async () => {
      try {
        if (currentPurchase?.productId) {
          dispatch(setLoading(true));
          
          // Validate receipt with backend before confirming purchase
          const isValid = await validateReceipt(currentPurchase);
          
          if (isValid) {
            // Finish the transaction only after validating with your server
            await finishTransaction({
              purchase: currentPurchase,
              isConsumable: false, // Subscriptions are not consumable
            });
            
            // Update owned subscriptions
            const updatedSubscriptions = [...ownedSubscriptions, currentPurchase.productId];
            setOwnedSubscriptions(updatedSubscriptions);
            await AsyncStorage.setItem(STORAGE_KEYS.OWNED_SUBSCRIPTIONS, JSON.stringify(updatedSubscriptions));
            
            dispatch(setSuccess(true));
            Alert.alert('Success', 'Your subscription was activated successfully');
          } else {
            dispatch(setError('Failed to verify subscription purchase'));
          }
        }
      } catch (error) {
        if (error instanceof PurchaseError) {
          errorLog({ message: `[${error.code}]: ${error.message}`, error });
          dispatch(setError(`Purchase error: ${error.message}`));
        } else {
          errorLog({ message: 'Error processing purchase', error });
          dispatch(setError('Failed to process subscription'));
        }
      } finally {
        dispatch(setLoading(false));
      }
    };

    processPurchase();
  }, [currentPurchase]);

  // Check for restored purchases
  useEffect(() => {
    const processRestoredPurchases = async () => {
      if (availablePurchases?.length > 0 && isRestoring) {
        try {
          const validSubscriptions = [];
          
          for (const purchase of availablePurchases) {
            // Check if the subscription is still valid
            if (isSubscriptionValid(purchase)) {
              validSubscriptions.push(purchase.productId);
              
              // Store receipt for verification purposes
              await storeReceiptData(purchase);
            }
          }
          
          if (validSubscriptions.length > 0) {
            setOwnedSubscriptions([...new Set([...ownedSubscriptions, ...validSubscriptions])]);
            await AsyncStorage.setItem(
              STORAGE_KEYS.OWNED_SUBSCRIPTIONS, 
              JSON.stringify([...new Set([...ownedSubscriptions, ...validSubscriptions])])
            );
            Alert.alert('Success', 'Your subscriptions have been restored');
          } else {
            Alert.alert('No Subscriptions', 'No active subscriptions were found');
          }
        } catch (error) {
          errorLog({ message: 'Error restoring purchases', error });
          dispatch(setError('Failed to restore subscriptions'));
        } finally {
          setIsRestoring(false);
        }
      }
    };
    
    processRestoredPurchases();
  }, [availablePurchases, isRestoring]);

  // Validate receipt with backend
  const validateReceipt = async (purchase:any) => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const userDataObj = userData ? JSON.parse(userData) : null;
      const userId = userDataObj?.user_id;
      
      if (!userId) {
        errorLog({ message: 'User ID not found for receipt validation', error: new Error('User ID not found') });
        return false;
      }
      
      // Store receipt data for future reference
      await storeReceiptData(purchase);
      
      // Different verification based on platform
      if (isIos) {
        // For iOS, send the receipt and transaction details
        const receipt = purchase.transactionReceipt;
        const transactionId = purchase.transactionId;
        
        // const response = await verifySubscription({
        //   userId,
        //   platform: 'ios',
        //   transactionId,
        //   subscriptionId: purchase.productId,
        // });
        
        // return response.success;
      } else if (isPlay) {
        // For Google Play, send the purchase token
        const purchaseToken = purchase.purchaseToken;
        const packageName = 'com.mindleaf.app'; // Get this from your app config
        
        // Get subscription details from purchase or metadata
        const subscription = subscriptions.find(s => s.productId === purchase.productId);
        const subscriptionName = subscription?.title || 'pro';
        
        const response = await verifySubscription({
          userId,
          packageName,
          subscriptionName,
          subscriptionId: purchase.productId,
          purchaseToken,
          platform: 'android',
          subscriptionExpiry:'123456'
        });
        
        return response.success;
      } else if (isAmazon) {
        // For Amazon, handle accordingly
        const receiptId = purchase.receiptId;
        const userId = purchase.userId;
        
        // const response = await verifySubscription({
        //   userId,
        //   platform: 'amazon',
        //   receiptId,
        //   userId: purchase.userIdAmazon,
        //   subscriptionId: purchase.productId,
        // });
        
        // return response.success;
      }
      
      return false;
    } catch (error) {
      errorLog({ message: 'Receipt validation failed', error });
      return false;
    }
  };

  // Store receipt data for future reference
  const storeReceiptData = async (purchase:any) => {
    try {
      const purchaseHistory = await AsyncStorage.getItem(STORAGE_KEYS.PURCHASE_HISTORY) || '{}';
      const parsedHistory = JSON.parse(purchaseHistory);
      
      parsedHistory[purchase.productId] = {
        ...purchase,
        timestamp: Date.now(),
      };
      
      await AsyncStorage.setItem(STORAGE_KEYS.PURCHASE_HISTORY, JSON.stringify(parsedHistory));
    } catch (error) {
      errorLog({ message: 'Failed to store receipt data', error });
    }
  };

  // Check if a subscription is still valid
  const isSubscriptionValid = (purchase:any) => {
    try {
      if (isIos) {
        // For iOS, check the expirationDate if available
        if (purchase.expirationDate) {
          const expiryDate = new Date(purchase.expirationDate);
          return expiryDate > new Date();
        }
        return true; // If no expiration date, assume it's valid
      } else if (isPlay) {
        // For Android, check if the subscription is still active
        return purchase.purchaseStateAndroid === 1; // PURCHASED state
      } else if (isAmazon) {
        // For Amazon, check the entitlement status
        return purchase.entitled;
      }
      return false;
    } catch (error) {
      errorLog({ message: 'Error checking subscription validity', error });
      return false;
    }
  };

  // Handle subscription purchase
  const handleBuySubscription = async (productId:any) => {
    try {
      dispatch(setLoading(true));
      
      const subscription = subscriptions.find(s => s.productId === productId);
      
      if (!subscription) {
        throw new Error('Subscription product not found');
      }
      
      console.log('Starting subscription purchase for:', productId);
      
      // Check if this is a Google Play subscription with offer details
      if (isPlay && 
          subscription.platform === SubscriptionPlatform.android && 
          subscription.subscriptionOfferDetails?.length > 0) {
        // Get all available offer tokens for Google Play
        const offerDetails = subscription.subscriptionOfferDetails;
        
        // You might want to select a specific offer based on your business logic
        // For now, we'll use the first base plan offer
        const basePlanOffer = offerDetails.find(offer => 
          offer.offerTags?.includes('BASE_PLAN') || !offer.offerTags?.length
        ) || offerDetails[0];
        
        const offerToken = basePlanOffer.offerToken;
        console.log('Using offer token:', offerToken);
        
        await requestSubscription({
          sku: productId,
          subscriptionOffers: [{ sku: productId, offerToken }],
        });
      } else {
        // For iOS or Amazon
        await requestSubscription({
          sku: productId,
          // For iOS, you might want to handle promotional offers
          // withOffer: promotionalOffer ? { offerIdentifier: promotionalOffer.identifier } : undefined,
        });
      }
      
      // Note: Actual purchase processing is handled in the currentPurchase useEffect
      
    } catch (error) {
      let errorMessage = 'Subscription purchase failed';
      
      if (error instanceof PurchaseError) {
        // Handle specific purchase errors
        switch (error.code) {
          case 'E_USER_CANCELLED':
            errorMessage = 'Purchase was cancelled';
            break;
          case 'E_ALREADY_OWNED':
            errorMessage = 'You already own this subscription';
            // Refresh the owned subscriptions
            await checkPurchaseHistory();
            break;
          case 'E_NETWORK_ERROR':
            errorMessage = 'Network error. Please check your connection';
            break;
          case 'E_SERVICE_ERROR':
            errorMessage = 'Store service error. Please try again later';
            break;
          default:
            errorMessage = `${error.message} (Error ${error.code})`;
        }
      }
      
      console.error('Subscription error:', { error, productId });
      dispatch(setError(errorMessage));
      Alert.alert('Subscription Error', errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Restore purchases
  const handleRestorePurchases = async () => {
    try {
      setIsRestoring(true);
      dispatch(setLoading(true));
      
      await getAvailablePurchasesIAP();
      
      // Processing happens in the availablePurchases useEffect
      
    } catch (error) {
      errorLog({ message: 'Error restoring purchases', error });
      dispatch(setError('Failed to restore purchases'));
      setIsRestoring(false);
      dispatch(setLoading(false));
    }
  };

  if (isInitializing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.green} />
        <Text style={styles.loadingText}>Initializing subscription system...</Text>
      </View>
    );
  }

  if (!connected) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Store not connected</Text>
        <View style={styles.button}>
          <Button 
            title="Retry Connection" 
            onPress={async () => {
              try {
                await initConnection();
                // Component will re-render when connected state changes
              } catch (error) {
                errorLog({ message: 'Failed to connect to store', error });
                Alert.alert('Connection Error', 'Failed to connect to the store. Please try again later.');
              }
            }} 
          />
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={contentContainerStyle}>
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.green} />
          <Text style={styles.loadingText}>
            {isRestoring ? 'Restoring subscriptions...' : 'Processing subscription...'}
          </Text>
        </View>
      ) : (
        <Box>
          <View style={styles.container}>
            <Heading copy="Available Subscriptions" />
            
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
  
            {subscriptions.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.noDataText}>No subscriptions available</Text>
              </View>
            ) : (
              <>
                {subscriptions.map((subscription) => {
  const owned = ownedSubscriptions.includes(subscription.productId);
  
  // Type guard to safely access subscriptionOfferDetails
  const isAndroidSubscription = subscription.platform === SubscriptionPlatform.android;
  const subscriptionOfferDetails = isAndroidSubscription 
    ? (subscription as SubscriptionAndroid).subscriptionOfferDetails 
    : undefined;
  
  const isBasePlan = !subscriptionOfferDetails || 
                      subscriptionOfferDetails.some(offer => 
                        offer.offerTags?.includes('BASE_PLAN') || !offer.offerTags?.length);
  
  return (
    <View key={subscription.productId} style={styles.subscriptionCard}>
      <Text style={styles.planName}>{subscription.title}</Text>
      <Text style={styles.description}>{subscription.description}</Text>
      
      {isPlay && isAndroidSubscription && subscriptionOfferDetails && (
        <Text style={styles.offerText}>
          {subscriptionOfferDetails[0]?.pricingPhases?.pricingPhaseList?.[0]?.formattedPrice || ''}
          {subscriptionOfferDetails[0]?.pricingPhases?.pricingPhaseList?.[0]?.billingPeriod ? 
            ` / ${subscriptionOfferDetails[0].pricingPhases.pricingPhaseList[0].billingPeriod}` : ''}
        </Text>
      )}
                      
                      {owned ? (
                        <View style={styles.subscribedBadge}>
                          <Text style={styles.subscribedText}>Active</Text>
                        </View>
                      ) : (
                        <View style={styles.subscribeButton}>
                          <Button
                            title="Subscribe Now"
                            onPress={() => handleBuySubscription(subscription.productId)}
                          />
                        </View>
                      )}
                    </View>
                  );
                })}
              </>
            )}
            
            <View style={styles.restoreContainer}>
              <View style={styles.restoreButton}>
                {!(isLoading || isRestoring) ? (
                  <Button
                    title="Restore Purchases"
                    onPress={handleRestorePurchases}
                  />
                ) : (
                  <ActivityIndicator size="small" color={colors.green} />
                )}
              </View>
            </View>
            
            {ownedSubscriptions.length > 0 && (
              <View style={styles.activeSubscriptionsContainer}>
                <Heading copy="Active Subscriptions" />
                {ownedSubscriptions.map((productId) => {
                  const subscription = subscriptions.find(s => s.productId === productId);
                  if (!subscription) return null;
                  
                  return (
                    <View key={`active-${productId}`} style={styles.activeSubscriptionCard}>
                      <Text style={styles.activePlanName}>{subscription.title}</Text>
                      <Text style={styles.activeDescription}>{subscription.description}</Text>
                      <View style={styles.manageButton}>
                        <Button
                          title="Manage Subscription"
                          onPress={() => deepLinkToSubscriptions({ sku: productId })}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </Box>
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  subscriptionCard: {
    backgroundColor: '#ffeb3b',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    color: colors.gray600,
    marginBottom: 16,
    textAlign: 'center',
  },
  offerText: {
    fontSize: 14,
    color: colors.gray500,
    fontWeight: '500',
    marginBottom: 10,
  },
  subscribedBadge: {
    backgroundColor: colors.green,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'center',
  },
  subscribedText: {
    color: 'white',
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.gray600,
  },
  errorText: {
    color: colors.red,
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: '#ffeeee',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    color: colors.gray600,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  restoreContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  restoreButton: {
    backgroundColor: colors.blue,
  },
  subscribeButton: {
    width: '80%',
  },
  activeSubscriptionsContainer: {
    marginTop: 30,
  },
  activeSubscriptionCard: {
    backgroundColor: colors.green,
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  activePlanName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  activeDescription: {
    fontSize: 14,
    color: colors.gray100,
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.blue,
    padding: 10,
    borderRadius: 5,
  },
  manageButton: {
    backgroundColor: colors.green,
    width: '80%',
  },
});