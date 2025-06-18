from app import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    is_admin = db.Column(db.Boolean, default=False, nullable=False)

    def __repr__(self):
        return f"User('{self.username}', '{self.email}', Admin: {self.is_admin})"

product_categories = db.Table('product_categories',
    db.Column('product_id', db.Integer, db.ForeignKey('product.id'), primary_key=True),
    db.Column('category_id', db.Integer, db.ForeignKey('category.id'), primary_key=True)
)

product_events = db.Table('product_events',
    db.Column('product_id', db.Integer, db.ForeignKey('product.id'), primary_key=True),
    db.Column('event_id', db.Integer, db.ForeignKey('event.id'), primary_key=True)
)



class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(900), nullable=True)

    categories = db.relationship('Category', secondary=product_categories, backref='products')
    events = db.relationship('Event', secondary=product_events, backref='products')


    def __repr__(self):
        category_names = ', '.join([cat.name for cat in self.categories]) if self.categories else 'Sin categorías'
        event_names = ', '.join([event.name for event in self.events]) if self.events else 'Sin eventos'
        return f"Product('{self.name}', '{self.price}', Categorías: [{category_names}], Eventos: [{event_names}])"


# Modelo de Reserva
class Reserva(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre_cliente = db.Column(db.String(100), nullable=False)
    telefono_cliente = db.Column(db.String(50), nullable=False, default='0000000000')
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
        producto_nombre = self.producto.name if self.producto else "Producto no asignado"
        return f"Reserva('{self.nombre_cliente}', Producto: '{producto_nombre}')"


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)

    def __repr__(self):
        return f"Category('{self.name}')"


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)

    def __repr__(self):
        return f"Event('{self.name}')"
