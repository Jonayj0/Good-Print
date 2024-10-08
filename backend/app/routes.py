from flask import Blueprint, jsonify, request
from app import db, mail
from app.models import Product, Reserva
import cloudinary
import cloudinary.uploader
from flask_mail import Message
import requests

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

        # Obtener todas las imágenes del formulario
        fotos = None
        for key in request.files:
            fotos = request.files[key]
            print(f"Imagen recibida: {key} - {fotos.filename}")

        if fotos:
            # Subir la foto a Cloudinary
            upload_response = cloudinary.uploader.upload(fotos)
            fotos_url = upload_response['secure_url']  # URL de la foto en Cloudinary
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

            # Intentar enviar correos
            try:
                # Enviar correo de confirmación al cliente
                send_confirmation_email(email_cliente, nombre_cliente, producto.name)

                # Enviar correo al administrador
                send_admin_notification(nombre_cliente, email_cliente, producto.name, mensaje, fotos_url)
            except Exception as e:
                print(f"Error al enviar correos: {str(e)}")
                return jsonify({'message': 'Reserva creada, pero no se pudieron enviar los correos.'}), 500

            return jsonify({'message': 'Reserva creada exitosamente!'}), 201
        else:
            return jsonify({'message': 'Producto no encontrado!'}), 404
    except Exception as e:
        print(f"Error al crear la reserva: {str(e)}")
        return jsonify({'message': 'Hubo un error al crear la reserva.'}), 500


#--------------------------------------------FUNCIONES----------------------------------------------------------------
# Función para enviar correo al cliente
def send_confirmation_email(to_email, nombre_cliente, producto_nombre):
    try:
        msg = Message('Confirmación de Reserva', recipients=[to_email])
        
        # Cuerpo del mensaje en HTML
        msg.html = f"""
        <html>
            <body>
                <h2>Hola {nombre_cliente},</h2>
                <p>Tu reserva para el producto <strong>{producto_nombre}</strong> ha sido confirmada.</p>
                <p>Gracias por tu confianza.</p>
                <p>¡Esperamos verte pronto!</p>
            </body>
        </html>
        """
        
        mail.send(msg)
    except Exception as e:
        print(f"Error al enviar correo de confirmación: {str(e)}")
        raise  # Vuelve a lanzar la excepción para manejarla en la función `create_reservation`



# Función para enviar notificación al administrador con imagen adjunta
def send_admin_notification(nombre_cliente, email_cliente, producto_nombre, mensaje_cliente, fotos_url):
    try:
        admin_email = 'elmundoenbandeja@gmail.com'
        msg = Message('Nueva Reserva Realizada', recipients=[admin_email])

        # Cuerpo del mensaje
        msg.body = (f"Se ha realizado una nueva reserva.\n\n"
                    f"Cliente: {nombre_cliente}\nEmail: {email_cliente}\nProducto: {producto_nombre}\n"
                    f"Mensaje del cliente: {mensaje_cliente}\n")

        # Descargar la imagen desde Cloudinary y adjuntarla si existe una URL
        if fotos_url:
            print(f"Descargando imagen de: {fotos_url}")
            response = requests.get(fotos_url)  # Descargar la imagen
            if response.status_code == 200:
                print("Imagen descargada correctamente, adjuntando al correo.")
                msg.attach("imagen.jpg", "image/jpeg", response.content)  # Adjuntar la imagen
            else:
                print(f"Error al descargar la imagen desde Cloudinary: Status {response.status_code}")
        
        # Enviar el correo
        mail.send(msg)
        print("Correo enviado correctamente")
    except Exception as e:
        print(f"Error al enviar notificación al administrador: {str(e)}")
        raise