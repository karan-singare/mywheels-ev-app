import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
}));

// Mock the store hooks
const mockDispatch = jest.fn(() => Promise.resolve());
jest.mock('../../../src/store', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: jest.fn(),
}));

jest.mock('../../../src/hooks/use-auth.hook', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', phone: '9876543210' },
    session: { access_token: 'token' },
    loading: false,
    error: null,
  }),
}));

jest.mock('../../../src/hooks/use-rider.hook', () => ({
  useRider: () => ({
    profile: null,
    loading: false,
    error: null,
    onboardingStep: 'personal_info',
  }),
}));

jest.mock('../../../src/store/thunks/rider.thunk', () => ({
  createProfile: jest.fn((payload) => ({
    type: 'rider/createProfile',
    payload,
  })),
}));

import { OnboardingScreen } from '../../../src/screens/onboarding/onboarding.screen';

function findByTestId(root: ReactTestRenderer.ReactTestInstance, testID: string) {
  return root.findAll((node) => node.props.testID === testID);
}

function getAllTexts(root: ReactTestRenderer.ReactTestInstance): string[] {
  return root.findAllByType('Text' as any).map((n) => {
    const children = n.props.children;
    if (Array.isArray(children)) return children.join('');
    return String(children ?? '');
  });
}

describe('OnboardingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders step 1 initially with step indicator', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(<OnboardingScreen />);
    });
    const root = tree!.root;
    const stepIndicator = findByTestId(root, 'step-indicator');
    expect(stepIndicator.length).toBeGreaterThanOrEqual(1);

    const texts = getAllTexts(root);
    expect(texts.some((t) => t.includes('Step 1 of 3'))).toBe(true);
    expect(texts.some((t) => t.includes('Personal Information'))).toBe(true);
  });

  it('renders full name, DOB, and gender fields on step 1', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(<OnboardingScreen />);
    });
    const root = tree!.root;
    expect(findByTestId(root, 'fullname-input').length).toBeGreaterThanOrEqual(1);
    expect(findByTestId(root, 'dob-input').length).toBeGreaterThanOrEqual(1);
    expect(findByTestId(root, 'gender-male').length).toBeGreaterThanOrEqual(1);
    expect(findByTestId(root, 'gender-female').length).toBeGreaterThanOrEqual(1);
    expect(findByTestId(root, 'gender-other').length).toBeGreaterThanOrEqual(1);
  });

  it('shows validation errors when trying to proceed with empty step 1', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(<OnboardingScreen />);
    });
    const root = tree!.root;
    const nextBtn = findByTestId(root, 'next-button');
    expect(nextBtn.length).toBeGreaterThanOrEqual(1);

    await act(async () => {
      nextBtn[0].props.onPress();
    });

    const texts = getAllTexts(root);
    expect(texts.some((t) => t.includes('Full name is required'))).toBe(true);
    expect(texts.some((t) => t.includes('Date of birth is required'))).toBe(true);
    expect(texts.some((t) => t.includes('Please select a gender'))).toBe(true);
  });

  it('navigates to step 2 when step 1 is valid', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(<OnboardingScreen />);
    });
    const root = tree!.root;

    await act(async () => {
      findByTestId(root, 'fullname-input')[0].props.onChangeText('John Doe');
      findByTestId(root, 'dob-input')[0].props.onChangeText('1995-06-15');
      findByTestId(root, 'gender-male')[0].props.onPress();
    });

    await act(async () => {
      findByTestId(root, 'next-button')[0].props.onPress();
    });

    const texts = getAllTexts(root);
    expect(texts.some((t) => t.includes('Step 2 of 3'))).toBe(true);
    expect(texts.some((t) => t.includes('Address Details'))).toBe(true);
  });

  it('validates DOB for minimum age of 18', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(<OnboardingScreen />);
    });
    const root = tree!.root;

    const today = new Date();
    const underageDob = `${today.getFullYear() - 16}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    await act(async () => {
      findByTestId(root, 'fullname-input')[0].props.onChangeText('John Doe');
      findByTestId(root, 'dob-input')[0].props.onChangeText(underageDob);
      findByTestId(root, 'gender-male')[0].props.onPress();
    });

    await act(async () => {
      findByTestId(root, 'next-button')[0].props.onPress();
    });

    const texts = getAllTexts(root);
    expect(texts.some((t) => t.includes('at least 18 years old'))).toBe(true);
  });

  it('defaults city to Hyderabad on step 2', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(<OnboardingScreen />);
    });
    const root = tree!.root;

    await act(async () => {
      findByTestId(root, 'fullname-input')[0].props.onChangeText('John Doe');
      findByTestId(root, 'dob-input')[0].props.onChangeText('1995-06-15');
      findByTestId(root, 'gender-male')[0].props.onPress();
    });
    await act(async () => {
      findByTestId(root, 'next-button')[0].props.onPress();
    });

    const cityInput = findByTestId(root, 'city-input')[0];
    expect(cityInput.props.value).toBe('Hyderabad');
  });

  it('allows back navigation from step 2 to step 1', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(<OnboardingScreen />);
    });
    const root = tree!.root;

    await act(async () => {
      findByTestId(root, 'fullname-input')[0].props.onChangeText('John Doe');
      findByTestId(root, 'dob-input')[0].props.onChangeText('1995-06-15');
      findByTestId(root, 'gender-male')[0].props.onPress();
    });
    await act(async () => {
      findByTestId(root, 'next-button')[0].props.onPress();
    });

    let texts = getAllTexts(root);
    expect(texts.some((t) => t.includes('Step 2 of 3'))).toBe(true);

    await act(async () => {
      findByTestId(root, 'back-button')[0].props.onPress();
    });

    texts = getAllTexts(root);
    expect(texts.some((t) => t.includes('Step 1 of 3'))).toBe(true);
  });

  it('dispatches createProfile on step 3 completion with valid data', async () => {
    const { createProfile } = require('../../../src/store/thunks/rider.thunk');
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(<OnboardingScreen />);
    });
    const root = tree!.root;

    // Step 1
    await act(async () => {
      findByTestId(root, 'fullname-input')[0].props.onChangeText('John Doe');
      findByTestId(root, 'dob-input')[0].props.onChangeText('1995-06-15');
      findByTestId(root, 'gender-male')[0].props.onPress();
    });
    await act(async () => {
      findByTestId(root, 'next-button')[0].props.onPress();
    });

    // Step 2
    await act(async () => {
      findByTestId(root, 'address-input')[0].props.onChangeText('123 Main St');
    });
    await act(async () => {
      findByTestId(root, 'next-button')[0].props.onPress();
    });

    // Step 3
    await act(async () => {
      findByTestId(root, 'emergency-contact-input')[0].props.onChangeText('9876543210');
    });
    await act(async () => {
      findByTestId(root, 'submit-button')[0].props.onPress();
    });

    expect(createProfile).toHaveBeenCalledWith({
      userId: 'test-user-id',
      data: {
        full_name: 'John Doe',
        phone: '9876543210',
        date_of_birth: '1995-06-15',
        gender: 'male',
        address: '123 Main St',
        city: 'Hyderabad',
        emergency_contact: '9876543210',
      },
    });
    expect(mockDispatch).toHaveBeenCalled();
  });
});
