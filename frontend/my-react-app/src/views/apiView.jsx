import { useEffect, useState } from 'react';
import api from '../api';
import CardProductos from '../components/card-productos';

function ApiView() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        api.get('/')
        .then(response => setMessage(response.data.message))
        .catch(error => console.error(error));
    }, []);

    return (
        <div className='container'>
        <h1>API View</h1>
        <p>{message}</p>
        <section className="card-producto container mb-5 d-flex justify-content-evenly">
            <CardProductos/>
            <CardProductos/>
            <CardProductos/>
            <CardProductos/>
        </section>
        </div>
    );
}

export default ApiView;
