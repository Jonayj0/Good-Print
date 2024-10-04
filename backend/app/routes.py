from flask import Blueprint, jsonify, request
from app import db, mail
from app.models import Product, Reserva
import cloudinary
import cloudinary.uploader
from flask_mail import Message

main = Blueprint('main', __name__)

cloudinary.config(
    cloud_name='dtxkcfugs',
    api_key='714796538293287',
    api_secret='T9xmi1bQu6iZ3k2yEOE0fd7nTlw'
)

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
    print("Form Data Received:", request.form)
    print("Files Received:", request.files)

    nombre_cliente = request.form.get('name')
    telefono_cliente = request.form.get('telefono')
    email_cliente = request.form.get('email')
    mensaje = request.form.get('message')
    fotos = request.files.get('photos')
    producto_id = request.form.get('productId')

    print("Product ID:", producto_id)

    if fotos:
        # Subir la foto a Cloudinary
        upload_response = cloudinary.uploader.upload(fotos)
        fotos_url = upload_response['secure_url']  # URL de la foto en Cloudinary
        print(f"Foto guardada en Cloudinary: {fotos_url}")
    else:
        fotos_url = None

    producto = Product.query.get(producto_id)
    if producto:
        print(f"Producto encontrado: {producto.name}")

        reserva = Reserva(
            nombre_cliente=nombre_cliente,
            telefono_cliente=telefono_cliente,
            email_cliente=email_cliente,
            mensaje=mensaje,
            fotos=fotos_url,  # Almacena la URL de Cloudinary
            producto_id=producto_id,
            cliente_id=1  # Si tienes un usuario autenticado, reemplaza esto por el ID del usuario
        )

        db.session.add(reserva)
        db.session.commit()

        # Enviar correo de confirmación al cliente
        send_confirmation_email(email_cliente, nombre_cliente)

        # Enviar correo al administrador
        send_admin_notification(nombre_cliente, email_cliente, producto.name)


        return jsonify({'message': 'Reserva creada exitosamente!'}), 201
    else:
        return jsonify({'message': 'Producto no encontrado!'}), 404

#--------------------------------------------FUNCIONES----------------------------------------------------------------
# Función para enviar correo al cliente
def send_confirmation_email(to_email, nombre_cliente):
    msg = Message('Confirmación de Reserva', recipients=[to_email])
    msg.body = f"Hola {nombre_cliente},\n\nTu reserva ha sido confirmada.\nGracias por tu confianza."
    mail.send(msg)

# Función para enviar notificación al administrador
def send_admin_notification(nombre_cliente, email_cliente, producto_nombre):
    admin_email = 'admin@tuweb.com'  # Cambia esto al correo del administrador
    msg = Message('Nueva Reserva Realizada', recipients=[admin_email])
    msg.body = f"Se ha realizado una nueva reserva.\n\nCliente: {nombre_cliente}\nEmail: {email_cliente}\nProducto: {producto_nombre}"
    mail.send(msg)
