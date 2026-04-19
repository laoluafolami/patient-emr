import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useTheme } from '../../context/ThemeContext';

const Particle = ({ style }: { style: React.CSSProperties }) => (
  <div className="absolute rounded-full opacity-20 animate-pulse" style={style} />
);

export const ForgotPasswordPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (value: string): boolean => {
    if (!value.trim()) {
      setEmailError('Email address is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

    setIsLoading(true);
    setError('');

    try {
      await authService.forgotPassword(email.trim().toLowerCase());
      setIsSubmitted(true);
    } catch (err: any) {
      // Still show success to prevent user enumeration
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <Particle style={{ width: 300, height: 300, background: '#4A90E2', top: '-5%', left: '-5%', filter: 'blur(80px)' }} />
      <Particle style={{ width: 250, height: 250, background: '#2ECC71', bottom: '10%', right: '-5%', filter: 'blur(80px)', animationDelay: '1s' }} />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm shadow-elevation-2 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:scale-110 transition-all duration-300 z-10"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707zm2.121-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <div className="relative w-full max-w-md mx-4 animate-scale-in">
        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-2xl shadow-elevation-4 border border-white/50 dark:border-neutral-700/50 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-400" />

          <div className="p-8">
            {!isSubmitted ? (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-elevation-3 mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-neutral-900 dark:text-white font-headline">
                    Forgot Password?
                  </h1>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    Enter your email and we'll send you a reset link
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800 animate-slide-up">
                    <p className="text-sm text-error-700 dark:text-error-300">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                        placeholder="you@example.com"
                        autoComplete="email"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm text-neutral-900 dark:text-white placeholder-neutral-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 ${
                          emailError ? 'border-error-400 dark:border-error-600' : 'border-neutral-200 dark:border-neutral-700'
                        }`}
                      />
                    </div>
                    {emailError && (
                      <p className="mt-1.5 text-xs text-error-600 dark:text-error-400">{emailError}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success state */
              <div className="text-center py-4 animate-scale-in">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary-100 dark:bg-secondary-900/30 mb-6">
                  <svg className="w-10 h-10 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 font-headline">
                  Check Your Email
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">
                  If an account exists for <strong className="text-neutral-700 dark:text-neutral-300">{email}</strong>, 
                  you'll receive a password reset link shortly.
                </p>
                <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/50 mb-6">
                  <p className="text-xs text-primary-700 dark:text-primary-300">
                    The link will expire in <strong>24 hours</strong>. Check your spam folder if you don't see it.
                  </p>
                </div>
                <button
                  onClick={() => { setIsSubmitted(false); setEmail(''); }}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium transition-colors"
                >
                  Try a different email
                </button>
              </div>
            )}
          </div>

          <div className="px-8 py-4 bg-neutral-50/80 dark:bg-neutral-800/50 border-t border-neutral-100 dark:border-neutral-700/50 text-center">
            <Link
              to="/login"
              className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center justify-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
