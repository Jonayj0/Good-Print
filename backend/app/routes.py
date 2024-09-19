from flask import Blueprint, jsonify, request
from app import db
from app.models import Product, Reserva

main = Blueprint('main', __name__)

@main.route('/')
def home():
    return jsonify(message="Welcome to the Flask API!")

@main.route('/add_product', methods=['POST'])
def add_product():
    data = request.get_json()
    new_product = Product(
        name=data['name'],
        description=data['description'],
        price=data['price'],
        image_url=data.get('image_url', None)
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"message": "Product added successfully!"}), 201

@main.route('/products', methods=['GET'])
def get_products():
    # Consulta para obtener todos los productos
    products = Product.query.all()
    
    # Transformar la consulta en una lista de diccionarios
    products_list = [
        {
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "price": product.price,
            "image_url": product.image_url
        }
        for product in products
    ]
    
    # Devolver la lista de productos como JSON
    return jsonify(products_list), 200

@main.route('/api/reservation', methods=['POST'])
def create_reservation():
    print(request.form)
    nombre_cliente = request.form.get('name')
    email_cliente = request.form.get('email')
    mensaje = request.form.get('message')
    fotos = request.files.get('photos')
    producto_id = request.form.get('productId')

    if fotos:
        # Guardar el archivo de fotos y obtener la ruta
        fotos_path = f'static/uploads/{fotos.filename}'
        fotos.save(fotos_path)
    else:
        fotos_path = None

    producto = Product.query.get(producto_id)
    if producto:
        reserva = Reserva(
            nombre_cliente=nombre_cliente,
            email_cliente=email_cliente,
            mensaje=mensaje,
            fotos=fotos_path,
            producto_id=producto_id,
            producto_nombre=producto.name,
            cliente_id=1  # Si tienes un usuario autenticado, reemplaza esto por el ID del usuario
        )

        db.session.add(reserva)
        db.session.commit()

        return jsonify({'message': 'Reserva creada exitosamente!'}), 201
    else:
        return jsonify({'message': 'Producto no encontrado!'}), 404
