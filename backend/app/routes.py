from flask import Blueprint, jsonify, request
from app import db
from app.models import Product

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
