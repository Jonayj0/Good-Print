from flask import Blueprint, jsonify, request, current_app
from app import db, mail
from app.models import Product, Reserva, User
import cloudinary
import cloudinary.uploader
from flask_mail import Message
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from flask import current_app as app
from werkzeug.security import check_password_hash
from datetime import datetime, timedelta
import jwt
from functools import wraps

main = Blueprint('main', __name__)

cloudinary.config(
    cloud_name='dtxkcfugs',
    api_key='714796538293287',
    api_secret='T9xmi1bQu6iZ3k2yEOE0fd7nTlw'
)

executor = ThreadPoolExecutor()

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
    products = Product.query.all()
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
    return jsonify(products_list), 200

#-------------------------------------------------RESERVAS----------------------------------
@main.route('/api/reservation', methods=['POST'])
def create_reservation():
    try:
        print("Form Data Received:", request.form)
        print("Files Received:", request.files)

        nombre_cliente = request.form.get('name')
        telefono_cliente = request.form.get('telefono')
        email_cliente = request.form.get('email')
        mensaje = request.form.get('message')
        producto_id = request.form.get('productId')

        print("Product ID:", producto_id)

        fotos = None
        for key in request.files:
            fotos = request.files[key]
            print(f"Imagen recibida: {key} - {fotos.filename}")

        if fotos:
            upload_response = cloudinary.uploader.upload(fotos)
            fotos_url = upload_response['secure_url']
            print(f"Foto guardada en Cloudinary: {fotos_url}")
        else:
            fotos_url = None
            print("No se recibieron fotos.")

        producto = Product.query.get(producto_id)
        if producto:
            print(f"Producto encontrado: {producto.name}")

            reserva = Reserva(
                nombre_cliente=nombre_cliente,
                telefono_cliente=telefono_cliente,
                email_cliente=email_cliente,
                mensaje=mensaje,
                fotos=fotos_url,
                producto_id=producto_id,
                cliente_id=1
            )

            db.session.add(reserva)
            db.session.commit()

            # Ejecutar las funciones de correo dentro del contexto de la app
            with app.app_context():
                # Enviar correos en segundo plano asegurando el contexto correcto
                executor.submit(send_confirmation_email, app._get_current_object(), email_cliente, nombre_cliente, producto.name)
                executor.submit(send_admin_notification, app._get_current_object(), nombre_cliente, email_cliente, producto.name, mensaje, fotos_url, telefono_cliente)

            return jsonify({'message': 'Reserva creada exitosamente!'}), 201
        else:
            return jsonify({'message': 'Producto no encontrado!'}), 404
    except Exception as e:
        print(f"Error al crear la reserva: {str(e)}")
        return jsonify({'message': 'Hubo un error al crear la reserva.'}), 500

#--------------------------------------------FUNCIONES----------------------------------------------------------------
def send_confirmation_email(app, to_email, nombre_cliente, producto_nombre):
    with app.app_context():
        try:
            msg = Message('Confirmación de Reserva', recipients=[to_email])
            msg.html = f"""
            <html>
                <body>
                    <h2>Hola {nombre_cliente},</h2>
                    <p>Tu reserva para el producto:<br> 
                    <strong>{producto_nombre}</strong> ha sido confirmada.</p>
                    <p>Gracias por tu confianza.</p>
                    <p>¡Esperamos verte pronto!</p>
                </body>
            </html>
            """
            mail.send(msg)
        except Exception as e:
            print(f"Error al enviar correo de confirmación: {str(e)}")
            raise

def send_admin_notification(app, nombre_cliente, email_cliente, producto_nombre, mensaje_cliente, fotos_url, telefono_cliente):
    with app.app_context():
        try:
            admin_email = 'elmundoenbandeja@gmail.com'
            msg = Message('Nueva Reserva Realizada', recipients=[admin_email])
            msg.body = (f"Se ha realizado una nueva reserva.\n\n"
                        f"Cliente: {nombre_cliente}\nEmail: {email_cliente}\nProducto: {producto_nombre}\nTelefono: {telefono_cliente}\n"
                        f"Mensaje del cliente: {mensaje_cliente}\n")

            if fotos_url:
                response = requests.get(fotos_url)
                if response.status_code == 200:
                    msg.attach("imagen.jpg", "image/jpeg", response.content)
                else:
                    print(f"Error al descargar la imagen desde Cloudinary: Status {response.status_code}")
            
            mail.send(msg)
            print("Correo enviado correctamente")
        except Exception as e:
            print(f"Error al enviar notificación al administrador: {str(e)}")
            raise

# 

def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None

        # Verifica si el token está en los encabezados
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1] # "Bearer <token>"

        if not token:
            return jsonify({'message': 'Token is missing!'}), 403
        
        try:
            # Decodifica el token usando la clave secreta
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id']) # Obtén el usuario de la base de datos

            # Verifica el rol del usuario
            if not current_user.is_admin:
                return jsonify({'message': 'Unauthorized access - Admin only'}), 403
        
        except Exception as e:
            print(str(e))
            return jsonify({'message': 'Token is invalid!'}), 403
        
        return f(current_user, *args, **kwargs) # Pasa el usuario actual a la función decorada
    
    return decorator



#--------------------------------------------LOGIN----------------------------------------------------------------
#--------------------------------------------LOGIN----------------------------------------------------------------
@main.route('/login', methods=['POST'])
def login():
    data = request.get_json() # Obtener los datos enviados (email y password)

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Faltan datos'}), 400 # Validación simple de datos
    
    user = User.query.filter_by(email=data['email']).first() # Buscar usuario por email

    if not user:
        return jsonify({'message': 'Usuario no encontrado'}), 404
    
    if not check_password_hash(user.password, data['password']): # Verificar contraseñas
        return jsonify({'message': 'Contraseña incorrecta'}), 401 
    
    # Crear el token JWT válido por 30 minutos
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(minutes=30)
    }, current_app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({'token': token}), 200 # Devolver el token JWT al cliente


# @main.route('/admin', methods=['GET'])
# @token_required  # Aplica el decorador aquí
# def admin_only_route(current_user):
#     if not current_user.is_admin:  # Verifica si el usuario es administrador
#         return jsonify({'message': 'You do not have permission to access this resource.'}), 403
    
#     return jsonify({'message': 'Welcome to the admin panel!'}), 200


# Ruta protegida para obtener productos (solo para admin)
@main.route('/admin/products', methods=['GET'])
@token_required
def get_admin_products(current_user):
    products = Product.query.all()
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
    return jsonify(products_list), 200

# Ruta protegida para añadir un nuevo producto (solo para admin)
# @main.route('/admin/products/add', methods=['POST'])
# @token_required
# def add_admin_product():  # Cambiado el nombre de la función aquí
#     data = request.get_json()
    
#     new_product = Product(
#         name=data['name'],
#         description=data['description'],
#         price=data['price'],
#         image_url=data.get('image_url', None)
#     )
    
#     db.session.add(new_product)
#     db.session.commit()
    
#     return jsonify({"message": "Product added successfully!"}), 201

# Ruta protegida para añadir un nuevo producto (solo para admin)
@main.route('/admin/products/add', methods=['POST'])
@token_required
def add_admin_product(current_user):
    data = request.get_json()
    
    # Validar campos requeridos
    if not all(key in data for key in ['name', 'description', 'price']):
        return jsonify({"error": "Missing required product fields"}), 400
    
    try:
        new_product = Product(
            name=data['name'],
            description=data['description'],
            price=data['price'],
            image_url=data.get('image_url', None)
        )
        
        db.session.add(new_product)
        db.session.commit()
        
        return jsonify({"message": "Product added successfully!"}), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to add product", "details": str(e)}), 500

# Al final del archivo, imprime las rutas disponibles
@main.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Test route is working!"}), 200

