import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../style/reservation-page.css";
import Swal from 'sweetalert2';

const ReservationPage = () => {
  const navigate = useNavigate();
  const { id, name } = useParams(); // Obtener el ID del producto de la URL
  const [productName, setProductName] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [photos, setPhotos] = useState([]); // Almacena múltiples archivos
  const [previews, setPreviews] = useState([]); // Almacena las previsualizaciones

  // Manejar el cambio de selección de imágenes
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // Convertir FileList en Array

    if (selectedFiles.length + photos.length > 3) {
      Swal.fire({
        icon: 'warning',
        title: 'Límite de imágenes excedido',
        text: 'Solo puedes subir un máximo de 3 imágenes.',
      });
      return;
    }

    setPhotos([...photos, ...selectedFiles]); // Agregar nuevas imágenes
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]); // Agregar nuevas previsualizaciones
  };

  // Limpiar las URLs de previsualización cuando cambien las fotos o se desmonte el componente
  useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview)); // Limpiar URLs al desmontar
    };
  }, [previews]);

  // Función para eliminar una imagen seleccionada
  const handleRemoveImage = (indexToRemove) => {
    setPhotos(photos.filter((_, index) => index !== indexToRemove)); // Eliminar imagen de la lista de fotos
    setPreviews(previews.filter((_, index) => index !== indexToRemove)); // Eliminar previsualización correspondiente
  };

  // Confirmar si el usuario no ha subido ninguna imagen
  const confirmNoPhotos = async () => {
    const result = await Swal.fire({
      title: 'No has subido ninguna imagen',
      text: '¿Estás seguro de que no deseas subir imágenes?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
    });
    return result.isConfirmed; // Retorna true si el usuario confirma
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // // Verificar si el teléfono está vacío
    // if (!telefono) {
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'Teléfono requerido',
    //     text: 'Por favor, ingresa tu número de teléfono.',
    //   });
    //   return; // Salir si el teléfono no está ingresado
    // }

    // Verificar si no se han subido fotos, y preguntar al usuario
    if (photos.length === 0) {
      const confirm = await confirmNoPhotos(); // Mostrar alerta de confirmación
      if (!confirm) return; // Si el usuario cancela, no envía el formulario
    }

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('telefono', telefono);
    formData.append('email', email);
    formData.append('message', message);
    formData.append('productId', id); // Enviar el ID del producto relacionado
    formData.append('productName', name);

    // Añadir todas las fotos a FormData
    photos.forEach((photo, index) => {
      formData.append(`photos_${index}`, photo); // Fotos nombradas con índice
    });

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
        navigate("/");  // Redirigir a la página principal
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
    }
  };

  return (
    <div className="reservation-page__container container">
      <h1 className="reservation-page__header">Reservar: {name}</h1>
      <form className="reservation-page__form" onSubmit={handleSubmit}>
        <div className="reservation-page__form-group">
          <label className="reservation-page__label">Nombre:</label>
          <input 
            type="text" 
            className="reservation-page__input" 
            value={productName} 
            onChange={(e) => setProductName(e.target.value)} 
            placeholder="Escriba su nombre"
            required 
          />
        </div>
        <div className="reservation-page__form-group">
          <label className="reservation-page__label">Telefono:</label>
          <input 
            type="tel" 
            className="reservation-page__input" 
            value={telefono} 
            onChange={(e) => setTelefono(e.target.value)} 
            placeholder="1234567890"
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
            placeholder="email@email.com"
            required 
          />
        </div>
        <div className="reservation-page__form-group">
          <label className="reservation-page__label">Mensaje:</label>
          <textarea 
            className="reservation-page__textarea" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Texto"
            required 
          />
        </div>
        <div className="reservation-page__form-group">
          <label className="reservation-page__label">Subir fotos (máximo 3):</label>
          <input 
            type="file" 
            className="reservation-page__file-input" 
            onChange={handleImageChange} 
            accept="image/*" 
            multiple // Permitir múltiples archivos
          />
          <div className="reservation-page__image-previews">
            {previews.map((preview, index) => (
              <div key={index} className="reservation-page__image-preview">
                <img src={preview} alt={`Previsualización ${index}`} width="200" />
                <button
                  type="button"
                  className="reservation-page__remove-image"
                  onClick={() => handleRemoveImage(index)}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="reservation-page__button">Reservar</button>
      </form>
    </div>
  );
};

export default ReservationPage;
