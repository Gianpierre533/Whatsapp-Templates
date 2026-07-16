# 📱 Gestor de Plantillas para WhatsApp

Laboratorio 13.

## 🧠 Sobre la Clase `Template`

Usé esta clase como el "molde" para construir cada plantilla. Guarda el `titulo`, `mensaje` y `hashtag` que ingresa el usuario. Además, le puse `new Date()` en el constructor para que registre automáticamente la fecha y hora exacta de creación. Todo esto se almacena en un arreglo que funciona como el estado central de la app.

## 🔤 Métodos de String utilizados

Para limpiar y manipular los textos del usuario usé:

- **`.trim()`**: Para borrar los espacios en blanco que sobran al inicio y al final de los inputs.
- **`.toLowerCase()`**: Para guardar los hashtags siempre en minúsculas y mantener el orden.
- **`.startsWith()`**: Para revisar si el hashtag ya empieza con `#`. Si no lo tiene, se lo concateno.
- **`.replaceAll()`**: Es la clave del generador. Lo usé para buscar el texto `{nombre}` dentro de la plantilla y cambiarlo por el nombre real que se quiere usar en el mensaje final.

## 🖱️ Delegación de Eventos (Lab 14)

En lugar de ponerle un `addEventListener` a cada botón de "Eliminar" o "Editar" por separado (lo cual sería un problema porque las tarjetas se crean y destruyen constantemente), utilicé el patrón de **delegación de eventos**.

Le puse un solo "escuchador" de clics al contenedor padre (`<ul id="listaPlantillas">`). Cuando hago clic, el código revisa si el elemento clickeado (`evento.target`) tiene la clase del botón que busco. Si es así, lee su atributo `data-id` para saber exactamente a qué plantilla aplicarle la acción. Es mucho más eficiente y limpio.

## 📊 Estadísticas y la función `contarPorHashtag`

Para mostrar el resumen en la parte superior, creé la función `contarPorHashtag`. Esta es una **función pura**: recibe el arreglo actual de plantillas, lo recorre y devuelve un objeto nuevo que contiene el conteo de cuántas veces se repite cada hashtag. No modifica variables externas ni el estado original; solo entra un dato y sale un resultado.

Con ese resultado, puedo dibujar etiquetas dinámicas en el panel (ej. `#ventas · 2`) que se actualizan automáticamente en cada `render()`.

## 💾 Persistencia de Datos (Lab 15)

**¿Cómo guardo y cargo el estado?**
Para que las plantillas no se borren al recargar la página, guardo los datos en la memoria del navegador usando `localStorage`.

- **Para guardar:** Como `localStorage` solo acepta texto plano, utilizo `JSON.stringify(state.plantillas)` para convertir mi arreglo de objetos en una cadena de texto antes de guardarlo con `setItem()`.
- **Para cargar:** Al iniciar la app, hago el proceso inverso. Recupero el texto con `getItem()` y uso `JSON.parse()` para convertir ese texto de vuelta a un arreglo real de JavaScript.

**¿Por qué uso try/catch al parsear?**
Utilizo un bloque `try/catch` como medida de seguridad. La función `JSON.parse()` es muy estricta y "explota" (lanza un error fatal que detiene la ejecución del código) si el texto que intenta leer está corrupto o mal formado. Al envolverlo en `try/catch`, le digo a la app: "Intenta leer esto; si falla porque los datos están rotos, no te cuelgues, simplemente atrapa el error y arranca de cero con una lista vacía".
