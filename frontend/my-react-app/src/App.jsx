// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

import Home from './views/home';
import ApiView from './views/apiView';
import Nosotros from './views/nosotros';
import ProductDetails from './views/productDetails';
import ReservationPage from './views/reservationPage';
import LoginView from './views/loginView';
import AdminProducts from './views/adminProducts';
import AddProduct from './views/addProduct';
import EditProduct from './views/editProduct';
import AdminReservas from './views/adminReservas';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout con navbar/footer */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/api-view"
          element={
            <MainLayout>
              <ApiView />
            </MainLayout>
          }
        />
        <Route
          path="/nosotros"
          element={
            <MainLayout>
              <Nosotros />
            </MainLayout>
          }
        />
        <Route
          path="/product-details/:productId"
          element={
            <MainLayout>
              <ProductDetails />
            </MainLayout>
          }
        />
        <Route
          path="/reservar/:id/:name"
          element={
            <MainLayout>
              <ReservationPage />
            </MainLayout>
          }
        />
        <Route path="/login" element={<LoginView />} />

        {/* Rutas protegidas */}
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AdminProducts />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/add"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddProduct />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/edit/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <EditProduct />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reservas"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AdminReservas />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
