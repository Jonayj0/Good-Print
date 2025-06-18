# Good Print ![Paleta de Colores](https://img.icons8.com/color/48/000000/paint-palette.png)

Good Print es una plataforma innovadora para la **reserva de artículos personalizables**. Nuestra web te permite diseñar y reservar productos únicos, adaptados a tu estilo y necesidades, con una experiencia de usuario intuitiva y moderna.

## Características Destacadas

- **Personalización:** Envíanos tu idea y ajustaremos el diseño a tu gusto.
- **Reservas seguras y rápidas:** Gestiona tus pedidos de forma sencilla.
- **Interfaz amigable:** Navegación intuitiva para una experiencia óptima.
- **Variedad de productos:** Encuentra el artículo perfecto para cada ocasión.

¡Exprésate y crea tus propios diseños con Good Print!


## :computer: Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

backend/
│

└── app

 ├── __init__.py
 ├── models/
 │ └── # Archivos de definición de modelos de base de datos SQLAlchemy
 │
 ├── routes/
 │ └── # Archivos de rutas Flask para API y vistas
 
├── instance
│ └── site.db #Aquí se guarda la base de datos (sqlite)
├── venv
├── run.py
│

frontend/
│

└── my-react-app/
│ ├── node_modules/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ │ ├── apiView.jsx
│ │ │ └── home.jsx
│ │ ├── Api.js
│ │ ├── App.css
│ │ ├── index.css
│ │ ├── App.jsx
│ │ └── main.jsx

│ ├── .gitignore

│ └── package.json

│ └── index.html

├── node_modules/

└── package.json

│
README.MD


## 💻 Tecnologías Utilizadas

- **Front-end**:
  - HTML5
  - CSS3
  - React
  - JavaScript
  - Vite

- **Back-end**:
  - Python
  - Flask
  - SQL Alchemy

## Instrucciones de Instalación

### 📝 Requisitos Previos

Asegúrate de tener instalado en tu máquina:

- Node.js
- Python
- Flask
- SQLAlchemy

### Pasos de Instalación

## 📝 1. Clona el Repositorio

   ```bash
   git clone https://github.com/TU_USUARIO/NombreDelRepositorio.git
   cd NombreDelRepositorio
   ```

## 📝 2. Instala las Dependencias del Front-end
```bash
cd frontend/my-react-app
npm install
```

## 📝 3. Instala las Dependencias del Back-end
```bash
cd ../backend
pip install -r requirements.txt
```

## 📝 4. Configura la Base de Datos

Asegúrate de tener configurada tu base de datos SQL y ajusta las configuraciones en backend según sea necesario.

## 📝 5. Inicia el servidor

```bash
# En el directorio backend/
python run.py

# En el directorio frontend/my-react-app/
npm run dev
```

## 🌐 6. Accede a la Aplicación

Abre tu navegador y visita http://localhost:3005/ para ver la aplicación en funcionamiento.

## 📝 7. Accede al admin del backend para añadir productos como administrador
Abre tu navegador y visita http://127.0.0.1:5000/admin/

## 📝 8. Pruebas en postman del backend para añadir productos como administrador
http://localhost:5000/admin/products/add

## 📝 9. Accede al login como administrador del frontend para añadir, editar o eliminar productos de la web
http://localhost:3005/login

## 📫 Contacto
## Email: jonaybolanosmolina@gmail.com
## <a href="https://www.linkedin.com/in/jonay-bolanos-molina/" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg" alt="https://www.linkedin.com/in/jonay-bolanos-molina/" height="30" width="40" /></a> LinkedIn: www.linkedin.com/in/jonay-bolanos-molina
