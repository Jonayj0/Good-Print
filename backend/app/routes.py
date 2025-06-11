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
from jwt import ExpiredSignatureError, InvalidTokenError
from urllib.parse import unquote

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
        image_url=data.get('image_url', None),
        category=data.get('category', None)
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"message": "Product added successfully!"}), 201

#-----------------------------------------VER TODOS LOS PRODUCTOS--------------------------------///////
# @main.route('/products', methods=['GET'])
# def get_products():
#     products = Product.query.all()
#     products_list = [
#         {
#             "id": product.id,
#             "name": product.name,
#             "description": product.description,
#             "price": product.price,
#             "image_url": product.image_url,
#             "category": product.category
#         }
#         for product in products
#     ]
#     return jsonify(products_list), 200


#-----------------------------------VER TODOS LOS PRODUCTOS Y CATEGORIAS--------------------------------///////
# @main.route('/products', methods=['GET'])
# def get_products():

#     category = request.args.get('category')  # Obtener la categoría desde la URL

#     if category:  # Si hay una categoría en la URL, filtrar los productos
#         products = Product.query.filter_by(category=category).all()
#     else:  # Si no hay categoría, traer todos los productos
#         products = Product.query.all()
#     if not products:
#         return jsonify({"error": "No products found"}), 404
#     # Convertir los productos a un formato JSON
    
#     products_list = [
#         {
#             "id": product.id,
#             "name": product.name,
#             "description": product.description,
#             "price": product.price,
#             "image_url": product.image_url,
#             "category": product.category
#         }
#         for product in products
#     ]
#     return jsonify(products_list), 200

@main.route('/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    
    if category:
        # Decodificar y normalizar igual que al guardar
        decoded_category = unquote(category).strip().lower()
        if decoded_category.endswith('s') and len(decoded_category) > 3:
            search_term = decoded_category[:-1]
        else:
            search_term = decoded_category
        
        # Búsqueda flexible (incluye plural y singular)
        products = Product.query.filter(
            (Product.category.ilike(f"%{search_term}%")) |
            (Product.category.ilike(f"%{search_term}s%"))
        ).all()
    else:
        products = Product.query.all()
    
    products_list = [
        {
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "price": product.price,
            "image_url": product.image_url,
            "category": product.category
        }
        for product in products
    ]
    
    # Devuelve lista vacía si no hay productos, en lugar de 404
    return jsonify(products_list), 200
#-----------------------------------------VER UN PRODUCTO--------------------------------///////
@main.route('/products/<int:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404
        product_data = {
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "price": product.price,
            "image_url": product.image_url,
            "category": product.category

        }
        return jsonify(product_data), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch product", "details": str(e)}), 500

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

        # Listar las fotos recibidas
        fotos_urls = []  # Lista para almacenar las URLs de las fotos


        for key in request.files:
            fotos = request.files[key]
            print(f"Imagen recibida: {key} - {fotos.filename}")

            if fotos:
                upload_response = cloudinary.uploader.upload(fotos)
                fotos_url = upload_response['secure_url']
                print(f"Foto guardada en Cloudinary: {fotos_url}")
                fotos_urls.append(fotos_url) # Agregar la URL a la lista de fotos

        if not fotos_urls:
            print("No se recibieron fotos.")
            fotos_urls = None

        # Verificar si hay fotos para agregar
        print(f"Lista de fotos subidas: {fotos_urls}")

        producto = Product.query.get(producto_id)
        if producto:
            print(f"Producto encontrado: {producto.name}")

            reserva = Reserva(
                nombre_cliente=nombre_cliente,
                telefono_cliente=telefono_cliente,
                email_cliente=email_cliente,
                mensaje=mensaje,
                fotos=",".join(fotos_urls) if fotos_urls else None, # Unir las URLs con comas
                producto_id=producto_id,
                cliente_id=1
            )

            db.session.add(reserva)
            db.session.commit()

            # Ejecutar las funciones de correo dentro del contexto de la app
            with app.app_context():
                # Enviar correos en segundo plano asegurando el contexto correcto
                executor.submit(send_confirmation_email, app._get_current_object(), email_cliente, nombre_cliente, producto.name)
                executor.submit(send_admin_notification, app._get_current_object(), nombre_cliente, email_cliente, producto.name, mensaje, ",".join(fotos_urls), telefono_cliente)

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

def send_admin_notification(app, nombre_cliente, email_cliente, producto_nombre, mensaje_cliente, fotos_urls=None, telefono_cliente=None):
    with app.app_context():
        try:
            admin_email = 'elmundoenbandeja@gmail.com'
            msg = Message('Nueva Reserva Realizada', recipients=[admin_email])
            msg.body = (f"Se ha realizado una nueva reserva.\n\n"
                        f"Cliente: {nombre_cliente}\nEmail: {email_cliente}\nProducto: {producto_nombre}\nTelefono: {telefono_cliente}\n"
                        f"Mensaje del cliente: {mensaje_cliente}\n")

            if fotos_urls:  # Verificar si hay imágenes
                if isinstance(fotos_urls, str):  # Si está guardado como string (por ejemplo, en la BD)
                    fotos_urls = fotos_urls.split(",")  # Convertir en lista si es una cadena separada por comas
                
                for i, foto_url in enumerate(fotos_urls):
                    response = requests.get(foto_url.strip())  # Limpiar espacios en blanco
                    if response.status_code == 200:
                        msg.attach(f"imagen_{i+1}.jpg", "image/jpeg", response.content)
                    else:
                        print(f"Error al descargar la imagen {i+1} desde Cloudinary: Status {response.status_code}")
            
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
            token = request.headers['Authorization'].split(" ")[1]  # "Bearer <token>"

        if not token:
            return jsonify({'message': 'Token is missing!'}), 403

        try:
            # Decodifica el token usando la clave secreta
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])  # Obtén el usuario de la base de datos

            # Verifica el rol del usuario
            if not current_user.is_admin:
                return jsonify({'message': 'Unauthorized access - Admin only'}), 403

        except ExpiredSignatureError:
            return jsonify({'message': 'Token has expired! Please log in again.'}), 401
        except InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 403
        except Exception as e:
            return jsonify({'message': 'Token verification failed!', 'error': str(e)}), 403

        return f(current_user, *args, **kwargs)  # Pasa el usuario actual a la función decorada

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
            "image_url": product.image_url,
            "category": product.category
        }
        for product in products
    ]
    return jsonify(products_list), 200

# Ruta protegida para añadir un nuevo producto (solo para admin)
@main.route('/admin/products/add', methods=['POST'])
@token_required
def add_admin_product(current_user):
    data = request.get_json()

    if not all(key in data for key in ['name', 'description', 'price', 'category']):
        return jsonify({"error": "Missing required product fields"}), 400

    try:
        # Normalizar categoría: minúsculas y singular
        raw_category = data['category'].strip().lower()

        # Opcional: lógica para singularizar (muy básica)
        if raw_category.endswith('s') and len(raw_category) > 3:
            normalized_category = raw_category[:-1]  # elimina la 's' final
        else:
            normalized_category = raw_category

        # Capitalizar el nombre del producto
        capitalized_name = data['name'].capitalize()  # Primera letra mayúscula, resto minúsculas
        # Otra opción: data['name'].title()  # Primera letra de cada palabra mayúscula
        capitalized_description = data['description'].capitalize()

        new_product = Product(
            name=capitalized_name,
            description=capitalized_description,
            price=data['price'],
            image_url=data.get('image_url'),
            category=normalized_category
        )

        db.session.add(new_product)
        db.session.commit()

        return jsonify({"message": "Product added successfully!"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to add product", "details": str(e)}), 500

@main.route('/categories', methods=['GET'])
def get_categories():
    categories = db.session.query(Product.category).distinct().all()
    category_list = []
    for cat in categories:
        if cat[0]:
            normalized = cat[0].strip().lower()
            # Normalización más robusta
            if normalized.endswith('ies') and len(normalized) > 4:
                normalized = normalized[:-3] + 'y'  # "categories" -> "category"
            elif normalized.endswith('s') and len(normalized) > 3:
                normalized = normalized[:-1]
            category_list.append(normalized)
    return jsonify(sorted(list(set(category_list)))), 200


# Al final del archivo, imprime las rutas disponibles
# @main.route('/test', methods=['GET'])
# def test():
#     return jsonify({"message": "Test route is working!"}), 200

# Ruta protegida para editar un producto (solo para admin)
@main.route('/admin/products/edit/<int:product_id>', methods=['PUT'])
@token_required
def edit_admin_product(current_user, product_id):
    
    # Verificar si el usuario es administrador
    if not current_user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403
    
    # Obtener los datos enviados por el cliente
    data = request.get_json()
    
    try:
        # Buscar el producto en la base de datos
        product = Product.query.get(product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404
        
        # Función para capitalizar (primera letra mayúscula, resto minúsculas)
        def capitalize_text(text):
            if not text or len(text) == 0:
                return text
            return text[0].upper() + text[1:].lower()
        
        # Validar campos requeridos y actualizar solo los campos enviados
        if 'name' in data:
            product.name = capitalize_text(data['name'])  # Capitalizar nombre
        if 'description' in data:
            product.description = capitalize_text(data['description'])  # Capitalizar descripción
        if 'price' in data:
            product.price = data['price']
        if 'image_url' in data:
            product.image_url = data['image_url'] if data['image_url'] else None
        # Mantiene la categoría si no se envía
        product.category = data.get('category', product.category)
        #if 'category' in data:
            #product.category = data['category']
        
        # Guardar los cambios en la base de datos
        db.session.commit()
        return jsonify({"message": "Product updated successfully!"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update product", "details": str(e)}), 500


# Ruta protegida para eliminar un producto (solo para admin)
@main.route('/admin/products/delete/<int:product_id>', methods=['DELETE'])
@token_required
def delete_admin_product(current_user, product_id):
    try:
        # Verificar si el usuario actual es un administrador
        if not current_user.is_admin:
            return jsonify({"error": "Unauthorized access, admin only"}), 403

        # Buscar el producto en la base de datos
        product = Product.query.get(product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404
        
        # Eliminar el producto de la base de datos
        db.session.delete(product)
        db.session.commit()

        return jsonify({"message": "Product deleted successfully!"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete product", "details": str(e)}), 500

# Ruta protegida para obtener todas las reservas (solo para admin)
@main.route('/admin/reservations', methods=['GET'])
@token_required

def get_admin_reservations(current_user):
    try:
        # Verificar si el usuario actual es un administrador
        if not current_user.is_admin:
            return jsonify({"error": "Unauthorized access, admin only"}), 403

        # Obtener todas las reservas de la base de datos
        reservations = Reserva.query.all()
        reservations_list = [
            {
                "id": reserva.id,
                "nombre_cliente": reserva.nombre_cliente,
                "telefono_cliente": reserva.telefono_cliente,
                "email_cliente": reserva.email_cliente,
                "mensaje": reserva.mensaje,
                "fotos": reserva.fotos,
                "fecha_reserva": reserva.fecha_reserva,
                # "fecha_reserva": reserva.fecha_reserva.strftime("%d-%m-%Y, %H:%M:%S"),
                "producto": {
                "id": reserva.producto.id,
                "nombre": reserva.producto.name,  # Agregar el nombre del producto
                "imagen": reserva.producto.image_url  # Agregar la imagen del producto
            }
            }
            for reserva in reservations
        ]

        return jsonify(reservations_list), 200
    
    except Exception as e:
        return jsonify({"error": "Failed to fetch reservations", "details": str(e)}), 500
    
@main.route('/admin/reservations/<int:reservation_id>', methods=['DELETE'])
@token_required
def delete_reservation(current_user, reservation_id):
    reserva = Reserva.query.get(reservation_id)

    if not reserva:
        return jsonify({"error": "Reserva no encontrada"}), 404

    db.session.delete(reserva)
    db.session.commit()

    return jsonify({"message": "Reserva eliminada exitosamente"}), 200
