import React, { useEffect, useState } from 'react';
import api from '../api';

function ApiView() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        api.get('/')
        .then(response => setMessage(response.data.message))
        .catch(error => console.error(error));
    }, []);

    return (
        <div>
        <h1>API View</h1>
        <p>{message}</p>
        </div>
    );
}

export default ApiView;
