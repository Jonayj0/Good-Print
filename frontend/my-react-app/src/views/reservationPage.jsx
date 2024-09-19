// pages/ReservationPage.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; // Para obtener el id del producto
import "../style/reservation-page.css";

const ReservationPage = () => {
  const { id, name } = useParams(); // Obtener el ID del producto de la URL
  const [productName, setProductName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [photos, setPhotos] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('email', email);
    formData.append('message', message);
    formData.append('photos', photos);
    formData.append('productId', id); // Enviar el ID del producto relacionado
    formData.append('productName', name);

    const response = await fetch('http://localhost:5000/api/reservation', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert('¡Reserva realizada con éxito!');
    } else {
      alert('Algo salió mal, por favor intenta de nuevo.');
    }
  };

  return (
    <div className="reservation-page__container container">
      <h1 className="reservation-page__header">Reservar {name}</h1>
      <form className="reservation-page__form" onSubmit={handleSubmit}>
        <div className="reservation-page__form-group">
          <label className="reservation-page__label">Nombre:</label>
          <input 
            type="text" 
            className="reservation-page__input" 
            value={productName} 
            onChange={(e) => setProductName(e.target.value)} 
            required 
          />
        </div>
        <div className="reservation-page__form-group">
          <label className="reservation-page__label">Email:</label>
          <input 
            type="email" 
            className="reservation-page__input" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="reservation-page__form-group">
          <label className="reservation-page__label">Mensaje:</label>
          <textarea 
            className="reservation-page__textarea" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            required 
          />
        </div>
        <div className="reservation-page__form-group">
          <label className="reservation-page__label">Subir fotos:</label>
          <input 
            type="file" 
            className="reservation-page__file-input" 
            onChange={(e) => setPhotos(e.target.files[0])} 
            accept="image/*" 
          />
        </div>
        <button type="submit" className="reservation-page__button">Reservar</button>
      </form>
    </div>
  );
};

export default ReservationPage;
