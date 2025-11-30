# Diario de Conexión

Una aplicación web espiritual para escribir entradas de diario y referenciar a tus guías, maestros, héroes y a Dios usando menciones como @id.

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:5173`

### Construir para producción

```bash
npm run build
```

## 📋 Características

- ✍️ **Diario Espiritual**: Escribe entradas de diario con soporte para menciones
- 🔗 **Sistema de Menciones**: Menciona personajes usando @id (ej: @jesus, @aang, @naruto)
- 👥 **Perfiles de Personajes**: Página de perfil tipo Facebook para cada personaje
- 📊 **Estadísticas**: Ve cuántas veces has mencionado a cada personaje
- 💾 **Persistencia**: Todas las entradas se guardan en localStorage
- 🎨 **Tema Oscuro**: Interfaz moderna con tema oscuro

## 🎯 Uso

1. Escribe tu entrada en el área de texto
2. Menciona personajes usando `@id` (ej: `@jesus`, `@aang`, `@naruto`)
3. Las menciones se destacan automáticamente y son clicables
4. Haz clic en cualquier mención o personaje de la barra lateral para ver su perfil
5. Todas las entradas se guardan automáticamente

## 📁 Estructura del Proyecto

```
src/
  ├── main.jsx              # Punto de entrada
  ├── App.jsx               # Componente principal con rutas
  ├── data/
  │   └── personajes.js     # Datos de todos los personajes
  ├── components/
  │   ├── Diary.jsx         # Componente principal del diario
  │   ├── CharacterList.jsx # Barra lateral con lista de personajes
  │   └── CharacterProfile.jsx # Página de perfil de personaje
  └── styles.css            # Estilos globales
```

## 🎨 Personajes Disponibles

- **Dios**: Dios
- **Yo**: Fabián
- **Maestros**: Jesús, Buda, Ganesha, Krishna
- **Guías**: Conciencia, Voluntad, Equilibrio, Amor, Luz, y más...
- **Héroes**: Personajes de Avatar, Dragon Ball, Naruto, Sailor Moon, Winx, y Caballeros del Zodiaco

## 🛠️ Tecnologías

- React 18
- Vite
- React Router DOM
- CSS3

## 📝 Notas

- Las entradas se guardan en localStorage del navegador
- Los datos persisten entre sesiones
- Puedes eliminar entradas individuales
- El sistema detecta automáticamente las menciones válidas

