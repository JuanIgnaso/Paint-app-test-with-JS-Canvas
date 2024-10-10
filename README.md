# Paint-app-test-with-JS-Canvas

Pequeña app usando la API Canvas de JavaScript

## Descripción

Esta aplicación Web hace uso de la API de JS Canvas, el objetivo es que el usuario pueda realizar simples dibujos con algunas herramientas
mostradas en el DOM.

## Funciones

El usuario dispone de:

<ul>
<li>Pencil: para poder dibujar</li>
<li>Line: trazar líneas en el lienzo</li>
<li>Square: para dibujar cuadrados</li>
<li>Circle: para dibujar circunferencias</li>
<li>Eraser: el usuario puede borrar</li>
<li>Color Picker: copiar el color del lugar donde se haga click</li>
<li>Current Color: cambiar tanto el color del trazado como el del relleno</li>
<li>Save Canvas: pasar el dibujo a una imagen para poder guardarlo</li>
<li>Undo/Redo: deshacer y reacer los últimos cambios realizados</li>
</ul>

## Fallos conocidos

- Botón de **Undo** y **Redo** no funcionan, pero si sus atajos de teclado **u** y **r**.
- Div usado de referencia cuando se usa la herramienta **line,square o circle** no carga o aparece siempre.
- Puntero desincronizado al redimensionar la ventana.

## Como usarlo

Se puede probar si se dispone de cualquier editor de código que disponga de la herramienta de [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) o similar.
