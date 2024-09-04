import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'; // Usa Routes en lugar de Switch
import Home from './views/home';
import ApiView from './views/apiView';
import Nosotros from './views/nosotros';
import Navbar from './components/navbar';
import Footer from './components/footer';
import DetallesProducto from './views/detallesProducto';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/api-view" element={<ApiView />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/detalles-producto" element={<DetallesProducto />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;




// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

// import React, { useEffect, useState } from 'react';
// import api from './api';

// function App() {
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     api.get('/')
//       .then(response => setMessage(response.data.message))
//       .catch(error => console.error(error));
//   }, []);

//   return (
//     <div className="App">
//       <h1>{message}</h1>
//     </div>
//   );
// }

// export default App;
