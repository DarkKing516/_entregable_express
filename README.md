# Aplicación de Gestión - README

Este repositorio contiene una aplicación de gestión desarrollada con Node.js y Express, utilizando MongoDB como base de datos. La aplicación tiene funcionalidades clave, como autenticación de usuarios, menú principal, operaciones CRUD completas, barra de búsqueda y generación de reportes en formato PDF. La implementación del frontend se realiza con HTML y JavaScript, sin el uso de CSS3, Bootstrap u otros frameworks de diseño.

## Requisitos

Asegúrate de tener Node.js y npm instalados en tu sistema antes de comenzar. Además, se utiliza MongoDB como base de datos, así que asegúrate de tener un servidor MongoDB en ejecución.

```json
"dependencies": {
  "ejs": "^3.1.9",
  "express": "^4.18.2",
  "express-session": "^1.17.3",
  "mongodb": "^6.3.0",
  "nodemon": "^3.0.2"
},
"scripts": {
  "dev": "nodemon src/server.js"
}
```

## Instalación

1. Clona este repositorio en tu máquina local.
2. Navega al directorio del proyecto.

```bash
cd nombre-del-proyecto
```

3. Instala las dependencias.

```bash
npm install
```

## Configuración de MongoDB

Asegúrate de tener un servidor MongoDB en ejecución. Puedes configurar la conexión a la base de datos en el archivo `src/server.js`. Actualiza la URL de conexión según tu configuración.

```javascript
// src/server.js

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/tu-base-de-datos', { useNewUrlParser: true, useUnifiedTopology: true });
```

## Ejecutar la Aplicación

Ejecuta la aplicación con el siguiente comando:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Funcionalidades

- **Autenticación de Usuarios:** Implementación de inicio de sesión y registro de usuarios.

- **Menú Principal:** Interfaz simple para navegar entre las distintas secciones de la aplicación.

- **Operaciones CRUD:** Gestión completa de pedidos, ventas, reservas y configuraciones de usuarios con roles.

- **Barra de Búsqueda:** Funcionalidad para buscar y filtrar información.

- **Generación de Reportes PDF:** Capacidad para generar reportes en formato PDF.

## Consideraciones Importantes

- La aplicación no utiliza CSS3, Bootstrap u otros frameworks de diseño. El diseño se implementa exclusivamente con HTML y JavaScript. (o al menos este fue el primer requisito que se nos iformó, pero luego el instructor cambió de opinión)

- No se ha utilizado React, Angular u otros frameworks o librerías similares.

- La aplicación sigue las pautas establecidas y se enfoca en la simplicidad y funcionalidad del código.

---

**Importante:** 
Colecciones:
- Configuracion: Danilo,
- Ventas: Emmanuel,
- Pedidos: Jhon,
- Reservas: Nelson,

para poder ver la barra de navegación (el cual era uno de los requisitos así como contener login) solo se puede ver luego de loguearse, para ello se puede registrar o iniciar sesión (al registrarse se guardará como un usuario en la colección configuración la cual le pertenece a Danilo) al iniciar sesión podrá apreciar accesos a las colecciones en la navbar, desde allí podrá acceder al CRUD


Los usuarios NO ESTÁN QUEMADOS, ya que este factor se tomó mucho en cuenta en el aplicativo y evidenciamos el tratar de NO poner datos quemados, por ejemplo los usuarios se listan de la tabla configuración


Cabe aclarar que el instructor avisó con anterioridad que el aplicativo no debía contener css3 ni otros frameworks de diseño, por esto mismo ni había implementado diseño en mi aplicativo hasta el día 13 de diciembre 2023, donde al momento de mostrar el aplicativo al instructor para presentar la sustentación él nos da aviso de que el aplicativo si debía contener diseño y lo pedía como requisito, en lo personal opino que así como envío este mensaje indicando esto de la prohibición de css3 (el cual anexo como evidencia) pudo haber enviado un mensaje expresando su cambio de opinión y dando permiso del uso de css3 y diseño en la aplicación.


De todos modos el instructor el día 13 de diciembre como mencioné anteriormente nos avisó que implementarle más diseño a la aplicación era necesario (a pesar de que fue un aviso tardío y hecho al momento de nuestro intento de entrega de la evidencia)
Como aprendices no nos queda más de otra que acatar este requisito, asi que en este enlace de github encontrará el aplicativo con dicho diseño y css3 que se mencionó anteriormente.
---

**Importante:** Esta aplicación no es una API REST, ya que se prohíbe expresamente su creación o uso. La funcionalidad de la aplicación está basada en sus propias clases y en las colecciones de MongoDB especificadas (pedidos, ventas, reservas, configuración).

Para cualquier problema o pregunta, por favor, comunícate con el equipo de desarrollo.

¡Gracias por contribuir al desarrollo de la aplicación!
