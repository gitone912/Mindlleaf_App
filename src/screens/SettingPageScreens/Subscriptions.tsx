import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {format} from 'date-fns';
import {
  isIosStorekit2,
  PurchaseError,
  requestSubscription,
  useIAP,
} from 'react-native-iap';
import {useDispatch, useSelector} from 'react-redux';

import {Box, Button, Heading, Row, State} from '../../components';
import {
  constants,
  contentContainerStyle,
  errorLog,
  isAmazon,
  isIos,
  isPlay,
  colors,
} from '../../utils';
import {verifySubscription} from '../../api/paymentApi';
import {setLoading, setError, setSuccess} from '../../store/slices/paymentSlice';

export const BuySubscriptions = () => {
  const dispatch = useDispatch();
  const {isLoading} = useSelector((state: any) => state.payment);
  const {
    connected,
    subscriptions,
    getSubscriptions,
    currentPurchase,
    finishTransaction,
  } = useIAP();
  const [ownedSubscriptions, setOwnedSubscriptions] = useState<string[]>([]);
  const handleGetSubscriptions = async () => {
    try {
      await getSubscriptions({skus: constants.subscriptionSkus});
    } catch (error) {
      errorLog({message: 'handleGetSubscriptions', error});
    }
  };

  useEffect(() => {
    handleGetSubscriptions();
  }, []);

  const handleBuySubscription = async (productId: string) => {
    dispatch(setLoading(true));
    try {
      const subscription = subscriptions.find(s => s.productId === productId);
      
      console.log('Subscription details:', subscription);

      if (isPlay && subscription?.subscriptionOfferDetails) {
        // Get the first available offer token for Google Play
        const offerToken = subscription.subscriptionOfferDetails[0]?.offerToken;
        console.log('Using offer token:', offerToken);

        const purchase = await requestSubscription({
          sku: productId,
          subscriptionOffers: [{sku: productId, offerToken}],
        });

        console.log('Purchase response:', purchase);
        
        
        const userData = await AsyncStorage.getItem('userData');
      const userDataObj = userData ? JSON.parse(userData) : null;
      const userId = userDataObj?.user_id;

      if (purchase && userId) {
        const expiryDate = format(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), 'ddMMyyyy');
        await verifySubscription({
          userId,
          packageName: 'com.mindleaf.app',
          subscriptionName: 'Premium Plan',
          subscriptionId: productId,
          purchaseToken: purchase.purchaseTokenAndroid || '',
          subscriptionExpiry: expiryDate,
        });
        dispatch(setSuccess(true));
      }
      } else {
        // For non-Google Play stores
        const purchase = await requestSubscription({
          sku: productId,
        });
        
        console.log('Purchase response:', purchase);
      }

      
    } catch (error) {
      console.error('Subscription error details:', {
        error,
        productId,
        subscription: subscriptions.find(s => s.productId === productId)
      });
      if (error instanceof PurchaseError) {
        dispatch(setError(`[${error.code}]: ${error.message}`));
      } else {
        dispatch(setError('Purchase failed'));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    const checkCurrentPurchase = async () => {
      try {
        if (currentPurchase?.productId) {
          await finishTransaction({
            purchase: currentPurchase,
            isConsumable: true,
          });

          setOwnedSubscriptions(prev => [...prev, currentPurchase?.productId]);
        }
      } catch (error) {
        if (error instanceof PurchaseError) {
          errorLog({message: `[${error.code}]: ${error.message}`, error});
        } else {
          errorLog({message: 'handleBuyProduct', error});
        }
      }
    };

    checkCurrentPurchase();
  }, [currentPurchase, finishTransaction]);

  if (!connected) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Store not connected</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={contentContainerStyle}>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.green} />
          <Text style={styles.loadingText}>Processing subscription...</Text>
        </View>
      ) : (
        <Box>
          <View style={styles.container}>
            <Heading copy="Available Subscriptions" />
            {subscriptions.length === 0 ? (
              <Text style={styles.noDataText}>No subscriptions available</Text>
            ) : (
              subscriptions.map((subscription, index) => {
                const owned = ownedSubscriptions.includes(subscription.productId);
                return (
                  <View key={subscription.productId} style={styles.subscriptionCard}>
                    <Text style={styles.planName}>{subscription.title}</Text>
                    <Text style={styles.price}>{subscription.localizedPrice}</Text>
                    <Text style={styles.description}>{subscription.description}</Text>
                    
                    {owned ? (
                      <View style={styles.subscribedBadge}>
                        <Text style={styles.subscribedText}>Active</Text>
                      </View>
                    ) : (
                      <Button
                        title="Subscribe Now"
                        onPress={() => handleBuySubscription(subscription.productId)}
                      />
                    )}
                  </View>
                );
              })
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
    backgroundColor: '#ffeb3b', // Changed to match BuyLeaves yellow background
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
  },
  subscribedBadge: {
    backgroundColor: colors.green,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
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
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    color: colors.gray600,
  },
});