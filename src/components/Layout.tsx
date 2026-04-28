import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Camera,
  Wallet,
  TrendingUp,
  PiggyBank,
  ChevronLeft,
} from 'lucide-react';

const tabs = [
  { path: '/',            label: 'Dashboard',  icon: LayoutDashboard },
  { path: '/snapshot',   label: 'Snapshot',   icon: Camera },
  { path: '/balances',   label: 'Balances',   icon: Wallet },
  { path: '/strategies', label: 'Strategies', icon: TrendingUp },
  { path: '/planning',   label: 'Planning',   icon: PiggyBank },
];

const pageTitles: Record<string, string> = {
  '/':                          'Your 7-Year Runway',
  '/snapshot':                  'Your Snapshot',
  '/balances':                  'Account Balances',
  '/strategies':                'Strategies',
  '/strategies/roth-conversion':'Roth Conversion Ladder',
  '/strategies/rmd-projector':  'RMD Projector',
  '/strategies/social-security':'Social Security',
  '/strategies/withdrawal':     'Withdrawal Strategy',
  '/planning':                  'Planning',
  '/planning/catch-up':         'Catch-Up Tracker',
  '/planning/medicare':         'Medicare & Health',
};

const sidebarItems = [
  { path: '/',            label: 'Dashboard' },
  { path: '/snapshot',   label: 'Your Snapshot' },
  { path: '/balances',   label: 'Account Balances' },
  { path: '/strategies', label: 'Strategies', children: [
    { path: '/strategies/roth-conversion', label: 'Roth Conversion' },
    { path: '/strategies/rmd-projector',   label: 'RMD Projector' },
    { path: '/strategies/social-security', label: 'Social Security' },
    { path: '/strategies/withdrawal',      label: 'Withdrawal' },
  ]},
  { path: '/planning', label: 'Planning', children: [
    { path: '/planning/catch-up', label: 'Catch-Up Tracker' },
    { path: '/planning/medicare', label: 'Medicare & Health' },
  ]},
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;
  const title = pageTitles[pathname] ?? '7-Year Runway';
  const isSubPage = pathname.split('/').length > 2;

  return (
    <div className="flex h-screen bg-gray-50">

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-64 bg-white shadow-sm border-r border-gray-200 flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-800">The 7-Year Runway</h1>
          <p className="text-xs text-gray-400 mt-1">Retirement Dashboard</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-0.5 px-3">
            {sidebarItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
                {'children' in item && item.children && (
                  <ul className="ml-4 mt-0.5 space-y-0.5">
                    {item.children.map((child) => (
                      <li key={child.path}>
                        <NavLink
                          to={child.path}
                          className={({ isActive }) =>
                            `flex items-center px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              isActive ? 'text-blue-700 font-medium' : 'text-gray-500 hover:text-gray-700'
                            }`
                          }
                        >
                          {child.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-100 text-xs text-gray-400 text-center">
          For Ages 55–62
        </div>
      </aside>

      {/* ── Mobile layout ── */}
      <div className="flex flex-col flex-1 min-h-0 md:hidden">

        {/* Top header */}
        <header
          className="bg-white border-b border-gray-200 shrink-0 flex items-center gap-2 px-4 py-3"
          style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}
        >
          {isSubPage && (
            <button
              onClick={() => navigate(-1)}
              className="mr-1 -ml-1 p-1 rounded-full text-blue-600"
              aria-label="Back"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          <div>
            {!isSubPage && (
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">7-Year Runway</p>
            )}
            <h1 className="text-lg font-bold text-gray-900 leading-tight">{title}</h1>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 pb-28">
            <Outlet />
          </div>
        </main>

        {/* Bottom tab bar */}
        <nav
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="flex">
            {tabs.map((tab) => {
              const isActive = tab.path === '/' ? pathname === '/' : pathname.startsWith(tab.path);
              return (
                <NavLink
                  key={tab.path}
                  to={tab.path}
                  className="flex-1 flex flex-col items-center gap-0.5 py-2"
                >
                  <tab.icon className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className={`text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                    {tab.label}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>

      {/* ── Desktop main content ── */}
      <main className="hidden md:block flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
}
