from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_mail import Mail
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
migrate = Migrate()
admin = Admin(name='Admin', template_mode='bootstrap3')
mail = Mail()  # Crea la instancia de Mail
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = '123456'  # Agrega aquí la clave secreta
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = '123456'

    # Configuración para Flask-Mail
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = 'elmundoenbandeja@gmail.com'  # Reemplaza por tu correo
    app.config['MAIL_PASSWORD'] = 'mxhs qjge ngbr lxud'  # Reemplaza por tu contraseña o contraseña de app
    app.config['MAIL_DEFAULT_SENDER'] = ('Good Print', 'elmundoenbandeja@gmail.com')
    app.config['MAIL_USE_SSL'] = False


    CORS(app)

    db.init_app(app)
    migrate.init_app(app, db)
    admin.init_app(app)  # Inicializa Flask-Admin
    mail.init_app(app)  # Inicializa Flask-Mail

    jwt.init_app(app)

    from app.routes import main
    from app import models, routes

    from app.models import User
    admin.add_view(ModelView(User, db.session))  # Vista para el modelo User

    # Añade vistas de admin
    admin.add_view(ModelView(models.Product, db.session))
    admin.add_view(ModelView(models.Reserva, db.session))
    admin.add_view(ModelView(models.Category, db.session))
    admin.add_view(ModelView(models.Event, db.session))

    app.register_blueprint(main)

    return app
