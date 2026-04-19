import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge, StatusBadge, RoleBadge } from './Badge';

describe('Badge Component', () => {
  describe('Variants', () => {
    it('renders success badge', () => {
      const { container } = render(<Badge variant="success">Success</Badge>);
      const badge = container.firstChild;
      expect(badge).toHaveClass('bg-success-100', 'text-success-700');
    });

    it('renders error badge', () => {
      const { container } = render(<Badge variant="error">Error</Badge>);
      const badge = container.firstChild;
      expect(badge).toHaveClass('bg-error-100', 'text-error-700');
    });

    it('renders warning badge', () => {
      const { container } = render(<Badge variant="warning">Warning</Badge>);
      const badge = container.firstChild;
      expect(badge).toHaveClass('bg-accent-100', 'text-accent-700');
    });

    it('renders info badge', () => {
      const { container } = render(<Badge variant="info">Info</Badge>);
      const badge = container.firstChild;
      expect(badge).toHaveClass('bg-primary-100', 'text-primary-700');
    });

    it('renders primary badge', () => {
      const { container } = render(<Badge variant="primary">Primary</Badge>);
      const badge = container.firstChild;
      expect(badge).toHaveClass('bg-primary-100', 'text-primary-700');
    });

    it('renders secondary badge', () => {
      const { container } = render(<Badge variant="secondary">Secondary</Badge>);
      const badge = container.firstChild;
      expect(badge).toHaveClass('bg-neutral-100', 'text-neutral-700');
    });
  });

  describe('Sizes', () => {
    it('renders small badge', () => {
      const { container } = render(<Badge size="sm">Small</Badge>);
      const badge = container.firstChild;
      expect(badge).toHaveClass('px-2', 'py-1', 'text-caption');
    });

    it('renders medium badge', () => {
      const { container } = render(<Badge size="md">Medium</Badge>);
      const badge = container.firstChild;
      expect(badge).toHaveClass('px-3', 'py-1', 'text-label');
    });

    it('renders large badge', () => {
      const { container } = render(<Badge size="lg">Large</Badge>);
      const badge = container.firstChild;
      expect(badge).toHaveClass('px-4', 'py-2', 'text-body-sm');
    });
  });

  describe('Rendering', () => {
    it('renders children correctly', () => {
      render(<Badge>Test Badge</Badge>);
      expect(screen.getByText('Test Badge')).toBeInTheDocument();
    });

    it('accepts custom className', () => {
      const { container } = render(<Badge className="custom-class">Badge</Badge>);
      const badge = container.firstChild;
      expect(badge).toHaveClass('custom-class');
    });

    it('applies rounded-full class', () => {
      const { container } = render(<Badge>Badge</Badge>);
      const badge = container.firstChild;
      expect(badge).toHaveClass('rounded-full');
    });
  });
});

describe('StatusBadge Component', () => {
  it('renders active status', () => {
    render(<StatusBadge status="active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders pending status', () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders inactive status', () => {
    render(<StatusBadge status="inactive" />);
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('renders alert status', () => {
    render(<StatusBadge status="alert" />);
    expect(screen.getByText('Alert')).toBeInTheDocument();
  });

  it('applies correct variant for active status', () => {
    const { container } = render(<StatusBadge status="active" />);
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-success-100');
  });

  it('applies correct variant for pending status', () => {
    const { container } = render(<StatusBadge status="pending" />);
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-accent-100');
  });

  it('applies correct variant for inactive status', () => {
    const { container } = render(<StatusBadge status="inactive" />);
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-neutral-100');
  });

  it('applies correct variant for alert status', () => {
    const { container } = render(<StatusBadge status="alert" />);
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-error-100');
  });
});

describe('RoleBadge Component', () => {
  it('renders patient role', () => {
    render(<RoleBadge role="patient" />);
    expect(screen.getByText('Patient')).toBeInTheDocument();
  });

  it('renders nurse role', () => {
    render(<RoleBadge role="nurse" />);
    expect(screen.getByText('Nurse')).toBeInTheDocument();
  });

  it('renders doctor role', () => {
    render(<RoleBadge role="doctor" />);
    expect(screen.getByText('Doctor')).toBeInTheDocument();
  });

  it('renders admin role', () => {
    render(<RoleBadge role="admin" />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('applies correct variant for patient role', () => {
    const { container } = render(<RoleBadge role="patient" />);
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-primary-100');
  });

  it('applies correct variant for nurse role', () => {
    const { container } = render(<RoleBadge role="nurse" />);
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-success-100');
  });

  it('applies correct variant for doctor role', () => {
    const { container } = render(<RoleBadge role="doctor" />);
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-primary-100');
  });

  it('applies correct variant for admin role', () => {
    const { container } = render(<RoleBadge role="admin" />);
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-accent-100');
  });
});
