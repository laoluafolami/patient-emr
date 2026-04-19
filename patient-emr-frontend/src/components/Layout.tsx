import React, { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import Button from './Button';

interface LayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  showSidebar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  header,
  sidebar,
  showSidebar = true,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-800 shadow-elevation-1 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            {showSidebar && (
              <Button
                variant="icon"
                size="md"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden"
                ariaLabel="Toggle sidebar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
            )}

            {/* Header content */}
            {header && <div className="flex-1">{header}</div>}
          </div>

          {/* Theme toggle */}
          <ThemeToggle />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {showSidebar && sidebar && (
          <>
            {/* Mobile sidebar backdrop */}
            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <aside
              className={`fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-neutral-800 shadow-elevation-2 transform transition-transform duration-fast z-30 lg:relative lg:top-0 lg:transform-none lg:shadow-none ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
              }`}
            >
              <div className="h-full overflow-y-auto p-4">{sidebar}</div>
            </aside>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

// Header component
interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const LayoutHeader: React.FC<HeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-h2 font-headline font-bold text-neutral-900 dark:text-neutral-50">
          {title}
        </h1>
        {subtitle && (
          <p className="text-body-regular text-neutral-600 dark:text-neutral-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};

// Sidebar navigation component
interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

interface SidebarNavProps {
  items: NavItem[];
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ items }) => {
  return (
    <nav className="space-y-2">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          onClick={item.onClick}
          className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-fast ${
            item.active
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
              : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
          }`}
        >
          {item.icon && <span className="w-5 h-5">{item.icon}</span>}
          <span className="text-body-regular font-medium">{item.label}</span>
        </a>
      ))}
    </nav>
  );
};
