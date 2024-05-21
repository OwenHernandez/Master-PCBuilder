# manual de usuario de masterPCbuilder

julio manuel gonzález gonzález 2ºdam  
owen daniel hernández hanrahan  

## índice

1. [introducción](#introducción)
2. [login](#login)
3. [register](#register)
4. [menú lateral](#menú-lateral)
5. [social](#social)
6. [posts](#posts)
7. [other user profile](#other-user-profile)
8. [post](#post)
9. [create post](#create-post)
10. [edit post](#edit-post)
11. [friends list](#friends-list)
12. [search users](#search-users)
13. [group list](#group-list)
14. [group details](#group-details)
15. [profile](#profile)
16. [settings](#settings)
17. [support chat](#support-chat)
18. [friend chat](#friend-chat)
19. [group chat](#group-chat)
20. [components](#components)
21. [components list](#components-list)
22. [component screen](#component-screen)
23. [create component](#create-component)
24. [builds](#builds)
25. [builder](#builder)
26. [your builds](#your-builds)

## introducción

en un mundo donde la personalización y la optimización son cada vez más importantes en el ámbito de la tecnología, surge la necesidad de una plataforma que facilite el proceso de construcción de PCs a medida. con este objetivo en mente, nace masterPCbuilder, un proyecto dedicado a proporcionar a los usuarios una herramienta integral para explorar, comparar y construir configuraciones de PC personalizadas.

masterPCbuilder se presenta como una solución innovadora que combina funcionalidades de publicación de componentes, comparación de precios y comunidad en un solo lugar. los usuarios pueden explorar una amplia gama de componentes de hardware, desde procesadores hasta tarjetas gráficas, y armar configuraciones de PC según sus necesidades y presupuesto.

además de ofrecer herramientas para la construcción de PCs, masterPCbuilder fomenta la interacción entre los usuarios, proporcionando espacios para discusiones, intercambio de consejos y experiencias, y colaboración en tiempo real a través de funciones de chat integradas.

con una interfaz intuitiva y funcionalidades robustas, masterPCbuilder aspira a convertirse en el destino preferido para entusiastas de la tecnología y constructores de PC, ofreciendo una experiencia única y enriquecedora en el mundo de la construcción de PCs personalizados.

## login

esta es la primera pantalla que el usuario se va a encontrar, es una interfaz de inicio de sesión para una aplicación "masterPCbuilder".

### explicación elementos:

- **logo**: debajo del título, hay un logotipo con el texto "masterPCbuilder". esto refuerza la identidad de la aplicación.
- **campo de texto "nick"**: este es un campo donde los usuarios deben ingresar su apodo o nombre de usuario.
- **campo de texto "password"**: aquí, los usuarios deben ingresar su contraseña. por lo general, este campo enmascara el texto para proteger la privacidad.
- **botón "access"**: este botón se utiliza para enviar la información ingresada y tratar de iniciar sesión en la aplicación. al hacer clic, la aplicación intentará verificar las credenciales ingresadas.
- **botón "register"**: este botón lleva a los usuarios a una pantalla de registro donde pueden crear una nueva cuenta si no tienen una, si usted está empezando a usar la aplicación por favor presione este botón.

## register

esta pantalla es para que los usuarios se puedan registrar en nuestra aplicación, poder usarla sin complicaciones y se queden sus montajes, componentes y demás guardados. esta pantalla solo la debe usar si es su primera vez en la app.

### explicación elementos:

- **campo de texto "nick"**: este es un campo donde los usuarios deben ingresar su apodo o nombre de usuario y el nombre de usuario debe de ser único.
- **campo de texto "email"**: aquí, los usuarios deben ingresar su dirección de correo electrónico, está deberá de ser válida.
- **campo de texto "password"**: este campo es para que los usuarios ingresen una contraseña. como es habitual, este campo enmascara el texto para proteger la privacidad.
- **campo de texto "confirm password"**: en este campo, los usuarios deben volver a ingresar su contraseña para confirmarla y asegurarse de que no haya errores tipográficos.
- **botón "register"**: este botón se utiliza para enviar la información ingresada y crear una nueva cuenta en la aplicación. al hacer clic, la aplicación intentará registrar al usuario con las credenciales proporcionadas.
- **botón "volver"**: este botón hará regresar al usuario a la pantalla de inicio de sesión (la pantalla anterior). permite a los usuarios volver si se equivocaron de opción o si ya tienen una cuenta.

después de darle al botón “register”, si todo fue bien, le aparecerá un mensaje encima de los botones “register” y “volver”, que le indicarán al usuario que debe de revisar su correo para verificar que el correo usado es real y es el de el usuario.

al pulsar en el link, se le redirigirá al usuario a una pantalla que muestra los datos que el usuario ha proporcionado más otros para que creará la aplicación para que funcione correctamente (notará que su contraseña no es la misma que la que puso, eso se debe a que esta se encuentra encriptada para la seguridad del usuario, por lo que nadie salvo usted conocerá la contraseña) y podrá volver a la aplicación.

si algo fue mal se le proporcionará un mensaje para aclarar el problema y que el usuario pueda solucionarlo (normalmente, el problema será que las contraseñas no coincidan, el correo sea o tenga un formato invalido o que el nick ya fue elegido por otra persona.

## menú lateral

esta pantalla muestra el menú lateral de navegación dentro de la aplicación.

### explicación elementos:

- **logo (masterPCbuilder)**: en la parte superior del menú, muestra el logo de la aplicación "masterPCbuilder".
- **opciones del menú**:
  - **social**: esta opción probablemente lleva a una sección donde los usuarios pueden interactuar socialmente, como ver publicaciones, etc.
  - **components**: esta opción lleva a una sección donde los usuarios pueden explorar y buscar componentes de PC.
  - **friends**: esta opción lleva a la lista de amigos del usuario.
  - **builder**: esta opción lleva a la herramienta de construcción de PC, donde los usuarios pueden diseñar y ensamblar sus propias configuraciones de PC.
  - **profile**: esta opción lleva al perfil del usuario actual.
  - **settings**: esta opción lleva a la configuración de la aplicación, donde el usuario puede cambiar configuraciones como el tema, la contraseña, la imagen de perfil y el chat con un administrador de la aplicación.
- **botón "logout"**: en la parte inferior del menú, hay un botón para cerrar la sesión del usuario actual en la aplicación.

## social

esta parte explicará todas las pantallas que tienen que ver más con otros usuarios.

## posts

esta pantalla es una interfaz de publicaciones.

### explicación elementos:

- **encabezado (posts)**:
  - la parte superior de la pantalla muestra el título "posts", indicando que esta sección muestra publicaciones de usuarios.
  - **icono de usuario**: a la izquierda del título, hay un icono de perfil que lleva al perfil del usuario actual.
  - **menú de navegación**: a la derecha del título, hay un icono de menú que, al hacer clic, se abrirá un menú de navegación con más opciones.
- **botón "filters"**: este botón permite a los usuarios aplicar filtros a las publicaciones para refinar los resultados según ciertos criterios. si pulsa este botón le aparecerá una ventanita, con los distintos filtros que el usuario puede aplicar (por el momento solo hay uno).
- **barra de búsqueda**: un campo de texto que permite a los usuarios buscar publicaciones por título.
- **categorías de filtros** (la que está en gris es la que se encuentra seleccionada):
  - **all**: muestra todas las publicaciones.
  - **gaming**: filtra las publicaciones relacionadas con equipos de juegos.
  - **budget**: filtra las publicaciones que se ajustan a un presupuesto limitado.
  - y el usuario es capaz de mover los botones de categorías verá que hay otra que es **work**: filtra las publicaciones que se ajustan a lo básico y necesario para que un PC funcione.
- **publicación de ejemplo**:
  - **usuario (coso)**: muestra la foto de perfil y el nombre del usuario que hizo la publicación, el usuario puede pulsar la foto de perfil para acceder al perfil del usuario que hizo la publicación.
  - **título (great gaming PC)**: el título de la publicación.
  - **precio (100€)**: el precio del montaje publicado.
  - **categoría (gaming)**: la categoría a la que pertenece el montaje.
  - **imagen**: una imagen del PC descrito en la publicación.
  - **interacciones**: un icono de "me gusta" con un contador (actualmente en 0), que permite a los usuarios interactuar con la publicación y si pulsa en el resto de la publicación podrá ver en más detalle la publicación.
- **barra de navegación inferior**:
  - **crear (create)**: un botón para crear una nueva publicación.
  - **publicaciones (posts)**: un botón para ver la lista de publicaciones, que es la pantalla actual.

## other user profile

esta pantalla es una interfaz de perfil de otro usuario para la aplicación.

### explicación elementos:

- **encabezado (coso's profile)**:
  - la parte superior de la pantalla muestra el título "coso's profile", indicando que esta es la pantalla de perfil del usuario llamado "coso".
  - **icono de usuario**: a la izquierda del título, hay un icono de perfil que lleva al perfil del usuario actual.
  - **botón de retroceso**: a la derecha del título, hay un icono de flecha que permite al usuario regresar a la pantalla anterior.
- **detalles del usuario**:
  - **avatar de usuario**: justo debajo del encabezado, se muestra la imagen de perfil del usuario "coso".
  - **nombre de usuario (coso)**: el nombre del usuario cuyo perfil se está viendo.
  - **correo electrónico (coso8610@gmail.com)**: la dirección de correo electrónico del usuario.
- **botón "add friend"/”remove friend”**: un botón que permite añadir al usuario como amigo y así poder hablar con él (el botón aparecerá medio translúcido si el usuario está bloqueado), si este ya es su amigo podrá quitarlo pulsando de nuevo en el.
- **botón "block user"/”unblock user”**: un botón que permite bloquear a este usuario, evitando cualquier tipo de interacción futura, si este ya está bloqueado, podrá desbloquearlo pulsando otra vez en el mismo y si es su amigo y lo bloquea se cancelará la amistad.

## post

esta pantalla muestra una publicación específica dentro de la aplicación.

### explicación elementos:

- **encabezado (great gaming PC)**:
  - la parte superior de la pantalla muestra el título "great gaming PC", indicando que esta es la publicación seleccionada.
  - **icono de usuario**: a la izquierda del título, hay un icono de perfil que lleva al perfil del usuario actual.
  - **botón de retroceso**: a la derecha del título, hay un icono de flecha que permite al usuario regresar a la pantalla anterior.
- **detalles de la publicación**:
  - **imagen del PC**: justo debajo del encabezado, se muestra una imagen del PC descrito en la publicación.
  - **precio (cost: 100 €)**: muestra el precio del PC publicado.
  - **descripción "bla bla bla bla"**: descripción más detallada que el usuario creador de la publicación proporcionó.
  - **menú desplegable de gestión de la publicación (tres puntos)**: cuando la publicación es del usuario actual, aparecerán tres puntos arriba a la derecha que abrirá un menú desplegable, que le permitirá al usuario editar o borrar la publicación.
- **componentes individuales** (normalmente serán más de uno):
  - **imagen del componente**: se muestra una imagen de un componente específico, en este caso, un procesador.
  - **descripción del componente (amd ryzen 5 5500)**: el nombre del componente.
  - **precio del componente (100€)**: el precio del componente listado.
  - puede pulsar en el componente para ver la información de este más detalladamente.

## create post

esta pantalla es una interfaz de creación de publicaciones para la aplicación (si no ha creado ningún montaje no podrá usar esta pantalla).

### explicación elementos:

- **encabezado (create)**:
  - la parte superior de la pantalla muestra el título "create", indicando que esta sección es para crear una nueva publicación.
  - **icono de usuario**: a la izquierda del título, hay un icono de perfil que lleva al perfil del usuario actual.
  - **menú de navegación**: a la derecha del título, hay un icono de menú que, al hacer clic, se abrirá un menú de navegación con más opciones.
- **campo de texto "title"**: un campo donde los usuarios deben ingresar el título de su publicación.
- **selector de montaje (select item)**: un menú desplegable donde los usuarios pueden seleccionar el montaje que desean publicar.
- **campo de texto "description"**: un área de texto donde los usuarios deben ingresar una descripción detallada de su publicación.
- **selector de imagen (select a picture for the post)**: una opción para que los usuarios seleccionen una imagen para acompañar su publicación (al pulsarlo se le abrirá una ventana para que seleccione una imagen de su dispositivo).
- **botón "create post"**: un botón para enviar la información ingresada y crear una nueva publicación. al hacer clic, la aplicación intentará publicar el contenido con los detalles proporcionados y el usuario será redirigido a pantalla “social”.
- **barra de navegación inferior**:
  - **crear (create)**: un botón para crear una nueva publicación, que es la pantalla actual.
  - **publicaciones (posts)**: un botón para ver la lista de publicaciones.

## edit post

en si esta pantalla es idéntica a la de “create post” pero en lugar de crear la publicación la editaras y el título, descripción,... ya estarán cargadas.

## friends list

esta pantalla es la interfaz de lista de amigos dentro de la aplicación.

### explicación elementos:

- **encabezado (friends)**:
  - la parte superior de la pantalla muestra el título "friends", indicando que esta sección muestra la lista de amigos del usuario.
  - **icono de usuario**: a la izquierda del título, hay un icono de perfil que lleva al perfil del usuario actual.
  - **menú de navegación**: a la derecha del título, hay un icono de menú que, al hacer clic, se abrirá un menú de navegación con más opciones.
- **barra de búsqueda**:
  - **campo de texto**: un campo donde los usuarios pueden buscar un amigo por nombre.
- **lista de amigos**:
  - **amigo (coso)**: un amigo del usuario listado en esta sección. muestra un avatar (o imagen de perfil), que al pulsarlo se abrirá su perfil y el nombre del amigo, que al pulsarlo se abrirá un chat entre ambos usuarios.
- **barra de navegación inferior**:
  - **search users**: un botón para buscar nuevos usuarios para agregar como amigos.
  - **friends list**: un botón para ver la lista de amigos, que es la pantalla actual.
  - **group list**: un botón que lleva a una lista de grupos a los que el usuario pertenece.

## search users

esta pantalla es la interfaz de búsqueda de usuarios dentro de la aplicación.

### explicación elementos:

- **encabezado (search)**:
  - la parte superior de la pantalla muestra el título "search", indicando que esta sección es para buscar usuarios, para hacer amigos.
  - **icono de usuario**: a la izquierda del título, hay un icono de perfil que lleva al perfil del usuario actual.
  - **menú de navegación**: a la derecha del título, hay un icono de menú que, al hacer clic, se abrirá un menú de navegación con más opciones.
- **barra de búsqueda**:
  - **campo de texto**: un campo donde los usuarios pueden buscar a otros usuarios por nombre.
- **resultados de búsqueda**: aquí se muestra una lista de usuarios que coinciden con el nombre proporcionado en la barra de búsqueda.
- **barra de navegación inferior**:
  - **search users**: un botón para buscar nuevos usuarios, que es la pantalla actual.
  - **friends list**: un botón para ver la lista de amigos del usuario.
  - **group list**: un botón que lleva a una lista de grupos a los que el usuario pertenece.

## group list

esta pantalla es la interfaz de lista de grupos dentro de la aplicación.

### explicación elementos:

- **encabezado (groups)**:
  - la parte superior de la pantalla muestra el título "groups", indicando que esta sección muestra la lista de grupos a los que pertenece el usuario.
  - **icono de usuario**: a la izquierda del título, hay un icono de perfil que lleva al perfil del usuario actual.
  - **menú de navegación**: a la derecha del título, hay un icono de menú que, al hacer clic, se abrirá un menú de navegación con más opciones.
- **barra de búsqueda**:
  - **campo de texto**: un campo donde los usuarios pueden buscar un grupo por nombre.
- **lista de grupos**:
  - **cosogroupog!!**: un grupo al que el usuario pertenece. muestra un avatar genérico de grupo (o la imagen que le haya puesto el administrador del grupo) y el nombre del grupo.
- **botón para crear grupo**: un icono de suma (+) en la esquina inferior derecha que permite al usuario crear un nuevo grupo.
- **barra de navegación inferior**:
  - **search users**: un botón para buscar nuevos usuarios para agregar como amigos.
  - **friends list**: un botón para ver la lista de amigos del usuario.
  - **group list**: un botón para ver la lista de grupos, que es la pantalla actual.

## group details

estas pantallas muestran los detalles de un grupo específico dentro de la aplicación.

### explicación elementos:

- **encabezado (cosogroupog!!'s details)**:
  - la parte superior de la pantalla muestra el título "cosogroupog!!'s details", indicando que esta sección muestra los detalles del grupo "cosogroupog!!".
  - **icono de usuario**: a la izquierda del título, hay un icono de perfil que lleva al perfil del usuario actual.
  - **botón de retroceso**: a la derecha del título, hay un icono de flecha que permite al usuario regresar a la pantalla anterior.
- **detalles del grupo**:
  - **imagen del grupo**: justo debajo del encabezado, se muestra una imagen genérica de grupo (o la imagen que le haya puesto el administrador del grupo).
  - **nombre del grupo (cosogroupog!!)**: el nombre del grupo.
  - **número de miembros**: indica que el grupo tiene 4 miembros.
  - **descripción del grupo**: "a group for all the coso enjoyers!!".
- **admin (del grupo, no de la aplicación)**:
  - **coso**: muestra el administrador del grupo con su avatar y nombre.
- **miembros**:
  - **user1**: muestra uno de los miembros del grupo con su avatar genérico y nombre.
  - **owen**: muestra otro miembro del grupo con su imagen de perfil personalizada y nombre.
  - **owen2**: muestra otro miembro del grupo con su imagen de perfil personalizada y nombre.
  - **menú desplegable (tres puntos)**: si el usuario actual es el administrador del grupo, este puede quitar o hacer administrador del grupo a cualquier miembro del grupo (si hace administrador a un miembro, usted dejará de serlo y será un miembro normal).
- **más acciones (solo disponibles para el administrador del grupo)**:
  - **añadir miembro “add member”**: permite al administrador del grupo añadir a algún miembro a este, abrirá una ventana para que pueda elegir a un amigo (si no es su amigo no va a aparecer), esencialmente con funcionalidad parecida a la de la lista de amigos, pero si pulsa en uno, este será añadido al grupo.
  - **editar grupo “edit group”**: permite al administrador del grupo editar el nombre, la descripción y la imagen del grupo.
- **botón "leave group"**: en la parte inferior, hay un botón rojo que permite al usuario salir del grupo.

## profile

esta pantalla es la interfaz de perfil del usuario actual dentro de la aplicación.

### explicación elementos:

- **encabezado (profile)**:
  - la parte superior de la pantalla muestra el título "profile", indicando que esta sección es el perfil del usuario actual.
  - **icono de configuración**: a la izquierda del título, hay un icono de engranaje que lleva a la configuración de la cuenta del usuario.
  - **menú de navegación**: a la derecha del título, hay un icono de menú que, al hacer clic, se abrirá un menú de navegación con más opciones.
- **detalles del usuario**:
  - **avatar de usuario**: justo debajo del encabezado, se muestra una imagen de perfil genérica o la imagen de perfil del usuario si la hubiera configurado (al principio siempre pondrá esa imagen hasta que la cambie.
  - **nombre de usuario (owen2)**: el nombre del usuario actual.
  - **correo electrónico (owendanielhernandezhanrahan@gmail.com)**: la dirección de correo electrónico del usuario.
- **sección de amigos (friends)**:
  - **amigo (coso)**: muestra uno de los amigos del usuario, en este caso "coso".
  - pulsando en su avatar puedes mirar su perfil y si pulsas en su nombre, podrás iniciar un chat con el amigo.
- **botones de navegación adicionales**:
  - **tus montajes “your builds”**: un botón que lleva a una sección donde el usuario puede ver sus configuraciones de PC creadas.
  - **lista de deseados “wishlist”**: un botón que lleva a la lista de deseos del usuario, donde puede guardar componentes o configuraciones que le interesan.
- **botón "logout"**: un botón para cerrar la sesión del usuario actual en la aplicación.

## settings

esta pantalla es la interfaz de configuración para la aplicación.

### explicación elementos:

- **encabezado (settings)**:
  - la parte superior de la pantalla muestra el título "settings", indicando que esta es la sección de configuración de la aplicación.
  - **icono de usuario**: a la izquierda del título, hay un icono de perfil que lleva al perfil del usuario actual.
  - **menú de navegación**: a la derecha del título, hay un icono de menú que, al hacer clic, se abrirá un menú de navegación con más opciones.
- **opción para cambiar el modo (change the mode to light)**:
  - **interruptor de cambio**: un interruptor que permite al usuario cambiar entre el modo oscuro (actual) y el modo claro. actualmente, el interruptor está en la posición de modo oscuro.
- **botón "change password"**: un botón que permite al usuario cambiar su contraseña. al hacer clic, abrirá una ventana donde el usuario puede ingresar una nueva contraseña.
- **botón "change profile picture"**: un botón que permite al usuario cambiar su foto de perfil. al pulsarlo, se le abrirá al usuario su galería de imágenes del móvil para que pueda seleccionar una y se cambiará el avatar de este.
- **botón de ayuda**: un icono de signo de interrogación en la esquina inferior derecha que redirigirá al usuario hacía el chat de ayuda en donde podrá hablar con un administrador por si tiene algún inconveniente.

## support chat

esta pantalla es la interfaz de soporte dentro de la aplicación.

### explicación elementos:

- **encabezado (support)**:
  - la parte superior de la pantalla muestra el título "support", indicando que esta sección es para recibir soporte o ayuda.
  - **botón de retroceso**: a la derecha del título, hay un icono de flecha que permite al usuario regresar a la pantalla anterior.
- **historial de mensajes**:
  - **mensaje enviado por el usuario**: los mensajes enviados por el usuario aparecerán en un cuadro rojo con la fecha encima.
  - **mensaje enviado por un administrador**: los mensajes enviados por un administrador aparecerán en un cuadro gris con la fecha encima.
- **campo de entrada de texto (ask something to an admin)**: un campo donde el usuario puede escribir su mensaje o pregunta para el administrador.
- **botón de envío**: a la derecha del campo de entrada de texto, hay un icono de flecha que permite enviar el mensaje escrito al administrador.

## friend chat

esta pantalla es básicamente igual a la anterior pero el encabezado tiene el avatar del amigo (que al pulsarlo irá al perfil del amigo) y el nombre de este, pero si tienes al usuario bloqueado saldrá así:

por lo que podrás seguir la conversación y desbloquear al usuario en su perfil o pulsando el texto en rojo “unblock them?” (recordar que si el usuario está bloqueado, este no es su amigo y si lo desbloquea tendrá que añadirlo otra vez como amigo)

## group chat

en esta pantalla más de lo mismo, lo diferente es que en lugar de estar el avatar y el nombre del amigo, están los del grupo, antes de la fecha aparece el nombre del usuario del grupo que envió dicho mensaje, siendo “you” el usuario actual y los mensajes de otros miembros del grupo que no sea este estarán en gris.

## components

## components list

esta pantalla muestra la lista de componentes dentro de la aplicación.

### explicación elementos:

- **encabezado (components list)**:
  - la parte superior de la pantalla muestra el título "components list", indicando que esta sección muestra los componentes disponibles.
  - **icono de usuario**: a la izquierda del título, hay un icono de perfil que lleva al perfil del usuario actual.
  - **menú de navegación**: a la derecha del título, hay un icono de menú que, al hacer clic, se abrirá un menú de navegación con más opciones.
- **barra de búsqueda**:
  - **campo de texto**: un campo donde los usuarios pueden buscar componentes por nombre.
- **lista de componentes**:
  - muestra los componentes que resultaron de la búsqueda, al pulsar en cualquiera de ellos, se abrirá una pantalla que mostrará información adicional sobre el componente.

## component screen

esta pantalla muestra un componente en concreto dentro de la aplicación.

### explicación elementos:

- **información del componente**:
  - **nombre del componente**: "geforce 3060 ti".
  - **price**: en una primera instancia sale el precio de la aplicación pero si le damos al texto price salen los precios de amazon y ebay. como se muestra en esta, si no consigue el precio en cualquiera de las webs esta pondrá not available y si lo consigue pondrá el precio.
  - **vendido por**: "techstore". nombre de la tienda o vendedor que ofrece el componente.
  - **creado por**: "owen". nombre de la persona que añadió el componente a la base de datos.
  - **descripción**: "es una grandiosa tarjeta gráfica". una breve descripción que proporciona información adicional sobre el componente.
- **funcionalidades**:
  - **tres puntos en la esquina superior derecha**:
    - **add to wish list (añadir a la lista de deseos)**: permite al usuario añadir el componente a su lista de deseos para futuras referencias o compras.
    - **edit component (editar componente)**: da la opción de modificar la información del componente, como el nombre, precio, descripción, etc. esta funcionalidad es útil para mantener la información actualizada y precisa.
    - **delete component (eliminar componente)**: permite al usuario eliminar el componente de la base de datos o lista, en caso de que ya no sea relevante o necesario.

## create component

esta pantalla muestra la interfaz para crear un nuevo componente dentro de la aplicación.

### explicación elementos:

- **encabezado (create component)**:
  - la parte superior de la pantalla muestra el título "create component", indicando que esta sección permite crear un nuevo componente.
  - **icono de usuario**: a la izquierda del título, hay un icono de perfil que lleva al perfil del usuario actual.
  - **menú de navegación**: a la derecha del título, hay un icono de menú que, al hacer clic, se abrirá un menú de navegación con más opciones.
- **campos para ingresar información**:
  - **nombre (name)**: un campo donde el usuario puede ingresar el nombre del componente.
  - **vendedor (select a seller)**: un menú desplegable donde el usuario puede seleccionar el vendedor del componente.
  - **descripción (description)**: un área de texto donde el usuario puede proporcionar una descripción detallada del componente.
  - **tipo (select a type)**: un menú desplegable donde el usuario puede seleccionar el tipo de componente.
  - **seleccionar una imagen (select a picture for the post)**: un área donde el usuario puede seleccionar una imagen para acompañar el componente.
  - **precio (price)**: un campo donde el usuario puede ingresar el precio del componente (no le ponga ningún símbolo y el precio deberá ser en €).
  - **botón "create component"**: un botón para enviar la información ingresada y crear el nuevo componente. al hacer clic, la aplicación intentará agregar el componente con los detalles proporcionados.
- **barra de navegación inferior**:
  - **create component**: un botón para crear un nuevo componente, que es la pantalla actual.
  - **components list**: un botón para ver la lista de componentes.

## builds

## builder

esta pantalla muestra la interfaz del constructor de PC dentro de la aplicación (si el usuario ya ha seleccionado un montaje previamente, le aparecerá dicho montaje y podrá actualizarlo).

### explicación elementos:

- **encabezado (builder)**:
  - la parte superior de la pantalla muestra el título "builder", indicando que esta sección permite al usuario construir una configuración de PC.
  - **icono de usuario**: a la izquierda del título, hay un icono de perfil que lleva al perfil del usuario actual.
  - **menú de navegación**: a la derecha del título, hay un icono de menú que, al hacer clic, se abrirá un menú de navegación con más opciones.
- **botones de selección**:
  - **components**: un botón que lleva a la selección de componentes para la construcción del PC.
    - **procesador (cpu)**: este botón te abrirá otra ventana para que puedas elegir entre las CPUs de la aplicación.
      - **elegir uno para el montaje (choose one for your computer and press it)**: presione en uno de los componentes mostrados para ponerlo en su configuración.
      - **listado de componentes disponibles**
    - **placa base (motherboard)**: este botón te abrirá otra ventana para que puedas elegir entre las placas base de la aplicación.
      - **elegir uno para el montaje (choose one for your computer and press it)**: presione en uno de los componentes mostrados para ponerlo en su configuración.
      - **listado de componentes disponibles**
    - **memoria RAM (memory ram)**: este botón te abrirá otra ventana para que puedas elegir entre las memorias ram de la aplicación.
      - **elegir uno para el montaje (choose one for your computer and press it)**: presione en uno de los componentes mostrados para ponerlo en su configuración.
      - **listado de componentes disponibles**
    - **memoria secundaria (drive)**: este botón te abrirá otra ventana para que puedas elegir entre las memorias secundarias de la aplicación.
      - **elegir uno para el montaje (choose one for your computer and press it)**: presione en uno de los componentes mostrados para ponerlo en su configuración.
      - **listado de componentes disponibles**
    - **carcasa (case)**: este botón te abrirá otra ventana para que puedas elegir entre las carcasas de la aplicación.
      - **elegir uno para el montaje (choose one for your computer and press it)**: presione en uno de los componentes mostrados para ponerlo en su configuración.
      - **listado de componentes disponibles**
    - **refrigeración (cooling)**: este botón te abrirá otra ventana para que puedas elegir entre las refrigeraciones de la aplicación.
      - **elegir uno para el montaje (choose one for your computer and press it)**: presione en uno de los componentes mostrados para ponerlo en su configuración.
      - **listado de componentes disponibles**
    - **fuente de alimentación (psu)**: este botón te abrirá otra ventana para que puedas elegir entre las fuentes de alimentación de la aplicación.
      - **elegir uno para el montaje (choose one for your computer and press it)**: presione en uno de los componentes mostrados para ponerlo en su configuración.
      - **listado de componentes disponibles**
    - **tarjeta gráfica (gpu)**: este botón te abrirá otra ventana para que puedas elegir entre las tarjetas gráficas de la aplicación.
      - **elegir uno para el montaje (choose one for your computer and press it)**: presione en uno de los componentes mostrados para ponerlo en su configuración.
      - **listado de componentes disponibles**
  - **peripherals**: un botón que lleva a la selección de periféricos para la construcción del PC.
    - **básicamente lo mismo pero, con otros campos**:
      - **televisión/monitor (tv)**
      - **teclado (keyboard)**
      - **ratón (mouse)**
      - **auriculares/cascos (headphones)**
      - **altavoces (speakers)**
      - **microphono (microphone)**
- **campos para ingresar información**:
  - **nombre (name)**: un campo donde el usuario puede ingresar el nombre para la construcción del PC.
  - **notas (notes)**: un área de texto donde el usuario puede agregar notas o comentarios sobre la construcción.
  - **categoría (gaming)**: un menú desplegable donde el usuario puede seleccionar la categoría de la construcción, en este caso "gaming".
- **sección de componentes seleccionados**:
  - un mensaje que dice "selected components (touch any to remove it from build)" indicando que los componentes seleccionados se pueden tocar para eliminarlos de la construcción, si no has seleccionado ninguno está lista estará vacía.
- **barra de acciones inferior**:
  - **price range: 0€**: muestra el rango de precios de los componentes seleccionados. actualmente, está en 0€, en cuanto seleccione o quite componentes, el precio se cambiará.
  - **new build**: un botón para iniciar una nueva construcción (borrará la construcción previa, si esta no fue guardada).
  - **save/update**: un botón para guardar/actualizar la construcción actual.

## your builds

esta pantalla muestra las construcciones de PC guardadas por el usuario dentro de la aplicación.

### explicación elementos:

- **encabezado (your builds)**:
  - la parte superior de la pantalla muestra el título "your builds", indicando que esta sección muestra las configuraciones de PC guardadas por el usuario.
  - **icono de usuario**: a la izquierda del título, hay un icono de perfil que lleva al perfil del usuario actual.
  - **botón de retroceso**: a la derecha del título, hay un icono de flecha que permite al usuario regresar a la pantalla anterior.
- **filtros de categoría** (al igual que en el listado de publicaciones, encontrará más si arrastra el dedo por los filtros en dirección derecha):
  - **all**: un botón para mostrar todas las construcciones guardadas por el usuario.
  - **gaming**: un botón para filtrar y mostrar solo las construcciones de tipo "gaming".
  - **budget**: un botón para filtrar y mostrar solo las construcciones de bajo presupuesto.
  - **work**: un botón para filtrar y mostrar solo las construcciones de componentes básicos y necesarios.
- **lista de construcciones guardadas**:
  - muestra las construcciones de PC que hayas guardado y al presionar en alguno de ellos le llevará al usuario a la pantalla del “builder” para poder editarlo.
