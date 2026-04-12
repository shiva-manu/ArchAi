import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InputPanel } from './InputPanel';
import { useDesignStore } from '@/store/useDesignStore';

vi.mock('@/store/useDesignStore', () => ({
  useDesignStore: vi.fn(),
}));

describe('InputPanel', () => {
  const mockGenerateDesign = vi.fn();
  const mockSetInput = vi.fn();
  const mockReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with empty initial state', () => {
    vi.mocked(useDesignStore).mockReturnValue({
      input: { idea: '', scale: '1k' },
      isLoading: false,
      isGenerated: false,
      activeTab: 'architecture',
      design: null,
      error: null,
      loadingNodes: new Set(),
      designId: null,
      savedDesigns: [],
      loadDesign: vi.fn(),
      deleteDesign: vi.fn(),
      refreshSavedDesigns: vi.fn(),
      setInput: mockSetInput,
      generateDesign: mockGenerateDesign,
      setActiveTab: vi.fn(),
      reset: mockReset,
    });

    render(<InputPanel />);

    expect(screen.getByText('SYSTEM INPUT')).toBeTruthy();
    expect(screen.getByText('Target Scale')).toBeTruthy();
  });

  it('shows character count when idea is entered', () => {
    const ideaText = 'A simple idea';
    vi.mocked(useDesignStore).mockReturnValue({
      input: { idea: ideaText, scale: '1k' },
      isLoading: false,
      isGenerated: false,
      activeTab: 'architecture',
      design: null,
      error: null,
      loadingNodes: new Set(),
      designId: null,
      savedDesigns: [],
      loadDesign: vi.fn(),
      deleteDesign: vi.fn(),
      refreshSavedDesigns: vi.fn(),
      setInput: mockSetInput,
      generateDesign: mockGenerateDesign,
      setActiveTab: vi.fn(),
      reset: mockReset,
    });

    render(<InputPanel />);

    expect(screen.getByText(`${ideaText.length} chars`)).toBeTruthy();
  });

  it('disables generate button when idea is empty', () => {
    vi.mocked(useDesignStore).mockReturnValue({
      input: { idea: '', scale: '1k' },
      isLoading: false,
      isGenerated: false,
      activeTab: 'architecture',
      design: null,
      error: null,
      loadingNodes: new Set(),
      designId: null,
      savedDesigns: [],
      loadDesign: vi.fn(),
      deleteDesign: vi.fn(),
      refreshSavedDesigns: vi.fn(),
      setInput: mockSetInput,
      generateDesign: mockGenerateDesign,
      setActiveTab: vi.fn(),
      reset: mockReset,
    });

    render(<InputPanel />);

    const button = screen.getByRole('button', { name: /generate architecture/i });
    expect(button).toBeDisabled();
  });

  it('enables generate button when idea has content', () => {
    vi.mocked(useDesignStore).mockReturnValue({
      input: { idea: 'A valid architecture idea', scale: '10k' },
      isLoading: false,
      isGenerated: false,
      activeTab: 'architecture',
      design: null,
      error: null,
      loadingNodes: new Set(),
      designId: null,
      savedDesigns: [],
      loadDesign: vi.fn(),
      deleteDesign: vi.fn(),
      refreshSavedDesigns: vi.fn(),
      setInput: mockSetInput,
      generateDesign: mockGenerateDesign,
      setActiveTab: vi.fn(),
      reset: mockReset,
    });

    render(<InputPanel />);

    const button = screen.getByRole('button', { name: /generate architecture/i });
    expect(button).not.toBeDisabled();
  });

  it('shows loading state when generating', () => {
    vi.mocked(useDesignStore).mockReturnValue({
      input: { idea: 'An idea', scale: '1k' },
      isLoading: true,
      isGenerated: false,
      activeTab: 'architecture',
      design: null,
      error: null,
      loadingNodes: new Set(),
      designId: null,
      savedDesigns: [],
      loadDesign: vi.fn(),
      deleteDesign: vi.fn(),
      refreshSavedDesigns: vi.fn(),
      setInput: mockSetInput,
      generateDesign: mockGenerateDesign,
      setActiveTab: vi.fn(),
      reset: mockReset,
    });

    render(<InputPanel />);

    expect(screen.getByText('Generating...')).toBeTruthy();
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('displays error message when present', () => {
    const errorMessage = 'Validation failed: idea must be at least 10 characters';
    vi.mocked(useDesignStore).mockReturnValue({
      input: { idea: 'short', scale: '1k' },
      isLoading: false,
      isGenerated: false,
      activeTab: 'architecture',
      design: null,
      error: errorMessage,
      loadingNodes: new Set(),
      designId: null,
      savedDesigns: [],
      loadDesign: vi.fn(),
      deleteDesign: vi.fn(),
      refreshSavedDesigns: vi.fn(),
      setInput: mockSetInput,
      generateDesign: mockGenerateDesign,
      setActiveTab: vi.fn(),
      reset: mockReset,
    });

    render(<InputPanel />);

    expect(screen.getByText(errorMessage)).toBeTruthy();
  });

  it('calls generateDesign when button is clicked', () => {
    vi.mocked(useDesignStore).mockReturnValue({
      input: { idea: 'Build a REST API', scale: '10k' },
      isLoading: false,
      isGenerated: false,
      activeTab: 'architecture',
      design: null,
      error: null,
      loadingNodes: new Set(),
      designId: null,
      savedDesigns: [],
      loadDesign: vi.fn(),
      deleteDesign: vi.fn(),
      refreshSavedDesigns: vi.fn(),
      setInput: mockSetInput,
      generateDesign: mockGenerateDesign,
      setActiveTab: vi.fn(),
      reset: mockReset,
    });

    render(<InputPanel />);

    const button = screen.getByRole('button', { name: /generate architecture/i });
    fireEvent.click(button);

    expect(mockGenerateDesign).toHaveBeenCalledTimes(1);
  });
});
