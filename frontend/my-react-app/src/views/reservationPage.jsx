import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../style/reservation-page.css";
import Swal from 'sweetalert2';
import { ClipLoader } from 'react-spinners';

const ReservationPage = () => {
  const navigate = useNavigate();
  const { id, name } = useParams();
  const [productName, setProductName] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length + photos.length > 3) {
      Swal.fire({
        icon: 'warning',
        title: 'Límite de imágenes excedido',
        text: 'Solo puedes subir un máximo de 3 imágenes.',
      });
      return;
    }

    setPhotos([...photos, ...selectedFiles]);
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  const handleRemoveImage = (indexToRemove) => {
    setPhotos(photos.filter((_, index) => index !== indexToRemove));
    setPreviews(previews.filter((_, index) => index !== indexToRemove));
  };

  const confirmNoPhotos = async () => {
    const result = await Swal.fire({
      title: 'No has subido ninguna imagen',
      text: '¿Estás seguro de que no deseas subir imágenes?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
    });
    return result.isConfirmed;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (photos.length === 0) {
      const confirm = await confirmNoPhotos();
      if (!confirm) return;
    }

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('telefono', telefono);
    formData.append('email', email);
    formData.append('message', message);
    formData.append('productId', id);
    formData.append('productName', name);

    photos.forEach((photo, index) => {
      formData.append(`photos_${index}`, photo);
    });

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/reservation', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '¡Reserva realizada con éxito!',
          text: 'Tu reserva ha sido creada correctamente.',
        });
        navigate("/");
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Error en la reserva',
          text: errorData.message || 'Algo salió mal, por favor intenta de nuevo.',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error en la conexión',
        text: 'Hubo un error al procesar la reserva. Verifica tu conexión e inténtalo nuevamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reservation-page__container container">
      <h1 className="reservation-page__header text-center">Reservar: {name}</h1>
      <form className="reservation-page__form" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="reservation-page__label">Nombre:</label>
            <input 
              type="text" 
              className="reservation-page__input form-control" 
              value={productName} 
              onChange={(e) => setProductName(e.target.value)} 
              placeholder="Escriba su nombre"
              required 
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="reservation-page__label">Teléfono:</label>
            <input 
              type="tel" 
              className="reservation-page__input form-control" 
              value={telefono} 
              onChange={(e) => setTelefono(e.target.value)} 
              placeholder="1234567890"
              required 
            />
          </div>
          <div className="col-sm-12 col-md-6 col-lg-6 col-xl-12 mb-4">
            <label className="reservation-page__label">Email:</label>
            <input 
              type="email" 
              className="reservation-page__input form-control" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="email@email.com"
              required 
            />
          </div>
          <div className="col-sm-12 col-md-6 col-lg-6 col-xl-12 mb-4">
            <label className="reservation-page__label">Mensaje:</label>
            <textarea 
              className="reservation-page__textarea form-control" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="Texto"
              required 
            />
          </div>
          <div className="col-12 mb-4">
            <label className="reservation-page__label">Subir fotos (máximo 3):</label>
            <input 
              type="file" 
              className="reservation-page__file-input form-control" 
              onChange={handleImageChange} 
              accept="image/*" 
              multiple 
            />
            <div className="d-flex flex-wrap mt-2">
              {previews.map((preview, index) => (
                <div key={index} className="reservation-page__image-preview me-2">
                  <img src={preview} alt={`Previsualización ${index}`} width="100" />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => handleRemoveImage(index)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center">
            <ClipLoader color="#007bff" loading={loading} size={50} />
            <p>Cargando...</p>
          </div>
        ) : (
          <div className="text-center">
            <button type="submit" className="btn btn-primary">
              Reservar
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ReservationPage;
