import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input, { Textarea, Select, Checkbox, Radio } from './Input';

describe('Input Component', () => {
  describe('Rendering', () => {
    it('renders input field', () => {
      render(<Input id="test-input" />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(<Input id="test-input" label="Email" />);
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('renders required indicator when required', () => {
      render(<Input id="test-input" label="Email" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('renders error message when error is provided', () => {
      render(<Input id="test-input" error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('renders helper text when provided', () => {
      render(<Input id="test-input" helperText="Enter a valid email" />);
      expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
    });
  });

  describe('States', () => {
    it('renders disabled input', () => {
      render(<Input id="test-input" disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('applies error styles when error is present', () => {
      render(<Input id="test-input" error="Error message" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-error-500');
    });
  });

  describe('Accessibility', () => {
    it('associates label with input', () => {
      render(<Input id="test-input" label="Email" />);
      const label = screen.getByText('Email');
      expect(label.tagName).toBe('LABEL');
    });

    it('sets aria-describedby for error', () => {
      render(<Input id="test-input" error="Error message" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'test-input-error');
    });

    it('sets aria-describedby for helper text', () => {
      render(<Input id="test-input" helperText="Helper text" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'test-input-helper');
    });
  });

  describe('User Interaction', () => {
    it('updates value on user input', async () => {
      render(<Input id="test-input" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      await userEvent.type(input, 'test value');
      expect(input.value).toBe('test value');
    });
  });
});

describe('Textarea Component', () => {
  describe('Rendering', () => {
    it('renders textarea field', () => {
      render(<Textarea id="test-textarea" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(<Textarea id="test-textarea" label="Comments" />);
      expect(screen.getByText('Comments')).toBeInTheDocument();
    });

    it('renders error message when error is provided', () => {
      render(<Textarea id="test-textarea" error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
  });

  describe('User Interaction', () => {
    it('updates value on user input', async () => {
      render(<Textarea id="test-textarea" />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      await userEvent.type(textarea, 'test comment');
      expect(textarea.value).toBe('test comment');
    });
  });
});

describe('Select Component', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ];

  describe('Rendering', () => {
    it('renders select field', () => {
      render(<Select id="test-select" options={options} />);
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('renders all options', () => {
      render(<Select id="test-select" options={options} />);
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(<Select id="test-select" label="Role" options={options} />);
      expect(screen.getByText('Role')).toBeInTheDocument();
    });
  });

  describe('User Interaction', () => {
    it('updates value on selection', async () => {
      render(<Select id="test-select" options={options} />);
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      await userEvent.selectOptions(select, 'option1');
      expect(select.value).toBe('option1');
    });
  });
});

describe('Checkbox Component', () => {
  describe('Rendering', () => {
    it('renders checkbox input', () => {
      render(<Checkbox id="test-checkbox" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(<Checkbox id="test-checkbox" label="Agree" />);
      expect(screen.getByText('Agree')).toBeInTheDocument();
    });

    it('renders error message when error is provided', () => {
      render(<Checkbox id="test-checkbox" error="This is required" />);
      expect(screen.getByText('This is required')).toBeInTheDocument();
    });
  });

  describe('User Interaction', () => {
    it('toggles checked state on click', async () => {
      render(<Checkbox id="test-checkbox" />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(false);
      await userEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);
    });
  });
});

describe('Radio Component', () => {
  describe('Rendering', () => {
    it('renders radio input', () => {
      render(<Radio id="test-radio" name="options" />);
      const radio = screen.getByRole('radio');
      expect(radio).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(<Radio id="test-radio" name="options" label="Option 1" />);
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('renders error message when error is provided', () => {
      render(<Radio id="test-radio" name="options" error="Select one" />);
      expect(screen.getByText('Select one')).toBeInTheDocument();
    });
  });

  describe('User Interaction', () => {
    it('selects radio on click', async () => {
      render(<Radio id="test-radio" name="options" />);
      const radio = screen.getByRole('radio') as HTMLInputElement;
      expect(radio.checked).toBe(false);
      await userEvent.click(radio);
      expect(radio.checked).toBe(true);
    });
  });
});
