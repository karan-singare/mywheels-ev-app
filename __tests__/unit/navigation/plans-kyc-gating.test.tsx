import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';

// Mock KYC state
let mockKYCStatus = 'not_started';

jest.mock('../../../src/hooks/use-kyc.hook', () => ({
  useKYC: () => ({
    status: mockKYCStatus,
    documents: [],
    loading: false,
    error: null,
    pendingCount: 0,
    uploadDocument: jest.fn(),
    submitForReview: jest.fn(),
  }),
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

// Mock bottom tabs
jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => children,
    Screen: () => null,
  }),
}));

// Mock lucide icons
jest.mock('lucide-react-native', () => {
  const { Text } = require('react-native');
  const icon = (name: string) => {
    const IconComponent = (props: Record<string, unknown>) => (
      <Text testID={props.testID as string}>{name}</Text>
    );
    IconComponent.displayName = name;
    return IconComponent;
  };
  return {
    Home: icon('Home'),
    CreditCard: icon('CreditCard'),
    User: icon('User'),
    MessageCircle: icon('MessageCircle'),
    ShieldAlert: icon('ShieldAlert'),
  };
});

// Mock Redux store (needed by useKYC's internal imports)
jest.mock('../../../src/store', () => ({
  useAppSelector: jest.fn(() => ({})),
  useAppDispatch: () => jest.fn(),
}));

import { PlansScreen } from '../../../src/navigation/rider-tabs.component';

function findByTestId(root: ReactTestRenderer.ReactTestInstance, testID: string) {
  return root.findAll((node) => node.props.testID === testID && typeof node.type === 'string');
}

describe('PlansScreen KYC gating', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockKYCStatus = 'not_started';
  });

  it('shows gating message when KYC status is not_started', async () => {
    mockKYCStatus = 'not_started';
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(<PlansScreen />);
    });
    const root = tree!.root;
    const gatingMsg = findByTestId(root, 'kyc-gating-message');
    expect(gatingMsg.length).toBe(1);
    expect(gatingMsg[0].props.children).toBe('KYC approval is required to view plans');
  });

  it('shows gating message when KYC status is in_progress', async () => {
    mockKYCStatus = 'in_progress';
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(<PlansScreen />);
    });
    const root = tree!.root;
    expect(findByTestId(root, 'kyc-gating-message').length).toBe(1);
  });

  it('shows gating message when KYC status is under_review', async () => {
    mockKYCStatus = 'under_review';
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(<PlansScreen />);
    });
    const root = tree!.root;
    expect(findByTestId(root, 'kyc-gating-message').length).toBe(1);
  });

  it('shows gating message when KYC status is rejected', async () => {
    mockKYCStatus = 'rejected';
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(<PlansScreen />);
    });
    const root = tree!.root;
    expect(findByTestId(root, 'kyc-gating-message').length).toBe(1);
  });

  it('does NOT show gating message when KYC status is approved', async () => {
    mockKYCStatus = 'approved';
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(<PlansScreen />);
    });
    const root = tree!.root;
    expect(findByTestId(root, 'kyc-gating-message').length).toBe(0);
    expect(findByTestId(root, 'kyc-gating-container').length).toBe(0);
  });

  it('shows shield icon in gating view', async () => {
    mockKYCStatus = 'not_started';
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(<PlansScreen />);
    });
    const root = tree!.root;
    expect(findByTestId(root, 'kyc-gating-icon').length).toBe(1);
  });

  it('shows navigate button that goes to KYC screen', async () => {
    mockKYCStatus = 'not_started';
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(<PlansScreen />);
    });
    const root = tree!.root;
    const btn = root.findAll(
      (node) => node.props.testID === 'kyc-gating-navigate-button' && typeof node.props.onPress === 'function',
    );
    expect(btn.length).toBeGreaterThanOrEqual(1);
    await act(async () => {
      btn[0].props.onPress();
    });
    expect(mockNavigate).toHaveBeenCalledWith('KYC');
  });
});
