// src/layouts/MainLayout.js
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh' }}>{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;
