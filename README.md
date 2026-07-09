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
