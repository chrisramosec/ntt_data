
# Proyecto Frontend - Angular

Este proyecto es el frontend de una aplicación conectada a un backend desarrollado en Node.js de Christopher Ramos para la evaluacion en NTT Data. A continuación se detallan los pasos necesarios para ejecutar correctamente el entorno de desarrollo, ejecutar pruebas y visualizar resultados de cobertura.

---

## Seniority aplicada

Dentro del proyecto se hizo los items para Junior y Semi-Senior.

---

## ✅ Requisitos previos

Antes de comenzar, asegúrate de tener instaladas las siguientes versiones:

- **Node.js**: `v18.10.0`
- **Angular CLI**: `v14.2.13`

Para verificar si están instaladas correctamente, puedes ejecutar:

```bash
node -v
ng version
```

Si no tienes Angular CLI instalado, puedes hacerlo con:

```bash
npm install -g @angular/cli@14.2.13
```

---

## 📦 Instalación de dependencias

1. Clona este repositorio.
2. Abre una terminal en la carpeta del proyecto.
3. Ejecuta el siguiente comando para instalar las dependencias:

```bash
npm install
```

---

## ⚙️ Iniciar backend (obligatorio)

Antes de iniciar el frontend, asegúrate de tener en ejecución el proyecto **`repo-interview-main`** (backend). Para ello:

1. Navega a la carpeta del backend.
2. Ejecuta:

```bash
npm run start:dev
```

> 🔴 **IMPORTANTE:** Este paso es obligatorio antes de iniciar el frontend. El backend debe estar corriendo para que el frontend funcione correctamente.

---

## 🚀 Iniciar el frontend

Una vez que el backend esté en ejecución y las dependencias estén instaladas, ejecuta:

```bash
ng serve -o
```

Esto abrirá la aplicación en tu navegador predeterminado.

---

## 🧪 Ejecutar pruebas unitarias

Para correr las pruebas unitarias del proyecto, utiliza el siguiente comando:

```bash
npm run test
```

---

## 📊 Ver reporte de cobertura

Para generar un reporte de cobertura de código de las pruebas unitarias:

```bash
npm run test:coverage
```

El reporte generado estará disponible en la siguiente ruta:

```
/coverage/lcov-report/index.html
```

Puedes abrir el archivo `index.html` en tu navegador para visualizar el reporte gráfico de cobertura.

---

## 📝 Notas adicionales

- Si modificas dependencias o configuraciones, recuerda volver a ejecutar `npm install`.
- Este proyecto utiliza Angular en modo desarrollo. Para compilarlo en modo producción, puedes usar:

```bash
ng build --prod
```

---

¡Listo! Ya puedes comenzar a trabajar en el proyecto 🚀
