import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { DashboardPage } from './DashboardPage';

// Mock Recharts components to avoid rendering issues in tests
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: () => <div data-testid="line-chart" />,
  BarChart: () => <div data-testid="bar-chart" />,
  Line: () => null,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

// Mock tour data for API hooks
const mockTours = [
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
];

const mockCities = [
  { id: 'krakow', name: 'Kraków', toursCount: 5 },
  { id: 'warszawa', name: 'Warszawa', toursCount: 3 },
  { id: 'wroclaw', name: 'Wrocław', toursCount: 3 },
  { id: 'trojmiasto', name: 'Trójmiasto', toursCount: 1 },
];

const mockStats = {
  totalTours: 24,
  totalPois: 156,
  totalViews: 45000,
  activeCities: 4,
  toursChange: 3,
  poisChange: 12,
  viewsChange: 15,
};

// Mock useTours hooks
vi.mock('@/hooks/useTours', () => ({
  useTours: vi.fn(() => ({
    data: mockTours,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  })),
  useTourStats: vi.fn(() => ({
    data: mockStats,
    isLoading: false,
    isError: false,
  })),
  useCities: vi.fn(() => ({
    data: mockCities,
    isLoading: false,
    isError: false,
  })),
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Page Header', () => {
    it('renders page title', () => {
      render(<DashboardPage />);
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('renders page subtitle', () => {
      render(<DashboardPage />);
      expect(
        screen.getByText(/manage tours|zarządzaj wycieczkami/i)
      ).toBeInTheDocument();
    });
  });

  describe('Stats Cards', () => {
    it('renders stats section with cards', () => {
      render(<DashboardPage />);

      // Check that stat cards are rendered (values come from mockTours)
      // 3 tours in mock data - may appear in multiple places
      const threeElements = screen.getAllByText('3');
      expect(threeElements.length).toBeGreaterThan(0);
      // POIs: 12 + 8 + 15 = 35
      expect(screen.getByText('35')).toBeInTheDocument();
      // Cities: 4 from mockCities
      const citiesValues = screen.getAllByText('4');
      expect(citiesValues.length).toBeGreaterThan(0);
    });

    it('shows trend indicators for stats', () => {
      render(<DashboardPage />);

      // Trend indicators should be present (can be positive/negative)
      // Using regex to find any trend value
      const trendElements = screen.getAllByText(/^[+-]?\d+$/);
      expect(trendElements.length).toBeGreaterThan(0);
    });
  });

  describe('City Selector', () => {
    it('renders city selector dropdown', () => {
      render(<DashboardPage />);

      // Find the select trigger (combobox role)
      const selectTrigger = screen.getByRole('combobox');
      expect(selectTrigger).toBeInTheDocument();
    });
  });

  describe('Charts Section', () => {
    it('renders tours over time chart', () => {
      render(<DashboardPage />);
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('renders views by city chart', () => {
      render(<DashboardPage />);
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('Quick Actions', () => {
    it('renders Add Tour button', () => {
      render(<DashboardPage />);
      expect(
        screen.getByRole('button', { name: /add tour|dodaj wycieczkę/i })
      ).toBeInTheDocument();
    });

    it('renders Manage POIs button', () => {
      render(<DashboardPage />);
      expect(
        screen.getByRole('button', { name: /manage pois|zarządzaj poi/i })
      ).toBeInTheDocument();
    });

    it('renders View Reports button', () => {
      render(<DashboardPage />);
      expect(
        screen.getByRole('button', { name: /view reports|zobacz raporty/i })
      ).toBeInTheDocument();
    });

    it('renders Analytics button', () => {
      render(<DashboardPage />);
      expect(
        screen.getByRole('button', { name: /analytics|analityka/i })
      ).toBeInTheDocument();
    });
  });

  describe('Top Tours Table', () => {
    it('renders top tours section', () => {
      render(<DashboardPage />);

      // Check for the section heading
      const topToursSection = screen.getByText(
        /top tours|najpopularniejsze wycieczki/i
      );
      expect(topToursSection).toBeInTheDocument();
    });

    it('displays tour names from mock data', () => {
      render(<DashboardPage />);

      // Tour names appear in multiple places (top tours, recent tours, activity), use getAllByText
      const krakow = screen.getAllByText('Najważniejsze zabytki Krakowa');
      expect(krakow.length).toBeGreaterThan(0);

      const drogaKrolewska = screen.getAllByText('Droga Królewska');
      expect(drogaKrolewska.length).toBeGreaterThan(0);

      const wroclaw = screen.getAllByText('Wrocławskie mosty');
      expect(wroclaw.length).toBeGreaterThan(0);
    });

    it('displays view counts', () => {
      render(<DashboardPage />);

      // mockTours have views: 1500, 2300, 800
      // Using formatNumber for thousands
      expect(screen.getByText(/2[\s,.]?3/)).toBeInTheDocument(); // 2.3k or 2,300
      expect(screen.getByText(/1[\s,.]?5/)).toBeInTheDocument(); // 1.5k or 1,500
    });
  });

  describe('Recent Tours Table', () => {
    it('renders recent tours section', () => {
      render(<DashboardPage />);

      expect(
        screen.getByText(/recent tours|ostatnie wycieczki/i)
      ).toBeInTheDocument();
    });

    it('displays tour names', () => {
      render(<DashboardPage />);

      // Tour names from mockTours - check that at least one appears
      // mockTours: "Najważniejsze zabytki Krakowa", "Droga Królewska", "Wrocławskie mosty"
      const krakow = screen.queryAllByText(
        /Najważniejsze zabytki Krakowa|Krakow Highlights/i
      );
      const royal = screen.queryAllByText(/Droga Królewska|Royal Road/i);

      expect(krakow.length + royal.length).toBeGreaterThan(0);
    });

    it('shows status badges', () => {
      render(<DashboardPage />);

      // Check for Published and Draft badges
      const publishedBadges = screen.getAllByText(/published|opublikowana/i);
      const draftBadges = screen.getAllByText(/draft|szkic/i);

      expect(publishedBadges.length).toBeGreaterThan(0);
      expect(draftBadges.length).toBeGreaterThan(0);
    });
  });

  describe('Activity Feed', () => {
    it('renders activity section', () => {
      render(<DashboardPage />);

      expect(
        screen.getByText(/recent activity|ostatnia aktywność/i)
      ).toBeInTheDocument();
    });

    it('displays activity items', () => {
      render(<DashboardPage />);

      // Check for activity entries - Admin is the user in mock data
      const adminElements = screen.getAllByText('Admin');
      expect(adminElements.length).toBeGreaterThan(0);
    });

    it('shows action types', () => {
      render(<DashboardPage />);

      // Use getAllByText for actions that appear multiple times
      const createdActions = screen.getAllByText(/created|utworzył/i);
      expect(createdActions.length).toBeGreaterThan(0);
    });

    it('shows timestamps', () => {
      render(<DashboardPage />);

      // Check for time indicators
      expect(screen.getByText(/2 godz\. temu/i)).toBeInTheDocument();
    });
  });

  describe('Responsive Layout', () => {
    it('renders in a grid layout', () => {
      const { container } = render(<DashboardPage />);

      // Check for grid classes on stats cards container
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
    });
  });
});
