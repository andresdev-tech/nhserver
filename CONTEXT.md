Claro. Te dejo un **prompt maestro** para que puedas usarlo posteriormente con ChatGPT, Copilot, Claude, Cursor o un agente de GitHub y generar el archivo `CONTEXT.md` exactamente con el enfoque que definimos.

Quiero inicializar desde cero el contexto técnico y de desarrollo del proyecto **NHSERVER**.

Repositorio de referencia:
[https://github.com/andresdev-tech/nhserver](https://github.com/andresdev-tech/nhserver)

El repositorio actual está vacío y quiero comenzar una nueva etapa del proyecto. El repositorio anterior fue descartado/puesto en privado y únicamente debe considerarse como referencia histórica, no como base para reutilizar arquitectura o código.

Necesito crear un archivo:

`CONTEXT.md`

Este archivo será el documento base de contexto del proyecto y deberá servir como referencia para cualquier desarrollador o agente de IA que trabaje posteriormente en NHSERVER.

## Objetivo general

NHSERVER será un framework/librería para crear y levantar servidores mediante una API sencilla y extensible.

La primera versión debe ser deliberadamente pequeña.

El objetivo inicial es poder hacer conceptualmente:

```js
const app = new NHServer("rest");
```

El parámetro `"rest"` representa la modalidad de API que utilizará el servidor.

Inicialmente solamente se implementará REST.

Sin embargo, quiero conservar una abstracción que permita que en el futuro puedan existir otras modalidades, por ejemplo:

```js
const app = new NHServer("graphql");
```

No quiero implementar GraphQL todavía.

La existencia del parámetro debe permitir que el proyecto pueda evolucionar posteriormente hacia diferentes tipos de API sin diseñar desde el principio una arquitectura excesivamente compleja.

---

# CONTENIDO QUE DEBE TENER CONTEXT.md

## 1. Propósito del proyecto

Explicar qué es NHSERVER, cuál es su propósito y por qué la primera etapa debe centrarse en un núcleo pequeño y estable.

Dejar claro que el objetivo inicial no es crear un framework gigantesco, sino establecer una base sólida que pueda evolucionar progresivamente.

---

## 2. API inicial

Documentar como API conceptual inicial:

```js
const app = new NHServer("rest");
```

Explicar que:

* `NHServer` es la instancia principal.
* `"rest"` identifica la modalidad REST.
* REST será la única modalidad soportada inicialmente.
* El parámetro existe también como punto de extensión conceptual para futuras modalidades.
* GraphQL y otras modalidades futuras no forman parte de `1.0.0`.

No inventar APIs que todavía no hayan sido implementadas.

---

## 3. Objetivo de la versión 1.0.0

La versión `1.0.0` debe concentrarse en:

* Crear una instancia de `NHServer`.
* Configurar la modalidad `rest`.
* Levantar un servidor HTTP funcional.
* Registrar rutas.
* Asociar métodos HTTP con rutas.
* Ejecutar handlers.
* Permitir iniciar y detener el servidor correctamente.
* Tener pruebas automatizadas básicas.
* Tener documentación mínima para utilizar el servidor.

El objetivo fundamental de `1.0.0` es:

**crear y levantar un servidor REST funcional y permitir crear rutas.**

---

## 4. Fuera del alcance de 1.0.0

Dejar explícitamente fuera de la primera versión:

* GraphQL.
* WebSockets.
* ORM.
* Bases de datos.
* Autenticación completa.
* Autorización completa.
* Middleware avanzado.
* Sistema de plugins.
* CLI avanzada.
* Microservicios.
* Generación automática de documentación.
* Funcionalidades innecesarias para el núcleo inicial.

La regla debe ser:

**no implementar una funcionalidad únicamente porque podría ser útil en el futuro.**

Primero debe existir una necesidad real.

---

## 5. Ejemplo conceptual

Incluir un ejemplo conceptual similar a:

```js
const app = new NHServer("rest");

app.get("/", (req, res) => {
  res.json({
    message: "NHSERVER is running"
  });
});

app.listen(3000);
```

Aclarar que este ejemplo representa la dirección deseada de la API y que las firmas definitivas deben considerarse parte de la implementación, pruebas y documentación de la versión.

No presentar como implementado algo que todavía no existe.

---

# 6. Principios de desarrollo

Definir principios como:

### Núcleo pequeño

No introducir complejidad innecesaria.

### API pública explícita

Solo las funcionalidades deliberadamente diseñadas deben formar parte de la API pública.

### Evolución incremental

Cada versión debe agregar capacidades de forma progresiva.

### Compatibilidad futura

Considerar futuras extensiones sin implementar prematuramente dichas extensiones.

### Separación de responsabilidades

Separar conceptualmente:

* servidor HTTP;
* router;
* request;
* response;
* handlers;
* futuras modalidades de API.

### Estabilidad antes que funcionalidades

Una versión pequeña y estable es preferible a una versión grande e inestable.

---

# 7. Versionado

NHSERVER utilizará Semantic Versioning:

```text
MAJOR.MINOR.PATCH
```

Explicar:

* `MAJOR`: cambios incompatibles.
* `MINOR`: funcionalidades nuevas compatibles.
* `PATCH`: correcciones compatibles.

Ejemplos:

```text
1.0.0
1.1.0
1.1.1
1.2.0
2.0.0
```

---

# 8. Roadmap inicial

Crear una planificación inicial:

## 1.0.0 — Core HTTP + Routing

Objetivos:

* instancia de `NHServer`;
* modalidad REST;
* servidor HTTP;
* routing;
* métodos HTTP fundamentales;
* handlers;
* pruebas;
* documentación inicial.

## 1.1.x — Evolución del servidor y routing

Posibles funcionalidades:

* parámetros dinámicos;
* query parameters;
* mejoras de request/response;
* manejo estructurado de errores;
* middleware básico, si realmente es necesario.

No fijar funcionalidades futuras como definitivas.

## 1.2.x en adelante

Dejar la planificación abierta y establecer que las siguientes versiones se definirán después de estabilizar las anteriores.

GraphQL puede considerarse posteriormente como una modalidad adicional de API.

---

# 9. Estrategia de ramas Git

El proyecto tendrá inicialmente:

```text
main
develop
```

### main

Representa el estado estable y publicable del proyecto.

Debe contener:

* código estable;
* releases;
* versiones publicadas.

No debe utilizarse como rama principal de trabajo diario.

### develop

Representa la integración del desarrollo actual.

Debe utilizarse para integrar las funcionalidades que formarán parte de la siguiente versión.

Flujo:

```text
feature/*
      │
      ▼
   develop
      │
      ▼
    main
```

---

# 10. Convenciones de ramas

Definir:

```text
feature/<nombre>
fix/<nombre>
refactor/<nombre>
docs/<nombre>
test/<nombre>
```

Ejemplos:

```text
feature/http-server
feature/router
feature/dynamic-routes
fix/router-params
refactor/http-core
docs/getting-started
test/router
```

---

# 11. Definition of Done para 1.0.0

Establecer que `1.0.0` estará lista cuando:

* el paquete pueda instalarse;
* `NHServer` pueda instanciarse;
* `"rest"` funcione;
* el servidor pueda iniciar;
* el servidor pueda detenerse;
* puedan registrarse rutas;
* las rutas respondan correctamente;
* los métodos HTTP principales funcionen;
* existan pruebas automatizadas;
* exista documentación básica;
* la API pública esté suficientemente definida;
* no haya funcionalidades experimentales expuestas accidentalmente.

---

# 12. Dirección arquitectónica

Incluir una representación conceptual similar a:

```text
NHServer
   │
   ├── API Mode
   │      ├── REST
   │      └── futuras modalidades
   │
   ├── HTTP Server
   │
   ├── Router
   │
   └── Request / Response
```

Aclarar que esto es una dirección conceptual y no una obligación de crear inmediatamente todas esas capas.

La arquitectura debe permanecer simple mientras el proyecto sea pequeño.

---
# 13. Estructura base obligatoria de la versión 1.0.0

La versión `1.0.0` debe construirse alrededor de una estructura mínima, clara y modular.

El proyecto utilizará **TypeScript** como lenguaje principal, con tipado estricto y una estructura orientada a mantener separación de responsabilidades, validación de datos y facilidad de evolución.

La estructura inicial propuesta es:

```text
nhserver/
│
├── src/
│   ├── core/
│   │   └── nh_server.ts
│   │
│   ├── http/
│   │   ├── server.ts
│   │   ├── request.ts
│   │   └── response.ts
│   │
│   ├── router/
│   │   ├── router.ts
│   │   └── route.ts
│   │
│   ├── adapters/
│   │   └── rest.ts
│   │
│   └── app.ts
│
├── test/
│   ├── core/
│   ├── http/
│   └── router/
│
├── examples/
│   └── basic_server.ts
│
├── CONTEXT.md
├── README.md
├── package.json
├── tsconfig.json
├── .gitignore
└── LICENSE
```

## 13.1. Convención de nombres

Todo el código fuente del proyecto deberá respetar las siguientes convenciones:

* Archivos en **minúsculas**.
* Extensión `.ts`.
* Separación de palabras mediante **guion bajo (`_`)**.
* No utilizar `index.ts` como punto de entrada.
* No utilizar nombres con PascalCase o camelCase para archivos.
* Los nombres de carpetas también deberán mantenerse en minúsculas.

Ejemplos válidos:

```text
nh_server.ts
basic_server.ts
http_server.ts
request.ts
response.ts
router.ts
route.ts
rest.ts
app.ts
```

Ejemplos que no deben utilizarse:

```text
NHServer.ts
NH_Server.ts
nh-server.ts
httpServer.ts
index.ts
```

La convención anterior aplica al código fuente, pruebas y ejemplos, salvo que una herramienta del ecosistema requiera específicamente otro nombre.

---

# 14. Punto de entrada de la aplicación

El proyecto **no utilizará `src/index.ts` como punto de entrada**.

El archivo principal será:

```text
src/app.ts
```

`app.ts` tendrá la responsabilidad de actuar como punto de composición/inicialización de la aplicación y conectar los componentes principales del framework.

Conceptualmente:

```text
src/
│
├── core/
│   └── nh_server.ts
│
├── http/
│   ├── server.ts
│   ├── request.ts
│   └── response.ts
│
├── router/
│   ├── router.ts
│   └── route.ts
│
├── adapters/
│   └── rest.ts
│
└── app.ts
```

`app.ts` no debe convertirse en un contenedor de toda la lógica del framework.

Su responsabilidad será principalmente realizar la composición necesaria para inicializar NHSERVER.

---

# 15. Responsabilidad de `core`

La carpeta:

```text
src/core/
```

contendrá el núcleo principal del framework.

Inicialmente:

```text
src/core/nh_server.ts
```

El archivo deberá contener la clase principal:

```ts
NHServer
```

Conceptualmente:

```ts
const app = new NHServer("rest");
```

La clase será responsable de representar la instancia principal del servidor y coordinar las capacidades principales de NHSERVER.

No deberá contener directamente toda la implementación HTTP ni toda la lógica del router.

---

# 16. Responsabilidad de `http`

La carpeta:

```text
src/http/
```

contendrá los componentes relacionados directamente con HTTP.

Estructura inicial:

```text
src/http/
├── server.ts
├── request.ts
└── response.ts
```

### `server.ts`

Responsable de:

* crear el servidor HTTP;
* iniciar el servidor;
* detener el servidor;
* recibir las solicitudes;
* conectar la infraestructura HTTP con el router.

### `request.ts`

Responsable de representar o adaptar la información recibida en una solicitud HTTP.

Debe aprovechar el tipado de TypeScript para definir claramente los datos disponibles.

### `response.ts`

Responsable de representar o adaptar la respuesta HTTP.

Debe proporcionar una interfaz controlada y tipada para enviar respuestas al cliente.

La implementación debe mantenerse sencilla durante `1.0.0`.

---

# 17. Responsabilidad de `router`

La carpeta:

```text
src/router/
```

contendrá el sistema de routing.

Estructura:

```text
src/router/
├── router.ts
└── route.ts
```

### `router.ts`

Será responsable de:

* registrar rutas;
* asociar rutas con métodos HTTP;
* buscar coincidencias;
* obtener el handler correspondiente;
* ejecutar el flujo de routing.

### `route.ts`

Representará la definición de una ruta.

Conceptualmente una ruta estará determinada por:

```text
HTTP Method + Path + Handler
```

Ejemplo:

```ts
app.get("/", handler);
```

El diseño debe permitir evolucionar posteriormente hacia parámetros dinámicos y otras capacidades sin introducirlas obligatoriamente en `1.0.0`.

---

# 18. Responsabilidad de `adapters`

La carpeta:

```text
src/adapters/
```

contendrá las implementaciones correspondientes a las modalidades de API soportadas.

Para `1.0.0` solamente existirá:

```text
src/adapters/rest.ts
```

Este archivo representará la modalidad REST.

La intención es que posteriormente puedan existir otras modalidades:

```text
src/adapters/
├── rest.ts
├── graphql.ts
└── otras_modalidades.ts
```

Sin embargo, estas implementaciones futuras no deben crearse hasta que formen parte del alcance de una versión concreta.

---

# 19. Flujo principal de NHSERVER

El flujo conceptual de la primera versión será:

```text
new NHServer("rest")
          │
          ▼
       app.ts
          │
          ▼
    REST Adapter
          │
          ▼
     HTTP Server
          │
          ▼
        Router
          │
          ▼
     Route Match
          │
          ▼
       Handler
          │
          ▼
      Response
```

Este flujo representa el núcleo funcional que debe existir antes de comenzar a desarrollar funcionalidades secundarias.

---

# 20. Orden de implementación de la 1.0.0

El desarrollo deberá realizarse progresivamente.

## Fase 1 — Core

Implementar:

```text
src/core/nh_server.ts
```

Objetivo:

```ts
const app = new NHServer("rest");
```

Debe existir validación de la modalidad recibida.

---

## Fase 2 — HTTP

Implementar:

```text
src/http/server.ts
src/http/request.ts
src/http/response.ts
```

Objetivo:

```ts
app.listen(3000);
```

El servidor deberá poder iniciar y detenerse correctamente.

---

## Fase 3 — Router

Implementar:

```text
src/router/router.ts
src/router/route.ts
```

Objetivo conceptual:

```ts
app.get("/", handler);

app.post("/users", handler);
```

El router deberá resolver las rutas mediante:

```text
HTTP Method + URL
```

---

## Fase 4 — REST

Implementar:

```text
src/adapters/rest.ts
```

El adaptador REST deberá conectar la modalidad REST con:

```text
HTTP Server
      +
Router
```

---

## Fase 5 — Application Composition

Implementar:

```text
src/app.ts
```

Este archivo deberá encargarse de componer los componentes necesarios para que NHSERVER pueda funcionar como una unidad.

No deberá concentrar responsabilidades que pertenecen al core, HTTP, router o adapters.

---

## Fase 6 — Tests

Crear pruebas para los componentes principales:

```text
test/
├── core/
├── http/
└── router/
```

Las pruebas deben validar principalmente comportamiento observable y contratos públicos.

Como mínimo se deberá comprobar:

* creación de `NHServer`;
* validación de modalidad;
* inicio del servidor;
* registro de rutas;
* resolución de rutas;
* ejecución de handlers;
* respuesta HTTP.

---

## Fase 7 — Ejemplo funcional

Crear:

```text
examples/basic_server.ts
```

El ejemplo debe demostrar el uso básico de NHSERVER.

Conceptualmente:

```ts
const app = new NHServer("rest");

app.get("/", (req, res) => {
  res.json({
    message: "NHSERVER is running"
  });
});

app.listen(3000);
```

El ejemplo deberá mantenerse actualizado con respecto a la API pública real.

---

# 21. TypeScript y tipado estricto

NHSERVER utilizará TypeScript como lenguaje principal.

La configuración deberá favorecer:

* tipado estricto;
* interfaces explícitas;
* tipos de retorno definidos cuando sea apropiado;
* reducción del uso de `any`;
* validación de datos;
* contratos claros entre módulos.

La configuración de TypeScript deberá utilizar `strict: true` salvo que exista una razón técnica documentada para modificar alguna regla específica.

El tipado debe utilizarse para mejorar la seguridad y mantenibilidad del framework, no para introducir complejidad innecesaria.

---

# 22. Regla de arquitectura inicial

Durante `1.0.0`, cualquier nueva carpeta, archivo, dependencia o abstracción deberá estar justificada por una necesidad concreta del alcance de la versión.

No se debe crear arquitectura adicional solamente para anticipar funcionalidades futuras.

La estructura debe poder ser comprendida rápidamente por un desarrollador que clone el repositorio.

La prioridad será:

```text
Claridad
   ↓
Separación de responsabilidades
   ↓
Tipado
   ↓
Testabilidad
   ↓
Extensibilidad
```

---

# 23. Núcleo mínimo antes de avanzar

No se deberá comenzar el desarrollo de funcionalidades correspondientes a versiones posteriores hasta que exista un núcleo funcional equivalente a:

```text
NHServer
   │
   ├── REST
   │
   ├── HTTP Server
   │
   ├── Router
   │
   ├── Request
   │
   ├── Response
   │
   └── Tests
```

El objetivo mínimo de `1.0.0` será conseguir el siguiente flujo:

```text
new NHServer("rest")
          │
          ▼
     HTTP Server
          │
          ▼
        Router
          │
          ▼
      Route Match
          │
          ▼
        Handler
          │
          ▼
       Response
```

Este flujo constituye el núcleo funcional inicial de NHSERVER.

Las funcionalidades posteriores deberán construirse sobre este núcleo y no deberán reemplazarlo prematuramente.
