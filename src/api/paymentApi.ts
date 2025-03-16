import { BASE_URL_AUTH } from "./baseUrls";

export const updateUserLeaves = async (payload: {
  userId: string;
  leafAdded: number;
  packageName: string;
  productId: string;
  purchaseToken: string;
  platform?: string;
  receipt?: string;
}) => {
  console.log('Sending payment payload:', payload);
  
  const response = await fetch(`${BASE_URL_AUTH}/v1/iap/add-leaves`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  console.log('Payment API response status:', response.status);
  
  // Handle non-JSON responses
  let data;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    data = await response.json();
  } else {
    const text = await response.text();
    console.log('Payment API response text:', text);
    try {
      // Try to parse as JSON anyway in case content-type is wrong
      data = JSON.parse(text);
    } catch (e) {
      // If not parseable, create an error object
      data = { message: text || 'Server returned non-JSON response' };
    }
  }
  
  console.log('Payment API response data:', data);

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};

export const verifySubscription = async (payload: {
  userId: string;
  packageName: string;
  subscriptionName: string;
  subscriptionId: string;
  purchaseToken: string;
  subscriptionExpiry: string;
}) => {
  const response = await fetch(`${BASE_URL_AUTH}/v1/iap/verify-subscription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to verify subscription');
  }

  return response.json();
};