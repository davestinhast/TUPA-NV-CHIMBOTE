# 🏛️ TUPA Digital — Municipalidad de Nuevo Chimbote

Portal web oficial del **Texto Único de Procedimientos Administrativos (TUPA) 2025** de la Municipalidad Distrital de Nuevo Chimbote.

---

## 🌐 Descripción

TUPA Digital es un portal ciudadano moderno que permite a los habitantes de Nuevo Chimbote consultar de forma rápida, sencilla y accesible los **260+ procedimientos administrativos** vigentes, sus requisitos, costos, plazos y bases legales — directamente desde cualquier dispositivo con conexión a internet.

---

## ✨ Funcionalidades

- 🔍 **Búsqueda inteligente** por nombre, categoría o código de trámite
- 📋 **Ficha completa** de cada procedimiento con requisitos, costos y plazos
- 🤖 **Tupi Bot** — Asistente virtual con flujos conversacionales de asesoría
- 🌍 **Traducción al Quechua (BETA)** — Inclusión de lenguas originarias
- 🖨️ **Impresión y exportación a PDF** con vista optimizada
- 📲 **Compartir por WhatsApp** en un solo clic
- 🔗 **Código QR** por trámite para consulta presencial
- 👍 **Widget de retroalimentación** ciudadana
- 🌙 **Modo oscuro** y accesibilidad mejorada
- 📱 **Diseño responsive** para móviles, tablets y escritorio
- ⚡ **PWA** — Instalable como aplicación en dispositivos móviles

---

## 🛠️ Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite 7 |
| Estilos | CSS Variables (diseño propio) |
| Íconos | Lucide React |
| Routing | React Router DOM v7 |
| QR | qrcode.react |
| PDF | pdf.js |
| PWA | vite-plugin-pwa |

---

## 🚀 Instalación y uso local

```bash
# Clonar el repositorio
git clone https://github.com/davestinhast/TUPA-NV-CHIMBOTE.git

# Instalar dependencias
cd TUPA-NV-CHIMBOTE
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

---

## 📁 Estructura del proyecto

```
tupa-portal/
├── public/
│   ├── data/
│   │   └── procedimientos.json    # Base de datos de trámites
│   └── capturas/                  # Imágenes de referencia PDF
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── LogoTupa.jsx           # Logo vectorial SVG
│   │   ├── TupaBot.jsx            # Asistente virtual
│   │   ├── TramiteCard.jsx
│   │   ├── DarkModeToggle.jsx
│   │   └── ...
│   ├── pages/
│   │   ├── Inicio.jsx
│   │   ├── Buscar.jsx
│   │   ├── DetalleTramite.jsx
│   │   ├── Acerca.jsx
│   │   └── Dashboard.jsx
│   ├── index.css                  # Sistema de diseño completo
│   └── main.jsx
└── package.json
```

---

## 🏛️ Información Institucional

- **Institución:** Municipalidad Distrital de Nuevo Chimbote
- **Documento base:** Ordenanza Municipal N° 009‑2024‑MDNCH
- **Versión TUPA:** 2025
- **Procedimientos:** 260+
- **Categorías:** 18

---

## 📄 Licencia

Proyecto de desarrollo institucional — Municipalidad Distrital de Nuevo Chimbote, Perú.
