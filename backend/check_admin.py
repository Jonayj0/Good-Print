import os
from dotenv import load_dotenv
from app import db, create_app
from app.models import User

# Cargar variables de entorno
load_dotenv()

app = create_app()

with app.app_context():
    admin_email = os.getenv("ADMIN_EMAIL")  # Obtener el email del admin desde el .env
    admin = User.query.filter_by(email=admin_email).first()

    if admin:
        print(f"✅ Administrador encontrado: {admin.username} - {admin.email}")
    else:
        print("❌ No se encontró el usuario administrador.")
