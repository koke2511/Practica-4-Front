````markdown
# Documentación del proyecto

## Pasos para la instalación y ejecución del proyecto

Para ejecutar este proyecto, se deberán seguir los siguientes pasos:

1. Clonar el repositorio y acceder a la carpeta del proyecto:

```bash
git clone <url del repositorio>
cd nombre-del-proyecto
````

2. Instalar las dependencias:

```bash
npm install
```

3. Ejecutar el servidor de desarrollo:

```bash
npm run dev
```

4. Acceder al proyecto desde el navegador:

```bash
http://localhost:3000
```

---

## Descripción del proyecto

Este proyecto consiste en una aplicación web desarrollada con **Next.js**, **React**, **TypeScript** y **Axios**.

La aplicación simula una red social llamada **NebrijaSocial**, donde los usuarios pueden iniciar sesión, registrarse, ver publicaciones, crear nuevos posts, consultar perfiles, dar like, retuitear y comentar publicaciones.

El proyecto consume una API REST externa y adapta los datos recibidos para poder trabajar con una estructura más cómoda dentro de la aplicación.

---

## Estructura general del proyecto

El proyecto se ha organizado separando páginas, componentes reutilizables, funciones de API, autenticación y tipos TypeScript.

La estructura principal es la siguiente:

```bash
src/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/
│   ├── register/
│   ├── post/
│   │   └── [id]/
│   └── profile/
│       └── [username]/
│
├── components/
│   ├── Header.tsx
│   └── PostCard.tsx
│
├── lib/
│   ├── apis.ts
│   └── auth.ts
│
├── types/
│   ├── index.ts
│   ├── post.ts
│   └── user.ts
│
└── proxy.ts
```

---

## Consumo de la API

Para realizar las peticiones HTTP se ha utilizado **Axios**.

La configuración principal de Axios se encuentra en el archivo:

```bash
src/lib/apis.ts
```

En este archivo se crea una conexión base con la API, indicando la URL principal y algunas opciones generales:

```ts
export const api = axios.create({
  baseURL: "https://backend-p4-klvc.onrender.com/api",
  timeout: 8000,
  headers: {
    "x-nombre": "Jorge Ferrero",
  },
});
```

Todas las peticiones incluyen la cabecera obligatoria:

```ts
"x-nombre": "Jorge Ferrero"
```

Esta cabecera es necesaria para que la API pueda identificar correctamente al alumno.

---

## Autenticación mediante token

La autenticación se gestiona mediante un token almacenado en las cookies del navegador.

En el archivo `auth.ts` se han creado funciones auxiliares para guardar, obtener y eliminar el token:

```ts
setToken(token);
getToken();
removeToken();
```

Cuando el usuario inicia sesión correctamente, el token se guarda en una cookie.

Después, en cada petición protegida, Axios recupera ese token y lo añade automáticamente en la cabecera:

```ts
Authorization: Bearer <token>
```

Esto permite acceder a los endpoints privados de la API sin tener que añadir manualmente el token en cada petición.

---

## Configuración automática de las peticiones

Para no tener que repetir las mismas cabeceras en cada petición, se ha configurado Axios para que añada automáticamente los datos necesarios antes de enviar cualquier solicitud a la API.

Esta configuración se encarga de:

* Obtener el token guardado en las cookies.
* Añadir la cabecera de autorización si el usuario ha iniciado sesión.
* Añadir siempre la cabecera obligatoria `x-nombre`.

```ts
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers["x-nombre"] = "Jorge Ferrero";

  return config;
});
```

Gracias a esta configuración, no es necesario escribir manualmente el token ni el nombre del alumno en cada petición. La aplicación lo hace automáticamente cada vez que se comunica con la API.

---

## Protección de rutas mediante proxy

El proyecto utiliza un archivo `proxy.ts` para proteger las rutas privadas.

Este archivo comprueba si existe un token en las cookies del usuario.

Si el usuario intenta acceder a una ruta protegida sin estar autenticado, se le redirige automáticamente a la página de login.

```ts
if (!token) {
  return NextResponse.redirect(new URL("/login", request.url));
}
```

Las rutas protegidas son:

```ts
"/"
"/post/:path*"
"/profile/:path*"
```

De esta forma, solo los usuarios autenticados pueden acceder al feed principal, a los detalles de publicaciones y a los perfiles.

---

## Normalización de datos

La API devuelve algunos datos con nombres diferentes a los que se utilizan dentro del proyecto.

Por ejemplo, la API puede devolver campos como:

```ts
_id
contenido
autor
comentarios
fecha
```

Para trabajar de forma más cómoda en React, estos datos se transforman a una estructura propia mediante funciones de normalización.

Por ejemplo, una publicación se transforma en un objeto con esta estructura:

```ts
{
  id,
  content,
  author,
  createdAt,
  likes,
  retweets,
  comments
}
```

Esto se realiza mediante funciones como:

```ts
normalizeUser()
normalizeComment()
normalizePost()
```

Gracias a esta normalización, los componentes no dependen directamente de la estructura exacta que devuelve la API.

---

## Tipado con TypeScript

El proyecto utiliza TypeScript para definir la estructura de los datos principales.

Los tipos se encuentran dentro de la carpeta:

```bash
src/types/
```

Se han definido tipos para usuarios, publicaciones y comentarios.

Por ejemplo, el tipo `Post` incluye:

```ts
export type Post = {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  likes: number;
  retweets: number;
  comments: Comment[];
  liked?: boolean;
  retweeted?: boolean;
};
```

Esto permite trabajar con mayor seguridad dentro de los componentes y evita errores al acceder a propiedades inexistentes.

---

## Componentes principales

El proyecto se ha dividido en varios componentes reutilizables.

### Header

El componente `Header` representa la barra superior de navegación.

Incluye:

* Logo de la aplicación.
* Enlace a la página principal.
* Enlace al perfil del usuario.
* Botón para cerrar sesión.

El cierre de sesión elimina el token de las cookies y redirige al usuario a la página de login.

```ts
removeToken();
router.push("/login");
```

---

### PostCard

El componente `PostCard` muestra una publicación en formato tarjeta.

Este componente permite:

* Mostrar el autor de la publicación.
* Mostrar el contenido del post.
* Mostrar número de likes, retweets y comentarios.
* Dar like a una publicación.
* Retuitear una publicación.
* Acceder al detalle del post al hacer clic sobre la tarjeta.

Para evitar que al pulsar en like o retweet se active también la navegación al detalle, se utiliza:

```ts
e.stopPropagation();
```

---

## Funcionamiento de la aplicación

### Página principal

La página principal muestra el feed de publicaciones.

Desde esta vista el usuario puede:

* Consultar las publicaciones existentes.
* Crear nuevas publicaciones.
* Dar like.
* Retuitear.
* Acceder al detalle de una publicación.
* Navegar entre páginas mediante paginación.

Las publicaciones se obtienen desde la API usando la función:

```ts
getPosts(page)
```

---

### Vista de detalle de publicación

La vista de detalle permite consultar una publicación concreta.

Desde esta página se puede:

* Ver el contenido completo de la publicación.
* Consultar los comentarios asociados.
* Añadir nuevos comentarios.
* Dar like.
* Retuitear.

La publicación se obtiene utilizando su identificador dinámico:

```bash
/post/[id]
```

Para recuperar el identificador de la URL se utiliza el hook:

```ts
useParams()
```

---

### Vista de perfil

La vista de perfil permite consultar la información de un usuario.

Esta página muestra:

* Nombre de usuario.
* Biografía.
* Número de seguidores.
* Número de seguidos.
* Publicaciones realizadas por ese usuario.

La ruta dinámica utilizada es:

```bash
/profile/[username]
```

Si el parámetro de la ruta es `me`, se carga el perfil del usuario autenticado.

```ts
username === "me" ? getMyProfile() : getProfile(String(username))
```

---

### Sistema de seguir y dejar de seguir

En la vista de perfil se ha implementado la funcionalidad para seguir o dejar de seguir a otros usuarios.

Si el usuario ya está siguiendo ese perfil, se ejecuta:

```ts
unfollowUser(profile.id)
```

Si todavía no lo sigue, se ejecuta:

```ts
followUser(profile.id)
```

Después de realizar la acción, el estado del perfil se actualiza para reflejar el cambio directamente en pantalla.

---

### Sistema de likes y retweets

Cada publicación permite realizar acciones de interacción.

El componente `PostCard` mantiene una copia local de la publicación mediante `useState`.

Cuando el usuario pulsa el botón de like, se llama a:

```ts
likePost(currentPost.id)
```

Cuando pulsa el botón de retweet, se llama a:

```ts
retweetPost(currentPost.id)
```

Después, el componente actualiza su estado local con la publicación modificada devuelta por la API.

Esto permite que el número de likes o retweets se actualice sin necesidad de recargar toda la página.

---

## Uso de rutas dinámicas

El proyecto utiliza rutas dinámicas de Next.js para acceder a recursos concretos.

Las rutas principales son:

```bash
/post/[id]
/profile/[username]
```

Gracias a estas rutas, la aplicación puede mostrar información específica dependiendo del identificador recibido en la URL.

Por ejemplo:

```bash
/post/123
/profile/koke
```

En los componentes se utiliza `useParams` para obtener esos valores dinámicos.

---

## Navegación con useRouter

Para realizar redirecciones desde componentes cliente se ha utilizado el hook:

```ts
useRouter()
```

Este hook se usa, por ejemplo, para:

* Redirigir al usuario al login al cerrar sesión.
* Volver a la página principal.
* Navegar al detalle de una publicación.
* Acceder al perfil de un usuario.

Ejemplo:

```ts
router.push(`/post/${currentPost.id}`)
```

---

## Estilos de la aplicación

Los estilos globales se encuentran en:

```bash
src/app/globals.css
```

En este archivo se definen los estilos principales de la aplicación, incluyendo:

* Barra de navegación.
* Tarjetas de publicaciones.
* Formularios de autenticación.
* Botones.
* Vista de perfil.
* Comentarios.
* Paginación.
* Contenedores generales.

También existe un archivo `page.module.css`, aunque la mayor parte del diseño principal se gestiona desde `globals.css`.

---

## Separación de responsabilidades

El proyecto se ha organizado intentando separar correctamente las responsabilidades:

* Los componentes se encargan de la interfaz.
* `apis.ts` se encarga de las peticiones HTTP.
* `auth.ts` gestiona el token de autenticación.
* `types/` define las estructuras de datos.
* `proxy.ts` protege las rutas privadas.
* Las páginas gestionan la carga de datos y la lógica principal de cada vista.

Esta separación permite que el código sea más claro, mantenible y fácil de ampliar.

---

## Funciones principales de la API

En el archivo `apis.ts` se han creado funciones específicas para cada acción de la aplicación:

```ts
login()
register()
getPosts()
createPost()
getPostById()
likePost()
retweetPost()
createComment()
getComments()
getProfile()
getMyProfile()
followUser()
unfollowUser()
getUserPosts()
```

Gracias a esto, los componentes no llaman directamente a Axios, sino que utilizan funciones ya preparadas.

Esto mejora la organización y evita repetir código.

---

## Gestión de errores y carga

En las páginas se utilizan estados para controlar la carga de datos y los posibles errores.

Por ejemplo:

```ts
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string>("");
```

Mientras los datos se están cargando, se muestra un mensaje de carga.

Si ocurre un error durante una petición, se guarda el mensaje y se muestra en pantalla.

---

## Conclusión

He desarrollado este proyecto utilizando una arquitectura basada en componentes reutilizables, rutas dinámicas y consumo de una API REST externa.

Durante el desarrollo he aplicado conceptos como:

* Next.js con App Router.
* React con componentes cliente.
* TypeScript.
* Axios para consumo de API.
* Configuración automática de cabeceras en Axios.
* Autenticación mediante token.
* Cookies para guardar sesión.
* Protección de rutas mediante proxy.
* Rutas dinámicas.
* Normalización de datos de la API.
* Tipado de usuarios, publicaciones y comentarios.
* Gestión de estado con `useState`.
* Carga de datos con `useEffect`.
* Navegación mediante `useRouter`.
* Separación de responsabilidades.
* Estilos globales con CSS.

En conjunto, el proyecto funciona como una red social básica donde el usuario puede autenticarse, consultar publicaciones, interactuar con ellas, comentar, retuitear y visitar perfiles de otros usuarios.
