import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import PageHeader from './PageHeader';
import StatCard from './StatCard';
import ErrorBoundary from './ErrorBoundary';
import { renderWithProviders } from '@/test/utils';

describe('PageHeader', () => {
  it('renders the title, subtitle, and actions', () => {
    renderWithProviders(
      <PageHeader title="Products" subtitle="Everything you sell" extra={<button>Add</button>} />,
      { route: '/dashboard/products' }
    );

    expect(screen.getByRole('heading', { name: 'Products' })).toBeInTheDocument();
    expect(screen.getByText('Everything you sell')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('builds a breadcrumb from the navigation tree', () => {
    renderWithProviders(<PageHeader title="Products" />, { route: '/dashboard/products' });

    expect(screen.getByText('Workspace')).toBeInTheDocument();
    expect(screen.getByText('Management')).toBeInTheDocument();
  });

  it('omits the breadcrumb when asked', () => {
    renderWithProviders(<PageHeader title="Products" breadcrumb={false} />, {
      route: '/dashboard/products',
    });

    expect(screen.queryByText('Workspace')).not.toBeInTheDocument();
  });
});

describe('StatCard', () => {
  it('shows an upward trend for a positive value', () => {
    renderWithProviders(<StatCard title="Revenue" value={1234} trend={12.4} />);

    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText(/12\.4%/)).toBeInTheDocument();
  });

  it('hides the trend row when no trend is given', () => {
    renderWithProviders(<StatCard title="Revenue" value={1234} />);
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });
});

describe('ErrorBoundary', () => {
  const Boom = () => {
    throw new Error('kaboom');
  };

  it('catches a render error instead of blanking the app', () => {
    renderWithProviders(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders its children when nothing throws', () => {
    renderWithProviders(
      <ErrorBoundary>
        <p>All good</p>
      </ErrorBoundary>
    );

    expect(screen.getByText('All good')).toBeInTheDocument();
  });
});
