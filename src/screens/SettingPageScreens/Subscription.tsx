import * as React from "react";
import { StyleSheet, Text, Pressable, View, ScrollView } from "react-native";

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = React.useState('free');

  const plans = {
    free: {
      name: 'FREE TIER',
      price: '$0',
      period: '/month',
      features: ['Type']
    },
    standard: {
      name: 'STANDARD',
      price: '$15',
      period: '/month',
      features: [
        'Type',
        'Chat with AI',
        'Prompt-based',
        'Gratitude'
      ]
    },
    premium: {
      name: 'PREMIUM',
      price: '$30',
      period: '/month',
      features: [
        'Type',
        'Chat with AI',
        'Prompt-based',
        'Gratitude',
        'Dialogue with AI',
        'Monologue'
      ]
    }
  };

  const renderPlan = (planKey: 'free' | 'standard' | 'premium') => {
    const plan = plans[planKey];
    const isSelected = selectedPlan === planKey;

    return (
      <Pressable
        style={[styles.planCard, isSelected && styles.selectedPlan]}
        onPress={() => setSelectedPlan(planKey)}
      >
        <Text style={[styles.planName, isSelected && styles.selectedText]}>
          {plan.name}
        </Text>
        <Text style={[styles.planPrice, isSelected && styles.selectedText]}>
          {plan.price}
          <Text style={[styles.period, isSelected && styles.selectedText]}>{plan.period}</Text>
        </Text>
        
        {plan.features.map((feature, index) => (
          <Text 
            key={index} 
            style={[styles.featureText, isSelected && styles.selectedText]}
          >
            • {feature}
          </Text>
        ))}
      </Pressable>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Choose Your Plan</Text>
      {renderPlan('free')}
      {renderPlan('standard')}
      {renderPlan('premium')}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfaf0",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "300",
    textAlign: "center",
    marginBottom: 30,
    color: "#000",
  },
  planCard: {
    backgroundColor: "#fcfaf0",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedPlan: {
    backgroundColor: "#474d41",
    borderColor: "#474d41",
  },
  planName: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: "700",
    color: "#474d41",
    marginBottom: 20,
  },
  period: {
    fontSize: 16,
    color: "#666",
  },
  featureText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
    paddingLeft: 10,
  },
  selectedText: {
    color: "#fff",
  }
});

export default Subscription;
