import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingContextType {
  isOnboarding: boolean;
  currentStep: number;
  completeOnboarding: () => Promise<void>;
  nextStep: () => void;
  skipOnboarding: () => Promise<void>;
  isLoading: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has completed onboarding on app launch
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const hasCompletedOnboarding = await AsyncStorage.getItem('onboarding_completed');
        if (hasCompletedOnboarding === 'true') {
          setIsOnboarding(false);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboarding_completed', 'true');
      setIsOnboarding(false);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const skipOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboarding_completed', 'true');
      setIsOnboarding(false);
    } catch (error) {
      console.error('Error skipping onboarding:', error);
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  return (
    <OnboardingContext.Provider
      value={{
        isOnboarding,
        currentStep,
        completeOnboarding,
        nextStep,
        skipOnboarding,
        isLoading,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};
