import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-label font-medium text-neutral-900 dark:text-neutral-50 mb-2">
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder-neutral-500 dark:placeholder-neutral-400 transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-100 dark:disabled:bg-neutral-900 disabled:cursor-not-allowed ${
            error ? 'border-error-500 focus:ring-error-500' : ''
          } ${className}`}
          aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${props.id}-error`} className="text-body-sm text-error-500 mt-1">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${props.id}-helper`} className="text-body-sm text-neutral-600 dark:text-neutral-400 mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-label font-medium text-neutral-900 dark:text-neutral-50 mb-2">
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full px-4 py-3 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder-neutral-500 dark:placeholder-neutral-400 transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-100 dark:disabled:bg-neutral-900 disabled:cursor-not-allowed resize-vertical min-h-32 ${
            error ? 'border-error-500 focus:ring-error-500' : ''
          } ${className}`}
          aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${props.id}-error`} className="text-body-sm text-error-500 mt-1">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${props.id}-helper`} className="text-body-sm text-neutral-600 dark:text-neutral-400 mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Select Component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
  className?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-label font-medium text-neutral-900 dark:text-neutral-50 mb-2">
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full px-4 py-3 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-100 dark:disabled:bg-neutral-900 disabled:cursor-not-allowed appearance-none cursor-pointer ${
            error ? 'border-error-500 focus:ring-error-500' : ''
          } ${className}`}
          aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
          {...props}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${props.id}-error`} className="text-body-sm text-error-500 mt-1">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${props.id}-helper`} className="text-body-sm text-neutral-600 dark:text-neutral-400 mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// Checkbox Component
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex items-center">
        <input
          ref={ref}
          type="checkbox"
          className={`w-5 h-5 rounded border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-primary-500 transition-all duration-fast cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 ${
            error ? 'border-error-500' : ''
          } ${className}`}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {label && (
          <label htmlFor={props.id} className="ml-3 text-body-regular text-neutral-900 dark:text-neutral-50 cursor-pointer">
            {label}
          </label>
        )}
        {error && (
          <p id={`${props.id}-error`} className="text-body-sm text-error-500 ml-3">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// Radio Button Component
interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex items-center">
        <input
          ref={ref}
          type="radio"
          className={`w-5 h-5 rounded-full border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-primary-500 transition-all duration-fast cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 ${
            error ? 'border-error-500' : ''
          } ${className}`}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {label && (
          <label htmlFor={props.id} className="ml-3 text-body-regular text-neutral-900 dark:text-neutral-50 cursor-pointer">
            {label}
          </label>
        )}
        {error && (
          <p id={`${props.id}-error`} className="text-body-sm text-error-500 ml-3">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
