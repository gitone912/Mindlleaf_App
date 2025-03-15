import {Platform} from 'react-native';

import {isAmazon} from 'react-native-iap/src/internal';

const productSkus = Platform.select({
  ios: ['com.cooni.point1000', 'com.cooni.point5000'],

  android: [
    'com.mindleaf.leaves10',
    'com.mindleaf.leaves25',
    'com.mindleaf.leaves50',
  ],

  default: [],
}) as string[];

const subscriptionSkus = Platform.select({
  ios: ['com.cooni.sub1000', 'com.cooni.sub5000'],
  android: isAmazon
    ? [
        'com.amazon.sample.iap.subscription.mymagazine.month',
        'com.amazon.sample.iap.subscription.mymagazine.quarter',
      ]
    : ['com.mindleaf.subscription','com.mindleaf.subscription2'],
  default: [],
}) as string[];
const amazonBaseSku = 'com.amazon.sample.iap.subscription.mymagazine';
export const constants = {
  productSkus,
  subscriptionSkus,
  amazonBaseSku,
};
