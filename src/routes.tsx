import { Navigate, Routes, Route } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import {useRecoilValue} from 'recoil'
import {userState} from './hooks/atom/user';
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import CategoryPage from './pages/CategoryPage';
import OrderPage from './pages/OrderPage';
import ProductUpdatePage from './pages/ProductUpdatePage';
import OptionPage from './pages/OptionPage';

// ----------------------------------------------------------------------

function Layout (Layout: any, Component: any) {
    return (
      <Layout>
        <Component />
      </Layout>
    );
}

export default function Router() {
  const user = useRecoilValue(userState);
  
  if(!user.isConnected && !localStorage.getItem('token')) {
    return <Routes>
      <Route path="/" index element={<LoginPage/>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  }

  return <Routes>
    <Route path="/" element={<Navigate to="/dashboard/app" />} />
    <Route path="/dashboard/app" index element={Layout(DashboardLayout, DashboardAppPage)} />
    <Route path="/dashboard/blog" element={Layout(DashboardLayout, BlogPage)} />
    <Route path="/dashboard/settings" element={Layout(DashboardLayout, DashboardAppPage)} />
    <Route path="/dashboard/user" element={Layout(DashboardLayout, UserPage)} />
    <Route path="/dashboard/products" element={Layout(DashboardLayout, ProductsPage)} />
    <Route path="/dashboard/register" element={Layout(DashboardLayout, RegisterPage)} />
    <Route path="/dashboard/product/:uuid" element={Layout(DashboardLayout, ProductUpdatePage)} />
    <Route path="/dashboard/option/images/:uuid" element={Layout(DashboardLayout, OptionPage)} />
    <Route path="/404" element={<Page404/>} />
    <Route path="/dashboard/order" element={Layout(DashboardLayout, OrderPage)} />
    <Route path="/dashboard/categories" element={Layout(DashboardLayout, CategoryPage)} />
    <Route path="/login" element={<LoginPage/>} />
    <Route path="/defaultsite" element={<Navigate to="/" />} />
    <Route path="*" element={<Navigate to="/404" />} />
  </Routes>;
}
