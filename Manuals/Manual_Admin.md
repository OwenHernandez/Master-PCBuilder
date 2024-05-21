# Manual de Administración de MasterPCBuilder

![https://github.com/OwenHernandez/Master-PCBuilder-Owen/blob/main/Manuals/img/logo_dark.png](https://github.com/OwenHernandez/Master-PCBuilder-Owen/blob/main/Manuals/img/logo_dark.png)

## Índice

- [Introducción](#introducción)
- [Menú](#menú)
  - [Login](#login)
  - [Navbar](#navbar)
  - [Side Menu](#side-menu)
- [Funcionalidades](#funcionalidades)
  - [Dashboard](#dashboard)
  - [Users](#users)
  - [Sellers](#sellers)
  - [Components](#components)
  - [Builds](#builds)
  - [Posts](#posts)
  - [Groups](#groups)

## Introducción

¡Bienvenido a MasterPCBuilder, tu solución integral para gestionar todo lo relacionado con la construcción de PCs! Nuestra aplicación está diseñada para ofrecerte un control total sobre cada aspecto, ya sea agregar, eliminar o editar cualquier cosa en la plataforma. Aquí te explicamos de manera sencilla las funciones clave que puedes realizar:

1. **Usuarios**: Gestiona los perfiles de los usuarios, incluyendo la creación de nuevos usuarios, la modificación de información existente o la eliminación de usuarios que ya no necesiten acceso.
2. **Vendedores (Sellers)**: Controla la lista de vendedores que ofrecen componentes en la plataforma. Puedes agregar nuevos vendedores, actualizar la información de los actuales o eliminar aquellos que ya no trabajen con nosotros.
3. **Componentes (Components)**: Administra todos los componentes de PC disponibles. Desde añadir nuevas piezas hasta actualizar los detalles de los componentes actuales o eliminar aquellos que ya no estén disponibles.
4. **Construcciones (Builds)**: Gestiona las diferentes configuraciones de PC creadas por los usuarios. Puedes agregar nuevas construcciones, editar las existentes o eliminar aquellas que ya no sean relevantes.
5. **Publicaciones (Posts)**: Supervisa todas las publicaciones hechas en la plataforma. Esto incluye agregar nuevas publicaciones, editar el contenido de las existentes o eliminarlas según sea necesario.
6. **Grupos (Groups)**: Administra los diferentes grupos de usuarios dentro de la aplicación. Puedes crear nuevos grupos, modificar la información de los existentes o eliminar grupos que ya no sean necesarios.

Además, MasterPCBuilder cuenta con un panel de control (dashboard) con gráficas y estadísticas para que puedas tener una visión clara y rápida del estado de la aplicación. Podrás ver estadísticas sobre el uso, el rendimiento y la actividad en la plataforma, todo en un solo lugar. Ahora veremos las distintas funcionalidades de la aplicación.

## Menú

### Login

![https://github.com/OwenHernandez/Master-PCBuilder-Owen/blob/main/Manuals/img/Screenshot%202024-05-21%20215728.png](https://github.com/OwenHernandez/Master-PCBuilder-Owen/blob/main/Manuals/img/Screenshot%202024-05-21%20215728.png)

- **Campo para el Nombre de Usuario (Nick)**: 
  - _Insert your nick here_: Este campo de texto permite al usuario ingresar su nombre de usuario o apodo (nick) que ha registrado en la plataforma. Es un campo obligatorio para proceder con el inicio de sesión.

- **Campo para la Contraseña**:
  - _Insert your password here_: Este campo de texto permite al usuario ingresar su contraseña asociada con el nombre de usuario ingresado. También es un campo obligatorio para proceder con el inicio de sesión. Normalmente, este campo enmascarará la entrada de la contraseña por motivos de seguridad.

- **Botón de Inicio de Sesión (Login)**:
  - _Login_: Este botón azul se utiliza para enviar la información ingresada en los campos de nombre de usuario y contraseña al sistema para su validación. Al hacer clic en este botón:
    - El sistema verifica que el nombre de usuario y la contraseña coincidan con los registros en la base de datos.
    - Si las credenciales son correctas, el usuario es redirigido a la pantalla principal de la aplicación, donde puede acceder a todas las funcionalidades disponibles según sus permisos.
    - Si las credenciales son incorrectas, el sistema muestra un mensaje de error indicando que el nombre de usuario o la contraseña son incorrectos.

- **Flujo de Proceso de Inicio de Sesión**:
  - _Ingreso de Credenciales_: El usuario ingresa su nombre de usuario y contraseña en los campos correspondientes.
  - _Validación_: Al hacer clic en el botón "Login", el sistema valida las credenciales ingresadas.
    - Si son correctas, se concede acceso.
    - Si son incorrectas, se muestra un mensaje de error y se solicita al usuario que vuelva a intentarlo.

### Navbar

![]()

1. **Ícono del Sol**:
   - Función: Cambiar entre el tema claro (light theme) y el tema oscuro (dark theme).
   - Uso: Al hacer clic en el ícono del sol, el tema de la interfaz de usuario cambiará, proporcionando una experiencia visual diferente según la preferencia del usuario. Si está en tema claro, cambiará a tema oscuro y viceversa.

2. **Ícono del Menú (tres líneas)**:
   - Función: Desplegar el menú lateral.
   - Uso: Al hacer clic en el ícono de tres líneas, se abre un menú lateral que contiene accesos directos a varias secciones de la aplicación.

### Side Menu

![https://github.com/OwenHernandez/Master-PCBuilder-Owen/blob/main/Manuals/img/Screenshot%202024-05-21%20215754.png](https://github.com/OwenHernandez/Master-PCBuilder-Owen/blob/main/Manuals/img/Screenshot%202024-05-21%20215754.png)

1. **Logo de MasterPCBuilder**:
   - En la parte superior del menú, se muestra el logo de la aplicación.

2. **Opciones del Menú**:
   - _Dashboard_: Acceso al panel de control principal, donde se pueden ver estadísticas y gráficas de la aplicación.
   - _Users_: Acceso a la pantalla de gestión de usuarios, donde se pueden agregar, editar o eliminar usuarios.
   - _Sellers_: Acceso a la pantalla de gestión de vendedores, donde se pueden agregar, editar o eliminar vendedores.
   - _Components_: Acceso a la pantalla de gestión de componentes, donde se pueden agregar, editar o eliminar componentes de PC.
   - _Builds_: Acceso a la pantalla de gestión de builds (configuraciones de PC), donde se pueden agregar, editar o eliminar builds.
   - _Posts_: Acceso a la pantalla de gestión de publicaciones, donde se pueden agregar, editar o eliminar publicaciones.
   - _Group Chats_: Acceso a la pantalla de gestión de grupos de chat, donde se pueden ver y gestionar los grupos y sus miembros.

3. **Botón de Logout**:
   - Función: Cerrar sesión en la aplicación.
   - Uso: Al hacer clic en "Logout", el usuario cierra su sesión actual y es redirigido a la pantalla de inicio de sesión.

## Funcionalidades

### Dashboard

![https://github.com/OwenHernandez/Master-PCBuilder-Owen/blob/main/Manuals/img/Screenshot%202024-05-21%20215803.png](https://github.com/OwenHernandez/Master-PCBuilder-Owen/blob/main/Manuals/img/Screenshot%202024-05-21%20215803.png)

- **Indicadores Principales**:
  - _Total Users_: En la parte superior izquierda, puedes ver el número total de usuarios registrados en la plataforma. En este ejemplo, hay 13 usuarios.
  - _Total Builds_: En el centro superior, se muestra el número total de configuraciones de PC creadas por los usuarios. Aquí, hay 10 builds.
  - _Total Components_: En la parte superior derecha, se indica la cantidad total de componentes de PC disponibles en la plataforma. Actualmente, hay 14 componentes.

- **Gráfica de Barras**:
  - Esta gráfica presenta información comparativa sobre los precios máximos de diversos componentes en diferentes plataformas (eBay, Amazon y la aplicación). Cada barra está coloreada para representar una plataforma específica:
    - _Max eBay Prices_: En color rosa.
    - _Max Amazon Prices_: En color rojo.
    - _Max App Prices_: En color azul.
  - Los componentes o elementos específicos se muestran en el eje horizontal (eje X), mientras que los precios se representan en el eje vertical (eje Y).

- **Gráfica Circular**:
  - A la derecha, hay una gráfica circular que muestra la distribución de componentes por vendedores. En el ejemplo, los componentes están distribuidos entre tres vendedores:
    - _TechStore_: Representado en color rosa.
    - _ElectroGadgets_: Representado en color naranja.
    - _PCParts_: Representado en color verde.

- **Botones de Filtro**:
  - _All_: Este botón, cuando está seleccionado (como se ve en color verde), muestra todos los componentes en la gráfica de barras.
  - _Categorías Específicas_: Los otros botones (GPU, CPU, RAM, Storage) permiten filtrar la gráfica de barras para mostrar únicamente los componentes pertenecientes a la categoría seleccionada. Por ejemplo, al seleccionar "GPU", sólo se mostrarán las tarjetas gráficas.

- **Cómo Utilizar el Dashboard**:
  - _Visualización de Datos_: Usa el dashboard para obtener una visión general del estado de la aplicación, incluyendo cuántos usuarios, builds y componentes hay.
  - _Comparación de Precios_: Observa y compara los precios máximos de componentes específicos entre distintas plataformas de venta.
  - _Distribución por Vendedores_: Visualiza qué porcentaje de componentes proviene de cada vendedor usando la gráfica circular.
  - _Filtrado de Información_: Utiliza los botones de filtro para personalizar la información mostrada en la gráfica de barras según la categoría de componentes que te interese.

### Users

![https://github.com/OwenHernandez/Master-PCBuilder-Owen/blob/main/Manuals/img/Screenshot%202024-05-21%20215822.png](https://github.com/OwenHernandez/Master-PCBuilder-Owen/blob/main/Manuals/img/Screenshot%202024-05-21%20215822.png)

#### Listado de Usuarios:

- La pantalla principal muestra una lista de todos los usuarios registrados en la plataforma. Cada usuario se muestra con su nombre de usuario.
- A la derecha de cada nombre de usuario, hay un ícono de flecha hacia abajo que, al hacer clic, despliega más detalles del usuario.

#### Detalles del Usuario:
- Al desplegar un usuario, se muestran detalles adicionales como:
  - Correo electrónico.
  - Rol (ej. ROL_ADMIN).
  - Estado (ej. Deleted).
  - Imagen de perfil (si está disponible).

- En esta vista desplegada, también hay botones para realizar acciones específicas sobre el usuario:
  - _Delete_: Botón rojo para eliminar al usuario.
  - _Edit_: Botón azul para editar la información del usuario.
  - _Chat_: Botón verde para iniciar una conversación con el usuario.

#### Editar Usuario:
- Al hacer clic en el botón "Edit", se abre una ventana modal que permite modificar la información del usuario.
  - _Insert a new password_: Campo para cambiar la contraseña del usuario.
  - _Choose Role_: Desplegable para seleccionar el rol del usuario.
  - _Seleccionar archivo_: Opción para subir una nueva imagen de perfil.
  - _Update User_: Botón azul para guardar los cambios realizados.
  - _Close_: Botón para cerrar la ventana sin guardar los cambios.

#### Agregar Usuario:
- En la parte inferior de la pantalla principal, hay un botón verde "Add User" para añadir un nuevo usuario.
  - Al hacer clic en "Add User", se abre una ventana modal para ingresar los detalles del nuevo usuario:
    - _Insert the nickname_: Campo para ingresar el nombre de usuario.
    - _Insert the password_: Campo para establecer una contraseña.
    - _Insert the email_: Campo para ingresar el correo electrónico.
    - _Choose Role_: Desplegable para seleccionar el rol del nuevo usuario.
    - _Seleccionar archivo_: Opción para subir una imagen de perfil.
    - _Add User_: Botón verde para añadir el usuario.
    - _Close_: Botón para cerrar la ventana sin añadir al usuario.

#### Eliminar Usuario:
- Al hacer clic en el botón "Delete" junto al usuario, aparece una ventana modal de confirmación.
  - _Are you sure?_: Pregunta de confirmación para asegurar que deseas eliminar al usuario.
  - _Delete User_: Botón rojo para confirmar y eliminar el usuario.
  - _Close_: Botón para cancelar y cerrar la ventana sin eliminar al usuario.

### Sellers

![https://github.com/OwenHernandez/Master-PCBuilder-Owen/blob/main/Manuals/img/Screenshot%202024-05-21%20215830.png](https://github.com/OwenHernandez/Master-PCBuilder-Owen/blob/main/Manuals/img/Screenshot%202024-05-21%20215830.png)

#### Listado de Vendedores:
- La pantalla principal muestra una lista de todos los vendedores registrados en la plataforma. Cada vendedor se muestra con su nombre.
- A la derecha de cada nombre de vendedor, hay un ícono de flecha hacia abajo que, al hacer clic, despliega más detalles del vendedor.

#### Detalles del Vendedor:
- Al desplegar un vendedor, se muestran detalles adicionales como:
  - Nombre del Vendedor.
  - Imagen o información adicional (si está disponible).

- En esta vista desplegada, también hay botones para realizar acciones específicas sobre el vendedor:
  - _Delete_: Botón rojo para eliminar al vendedor.
  - _Edit_: Botón azul para editar la información del vendedor.

#### Eliminar Vendedor:
- Al hacer clic en el botón "Delete" junto al vendedor, aparece una ventana modal de confirmación.
  - _Are you sure?_: Pregunta de confirmación para asegurar que deseas eliminar al vendedor.
  - _Delete Seller_: Botón rojo para confirmar y eliminar al vendedor.
  - _Close_: Botón para cancelar y cerrar la ventana sin eliminar al vendedor.

#### Editar Vendedor:
- Al hacer clic en el botón "Edit", se abre una ventana modal que permite modificar la información del vendedor.
  - _Insert the name_: Campo para cambiar el nombre del vendedor.
  - _Seleccionar archivo_: Opción para subir una nueva imagen o archivo relacionado con el vendedor.
  - _Update Seller_: Botón azul para guardar los cambios realizados.
  - _Close_: Botón para cerrar la ventana sin guardar los cambios.

#### Agregar Vendedor:
- En la parte inferior de la pantalla principal, hay un botón verde "Add Seller" para añadir un nuevo vendedor.
  - Al hacer clic en "Add Seller", se abre una ventana modal para ingresar los detalles del nuevo vendedor:
    - _Insert the name_: Campo para ingresar el nombre del vendedor.
    - _Seleccionar archivo_: Opción para subir una imagen o archivo relacionado con el vendedor.
    - _Add Seller_: Botón verde para añadir el vendedor.
    - _Close_: Botón para cerrar la ventana sin añadir al vendedor.

### Components

![https://github.com/OwenHernandez/Master-PCBuilder-Owen/blob/main/Manuals/img/Screenshot%202024-05-21%20215838.png](https://github.com/OwenHernandez/Master-PCBuilder-Owen/blob/main/Manuals/img/Screenshot%202024-05-21%20215838.png)

#### Listado de Componentes:
- La pantalla principal muestra una lista de todos los componentes de PC disponibles en la plataforma. Cada componente se muestra con su nombre y tipo.
- A la derecha de cada nombre de componente, hay un ícono de flecha hacia abajo que, al hacer clic, despliega más detalles del componente.

#### Detalles del Componente:
- Al desplegar un componente, se muestran detalles adicionales como:
  - Nombre del Componente (por ejemplo, Locura GPU).
  - Tipo de Componente (por ejemplo, GPU).
  - Vendedor (por ejemplo, TechStore).
  - Precios: Se muestra un desplegable que incluye los precios del componente en diferentes plataformas (precio en la aplicación, Amazon, eBay).
  - Estado (ej. Deleted).
  - Imagen del Componente (si está disponible).

- En esta vista desplegada, también hay botones para realizar acciones específicas sobre el componente:
  - _Delete_: Botón rojo para eliminar el componente.
  - _Edit_: Botón azul para editar la información del componente.

#### Eliminar Componente:
- Al hacer clic en el botón "Delete" junto al componente, aparece una ventana modal de confirmación.
  - _Are you sure?_: Pregunta de confirmación para asegurar que deseas eliminar el componente.
  - _Delete Component_: Botón rojo para confirmar y eliminar el componente.
  - _Close_: Botón para cancelar y cerrar la ventana sin eliminar el componente.

#### Editar Componente:
- Al hacer clic en el botón "Edit", se abre una ventana modal que permite modificar la información del componente.
  - _Nombre del Componente_: Campo para cambiar el nombre del componente.
  - _Precio_: Campo para cambiar el precio del componente.
  - _Tipo de Componente_: Desplegable para seleccionar el tipo de componente.
  - _Vendedor_: Desplegable para seleccionar el vendedor asociado con el componente.
  - _Seleccionar archivo_: Opción para subir una nueva imagen del componente.
  - _Update Component_: Botón azul para guardar los cambios realizados.
  - _Close_: Botón para cerrar la ventana sin guardar los cambios.

#### Visualización de Precios:
- En los detalles del componente, el desplegable "Prices" muestra los diferentes precios del componente en distintas plataformas:
  - _Price_: Precio en la aplicación.
  - _Amazon Price_: Precio en Amazon.
  - _eBay Price_: Precio en eBay.

### Builds

![https://github.com/OwenHernandez/Master-PCBuilder-Owen/blob/main/Manuals/img/Screenshot%202024-05-21%20215845.png](https://github.com/OwenHernandez/Master-PCBuilder-Owen/blob/main/Manuals/img/Screenshot%202024-05-21%20215845.png)

#### Listado de Builds:
- La pantalla principal muestra una lista de todas las configuraciones de PC creadas en la plataforma. Cada build se muestra con su nombre.
- Los builds están categorizados (por ejemplo, Gaming PC, Workstation, Budget PC).
- A la derecha de cada nombre de build, hay un ícono de flecha hacia abajo que, al hacer clic, despliega más detalles del build.

#### Detalles del Build:
- Al desplegar un build, se muestran detalles adicionales como:
  - Nombre del Build (por ejemplo, Entry-level budget PC).
  - Categoría (por ejemplo, Budget PC).
  - Precio Total: Muestra el costo total de la configuración (por ejemplo, 800 €).
  - Imagen de la Build (si está disponible).
  - Lista de Componentes: Detalle de los componentes incluidos en la build (por ejemplo, Storage: Samsung 1TB SSD con precio de 150 €).

- En esta vista desplegada, también hay botones para realizar acciones específicas sobre el build:
  - _Delete_: Botón rojo para eliminar el build.
  - _Edit_: Botón azul para editar la información del build.
  - _Remove Deleted Components_: Botón amarillo para eliminar los componentes que han sido marcados como eliminados de la configuración.

#### Eliminar Build:
- Al hacer clic en el botón "Delete" junto al build, aparece una ventana modal de confirmación.
  - _Are you sure?_: Pregunta de confirmación para asegurar que deseas eliminar el build.
  - _Delete Build_: Botón rojo para confirmar y eliminar el build.
  - _Close_: Botón para cancelar y cerrar la ventana sin eliminar el build.

#### Editar Build:
- Al hacer clic en el botón "Edit", se abre una ventana modal que permite modificar la información del build.
  - _Nombre del Build_: Campo para cambiar el nombre del build.
  - _Descripción del Build_: Campo para cambiar la descripción del build.
  - _Categoría_: Desplegable para seleccionar la categoría del build.
  - _Componentes_: Lista de verificación para seleccionar o deseleccionar componentes incluidos en el build.
  - _Update Build_: Botón azul para guardar los cambios realizados.
  - _Close_: Botón para cerrar la ventana sin guardar los cambios.

### Posts

![https://github.com/OwenHernandez/Master-PCBuilder-Owen/blob/main/Manuals/img/Screenshot%202024-05-21%20215852.png](https://github.com/OwenHernandez/Master-PCBuilder-Owen/blob/main/Manuals/img/Screenshot%202024-05-21%20215852.png)

#### Listado de Publicaciones:
- La pantalla principal muestra una lista de todas las publicaciones creadas en la plataforma. Cada publicación se muestra con su título.
- A la derecha de cada título de publicación, hay un ícono de flecha hacia abajo que, al hacer clic, despliega más detalles de la publicación.

#### Detalles de la Publicación:
- Al desplegar una publicación, se muestran detalles adicionales como:
  - Título de la Publicación (por ejemplo, My Gaming PC Setup).
  - Contenido de la Publicación (por ejemplo, Just finished building my dream gaming PC!).
  - Categoría del Build (por ejemplo, Build: Gaming PC).
  - Creador de la Publicación (por ejemplo, Created by: user1).

- En esta vista desplegada, también hay botones para realizar acciones específicas sobre la publicación:
  - _Delete_: Botón rojo para eliminar la publicación.
  - _Edit_: Botón azul para editar la información de la publicación.

#### Eliminar Publicación:
- Al hacer clic en el botón "Delete" junto a la publicación, aparece una ventana modal de confirmación.
  - _Are you sure?_: Pregunta de confirmación para asegurar que deseas eliminar la publicación.
  - _Delete Post_: Botón rojo para confirmar y eliminar la publicación.
  - _Close_: Botón para cancelar y cerrar la ventana sin eliminar la publicación.

#### Editar Publicación:
- Al hacer clic en el botón "Edit", se abre una ventana modal que permite modificar la información de la publicación.
  - _Título de la Publicación_: Campo para cambiar el título de la publicación.
  - _Contenido de la Publicación_: Campo para cambiar el contenido de la publicación.
  - _Seleccionar archivo_: Opción para subir una nueva imagen o archivo relacionado con la publicación.
  - _Update Post_: Botón azul para guardar los cambios realizados.
  - _Close_: Botón para cerrar la ventana sin guardar los cambios.

### Groups

![https://github.com/OwenHernandez/Master-PCBuilder-Owen/blob/main/Manuals/img/Screenshot%202024-05-21%20215900.png](https://github.com/OwenHernandez/Master-PCBuilder-Owen/blob/main/Manuals/img/Screenshot%202024-05-21%20215900.png)

#### Listado de Grupos:
- La pantalla principal muestra una lista de todos los grupos creados en la plataforma. Cada grupo se muestra con su nombre.
- A la derecha de cada nombre de grupo, hay un ícono de flecha hacia abajo que, al hacer clic, despliega más detalles del grupo.

#### Detalles del Grupo:
- Al desplegar un grupo, se muestran detalles adicionales como:
  - Nombre del Grupo (por ejemplo, Viva la locura).
  - Admin: El administrador del grupo (por ejemplo, Julio).
  - Miembros: Lista de miembros del grupo con opciones para cada miembro (por ejemplo, Owen, Juan Carlos, Juan).
  - Imagen del Grupo (si está disponible).

- En esta vista desplegada, también hay botones para realizar acciones específicas sobre el grupo:
  - _Delete_: Botón rojo para eliminar el grupo.
  - _Edit_: Botón azul para editar la información del grupo.

#### Acciones sobre los Miembros del Grupo:
- Al lado de cada nombre de miembro, hay un menú desplegable con opciones para:
  - _Remove User_: Eliminar al miembro del grupo.
  - _Make Admin_: Convertir al miembro en administrador del grupo.

#### Eliminar Grupo:
- Al hacer clic en el botón "Delete" junto al grupo, aparece una ventana modal de confirmación.
  - _Are you sure?_: Pregunta de confirmación para asegurar que deseas eliminar el grupo.
  - _Delete Group_: Botón rojo para confirmar y eliminar el grupo.
  - _Close_: Botón para cancelar y cerrar la ventana sin eliminar el grupo.

#### Editar Grupo:
- Al hacer clic en el botón "Edit", se abre una ventana modal que permite modificar la información del grupo.
  - _Nombre del Grupo_: Campo para cambiar el nombre del grupo.
  - _Descripción del Grupo_: Campo para cambiar la descripción del grupo.
  - _Seleccionar archivo_: Opción para subir una nueva imagen del grupo.
  - _Update Group_: Botón azul para guardar los cambios realizados.
  - _Close_: Botón para cerrar la ventana sin guardar los cambios.

