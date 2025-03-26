import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, Alert, Image, TouchableOpacity } from 'react-native';
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
        const subscriptionName = subscription?.title || purchase.productId;
        
        const response = await verifySubscription({
          userId,
          packageName,
          subscriptionName,
          subscriptionId: purchase.productId,
          purchaseToken,
          platform: 'android',
          subscriptionExpiry: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'ddMMyyyy')
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
    <ScrollView contentContainerStyle={styles.scrollView}>
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#D4AF37" />
          <Text style={styles.loadingText}>
            {isRestoring ? 'Restoring subscriptions...' : 'Processing subscription...'}
          </Text>
        </View>
      ) : (
        <Box >
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <View style={styles.titleWrapper}>
                <Text style={styles.title}>Premium Subscriptions</Text>
              </View>
              <Text style={styles.subtitle}>Choose your plan to unlock all features</Text>
              <Text style={styles.subtitle}>all plans are monthly: P1M - Per 1 month</Text>
            </View>
  
            {subscriptions.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.noDataText}>No subscriptions available</Text>
              </View>
            ) : (
              <View style={styles.plansContainer}>
                {subscriptions.map((subscription) => {
                  const owned = ownedSubscriptions.includes(subscription.productId);
                  const isAndroidSubscription = subscription.platform === SubscriptionPlatform.android;
                  const subscriptionOfferDetails = isAndroidSubscription 
                    ? (subscription as SubscriptionAndroid).subscriptionOfferDetails 
                    : undefined;
                  
                  return (
                    <View key={subscription.productId} style={styles.planBox}>
                      <View style={styles.planContent}>
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
                          <TouchableOpacity
                            style={styles.subscribeButton}
                            onPress={() => handleBuySubscription(subscription.productId)}
                          >
                            <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.restoreButton}
              onPress={handleRestorePurchases}
              disabled={isLoading || isRestoring}
            >
              {!(isLoading || isRestoring) ? (
                <Text style={styles.restoreButtonText}>Restore Purchases</Text>
              ) : (
                <ActivityIndicator size="small" color="#D4AF37" />
              )}
            </TouchableOpacity>
          </View>
        </Box>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: '#FCFAF0',
    
  },
  mainContainer: {
    flex: 1,
    backgroundColor:'#FCFAF0'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor:'#FCFAF0'
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10, // Adjust spacing between image and text
  },
  
  subtitle: {
    fontSize: 15,
    color: '#A6A6A6',
    fontFamily: 'Inter-Regular',
    marginBottom: 5,
    letterSpacing: 0.3,
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
    width: '100%',
    marginBottom: 15,
    fontFamily: 'Inter-Regular',
    paddingHorizontal: 10,
  },
  offerText: {
    fontSize: 20,
    color: '#D4AF37',
    fontFamily: 'Inter-Medium',
    marginBottom: 15,
  },
  subscribeButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  subscribeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  subscribedBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  subscribedText: {
    color: '#D4AF37',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  restoreButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  restoreButtonText: {
    color: '#D4AF37',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  centerContainer: {
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
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  errorText: {
    color: '#FF6B6B',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    width: '100%',
  },
  
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Ovo',
    color: '#000',
    letterSpacing: 0.5,
    textAlign: 'center',
    lineHeight: 50, // This helps vertically align with the logo
  },
  
});