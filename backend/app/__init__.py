from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView

db = SQLAlchemy()
migrate = Migrate()
admin = Admin(name='Admin', template_mode='bootstrap3')

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    CORS(app)

    db.init_app(app)
    migrate.init_app(app, db)
    admin.init_app(app)  # Inicializa Flask-Admin

    from app.routes import main
    from app import models, routes

    # Añade vistas de admin
    admin.add_view(ModelView(models.Product, db.session))

    app.register_blueprint(main)

    return app
