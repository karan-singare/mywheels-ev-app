import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Alert } from 'react-native';

// Mock useKYC hook
const mockUploadDocument = jest.fn();
const mockSubmitForReview = jest.fn();
let mockKYCState: {
  status: string;
  documents: Array<{
    id: string;
    rider_id: string;
    document_type: string;
    file_path: string;
    file_url: string;
    uploaded_at: string;
  }>;
  loading: boolean;
  error: string | null;
  pendingCount: number;
  uploadDocument: jest.Mock;
  submitForReview: jest.Mock;
};

function resetMockState() {
  mockKYCState = {
    status: 'not_started',
    documents: [],
    loading: false,
    error: null,
    pendingCount: 0,
    uploadDocument: mockUploadDocument,
    submitForReview: mockSubmitForReview,
  };
}

jest.mock('../../../src/hooks/use-kyc.hook', () => ({
  useKYC: () => mockKYCState,
}));

jest.mock('lucide-react-native', () => {
  const { Text } = require('react-native');
  const icon = (name: string) => {
    const IconComponent = (props: Record<string, unknown>) => (
      <Text testID={`icon-${name}`}>{name}</Text>
    );
    IconComponent.displayName = name;
    return IconComponent;
  };
  return {
    ShieldCheck: icon('ShieldCheck'),
    FileCheck: icon('FileCheck'),
    AlertCircle: icon('AlertCircle'),
    Clock: icon('Clock'),
    CheckCircle2: icon('CheckCircle2'),
    XCircle: icon('XCircle'),
    Camera: icon('Camera'),
    ImageIcon: icon('ImageIcon'),
    X: icon('X'),
  };
});

import { KYCScreen } from '../../../src/screens/kyc/kyc.screen';

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

function makeDoc(type: string) {
  return {
    id: `doc-${type}`,
    rider_id: 'rider-1',
    document_type: type,
    file_path: `rider-1/${type}_123`,
    file_url: `https://example.com/${type}.jpg`,
    uploaded_at: '2024-01-01T00:00:00Z',
  };
}

describe('KYCScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetMockState();
  });

  it('renders KYC title and status', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(<KYCScreen />);
    });
    const root = tree!.root;
    expect(findByTestId(root, 'kyc-title').length).toBeGreaterThanOrEqual(1);
    const statusLabel = findByTestId(root, 'kyc-status-label')[0];
    expect(statusLabel.props.children).toBe('Not Started');
  });

  it('displays correct status label for each KYC status', async () => {
    const statusMap: Record<string, string> = {
      not_started: 'Not Started',
      in_progress: 'In Progress',
      under_review: 'Under Review',
      approved: 'Approved',
      rejected: 'Rejected',
    };

    for (const [status, label] of Object.entries(statusMap)) {
      mockKYCState = { ...mockKYCState, status };
      let tree: ReactTestRenderer.ReactTestRenderer;
      await act(async () => {
        tree = ReactTestRenderer.create(<KYCScreen />);
      });
      const root = tree!.root;
      const statusLabel = findByTestId(root, 'kyc-status-label')[0];
      expect(statusLabel.props.children).toBe(label);
    }
  });

  it('shows document checklist with all 4 items', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(<KYCScreen />);
    });
    const root = tree!.root;
    expect(findByTestId(root, 'checklist-item-aadhaar').length).toBeGreaterThanOrEqual(1);
    expect(findByTestId(root, 'checklist-item-driving_license').length).toBeGreaterThanOrEqual(1);
    expect(findByTestId(root, 'checklist-item-photo').length).toBeGreaterThanOrEqual(1);
    expect(findByTestId(root, 'checklist-item-address_proof').length).toBeGreaterThanOrEqual(1);
  });

  it('disables submit button when not all documents are uploaded', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(<KYCScreen />);
    });
    const root = tree!.root;
    const submitBtn = findByTestId(root, 'submit-kyc-button')[0];
    expect(submitBtn.props.accessibilityState.disabled).toBe(true);
  });

  it('enables submit button when all 4 documents are uploaded', async () => {
    mockKYCState = {
      ...mockKYCState,
      status: 'in_progress',
      documents: [
        makeDoc('aadhaar'),
        makeDoc('driving_license'),
        makeDoc('photo'),
        makeDoc('address_proof'),
      ],
    };
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(<KYCScreen />);
    });
    const root = tree!.root;
    const submitBtn = findByTestId(root, 'submit-kyc-button')[0];
    expect(submitBtn.props.accessibilityState.disabled).toBe(false);
  });

  it('calls submitForReview when submit is confirmed', async () => {
    jest.spyOn(Alert, 'alert').mockImplementation(
      (_title: string, _msg?: string, buttons?: any) => {
        const confirmBtn = buttons?.find(
          (b: { text: string }) => b.text === 'Submit',
        );
        confirmBtn?.onPress?.();
      },
    );

    mockKYCState = {
      ...mockKYCState,
      status: 'in_progress',
      documents: [
        makeDoc('aadhaar'),
        makeDoc('driving_license'),
        makeDoc('photo'),
        makeDoc('address_proof'),
      ],
    };

    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(<KYCScreen />);
    });
    const root = tree!.root;
    await act(async () => {
      findByTestId(root, 'submit-kyc-button')[0].props.onPress();
    });
    expect(mockSubmitForReview).toHaveBeenCalled();
  });

  it('hides upload section when status is under_review', async () => {
    mockKYCState = { ...mockKYCState, status: 'under_review' };
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(<KYCScreen />);
    });
    const root = tree!.root;
    expect(findByTestId(root, 'document-uploader').length).toBe(0);
  });

  it('hides upload section when status is approved', async () => {
    mockKYCState = { ...mockKYCState, status: 'approved' };
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(<KYCScreen />);
    });
    const root = tree!.root;
    expect(findByTestId(root, 'document-uploader').length).toBe(0);
  });

  it('shows error message when error exists', async () => {
    mockKYCState = { ...mockKYCState, error: 'Network error' };
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(<KYCScreen />);
    });
    const root = tree!.root;
    const errorEl = findByTestId(root, 'kyc-error');
    expect(errorEl.length).toBeGreaterThanOrEqual(1);
    expect(errorEl[0].props.children).toBe('Network error');
  });

  it('shows document picker slots in upload section', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(<KYCScreen />);
    });
    const root = tree!.root;
    expect(findByTestId(root, 'document-picker-aadhaar').length).toBeGreaterThanOrEqual(1);
    expect(findByTestId(root, 'document-picker-driving_license').length).toBeGreaterThanOrEqual(1);
    expect(findByTestId(root, 'document-picker-photo').length).toBeGreaterThanOrEqual(1);
    expect(findByTestId(root, 'document-picker-address_proof').length).toBeGreaterThanOrEqual(1);
  });

  it('shows preview thumbnail when document is uploaded', async () => {
    mockKYCState = {
      ...mockKYCState,
      documents: [makeDoc('aadhaar')],
    };
    let tree: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      tree = ReactTestRenderer.create(<KYCScreen />);
    });
    const root = tree!.root;
    expect(findByTestId(root, 'document-preview-aadhaar').length).toBeGreaterThanOrEqual(1);
  });
});
