from app import db, create_app
from app.models import User
from werkzeug.security import generate_password_hash

app = create_app()

# Crear los usuarios administradores
with app.app_context():
    # Lista de administradores a crear
    admins = [
        {'username': 'Jonay', 'email': 'elmundoenbandeja@gmail.com', 'password': 'GoodPrint123'},
        {'username': 'Admin2', 'email': 'admin2@example.com', 'password': 'AdminPassword2'},
    ]
    
    for admin in admins:
        new_admin = User(
            username=admin['username'],
            email=admin['email'],
            password=generate_password_hash(admin['password'], method='scrypt'),  # Usar scrypt para hashear
            is_admin=True
        )

        # Añadir y guardar en la base de datos
        db.session.add(new_admin)

    db.session.commit()  # Hacer un solo commit después de añadir todos
    print("Administradores creados exitosamente.")
