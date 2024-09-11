from app import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)

    def __repr__(self):
        return f"User('{self.username}', '{self.email}')"


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(900), nullable=True)

    def __repr__(self):
        return f"Product('{self.name}', '{self.price}')"


# Modelo de Reserva
class Reserva(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre_cliente = db.Column(db.String(100), nullable=False)
    email_cliente = db.Column(db.String(100), nullable=False)
    mensaje = db.Column(db.Text, nullable=True)
    fotos = db.Column(db.String(200), nullable=True)  # Ruta de la imagen subida
    fecha_reserva = db.Column(db.DateTime, default=datetime.utcnow)

    # Relaciones con otras tablas
    producto_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    producto = db.relationship('Product', backref=db.backref('reservas', lazy=True))

    cliente_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # Relación con la tabla User
    cliente = db.relationship('User', backref=db.backref('reservas', lazy=True))

    def __repr__(self):
        return f"Reserva('{self.nombre_cliente}', Producto: '{self.producto.name}')"


