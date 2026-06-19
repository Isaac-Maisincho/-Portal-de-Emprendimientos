# ESPE Emprende — Portal de Emprendimientos Universitarios

**ESPE Emprende** es una solución digital interactiva estructurada bajo el patrón arquitectónico de una *Single Page Application* (SPA) en el frontend. El sistema ha sido diseñado específicamente para unificar la catalogación, registro autónomo y auditoría estadística en tiempo real de los proyectos comerciales e innovaciones generadas por la comunidad académica de la **Universidad de las Fuerzas Armadas ESPE**.

La plataforma opera completamente en el lado del cliente, garantizando transiciones instantáneas libre de recargas de página, persistencia local tolerante a fallos y un despliegue aislado mediante contenedores inmutables.

---
# Tecnologías Utilizadas

El ecosistema técnico del proyecto se fundamenta en la trilogía estándar del desarrollo web nativo junto con herramientas modernas de infraestructura:

* **HTML5 Semántico:** Estructuración de la interfaz mediante bloques modulares (`<main>`, `<section>`, `<table>`, `<form>`) que segmentan las vistas dinámicas de la SPA sin depender de múltiples documentos.
* **CSS3 Tokenizado (Sistema de Diseño):** Centralización de variables globales en el selector `:root` para asegurar el cumplimiento estricto de la línea gráfica institucional (Verdes ESPE, acentos dorados). Implementación de layouts bidimensionales y unidimensionales mediante **CSS Grid** y **Flexbox**.
* **JavaScript Nativo:** Motor operacional del sistema. Responsable de la manipulación dinámica del DOM mediante plantillas literales, enrutamiento lógico interno, interceptación y validación de formularios (CRUD), y computación de analíticas financieras.
* **Web Storage API (LocalStorage):** Persistencia persistente de datos locales en formato serializado JSON para mantener el estado de la sesión ante refrescos accidentales del navegador.
* **Docker & Nginx Alpine:** Empaquetado e infraestructura inmutable. Uso de un servidor web ultra ligero y de alto rendimiento basado en Linux Alpine para garantizar la portabilidad absoluta del portal.

---
##Instrucciones para despligue del Docker
### Construir la Imagen
```bash
docker build -t skrisaac/espe-emprendimientos .
```

### Ejecutar contenedor

```bash
docker run -d -p 8080:80 --name contenedor_espe skrisaac/espe-emprendimientos:latest
```

### Descargar Imagen de Docker hub
```bash
docker pull skrisaac/espe-emprendimientos:latest
```

### Acceso al sitio Web
```bash
http://localhost:8080
```

### URL de la Imagen

```bash
https://hub.docker.com/r/skrisaac/espe-emprendimientos
```

```plaintext
📂 PORTAL-DE-EMPRENDIMIENTOS/
├── __MACOSX/               # Archivos de metadatos generados automáticamente por el sistema macOS
├── prueba/                 # Directorio de respaldo con versiones preliminares del frontend
│   ├── ._index.html
│   ├── ._script.js
│   ├── ._styles.css
│   └── ._prueba
├── LastestVersion/         # CÓDIGO FUENTE Versión estable y definitiva de la SPA
│   ├── index.html          # Estructura semántica HTML5 y contenedores modulares de las secciones
│   ├── script.js           # Lógica en JavaScript: enrutador, operaciones CRUD y motor estadístico
│   └── styles.css          # Hojas de estilo CSS3: variables :root, layouts (Grid/Flex) y Media Queries
├── .dockerignore           # Archivos y directorios excluidos del contexto de construcción de Docker
├── Dockerfile              # Receta de automatización para desplegar la SPA en Nginx Alpine
└── README.md               # Documentación técnica del proyecto 




