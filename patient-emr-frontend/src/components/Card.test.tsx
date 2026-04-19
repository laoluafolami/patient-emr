import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card, PatientRecordCard, VitalSignsCard, LabResultCard } from './Card';

describe('Card Component', () => {
  it('renders card with children', () => {
    render(<Card>Test Content</Card>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies card styles', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('bg-white', 'dark:bg-neutral-800', 'rounded-lg', 'shadow-elevation-2');
  });

  it('applies hover styles when hoverable is true', () => {
    const { container } = render(<Card hoverable={true}>Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('hover:shadow-elevation-3', 'hover:scale-101');
  });

  it('does not apply hover styles when hoverable is false', () => {
    const { container } = render(<Card hoverable={false}>Content</Card>);
    const card = container.firstChild;
    expect(card).not.toHaveClass('hover:shadow-elevation-3');
  });

  it('accepts custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('custom-class');
  });
});

describe('PatientRecordCard Component', () => {
  const defaultProps = {
    patientName: 'John Doe',
    patientId: 'P001',
    lastVisit: '2024-01-15',
    status: 'active' as const,
  };

  it('renders patient information', () => {
    render(<PatientRecordCard {...defaultProps} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('ID: P001')).toBeInTheDocument();
    expect(screen.getByText('Last visit: 2024-01-15')).toBeInTheDocument();
  });

  it('renders status badge', () => {
    render(<PatientRecordCard {...defaultProps} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders different status badges', () => {
    const { rerender } = render(<PatientRecordCard {...defaultProps} status="pending" />);
    expect(screen.getByText('Pending')).toBeInTheDocument();

    rerender(<PatientRecordCard {...defaultProps} status="inactive" />);
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('applies correct status colors', () => {
    const { container } = render(<PatientRecordCard {...defaultProps} status="active" />);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-success-100');
  });
});

describe('VitalSignsCard Component', () => {
  const defaultProps = {
    vitalName: 'Temperature',
    value: 98.6,
    unit: '°F',
    timestamp: '2024-01-15 10:30 AM',
    status: 'normal' as const,
  };

  it('renders vital signs information', () => {
    render(<VitalSignsCard {...defaultProps} />);
    expect(screen.getByText('Temperature')).toBeInTheDocument();
    expect(screen.getByText('98.6')).toBeInTheDocument();
    expect(screen.getByText('°F')).toBeInTheDocument();
    expect(screen.getByText('2024-01-15 10:30 AM')).toBeInTheDocument();
  });

  it('renders status indicator', () => {
    const { container } = render(<VitalSignsCard {...defaultProps} />);
    const indicator = container.querySelector('.bg-success-500');
    expect(indicator).toBeInTheDocument();
  });

  it('renders different status indicators', () => {
    const { container, rerender } = render(<VitalSignsCard {...defaultProps} status="warning" />);
    expect(container.querySelector('.bg-accent-500')).toBeInTheDocument();

    rerender(<VitalSignsCard {...defaultProps} status="critical" />);
    expect(container.querySelector('.bg-error-500')).toBeInTheDocument();
  });

  it('renders value in monospace font', () => {
    const { container } = render(<VitalSignsCard {...defaultProps} />);
    const valueElement = container.querySelector('.font-mono');
    expect(valueElement).toBeInTheDocument();
  });
});

describe('LabResultCard Component', () => {
  const defaultProps = {
    testName: 'Blood Test',
    date: '2024-01-15',
    status: 'completed' as const,
  };

  it('renders lab result information', () => {
    render(<LabResultCard {...defaultProps} />);
    expect(screen.getByText('Blood Test')).toBeInTheDocument();
    expect(screen.getByText('2024-01-15')).toBeInTheDocument();
  });

  it('renders status badge', () => {
    render(<LabResultCard {...defaultProps} />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('renders different status badges', () => {
    const { rerender } = render(<LabResultCard {...defaultProps} status="pending" />);
    expect(screen.getByText('Pending')).toBeInTheDocument();

    rerender(<LabResultCard {...defaultProps} status="reviewed" />);
    expect(screen.getByText('Reviewed')).toBeInTheDocument();
  });

  it('renders details when provided', () => {
    render(<LabResultCard {...defaultProps} details="All values normal" />);
    expect(screen.getByText('All values normal')).toBeInTheDocument();
  });

  it('does not render details when not provided', () => {
    render(<LabResultCard {...defaultProps} />);
    expect(screen.queryByText('All values normal')).not.toBeInTheDocument();
  });

  it('applies correct status colors', () => {
    const { container } = render(<LabResultCard {...defaultProps} status="completed" />);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-success-100');
  });
});
