import os
from dotenv import load_dotenv
from app import db, create_app
from app.models import User
from werkzeug.security import generate_password_hash

# Cargar variables de entorno desde .env
load_dotenv()

app = create_app()

with app.app_context():
    # Obtener credenciales desde variables de entorno
    username = os.getenv("ADMIN_USERNAME")
    email = os.getenv("ADMIN_EMAIL")
    password = os.getenv("ADMIN_PASSWORD")

    if username and email and password:
        new_admin = User(
            username=username,
            email=email,
            password=generate_password_hash(password, method='scrypt'),
            is_admin=True
        )
        db.session.add(new_admin)
        db.session.commit()
        print("Administrador creado exitosamente.")
    else:
        print("Error: Faltan variables de entorno para el administrador.")

