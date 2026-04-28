import { lazy, Suspense } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { FinancialProvider } from './context/FinancialContext';
import { Layout } from './components/Layout';

const Dashboard     = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Snapshot      = lazy(() => import('./pages/Snapshot').then(m => ({ default: m.Snapshot })));
const Balances      = lazy(() => import('./pages/Balances').then(m => ({ default: m.Balances })));
const Strategies    = lazy(() => import('./pages/Strategies').then(m => ({ default: m.Strategies })));
const Planning      = lazy(() => import('./pages/Planning').then(m => ({ default: m.Planning })));
const RothConversion = lazy(() => import('./pages/RothConversion').then(m => ({ default: m.RothConversion })));
const RMDProjector  = lazy(() => import('./pages/RMDProjector').then(m => ({ default: m.RMDProjector })));
const SocialSecurity = lazy(() => import('./pages/SocialSecurity').then(m => ({ default: m.SocialSecurity })));
const Withdrawal    = lazy(() => import('./pages/Withdrawal').then(m => ({ default: m.Withdrawal })));
const CatchUp       = lazy(() => import('./pages/CatchUp').then(m => ({ default: m.CatchUp })));
const Medicare      = lazy(() => import('./pages/Medicare').then(m => ({ default: m.Medicare })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-40">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true,              element: <Suspense fallback={<PageLoader />}><Dashboard /></Suspense> },
      { path: 'snapshot',         element: <Suspense fallback={<PageLoader />}><Snapshot /></Suspense> },
      { path: 'balances',         element: <Suspense fallback={<PageLoader />}><Balances /></Suspense> },
      {
        path: 'strategies',
        children: [
          { index: true,                   element: <Suspense fallback={<PageLoader />}><Strategies /></Suspense> },
          { path: 'roth-conversion',        element: <Suspense fallback={<PageLoader />}><RothConversion /></Suspense> },
          { path: 'rmd-projector',          element: <Suspense fallback={<PageLoader />}><RMDProjector /></Suspense> },
          { path: 'social-security',        element: <Suspense fallback={<PageLoader />}><SocialSecurity /></Suspense> },
          { path: 'withdrawal',             element: <Suspense fallback={<PageLoader />}><Withdrawal /></Suspense> },
        ],
      },
      {
        path: 'planning',
        children: [
          { index: true,           element: <Suspense fallback={<PageLoader />}><Planning /></Suspense> },
          { path: 'catch-up',      element: <Suspense fallback={<PageLoader />}><CatchUp /></Suspense> },
          { path: 'medicare',      element: <Suspense fallback={<PageLoader />}><Medicare /></Suspense> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <FinancialProvider>
      <RouterProvider router={router} />
    </FinancialProvider>
  );
}

export default App;
