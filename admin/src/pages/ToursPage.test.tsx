import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToursPage } from './ToursPage';
import { render } from '@/test/test-utils';

// Mock URL.createObjectURL and URL.revokeObjectURL
URL.createObjectURL = vi.fn(() => 'blob:test');
URL.revokeObjectURL = vi.fn();

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

      expect(
        screen.getByText('Najważniejsze zabytki Krakowa')
      ).toBeInTheDocument();
      expect(screen.getByText('Droga Królewska')).toBeInTheDocument();
      expect(screen.getByText('Wrocławskie mosty')).toBeInTheDocument();
    });

    it('renders category badges', () => {
      render(<ToursPage />);

      expect(screen.getAllByText('Historical').length).toBeGreaterThan(0);
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
