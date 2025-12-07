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

      // Check for stat values (mock data from citiesData.all)
      expect(screen.getByText('24')).toBeInTheDocument(); // Tours
      expect(screen.getByText('156')).toBeInTheDocument(); // POIs
      // Cities value 4 appears in multiple places, use getAllByText
      const citiesValues = screen.getAllByText('4');
      expect(citiesValues.length).toBeGreaterThan(0);
    });

    it('shows trend indicators for stats', () => {
      render(<DashboardPage />);

      // Check that trend values are present
      expect(screen.getByText('+3')).toBeInTheDocument();
      expect(screen.getByText('+12')).toBeInTheDocument();
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

      expect(screen.getByText('420')).toBeInTheDocument(); // Views for first tour
      expect(screen.getByText('380')).toBeInTheDocument(); // Views for second tour
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

      // Tour names may appear in multiple places (table and activity), use getAllByText
      const legendy = screen.getAllByText('Krakowskie legendy');
      expect(legendy.length).toBeGreaterThan(0);

      expect(
        screen.getByText('Historyczne kościoły Warszawy')
      ).toBeInTheDocument();
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
