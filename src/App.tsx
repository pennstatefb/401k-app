import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { FinancialProvider } from './context/FinancialContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Snapshot } from './pages/Snapshot';
import { Balances } from './pages/Balances';
import { Strategies } from './pages/Strategies';
import { Planning } from './pages/Planning';
import { RMDProjector } from './pages/RMDProjector';
import { SocialSecurity } from './pages/SocialSecurity';
import { CatchUp } from './pages/CatchUp';
import { Medicare } from './pages/Medicare';
import { RothConversion } from './pages/RothConversion';
import { Withdrawal } from './pages/Withdrawal';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'snapshot', element: <Snapshot /> },
      { path: 'balances', element: <Balances /> },
      {
        path: 'strategies',
        children: [
          { index: true, element: <Strategies /> },
          { path: 'roth-conversion', element: <RothConversion /> },
          { path: 'rmd-projector', element: <RMDProjector /> },
          { path: 'social-security', element: <SocialSecurity /> },
          { path: 'withdrawal', element: <Withdrawal /> },
        ],
      },
      {
        path: 'planning',
        children: [
          { index: true, element: <Planning /> },
          { path: 'catch-up', element: <CatchUp /> },
          { path: 'medicare', element: <Medicare /> },
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
