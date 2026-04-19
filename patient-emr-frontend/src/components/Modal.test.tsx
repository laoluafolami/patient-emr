import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal, ModalHeader, ModalBody, ModalFooter } from './Modal';

describe('Modal Component', () => {
  describe('Rendering', () => {
    it('does not render when isOpen is false', () => {
      render(
        <Modal isOpen={false} onClose={jest.fn()}>
          Content
        </Modal>
      );
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('renders when isOpen is true', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()}>
          Content
        </Modal>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders title when provided', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()} title="Test Modal">
          Content
        </Modal>
      );
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
    });

    it('renders footer when provided', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()} footer={<button>Close</button>}>
          Content
        </Modal>
      );
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('applies small size class', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={jest.fn()} size="sm">
          Content
        </Modal>
      );
      const modal = container.querySelector('[role="dialog"]');
      expect(modal).toHaveClass('max-w-sm');
    });

    it('applies medium size class', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={jest.fn()} size="md">
          Content
        </Modal>
      );
      const modal = container.querySelector('[role="dialog"]');
      expect(modal).toHaveClass('max-w-md');
    });

    it('applies large size class', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={jest.fn()} size="lg">
          Content
        </Modal>
      );
      const modal = container.querySelector('[role="dialog"]');
      expect(modal).toHaveClass('max-w-lg');
    });
  });

  describe('Accessibility', () => {
    it('has role="dialog"', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={jest.fn()}>
          Content
        </Modal>
      );
      const modal = container.querySelector('[role="dialog"]');
      expect(modal).toHaveAttribute('role', 'dialog');
    });

    it('has aria-modal="true"', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={jest.fn()}>
          Content
        </Modal>
      );
      const modal = container.querySelector('[role="dialog"]');
      expect(modal).toHaveAttribute('aria-modal', 'true');
    });

    it('has aria-labelledby when title is provided', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={jest.fn()} title="Test Modal">
          Content
        </Modal>
      );
      const modal = container.querySelector('[role="dialog"]');
      expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('close button has aria-label', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()} title="Test Modal">
          Content
        </Modal>
      );
      const closeButton = screen.getByLabelText('Close modal');
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('User Interaction', () => {
    it('calls onClose when close button is clicked', async () => {
      const handleClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Test Modal">
          Content
        </Modal>
      );
      const closeButton = screen.getByLabelText('Close modal');
      await userEvent.click(closeButton);
      await waitFor(() => {
        expect(handleClose).toHaveBeenCalledTimes(1);
      });
    });

    it('calls onClose when backdrop is clicked', async () => {
      const handleClose = jest.fn();
      const { container } = render(
        <Modal isOpen={true} onClose={handleClose}>
          Content
        </Modal>
      );
      const backdrop = container.querySelector('[role="presentation"]');
      if (backdrop) {
        await userEvent.click(backdrop);
        expect(handleClose).toHaveBeenCalledTimes(1);
      }
    });

    it('does not close when modal content is clicked', async () => {
      const handleClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={handleClose}>
          <button>Click me</button>
        </Modal>
      );
      const button = screen.getByRole('button', { name: /click me/i });
      await userEvent.click(button);
      expect(handleClose).not.toHaveBeenCalled();
    });

    it('closes when Escape key is pressed', async () => {
      const handleClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={handleClose}>
          Content
        </Modal>
      );
      await userEvent.keyboard('{Escape}');
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Body Overflow', () => {
    it('sets body overflow to hidden when modal is open', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()}>
          Content
        </Modal>
      );
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body overflow when modal is closed', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={jest.fn()}>
          Content
        </Modal>
      );
      rerender(
        <Modal isOpen={false} onClose={jest.fn()}>
          Content
        </Modal>
      );
      expect(document.body.style.overflow).toBe('unset');
    });
  });
});

describe('ModalHeader Component', () => {
  it('renders title', () => {
    render(<ModalHeader title="Test Title" onClose={jest.fn()} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders close button', () => {
    render(<ModalHeader title="Test Title" onClose={jest.fn()} />);
    const closeButton = screen.getByLabelText('Close modal');
    expect(closeButton).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const handleClose = jest.fn();
    render(<ModalHeader title="Test Title" onClose={handleClose} />);
    const closeButton = screen.getByLabelText('Close modal');
    await userEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

describe('ModalBody Component', () => {
  it('renders children', () => {
    render(<ModalBody>Test Content</ModalBody>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    const { container } = render(<ModalBody className="custom-class">Content</ModalBody>);
    const body = container.firstChild;
    expect(body).toHaveClass('custom-class');
  });
});

describe('ModalFooter Component', () => {
  it('renders children', () => {
    render(<ModalFooter><button>Action</button></ModalFooter>);
    expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    const { container } = render(<ModalFooter className="custom-class"><div>Content</div></ModalFooter>);
    const footer = container.firstChild;
    expect(footer).toHaveClass('custom-class');
  });
});
