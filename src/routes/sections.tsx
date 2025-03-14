import { lazy, Suspense, useEffect } from 'react';
import { Outlet, Navigate, useRoutes, useNavigate } from 'react-router';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from '@/theme/styles';
import { AuthLayout } from '@/layouts/auth';
import { DashboardLayout } from '@/layouts/dashboard';
import PrivatePage from './privateRouter';
import AnnouncementPortal from '@/pages/admin/AnnouncementPortal';
import Profile from '@/pages/Profile'
import Apply from '@/pages/Apply';
import { setNavigate } from '@/utils/globalNavigator';
import Chart from '@/pages/Chart';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('@/pages/home'));
export const Users = lazy(() => import('@/pages/admin/RegisterRequest'));
export const GrantRequest = lazy(() => import('@/pages/GrantRequest'));
export const Page404 = lazy(() => import('@/pages/page-not-found'));
export const Register = lazy(() => import("@/pages/auth/register"));
export const Login = lazy(() => import('@/pages/auth/login'));
export const Invoice = lazy(() => import('@/pages/Invoice'));
// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  const navigate = useNavigate()

  useEffect(() => {
    setNavigate(navigate)
  }, [navigate])

  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        // { element: <PrivatePage component={HomePage} />, index: true },
        { element: <HomePage/>, index: true },
        { path: 'profile', element: <PrivatePage component={Profile} />},
        { path: 'users', element: <PrivatePage requiredRole={['grant_dir', 'col_dean']} component={Users}/>},
        { path: 'grant-request', element: <PrivatePage component={GrantRequest}/>},
        { path: 'announcement-portal', element: <PrivatePage requiredRole={['grant_dir']} component={AnnouncementPortal}/>},
        { path: 'apply/:id', element: <PrivatePage component={Apply}/>},
        { path: 'chart', element: <PrivatePage component={Chart}/> },
        { path: "invoice", element: <PrivatePage component={Invoice}/> }
      ],
    },
    {
      path: "/login",
      element: (
        <AuthLayout>
          <Login />
        </AuthLayout>
      )
    },
    {
      path: "/register",
      element: (
        <AuthLayout>
          <Register />
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
