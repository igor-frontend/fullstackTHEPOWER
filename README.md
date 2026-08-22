# Concesionarios Igor - Sistema FullStack de Gestión de Concesionario

Este proyecto constituye una aplicación FullStack real (Single Page Application) diseñada para la administración automatizada, control de stock y procesamiento relacional de operaciones comerciales en un concesionario automotriz.

El sistema se enfoca en resolver los problemas de sincronización de inventarios de vehículos y registro de compradores, ofreciendo una interfaz de usuario ágil y segura para asesores comerciales.

---

## 🎯 Cumplimiento de los Requisitos Técnicos del Enunciado

### 📂 1. Generación de Base de Datos mediante Semilla ( fs + CSV )
La base de datos relacional de MongoDB Atlas no utiliza datos inventados en local. Se ha desarrollado un script automatizado inteligente (`backend/src/seeds/db.seed.js`) que utiliza flujos de lectura asíncronos (`fs.createReadStream`) para parsear las columnas y filas reales de los archivos `.csv` extraídos del Excel. El script normaliza las cabeceras e inyecta los 100 registros en la nube cruzando las relaciones lógicas de forma nativa.

### 👥 2. Colecciones Relacionadas y Gestión de Usuarios por Roles
El ecosistema de Mongoose cuenta con tres colecciones estructuradas y vinculadas entre sí:
* **Vehículos**: Almacena el número de bastidor (VIN), precio, marca, modelo y disponibilidad del stock.
* **Clientes**: Registra la información de contacto y códigos de identificación del comprador extraídos del Excel.
* **Ventas**: Actúa como nexo relacional guardando los `ObjectId` cruzados de los vehículos y los clientes implicados en cada transacción.
* **Usuarios**: Gestión de cuentas corporativas protegidas mediante encriptación de contraseñas (`bcrypt`) y autenticación segura mediante tokens **JWT**, discriminando el acceso a rutas privadas según el rol asignado (`asesor` o `admin`).

### 💻 3. Frontend Avanzado en React con Enrutamiento SPA
La interfaz visual de usuario está construida sobre React y Vite, implementando una arquitectura modular limpia (`components/`, `pages/`, `context/`, `hooks/`, `config/`). Utiliza `react-router-dom` para la navegación fluida entre el catálogo de vehículos público y el panel restringido de transacciones.

### ⚡ 4. Control de Renders Eficientes y Hooks Avanzados
* **Evitación de Re-renderizados**: Los formularios de acceso y registro de operaciones comerciales se gestionan de forma ultra eficiente mediante **`useRef()`**, capturando los datos en el momento del envío (`onSubmit`) e impidiendo que la pantalla parpadee o sufra refrescos invisibles mientras el usuario escribe en el teclado.
* **Hooks Personalizados**: Se ha desarrollado el hook avanzado de validación **`useFormValidation.js`** para el control dinámico de errores de inserción en el cliente.
* **useContext**: Persistencia del estado global del asesor autenticado para validar permisos en cualquier nodo de la aplicación.

### 📱 5. Diseño CSS Premium y Web FULL RESPONSIVE
Toda la maquetación visual está construida con variables CSS nativas centralizadas dentro de `:root` (colores de marca, espaciados y sombras). La interfaz gráfica cuenta con consultas multimedia (`@media query`) estrictas que adaptan las rejillas y desglosan las tablas horizontales en columnas verticales verticales limpias, garantizando un soporte responsive fluido **hasta los 375px** de pantallas móviles compactas.

---

## 🚀 Instrucciones para Levantar el Entorno Local

Sigue este orden técnico estricto para poner en marcha la aplicación:

### 1. Servidor API Backend (Node.js)
Abre una terminal en tu carpeta `backend/`, configura tu archivo `.env` con tus credenciales de MongoDB Atlas y ejecuta:
```bash
npm install
npm run seed  # 1. Lee los archivos CSV de tu Excel e inyecta las colecciones en MongoDB
npm run dev   # 2. Arranca el servidor web en http://localhost:3030
```

### 2. Aplicación Cliente (React)
Abre una segunda terminal en tu carpeta `frontend/` y ejecuta:
```bash
npm install
npm run dev   # Arranca la interfaz visual en http://localhost:5173
```

---

## 📝 Guía de Uso: Cómo Crear una Nueva Venta (Para Evaluación)

Para probar de forma exitosa el formulario del panel de **Operaciones Comerciales** y validar la inserción relacional, el sistema cuenta con un motor de búsqueda inteligente y tolerante en el backend. Sigue estos pasos:

1. **Copiar un VIN válido del Stock**: Entra en la página principal (`/`), revisa la flota de vehículos disponibles y copia el código alfanumérico largo gris (VIN) de cualquiera de ellos (por ejemplo: `2GKALSEK7G6123456`).
2. **Rellenar el Formulario**: Dirígete a la pestaña de Operaciones e introduce:
   * **ID Venta**: Un código identificador único (ej: `VNT-500`).
   * **VIN**: Pega el código de 17 caracteres que acabas de copiar de la Home (asegúrate de que no tenga espacios adicionales).
   * **Código o Nombre del Cliente**: El buscador del backend acepta de forma tolerante tanto el DNI como el nombre propio del comprador. Escribe el nombre de cualquiera de las personas que ya aparecen en tu tabla (ej: `Sergio Ramírez` o `Carolina Martínez`).
3. **Procesamiento de datos**: Haz clic en **Cerrar Venta**. El sistema emparejará los `ObjectIds` en MongoDB Atlas, registrará la fila en tiempo real en la tabla inferior y modificará automáticamente el estado del vehículo de **"Disponible"** a **"Vendido"** en el catálogo de la Home.
