import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'; // Usa Routes en lugar de Switch
import Home from './views/home';
import ApiView from './views/apiView';
import Nosotros from './views/nosotros';
import Navbar from './components/navbar';
import Footer from './components/footer';
import ProductDetails from './views/productDetails';
import ReservationPage from './views/reservationPage';
import LoginView from './views/loginView';
import AdminProducts from './views/adminProducts';
import ProtectedRoute from './components/ProtectedRoute';
import AddProduct from './views/addProduct';
import EditProduct from './views/editProduct';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/api-view" element={<ApiView />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/product-details/:productId" element={<ProductDetails />} />
          <Route path="/reservar/:id/:name" element={<ReservationPage />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/admin/products" element={<ProtectedRoute element={AdminProducts} />} />
          <Route path="/admin/products/add" element={<ProtectedRoute element={AddProduct} />} />
          <Route path="/admin/products/edit/:id" element={<ProtectedRoute element={EditProduct} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;