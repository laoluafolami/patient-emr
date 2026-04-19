import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useTheme } from '../../context/ThemeContext';

interface PasswordRequirement {
  label: string;
  test: (pw: string) => boolean;
}

const requirements: PasswordRequirement[] = [
  { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { label: 'One uppercase letter (A-Z)', test: (pw) => /[A-Z]/.test(pw) },
  { label: 'One lowercase letter (a-z)', test: (pw) => /[a-z]/.test(pw) },
  { label: 'One number (0-9)', test: (pw) => /[0-9]/.test(pw) },
  { label: 'One special character (!@#$...)', test: (pw) => /[!@#$%^&*()_+\-={}[\];':"\\|,.<>/?]/.test(pw) },
];

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

const Particle = ({ style }: { style: React.CSSProperties }) => (
  <div className="absolute rounded-full opacity-20 animate-pulse" style={style} />
);

export const ResetPasswordPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, [token]);

  const getStrength = (): { score: number; label: string; color: string } => {
    const passed = requirements.filter((r) => r.test(password)).length;
    if (passed <= 1) return { score: 1, label: 'Weak', color: 'bg-error-500' };
    if (passed <= 2) return { score: 2, label: 'Fair', color: 'bg-accent-500' };
    if (passed <= 3) return { score: 3, label: 'Good', color: 'bg-yellow-500' };
    if (passed <= 4) return { score: 4, label: 'Strong', color: 'bg-secondary-500' };
    return { score: 5, label: 'Very Strong', color: 'bg-secondary-600' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setConfirmError('');

    if (!token) {
      setError('Invalid reset token.');
      return;
    }

    const allPassed = requirements.every((r) => r.test(password));
    if (!allPassed) {
      setError('Password does not meet all requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(token, password, confirmPassword);
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  const strength = password ? getStrength() : null;

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
            {isSuccess ? (
              <div className="text-center py-4 animate-scale-in">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary-100 dark:bg-secondary-900/30 mb-6">
                  <svg className="w-10 h-10 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 font-headline">
                  Password Reset!
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                  Your password has been reset successfully. Redirecting you to login...
                </p>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-pulse" style={{ width: '100%' }} />
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-elevation-3 mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-neutral-900 dark:text-white font-headline">
                    Create New Password
                  </h1>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    Choose a strong password for your account
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800 animate-slide-up">
                    <p className="text-sm text-error-700 dark:text-error-300">{error}</p>
                    {!token && (
                      <Link to="/forgot-password" className="text-sm text-primary-600 dark:text-primary-400 font-medium mt-2 block">
                        Request a new reset link →
                      </Link>
                    )}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* New password */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                        className="w-full pl-11 pr-12 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm text-neutral-900 dark:text-white placeholder-neutral-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                      >
                        <EyeIcon open={showPassword} />
                      </button>
                    </div>

                    {/* Strength meter */}
                    {password && strength && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                i <= strength.score ? strength.color : 'bg-neutral-200 dark:bg-neutral-700'
                              }`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs font-medium ${
                          strength.score <= 2 ? 'text-error-600' : strength.score <= 3 ? 'text-yellow-600' : 'text-secondary-600'
                        }`}>
                          {strength.label}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Requirements checklist */}
                  {password && (
                    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/50 space-y-2">
                      {requirements.map((req, i) => {
                        const passed = req.test(password);
                        return (
                          <div key={i} className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                              passed ? 'bg-secondary-500' : 'bg-neutral-200 dark:bg-neutral-700'
                            }`}>
                              {passed && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-xs transition-colors duration-200 ${
                              passed ? 'text-secondary-700 dark:text-secondary-400' : 'text-neutral-500 dark:text-neutral-400'
                            }`}>
                              {req.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Confirm password */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setConfirmError(''); }}
                        placeholder="Confirm your new password"
                        autoComplete="new-password"
                        className={`w-full pl-11 pr-12 py-3 rounded-xl border bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm text-neutral-900 dark:text-white placeholder-neutral-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 ${
                          confirmError ? 'border-error-400 dark:border-error-600' : 'border-neutral-200 dark:border-neutral-700'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                      >
                        <EyeIcon open={showConfirm} />
                      </button>
                    </div>
                    {confirmError && (
                      <p className="mt-1.5 text-xs text-error-600 dark:text-error-400">{confirmError}</p>
                    )}
                    {confirmPassword && !confirmError && password === confirmPassword && (
                      <p className="mt-1.5 text-xs text-secondary-600 dark:text-secondary-400 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Passwords match
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !token}
                    className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Resetting...
                      </span>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </form>
              </>
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

export default ResetPasswordPage;
