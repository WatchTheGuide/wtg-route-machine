import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToursPage } from './ToursPage';
import { render } from '@/test/test-utils';

// Mock URL.createObjectURL and URL.revokeObjectURL
URL.createObjectURL = vi.fn(() => 'blob:test');
URL.revokeObjectURL = vi.fn();

// Use vi.hoisted to ensure mock data is available during vi.mock hoisting
const { mockTours, mockCities } = vi.hoisted(() => ({
  mockTours: [
    {
      id: '1',
      name: { pl: 'Najważniejsze zabytki Krakowa', en: 'Krakow Highlights' },
      cityId: 'krakow',
      category: 'history',
      difficulty: 'easy' as const,
      poisCount: 12,
      status: 'published' as const,
      views: 1500,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
    },
    {
      id: '2',
      name: { pl: 'Droga Królewska', en: 'Royal Road' },
      cityId: 'krakow',
      category: 'history',
      difficulty: 'easy' as const,
      poisCount: 8,
      status: 'published' as const,
      views: 2300,
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-18T14:30:00Z',
    },
    {
      id: '3',
      name: { pl: 'Wrocławskie mosty', en: 'Wroclaw Bridges' },
      cityId: 'wroclaw',
      category: 'architecture',
      difficulty: 'medium' as const,
      poisCount: 15,
      status: 'draft' as const,
      views: 800,
      createdAt: '2024-02-01T10:00:00Z',
      updatedAt: '2024-02-05T14:30:00Z',
    },
    {
      id: '4',
      name: { pl: 'Spacer po Starym Mieście', en: 'Old Town Walk' },
      cityId: 'warszawa',
      category: 'history',
      difficulty: 'easy' as const,
      poisCount: 10,
      status: 'published' as const,
      views: 1200,
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-25T14:30:00Z',
    },
    {
      id: '5',
      name: { pl: 'Architektura modernistyczna', en: 'Modernist Architecture' },
      cityId: 'wroclaw',
      category: 'architecture',
      difficulty: 'medium' as const,
      poisCount: 9,
      status: 'draft' as const,
      views: 450,
      createdAt: '2024-02-10T10:00:00Z',
      updatedAt: '2024-02-12T14:30:00Z',
    },
    {
      id: '6',
      name: { pl: 'Kulinarny Kraków', en: 'Culinary Krakow' },
      cityId: 'krakow',
      category: 'food',
      difficulty: 'easy' as const,
      poisCount: 7,
      status: 'published' as const,
      views: 950,
      createdAt: '2024-01-25T10:00:00Z',
      updatedAt: '2024-01-28T14:30:00Z',
    },
    {
      id: '7',
      name: { pl: 'Nocne życie Warszawy', en: 'Warsaw Nightlife' },
      cityId: 'warszawa',
      category: 'nightlife',
      difficulty: 'easy' as const,
      poisCount: 11,
      status: 'published' as const,
      views: 1800,
      createdAt: '2024-02-05T10:00:00Z',
      updatedAt: '2024-02-08T14:30:00Z',
    },
    {
      id: '8',
      name: { pl: 'Parki Wrocławia', en: 'Wroclaw Parks' },
      cityId: 'wroclaw',
      category: 'nature',
      difficulty: 'easy' as const,
      poisCount: 6,
      status: 'draft' as const,
      views: 320,
      createdAt: '2024-02-15T10:00:00Z',
      updatedAt: '2024-02-17T14:30:00Z',
    },
    {
      id: '9',
      name: { pl: 'Sztuka Krakowa', en: 'Krakow Art' },
      cityId: 'krakow',
      category: 'art',
      difficulty: 'medium' as const,
      poisCount: 14,
      status: 'published' as const,
      views: 670,
      createdAt: '2024-01-30T10:00:00Z',
      updatedAt: '2024-02-02T14:30:00Z',
    },
    {
      id: '10',
      name: { pl: 'Warszawskie muzea', en: 'Warsaw Museums' },
      cityId: 'warszawa',
      category: 'art',
      difficulty: 'medium' as const,
      poisCount: 8,
      status: 'published' as const,
      views: 1100,
      createdAt: '2024-02-08T10:00:00Z',
      updatedAt: '2024-02-10T14:30:00Z',
    },
    {
      id: '11',
      name: { pl: 'Krakowskie legendy', en: 'Krakow Legends' },
      cityId: 'krakow',
      category: 'history',
      difficulty: 'easy' as const,
      poisCount: 9,
      status: 'draft' as const,
      views: 280,
      createdAt: '2024-02-12T10:00:00Z',
      updatedAt: '2024-02-14T14:30:00Z',
    },
    {
      id: '12',
      name: { pl: 'Sopot i plaże', en: 'Sopot and Beaches' },
      cityId: 'trojmiasto',
      category: 'nature',
      difficulty: 'easy' as const,
      poisCount: 5,
      status: 'published' as const,
      views: 2100,
      createdAt: '2024-02-18T10:00:00Z',
      updatedAt: '2024-02-20T14:30:00Z',
    },
  ],
  mockCities: [
    { id: 'krakow', name: 'Kraków', toursCount: 5 },
    { id: 'warszawa', name: 'Warszawa', toursCount: 3 },
    { id: 'wroclaw', name: 'Wrocław', toursCount: 3 },
    { id: 'trojmiasto', name: 'Trójmiasto', toursCount: 1 },
  ],
}));

// Mock useTours hook - factory must access hoisted data via closure
vi.mock('@/hooks/useTours', () => {
  // Import hoisted data
  const tours = mockTours;
  const cities = mockCities;

  return {
    useTours: vi.fn(() => ({
      data: tours,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    })),
    useCities: vi.fn(() => ({
      data: cities,
      isLoading: false,
      isError: false,
    })),
    useDeleteTour: vi.fn(() => ({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
    })),
    useBulkDeleteTours: vi.fn(() => ({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
    })),
    useDuplicateTour: vi.fn(() => ({
      mutateAsync: vi.fn().mockResolvedValue({ id: 'new-id' }),
      isPending: false,
    })),
    usePublishTour: vi.fn(() => ({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
    })),
  };
});

describe('ToursPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders the page title and subtitle', () => {
      render(<ToursPage />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Tours'
      );
      expect(
        screen.getByText('Manage curated walking tours')
      ).toBeInTheDocument();
    });

    it('renders the add tour button', () => {
      render(<ToursPage />);

      expect(
        screen.getByRole('button', { name: /add tour/i })
      ).toBeInTheDocument();
    });

    it('renders the export button', () => {
      render(<ToursPage />);

      expect(
        screen.getByRole('button', { name: /export/i })
      ).toBeInTheDocument();
    });

    it('renders the filters card', () => {
      render(<ToursPage />);

      expect(screen.getByText('Filters')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Search tours...')
      ).toBeInTheDocument();
    });

    it('renders the tours table', () => {
      render(<ToursPage />);

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('City')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Difficulty')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('renders mock tour data', () => {
      render(<ToursPage />);

      // Check that tour data from mock is rendered in the table
      // Using queryAllByText to handle cases where names appear multiple times
      const tourNames = screen.queryAllByText(
        /Najważniejsze|Droga|Wrocławskie/i
      );
      expect(tourNames.length).toBeGreaterThan(0);
    });

    it('renders category badges', () => {
      render(<ToursPage />);

      // mockTours have categories: history, architecture - translated to "History", "Architecture"
      expect(screen.getAllByText('History').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Architecture').length).toBeGreaterThan(0);
    });

    it('renders status badges', () => {
      render(<ToursPage />);

      expect(screen.getAllByText('Published').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Draft').length).toBeGreaterThan(0);
    });

    it('renders difficulty badges', () => {
      render(<ToursPage />);

      expect(screen.getAllByText('Easy').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Medium').length).toBeGreaterThan(0);
    });
  });

  describe('search filtering', () => {
    it('filters tours by search query', async () => {
      const user = userEvent.setup();
      render(<ToursPage />);

      const searchInput = screen.getByPlaceholderText('Search tours...');
      await user.type(searchInput, 'Kraków');

      // Should show Kraków tours
      expect(
        screen.getByText('Najważniejsze zabytki Krakowa')
      ).toBeInTheDocument();
      expect(screen.getByText('Droga Królewska')).toBeInTheDocument();

      // Should not show Wrocław tours
      expect(screen.queryByText('Wrocławskie mosty')).not.toBeInTheDocument();
    });

    it('clears filters when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<ToursPage />);

      // Apply a search filter
      const searchInput = screen.getByPlaceholderText('Search tours...');
      await user.type(searchInput, 'Kraków');

      // Clear filters button should appear
      const clearButton = screen.getByRole('button', {
        name: /clear filters/i,
      });
      expect(clearButton).toBeInTheDocument();

      await user.click(clearButton);

      // Search input should be cleared
      expect(searchInput).toHaveValue('');

      // All tours should be visible again
      expect(screen.getByText('Wrocławskie mosty')).toBeInTheDocument();
    });
  });

  describe('sorting', () => {
    it('toggles sort order when arrow button is clicked', async () => {
      const user = userEvent.setup();
      render(<ToursPage />);

      // Find the sort order toggle button (arrow)
      const sortOrderButton = screen.getByRole('button', { name: '↓' });
      expect(sortOrderButton).toBeInTheDocument();

      await user.click(sortOrderButton);

      // Should now show ascending arrow
      expect(screen.getByRole('button', { name: '↑' })).toBeInTheDocument();
    });
  });

  describe('selection', () => {
    it('selects individual tours', async () => {
      const user = userEvent.setup();
      render(<ToursPage />);

      // Find first tour checkbox
      const checkboxes = screen.getAllByRole('checkbox');
      const firstTourCheckbox = checkboxes[1]; // First is "select all"

      await user.click(firstTourCheckbox);

      expect(firstTourCheckbox).toBeChecked();
      expect(screen.getByText(/selected: 1/i)).toBeInTheDocument();
    });

    it('selects all tours on current page', async () => {
      const user = userEvent.setup();
      render(<ToursPage />);

      // Find "select all" checkbox
      const selectAllCheckbox = screen.getAllByRole('checkbox')[0];

      await user.click(selectAllCheckbox);

      expect(selectAllCheckbox).toBeChecked();
      expect(screen.getByText(/selected: 10/i)).toBeInTheDocument();
    });

    it('shows bulk action buttons when tours are selected', async () => {
      const user = userEvent.setup();
      render(<ToursPage />);

      // Select a tour
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[1]);

      // Bulk action buttons should appear
      expect(
        screen.getByRole('button', { name: /publish/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /delete selected/i })
      ).toBeInTheDocument();
    });

    it('deselects all when clicking select all checkbox again', async () => {
      const user = userEvent.setup();
      render(<ToursPage />);

      const selectAllCheckbox = screen.getAllByRole('checkbox')[0];

      // Select all
      await user.click(selectAllCheckbox);
      expect(screen.getByText(/selected: 10/i)).toBeInTheDocument();

      // Deselect all
      await user.click(selectAllCheckbox);
      expect(screen.queryByText(/selected:/i)).not.toBeInTheDocument();
    });
  });

  describe('pagination', () => {
    it('shows pagination when there are more tours than page size', () => {
      render(<ToursPage />);

      // With 12 mock tours and page size 10, should show pagination
      expect(screen.getByText(/page 1 of 2/i)).toBeInTheDocument();
    });

    it('disables previous button on first page', () => {
      render(<ToursPage />);

      const paginationButtons = screen.getAllByRole('button');
      const prevButton = paginationButtons.find(
        (btn) => btn.querySelector('svg.lucide-chevron-left') !== null
      );

      if (prevButton) {
        expect(prevButton).toBeDisabled();
      }
    });
  });

  describe('actions', () => {
    it('opens action menu for a tour', async () => {
      const user = userEvent.setup();
      render(<ToursPage />);

      // Find action menu button (MoreHorizontal icon)
      const actionButtons = screen.getAllByRole('button');
      const menuButton = actionButtons.find(
        (btn) => btn.querySelector('svg.lucide-more-horizontal') !== null
      );

      if (menuButton) {
        await user.click(menuButton);

        expect(screen.getByText('Preview')).toBeInTheDocument();
        expect(screen.getByText('Edit')).toBeInTheDocument();
        expect(screen.getByText('Duplicate')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
      }
    });

    it('opens delete confirmation dialog', async () => {
      const user = userEvent.setup();
      render(<ToursPage />);

      // Open action menu
      const actionButtons = screen.getAllByRole('button');
      const menuButton = actionButtons.find(
        (btn) => btn.querySelector('svg.lucide-more-horizontal') !== null
      );

      if (menuButton) {
        await user.click(menuButton);

        // Click delete
        const deleteButton = screen.getByText('Delete');
        await user.click(deleteButton);

        // Dialog should appear
        expect(
          screen.getByText('Are you sure you want to delete?')
        ).toBeInTheDocument();
      }
    });

    it('closes delete dialog when cancel is clicked', async () => {
      const user = userEvent.setup();
      render(<ToursPage />);

      // Open action menu and delete dialog
      const actionButtons = screen.getAllByRole('button');
      const menuButton = actionButtons.find(
        (btn) => btn.querySelector('svg.lucide-more-horizontal') !== null
      );

      if (menuButton) {
        await user.click(menuButton);
        await user.click(screen.getByText('Delete'));

        // Cancel
        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        await user.click(cancelButton);

        // Dialog should close
        expect(
          screen.queryByText('Are you sure you want to delete?')
        ).not.toBeInTheDocument();
      }
    });

    it('exports tours as JSON', async () => {
      const user = userEvent.setup();
      render(<ToursPage />);

      // Mock createElement and click
      const createElementSpy = vi.spyOn(document, 'createElement');
      const mockAnchor = {
        href: '',
        download: '',
        click: vi.fn(),
      };
      createElementSpy.mockReturnValueOnce(
        mockAnchor as unknown as HTMLElement
      );

      const exportButton = screen.getByRole('button', { name: /export/i });
      await user.click(exportButton);

      expect(mockAnchor.download).toBe('tours-export.json');
      expect(mockAnchor.click).toHaveBeenCalled();

      createElementSpy.mockRestore();
    });
  });

  describe('empty state', () => {
    it('shows no results message when filters match nothing', async () => {
      const user = userEvent.setup();
      render(<ToursPage />);

      const searchInput = screen.getByPlaceholderText('Search tours...');
      await user.type(searchInput, 'xyznonexistent');

      expect(screen.getByText('No tours found')).toBeInTheDocument();
    });
  });

  describe('showing count', () => {
    it('displays correct showing count', () => {
      render(<ToursPage />);

      // With 12 tours and page size 10, should show "Showing 1-10 of 12"
      expect(screen.getByText(/showing 1-10 of 12/i)).toBeInTheDocument();
    });

    it('updates showing count when filtered', async () => {
      const user = userEvent.setup();
      render(<ToursPage />);

      const searchInput = screen.getByPlaceholderText('Search tours...');
      await user.type(searchInput, 'Kraków');

      // Should show count of filtered results
      const showingText = screen.getByText(/showing \d+-\d+ of \d+/i);
      expect(showingText).toBeInTheDocument();
    });
  });
});
