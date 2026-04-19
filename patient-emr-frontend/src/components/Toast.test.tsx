import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast, ToastContainer, useToast } from './Toast';

describe('Toast Component', () => {
  describe('Rendering', () => {
    it('renders success toast', () => {
      render(
        <Toast
          id="1"
          type="success"
          message="Success message"
          onClose={jest.fn()}
        />
      );
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });

    it('renders error toast', () => {
      render(
        <Toast
          id="1"
          type="error"
          message="Error message"
          onClose={jest.fn()}
        />
      );
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('renders warning toast', () => {
      render(
        <Toast
          id="1"
          type="warning"
          message="Warning message"
          onClose={jest.fn()}
        />
      );
      expect(screen.getByText('Warning message')).toBeInTheDocument();
    });

    it('renders info toast', () => {
      render(
        <Toast
          id="1"
          type="info"
          message="Info message"
          onClose={jest.fn()}
        />
      );
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies success background color', () => {
      const { container } = render(
        <Toast
          id="1"
          type="success"
          message="Success"
          onClose={jest.fn()}
        />
      );
      const toast = container.firstChild;
      expect(toast).toHaveClass('bg-success-500');
    });

    it('applies error background color', () => {
      const { container } = render(
        <Toast
          id="1"
          type="error"
          message="Error"
          onClose={jest.fn()}
        />
      );
      const toast = container.firstChild;
      expect(toast).toHaveClass('bg-error-500');
    });

    it('applies warning background color', () => {
      const { container } = render(
        <Toast
          id="1"
          type="warning"
          message="Warning"
          onClose={jest.fn()}
        />
      );
      const toast = container.firstChild;
      expect(toast).toHaveClass('bg-accent-500');
    });

    it('applies info background color', () => {
      const { container } = render(
        <Toast
          id="1"
          type="info"
          message="Info"
          onClose={jest.fn()}
        />
      );
      const toast = container.firstChild;
      expect(toast).toHaveClass('bg-primary-500');
    });
  });

  describe('Accessibility', () => {
    it('has role="alert"', () => {
      const { container } = render(
        <Toast
          id="1"
          type="success"
          message="Message"
          onClose={jest.fn()}
        />
      );
      const toast = container.firstChild;
      expect(toast).toHaveAttribute('role', 'alert');
    });

    it('has aria-live="polite"', () => {
      const { container } = render(
        <Toast
          id="1"
          type="success"
          message="Message"
          onClose={jest.fn()}
        />
      );
      const toast = container.firstChild;
      expect(toast).toHaveAttribute('aria-live', 'polite');
    });

    it('close button has aria-label', () => {
      render(
        <Toast
          id="1"
          type="success"
          message="Message"
          onClose={jest.fn()}
        />
      );
      const closeButton = screen.getByLabelText('Close notification');
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('User Interaction', () => {
    it('calls onClose when close button is clicked', async () => {
      const handleClose = jest.fn();
      render(
        <Toast
          id="1"
          type="success"
          message="Message"
          onClose={handleClose}
        />
      );
      const closeButton = screen.getByLabelText('Close notification');
      await userEvent.click(closeButton);
      await waitFor(() => {
        expect(handleClose).toHaveBeenCalledWith('1');
      });
    });

    it('auto-closes after duration', async () => {
      const handleClose = jest.fn();
      render(
        <Toast
          id="1"
          type="success"
          message="Message"
          duration={100}
          onClose={handleClose}
        />
      );
      await waitFor(
        () => {
          expect(handleClose).toHaveBeenCalledWith('1');
        },
        { timeout: 500 }
      );
    });
  });
});

describe('ToastContainer Component', () => {
  it('renders multiple toasts', () => {
    const toasts = [
      { id: '1', type: 'success' as const, message: 'Success' },
      { id: '2', type: 'error' as const, message: 'Error' },
    ];
    render(<ToastContainer toasts={toasts} onClose={jest.fn()} />);
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renders empty when no toasts', () => {
    const { container } = render(<ToastContainer toasts={[]} onClose={jest.fn()} />);
    expect(container.firstChild?.childNodes.length).toBe(0);
  });

  it('calls onClose when toast is closed', async () => {
    const handleClose = jest.fn();
    const toasts = [{ id: '1', type: 'success' as const, message: 'Success' }];
    render(<ToastContainer toasts={toasts} onClose={handleClose} />);
    const closeButton = screen.getByLabelText('Close notification');
    await userEvent.click(closeButton);
    await waitFor(() => {
      expect(handleClose).toHaveBeenCalledWith('1');
    });
  });
});

describe('useToast Hook', () => {
  function TestComponent() {
    const { toasts, success, error, warning, info, removeToast } = useToast();
    return (
      <div>
        <button onClick={() => success('Success message')}>Show Success</button>
        <button onClick={() => error('Error message')}>Show Error</button>
        <button onClick={() => warning('Warning message')}>Show Warning</button>
        <button onClick={() => info('Info message')}>Show Info</button>
        <div>
          {toasts.map((toast) => (
            <div key={toast.id} onClick={() => removeToast(toast.id)}>
              {toast.message}
            </div>
          ))}
        </div>
      </div>
    );
  }

  it('adds success toast', async () => {
    render(<TestComponent />);
    const button = screen.getByRole('button', { name: /show success/i });
    await userEvent.click(button);
    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('adds error toast', async () => {
    render(<TestComponent />);
    const button = screen.getByRole('button', { name: /show error/i });
    await userEvent.click(button);
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('adds warning toast', async () => {
    render(<TestComponent />);
    const button = screen.getByRole('button', { name: /show warning/i });
    await userEvent.click(button);
    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('adds info toast', async () => {
    render(<TestComponent />);
    const button = screen.getByRole('button', { name: /show info/i });
    await userEvent.click(button);
    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('removes toast', async () => {
    render(<TestComponent />);
    const button = screen.getByRole('button', { name: /show success/i });
    await userEvent.click(button);
    const toast = screen.getByText('Success message');
    await userEvent.click(toast);
    await waitFor(() => {
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    });
  });
});
