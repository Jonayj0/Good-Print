import { useContext, useEffect, useState } from 'react';
import { Context } from '../store/AppContext';
import CardProductos from '../components/card-productos';

function TestContext() {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (actions && typeof actions.getProducts === 'function') {
            actions.getProducts();
        }
    }, [actions]);

    useEffect(() => {
        if (store.products) {
            setLoading(false);
        }
    }, [store.products]);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Products</h1>
            {store.products.length > 0 ? (
                store.products.map(product => (
                    <CardProductos
                        key={product.id}
                        name={product.name || 'Unknown Name'}
                        description={product.description || 'No description available'}
                        price={product.price || 0}
                        image_url={product.image_url || 'default-image-url.jpg'}
                    />
                ))
            ) : (
                <p>No products available</p>
            )}
        </div>
    );
}

export default TestContext;

