# Lisandro López Nutrición — Style Reference
> Una cinta verde lima sobre un delantal verde bosque. La web de un nutricionista enmarcada en verde profundo, blanco hueso y gris suave, donde una sola píldora, cinta o subrayado verde lima atrae la mirada por vez.

**Tema:** claro
**Idioma:** español (Argentina), voseo. Tono cercano, cálido y profesional.
**Stack:** Next.js (App Router) + Tailwind CSS + shadcn/ui. Los tokens de este archivo se mapean a variables CSS (ver "Tokens para Tailwind / shadcn").

Sistema visual adaptado de la referencia "VOLDOG Food". Se conserva su esencia: canvas blanco y hueso, todo el texto en verde profundo, un único acento fuerte por pantalla, formas de píldora, esquinas muy redondeadas, garabatos dibujados a mano y profundidad casi invisible. Cambian el contenido, el producto y los componentes de negocio: la web presenta a un profesional de la salud y gestiona turnos, no vende productos. La paleta es propia: Verde Lima como color de identidad, sobre Verde Bosque y Blanco Hueso.

## Personalidad

- **Cercano, no clínico.** Nada de blanco hospital, azules médicos ni íconos de estetoscopio. La salud se comunica como algo rico, alegre y alcanzable.
- **Comida real.** La fotografía de alimentos frescos hace el trabajo decorativo, igual que los packs de producto en la referencia.
- **Persona primero.** Lisandro es la cara de la marca: su foto ocupa el lugar protagónico que en la referencia ocupaba el perro.
- **Juguetón con medida.** Los garabatos y la cinta verde lima aportan energía, pero nunca compiten con la información de turnos.

## Colores

### Regla de la paleta: dos tranquilos y uno fuerte (60 / 30 / 10)

| Proporción | Color | Papel |
|---|---|---|
| ~60% | Blanco Hueso `#f6f5ef` + Papel `#ffffff` | El claro tranquilo: fondos, bandas y tarjetas |
| ~30% | Verde Bosque `#1f3d2b` | El oscuro tranquilo: todo el texto, footer y secciones oscuras |
| ~10% | Verde Lima `#a3e635` | El protagonista: el color que identifica a Lisandro |

El Verde Lima es el color de identidad, pero ocupa poca superficie. Es tan intenso que en áreas grandes satura la vista, y con un 10% de la pantalla sigue siendo lo primero que se ve. Si pasa de ese 10%, deja de rematar y empieza a gritar.

Verde Bosque reemplaza al verde pino azulado de la referencia: tira a amarillo, igual que el Verde Lima (el tono del limón verde, apenas más oscuro que un bitter lime), así que los dos se leen como la misma familia. Blanco Hueso reemplaza a la avena beige: junto a un verde tan eléctrico, un blanco muy beige se ve sucio, y el hueso se mantiene cálido sin parecer viejo.

**Regla que no se rompe:** el Verde Lima nunca va como texto sobre Papel o Hueso (1.4–1.5:1, ilegible). Sobre fondos claros va solo como relleno, con texto Verde Bosque encima. Sobre Verde Bosque sí puede ir como texto (7.9:1).

### Tokens de color

| Nombre | Valor | Rol |
|------|-------|------|
| Verde Bosque | `#1f3d2b` | Logo, todos los títulos y textos, labels de botones, íconos, footer y secciones oscuras. Reemplaza al negro en todo el sitio. |
| Verde Lima | `#a3e635` | Botón de reservar, subrayados de palabras clave, tab activo y la cinta con el slogan. Sobre Verde Bosque, también palabras destacadas y pequeños labels. El único color fuerte de la página. |
| Papel | `#ffffff` | Canvas principal, header, tarjetas de testimonios y beneficios, marco del hero. |
| Hueso | `#f6f5ef` | Bandas alternadas (beneficios, testimonios), con bordes curvos amplios. |
| Gris Nube | `#f2f3f4` | Tarjetas de servicios y sucursales, botones secundarios, discos del FAQ. |
| Pimentón | `#c1452e` | Solo precios y aranceles de consulta. También estados de error en formularios (con ícono y texto, nunca solo color). |
| Zanahoria | `#ec7357` | Garabatos: flechas, rulos y chispas junto a los títulos. Nunca texto ni relleno. Junto con el Pimentón, aporta el toque cálido de la paleta. |
| Niebla | `#b3bdb7` | Links, direcciones y texto legal sobre Verde Bosque (blanco al 66%). |
| Línea Salvia | `#e6eae8` | Separadores del FAQ, bordes finos y divisiones de la agenda (Verde Bosque al 11%). |
| Gris Piedra | `#666666` | Texto de testimonios y textos secundarios. Único gris neutro para texto. |
| Fundido Bosque | `linear-gradient(rgba(31,61,43,0) 0%, rgb(31,61,43) 100%)` | Overlay de la foto de cierre que funde la imagen con el footer. |

### Colores de estado (agregados, solo para turnos y panel)

| Nombre | Valor | Rol |
|------|-------|------|
| Disponible | Verde Lima `#a3e635` con texto Verde Bosque | Horarios libres seleccionados |
| Confirmado | `#d9ead3` fondo + Verde Bosque texto | Turno confirmado en el panel |
| Pendiente | `#f6f5ef` fondo + Verde Bosque texto + borde Línea Salvia | Turno a confirmar |
| Cancelado | `#f2f3f4` fondo + Gris Piedra texto tachado | Turno cancelado |
| Error | Pimentón `#c1452e` | Validaciones de formulario |

### Contraste verificado (WCAG)

- Verde Bosque sobre Papel 11.9:1 · sobre Hueso 10.9:1 · sobre Gris Nube 10.7:1 · sobre Verde Lima 7.9:1 → AAA.
- Verde Lima sobre Verde Bosque 7.9:1 → AAA (puede ser texto en secciones oscuras).
- Pimentón sobre Papel 5.1:1 · sobre Hueso 4.6:1 · sobre Gris Nube 4.6:1 → AA para texto normal.
- Gris Piedra sobre Papel 5.7:1 · sobre Hueso 5.3:1 → AA.
- Niebla sobre Verde Bosque 6.2:1 → AA.
- **Verde Lima sobre Papel 1.5:1 y sobre Hueso 1.4:1, Zanahoria sobre Papel 2.9:1 → nunca como texto.**

## Tipografía

### Manrope — única familia
La referencia usa Peridot PE (licencia comercial). Usamos **Manrope** (Google Fonts, gratuita, cargada con `next/font/google`): geométrica, redonda y amable. Si más adelante se compra la licencia de Peridot PE, se reemplaza sin cambiar la escala.

- **Pesos:** 400, 500, 600, 700
- **Sin tracking negativo.** 0px en todo el sitio, salvo +1px en los links del nav (15px/600, mayúsculas).
- **Firma tipográfica:** los títulos de sección van en peso 500 y las palabras clave saltan a 700 dentro de la misma línea. Ej: "Comer bien **no es hacer dieta**".

### Escala

| Rol | Peso | Desktop | Mobile | Line height |
|------|--------|------|------|-------------|
| legal | 500 | 12.8px | 12.8px | 1.86 |
| footer-link | 500 | 14px | 14px | 2 |
| precio | 500 | 15px | 15px | 1.73 |
| nav | 600 | 15px | 15px | 0.93 (+1px tracking) |
| body | 400 | 16px | 16px | 1.6 |
| card-body | 500 | 17px | 16px | 1.6 |
| botón | 500 | 18px | 17px | 1 |
| card-title | 500 | 20px | 19px | 1.3 |
| lead | 500 | 21.6px | 18px | 1.6 |
| título | 500 (+700 en énfasis) | 38.4px | 28px | 1.5–1.7 |

## Espaciado y layout

**Unidad base:** 4px · **Densidad:** espaciosa

- **Ancho máximo:** 1280px de contenido (la referencia llega a 1700px; para un sitio con más texto, 1280px lee mejor).
- **Gutters:** 80px desktop · 24px tablet · 16px mobile.
- **Separación entre secciones:** 108px desktop · 64px mobile.
- **Padding de tarjetas:** 40px desktop · 24px mobile.
- **Gap entre elementos:** 12px.

### Radios

| Elemento | Radio |
|---|---|
| Botones | 9999px |
| Botón del header | 50px |
| Toggles / tabs | 100px |
| Tarjetas | 30px |
| Tarjetas flotantes de beneficio | 29px |
| Inputs y barra de reserva | 25px |
| Marco del hero | 88px desktop · 40px mobile |
| Testimonios | 8px |
| Panel admin (tablas, modales) | 16px |

## Componentes — sitio público

### Nav con logo centrado
Barra Papel con borde inferior gris de 1px al hacer scroll (transparente con texto blanco sobre el hero). A la izquierda, links en mayúsculas 15px/600 con +1px de tracking: SOBRE MÍ · SERVICIOS · SUCURSALES · PREGUNTAS. Al centro, el logotipo de Lisandro en Verde Bosque. A la derecha, el botón Verde Lima "RESERVAR TURNO" (radio 50px, padding 15px 35px). En mobile: logo a la izquierda, botón Verde Lima redondo de menú a la derecha y "Reservar" fijo abajo.

### Hero enmarcado
Sección a todo el ancho con un borde Papel sólido de 35px (16px en mobile) y radio de 88px alrededor de un fondo de color plano Verde Bosque (recomendado: el recorte de Lisandro resalta y el detalle puede ir en Verde Lima) o Hueso. **Lisandro recortado, sin fondo** (de cintura para arriba, sonriente, con ropa de color liso), parado delante de su nombre o del logotipo gigante en blanco. Garabatos dibujados a mano alrededor: blancos o Verde Lima sobre Verde Bosque, Zanahoria sobre Hueso. Abajo a la izquierda, una píldora Papel con flecha: "Reservá tu primera consulta". Abajo a la derecha, el selector de sucursal. Debajo del hero va una línea de presentación, porque el nombre solo no alcanza para explicar qué hace: "Licenciado en Nutrición · MN [número]".

**Disposición vigente (US-6, según `docs/wireframes/ejemplo-presentacion.png`):**
- Nombre en Manrope 800, sin tracking negativo: "LISANDRO" blanco macizo y "LÓPEZ" en contorno Verde Lima (relleno
  transparente). Una línea desde 1024px, dos en pantallas más chicas. Sin píldora de credencial arriba (descartada
  por el dev) y sin matrícula por ahora.
- Foto recortada al centro, apoyada abajo y grande: la cabeza tapa cerca del 45% de abajo de las letras.
- Frase del cliente en dos bloques a los costados de la foto, abajo, en Hueso con las palabras clave en Verde Lima
  700. El ancho de cada bloque es el espacio libre entre el borde y la foto (`--phrase-w` en `hero.tsx`) y el tamaño
  de letra sale de ese ancho, así la frase llena el costado sin tocar la foto. Debajo de 1024px va en columna, debajo
  de la foto.
- Sin garabatos, sin píldora del hero ni selector de sucursal: reservar es el botón flotante.

### Botón flotante de reserva (US-4, rediseñado en US-6)
Píldora Verde Lima fija abajo al centro de la home durante todo el scroll, como en el wireframe: ícono de calendario
(Lucide `CalendarCheck`), "Reservá tu turno" en 600 y un disco Verde Bosque con una flecha `ArrowUpRight` Verde Lima
que gira 45° al pasar el mouse. 64px de alto en mobile y 72px en desktop, con un halo Verde Lima suave hacia abajo y
el área segura de iOS. Lleva a `/reservar`. Es la única píldora Verde Lima de la home. La home deja abajo un espacio
Hueso más alto que el botón para que nunca tape el final. El foco suma un halo blanco y un anillo Verde Bosque.

### Sobre mí (US-6)
Banda Hueso con borde curvo arriba. A la izquierda, la foto en un marco en arco (arriba redondo, abajo radio 30px);
mientras falta, el placeholder `[Completar: foto Sobre mí]` con borde punteado. A la derecha: el `h2` «Sobre **mí**»
con un subrayado Verde Lima dibujado a mano y una flecha Zanahoria a mano que baja hacia la foto (desde 1024px); el
primer párrafo en display (28px/38.4px, 500, con «Licenciado en Nutrición» y «Universidad Favaloro» en 700) y el
resto del texto en dos columnas desde 768px, con menos de 75 caracteres por línea.

### Píldora Verde Lima con flecha (CTA principal)
Relleno Verde Lima, 88px de alto (64px en mobile), radio 9999px, padding 0 37px, label Verde Bosque 18px/500 y un círculo blanco con flecha Verde Bosque en el extremo derecho. Sombra `rgba(0,0,0,0.05) 0 6px 34px`. Sin borde. **Una sola por pantalla.**

### Píldora Papel con flecha
Misma píldora en `rgba(255,255,255,0.97)` con disco Verde Lima con flecha. Para CTAs sobre fotos.

### Píldora Gris Nube
Relleno Gris Nube, misma forma y halo. CTA secundario: "Ver todos los servicios", "Cómo llegar".

### Barra de reserva (reemplaza al "Meal Finder")
Formulario Papel a todo el ancho, radio 25px, con glow `rgba(0,0,0,0.05) 0 0 30px 6px`. Cuatro campos separados por líneas verticales finas, cada uno con una pregunta Verde Bosque 17px/500 y un chevron: **¿Dónde? (sucursal) · ¿Qué consulta? · ¿Qué día? · ¿A qué hora?** Termina en un bloque Verde Lima con "Reservar" y un círculo blanco con flecha. En mobile se apila en vertical y el bloque Verde Lima ocupa todo el ancho.

### Selector de sucursal (reemplaza al toggle perro/gato)
Contenedor Papel con radio 100px y sombra `rgba(0,0,0,0.21) 0 6px 34px`, con un tab por sucursal (60px de alto). El tab activo es una píldora Verde Lima con ícono de pin y nombre en mayúsculas 18px/600. Los inactivos van en verde grisado. Filtra horarios y dirección en todo el sitio. Si hay más de 3 sucursales, pasa a un dropdown con la misma estética.

### Tarjeta de servicio (reemplaza a la tarjeta de producto)
Tarjeta alta Gris Nube con radio 30px, padding 0 40px, sin sombra ni borde. Arriba flota una foto recortada de comida o un objeto representativo (plato, fruta, botella de agua, cinta métrica). Título Verde Bosque 20px/500, descripción corta 17px/500 y, si se muestra, el arancel en Pimentón 15px/500 ("Primera consulta · $XX.XXX") con duración en Gris Piedra ("60 min"). Ejemplos: Primera consulta · Seguimiento · Nutrición deportiva · Plan online.

### Tarjeta de sucursal (nueva)
Tarjeta Gris Nube con radio 30px. Arriba, un mapa estático o embebido con esquinas de 22px. Debajo: nombre del consultorio (20px/500), dirección, días y horarios en una mini-tabla con separadores Línea Salvia, obras sociales aceptadas como chips Papel, y dos píldoras: Verde Lima "Reservar acá" + Gris Nube "Cómo llegar".

### Tarjeta flotante de beneficio
Tarjeta Papel con radio 29px, padding 33px 34px, borde `1px rgba(10,0,0,0.09)` y sombra `rgba(0,0,0,0.01) 0 12px 18px -6px`. Disco Verde Lima de 25px con tilde, título 19px/500 y nota 17px/500. Flotan alrededor de una foto cenital de un plato saludable. Ej: "Plan a tu medida", "Sin dietas extremas", "Seguimiento real", "Recetas simples".

### Cinta Verde Lima con slogan
Una banda Verde Lima gruesa que cruza en curva todo el ancho de una sección Hueso, como una bufanda, con el slogan repetido en blanco bold a lo largo del recorrido, detrás de un título centrado de 38.4px. Slogan: "Lisandro López ✱ [slogan, ej. comer rico también es comer bien]". Se anima con un desplazamiento lento. Respeta `prefers-reduced-motion`.

### Garabatos a mano
Trazos sueltos junto a los títulos o debajo de ellos: subrayado Verde Lima bajo las palabras en 700, y flechas, rulos y chispas de tres líneas en Zanahoria. Solo trazos, nunca rellenos, y sin sombra. Se dibujan al hacer scroll (SVG `stroke-dashoffset`). Son decorativos: llevan `aria-hidden`.

### Tarjeta de testimonio
Tarjeta Papel con radio 8px y padding 25px: avatar redondo (o inicial sobre Hueso), nombre Verde Bosque 18px/700, fecha 13px/400, cinco estrellas y texto Gris Piedra 16px/400. Carrusel con flechas redondas grises. **Solo testimonios reales**, con permiso del paciente. Si todavía no hay, esta sección se omite: nunca inventar reseñas.

### Fila de FAQ (acordeón)
Fila a todo el ancho con la pregunta Verde Bosque 20px/500, una línea de 2px `rgba(31,61,43,0.11)` debajo y un disco Gris Nube de radio 100px con un "+" a la derecha. Va en la columna derecha, junto a un título de 38.4px. Ej: ¿Atendés por obra social? · ¿Qué llevo a la primera consulta? · ¿Hacés consultas online? · ¿Cómo cancelo un turno?

### Bloque CTA con foto en arco
Foto a todo el ancho con el borde superior en arco y Fundido Bosque hacia `#1f3d2b` abajo: Lisandro en consultorio, conversando con un paciente o cocinando. Título Hueso 38.4px/500 a la izquierda con las palabras clave en Verde Lima 700 ("Empecemos por **algo simple**"), píldora Verde Lima a la derecha y una línea `1px rgba(255,255,255,0.39)` que da paso al footer.

### Footer Verde Bosque
Fondo `#1f3d2b` con cuatro columnas: Lisandro y una bio breve · Sucursales (direcciones) · Navegación · Contacto (WhatsApp, email, Instagram). Títulos de columna en blanco 19px/500 y links en Niebla 14px/500. Discos Verde Lima redondos para redes sociales. En el texto legal (12.8px/500), la **matrícula profesional (MN/MP)** y la política de privacidad.

### Disco Verde Lima de carrusel
Círculo Verde Lima de unos 92px (56px en mobile) con flecha Verde Bosque, superpuesto al borde derecho del carrusel. Sin borde ni sombra.

## Componentes — reserva de turnos (nuevo)

La referencia no tiene flujo de reservas. Se diseña con el mismo lenguaje.

- **Pasos:** Sucursal → Tipo de consulta → Día → Horario → Datos → Confirmación. Un indicador de progreso arriba, con píldoras numeradas: la activa en Verde Lima y las completadas en Verde Bosque con tilde.
- **Calendario:** grilla Papel con radio 25px. Los días disponibles van como círculos Verde Bosque 16px/500, el día seleccionado en un disco Verde Lima y los días sin turnos en Línea Salvia.
- **Horarios:** píldoras Gris Nube (radio 9999px, 48px de alto) en grilla. La seleccionada pasa a Verde Lima.
- **Formulario de datos:** inputs con radio 25px, fondo Gris Nube, label Verde Bosque 15px/600 arriba y foco con anillo Verde Bosque de 2px y halo Verde Lima de 4px por fuera. Campos: nombre, email, teléfono (WhatsApp) y obra social (opcional).
- **Confirmación:** una tarjeta Hueso con un garabato Zanahoria festivo, el resumen del turno y los botones "Agregar al calendario" (Gris Nube) y "Volver al inicio" (Papel).
- **Áreas táctiles:** mínimo 44×44px. Todo el flujo se puede usar con teclado.

## Componentes — panel admin (nuevo)

El panel es una herramienta de trabajo diario, así que usa una **versión silenciosa del sistema**: misma tipografía, mismos colores y mismos radios, pero sin garabatos, sin cinta y sin fotos. El Verde Lima se reserva para la acción principal de cada vista.

- **Layout:** sidebar Verde Bosque a la izquierda (íconos y links en Niebla, el activo en blanco con un indicador Verde Lima) y un área de contenido sobre Hueso.
- **Agenda:** vista día/semana con columnas por sucursal, sobre tarjetas Papel con radio 16px. Cada turno es un bloque con el color de su estado.
- **Tabla de turnos:** filas Papel con separadores Línea Salvia, chips de estado como píldoras y acciones (confirmar, reprogramar, cancelar) en un menú de tres puntos.
- **Bloquear disponibilidad:** modal Papel con radio 30px, selector de fechas y la píldora Verde Lima "Bloquear".
- **Mobile:** la sidebar pasa a una barra inferior con 4 íconos y la agenda muestra un día por vez.
- **Tarjeta de login (T-3):** fondo Hueso, tarjeta Papel con radio 30px, título 38.4px/28px "Ingresá al **panel**",
  inputs del formulario de reserva (radio 25px, Gris Nube, label 15px/600, foco Verde Bosque de 2px con halo Verde
  Lima de 4px) y la píldora Verde Lima "Entrar" a todo el ancho. El error va arriba del botón, en Pimentón con ícono.
- **Acceso denegado (T-3):** la ve cualquiera que entre a `/admin/**` sin sesión, así que usa el lenguaje del sitio
  público: banda Hueso, tarjeta Papel, título "Acceso **denegado**" con subrayado Verde Lima, la línea "Esta sección
  es privada." y la píldora Verde Lima "Volver al inicio" con disco de flecha. Ningún link al login.
- **Mi cuenta (US-5):** sobre Hueso, dos tarjetas Papel con radio 16px ("Cambiar el email" y "Cambiar la contraseña"),
  cada una con su título 20px/500, los inputs de la tarjeta de login y su píldora Verde Lima "Guardar …". Es la única
  vista con dos píldoras Verde Lima: cada una cierra su propio formulario. El éxito va en una franja `bg-confirmed`.

## Movimiento (US-3)

Tesis: "el hilo que atraviesa". Un solo momento de autor, la entrada del hero; el resto acompaña el scroll.

- **Scroll con inercia** (Lenis, `src/components/motion/smooth-scroll.tsx`) sólo en la home y sólo sin "reducir
  movimiento". En touch el scroll es el nativo del celular. ScrollTrigger se actualiza con cada scroll de Lenis.
- **Entrada del hero** (`hero-motion.tsx`, ~1.6 s, `expo.out`), cada parte desde su lado (pedido del dev):
  la foto sube desde el fondo y crece (0.9 → 1); las letras del nombre bajan desde arriba de a una (desfase de 0.035
  s); la frase de la izquierda entra de derecha a izquierda y la de la derecha de izquierda a derecha; al final sube
  el botón flotante.
- **Escena del hero al scrollear** (`scrub`): la foto sigue creciendo (hasta 1.08) y baja más lento, el nombre sube
  más rápido y se apaga a 0.25, y el marco se achica a 0.94. La frase no se mueve: el texto no lleva parallax.
- **"Sobre mí"** (`about-motion.tsx`): el título sube palabra por palabra y el párrafo display línea por línea, con
  máscara (SplitText); el marco en arco se revela de abajo hacia arriba con `clip-path`; el subrayado Verde Lima y la
  flecha Zanahoria se dibujan con el scroll (DrawSVG): es "el hilo".
- **Sin parpadeo y sin contenido perdido**: un script mínimo en `<head>` oculta sólo lo marcado con `data-intro`
  mientras la intro no arrancó; la intro lo libera al empezar y, si el JS falla, se libera solo a los 2.5 s.
- **Reducir movimiento / sin JavaScript**: sin Lenis, sin intro y sin escenas; todo se ve quieto, con los trazos
  dibujados.
- Para animar una sección nueva: un componente cliente como `about-motion.tsx` que envuelva la sección, con
  `gsap.matchMedia(MOTION_OK)`. Sólo `transform`, `opacity`, `clip-path` y trazos SVG.

## Elevación

- **Halo de píldora:** `rgba(0,0,0,0.05) 0px 6px 34px 0px`
- **Glow de barra de reserva:** `rgba(0,0,0,0.05) 0px 0px 30px 6px`
- **Elevación de toggle:** `rgba(0,0,0,0.21) 0px 6px 34px 0px`
- **Modal (panel):** `rgba(31,61,43,0.12) 0px 12px 40px 0px`

## Superficies

- **Papel** (`#ffffff`): canvas, header, tarjetas de testimonios y beneficios.
- **Hueso** (`#f6f5ef`): bandas alternadas detrás de bordes curvos y fondo del panel.
- **Gris Nube** (`#f2f3f4`): tarjetas de servicios y sucursales, píldoras secundarias e inputs.
- **Verde Lima** (`#a3e635`): CTA principal, tab activo y cinta.
- **Verde Bosque** (`#1f3d2b`): footer, sidebar del panel y fundido de la foto de cierre.

## Imágenes

Tres tipos de imagen cargan la página:

1. **Retratos de Lisandro:** uno recortado y sin fondo para el hero (PNG/WebP con transparencia, alta resolución), uno en contexto para el bloque de cierre (atendiendo, cocinando, en el consultorio) y uno cercano para "Sobre mí". Luz natural y cálida, expresión amable, ropa de color liso que contraste con el fondo Verde Bosque o Hueso (evitar ropa verde o lima, que se pierde contra la paleta).
2. **Comida fresca:** platos vistos desde arriba sobre Hueso, con ingredientes sueltos alrededor (hojas verdes, legumbres, frutas, semillas). Colores naturales y vivos, nunca la típica foto de dieta con cinta métrica.
3. **Objetos recortados** para las tarjetas de servicio: flotan sobre Gris Nube, igual que los packs de producto en la referencia.

Sobre todo esto van los trazos a mano: garabatos blancos o Verde Lima en el hero, subrayados y cinta Verde Lima, flechas y chispas Zanahoria. Los íconos son de línea fina Verde Bosque (Lucide, que viene con shadcn): pin, calendario, reloj, WhatsApp, usuario, manzana, hoja.

Todas las imágenes llevan `alt` descriptivo y se sirven con `next/image`.

## Estructura de la home

1. Nav
2. Hero enmarcado con Lisandro + línea de presentación
3. Título centrado + barra de reserva
4. Selector de sucursal + grilla de 3 tarjetas de servicio
5. Sobre mí (Hueso, borde curvo): foto + texto, título con énfasis 700 y garabato
6. Beneficios: tarjetas flotantes alrededor de un plato
7. Cinta Verde Lima con slogan + testimonios (Hueso), si hay testimonios reales
8. Sucursales: tarjetas con mapa
9. FAQ en dos columnas
10. CTA con foto en arco
11. Footer Verde Bosque

Las secciones alternan Papel y Hueso con bordes curvos amplios. Los títulos van a la izquierda con el lead a la derecha, o centrados.

## Tokens para Tailwind / shadcn

```css
:root {
  --background: #ffffff;        /* Papel */
  --foreground: #1f3d2b;        /* Verde Bosque */
  --primary: #a3e635;           /* Verde Lima */
  --primary-foreground: #1f3d2b;
  --secondary: #f2f3f4;         /* Gris Nube */
  --secondary-foreground: #1f3d2b;
  --muted: #f6f5ef;             /* Hueso */
  --muted-foreground: #666666;  /* Gris Piedra */
  --accent: #f6f5ef;
  --accent-foreground: #1f3d2b;
  --destructive: #c1452e;       /* Pimentón */
  --border: #e6eae8;            /* Línea Salvia */
  --input: #f2f3f4;
  --ring: #1f3d2b;              /* foco visible: Verde Lima sobre claro no se ve */
  --radius: 30px;
  --price: #c1452e;
  --scribble: #ec7357;          /* Zanahoria */
  --footer-text: #b3bdb7;       /* Niebla */
}
```

Solo tema claro. No se implementa modo oscuro en esta etapa.

### Dónde viven y cómo se usan (T-2)

- La fuente de verdad es `src/app/tokens.css`: además de los de arriba, suma `--confirmed` (`#d9ead3`),
  `--card`/`--popover` (Papel) para shadcn, `--benefit-border`, `--line-on-dark` y `--gradient-forest` (Fundido
  Bosque). `globals.css` sólo lo importa. Si `shadcn add` escribe variables nuevas en `globals.css`, se mueven ahí.
- Colores como clases de Tailwind: `bg-primary`, `text-foreground`, `bg-muted`, `bg-secondary`, `text-price`,
  `stroke-scribble`, `text-footer-text`, `bg-confirmed`, `border-border`, `border-benefit-border`.
- Radios: `rounded-card` (30px), `rounded-benefit` (29px), `rounded-input` (25px), `rounded-hero` (88px) y
  `rounded-hero-mobile` (40px), `rounded-header-button` (50px), `rounded-toggle` (100px), `rounded-testimonial`
  (8px), `rounded-panel` (16px). Las píldoras usan `rounded-full`.
- Sombras: `shadow-halo`, `shadow-glow`, `shadow-toggle`, `shadow-benefit`, `shadow-modal`.
- Fuente: Manrope con `next/font/google` (`--font-manrope`), aplicada como `font-sans`.
- `npm run lint` rechaza cualquier color hex escrito en `src/**/*.{ts,tsx}`, y `src/app/tokens.test.ts` verifica
  el contraste AA de cada par de colores de texto.
- `cn` (de `@/lib/utils`) combina clases. Si se agregan tamaños de texto propios (`text-lead`, `text-title`), hay
  que declararlos en `cn/config`: si no, los confunde con colores.

## Hacer

- Usar Verde Bosque para todos los títulos, textos, labels e íconos. El sitio nunca usa negro.
- Reservar el Verde Lima para la acción principal de cada pantalla, casi siempre "Reservar turno", y mantenerlo cerca del 10% de la superficie.
- Escribir los títulos en 500 y pasar a 700 solo las palabras clave, dentro de la misma línea.
- Hacer las tarjetas de servicio y sucursal en Gris Nube, con radio 30px, sin sombra ni borde.
- Acompañar cada píldora con un disco de flecha en su extremo derecho: blanco sobre Verde Lima, Verde Lima sobre blanco.
- Entrar a las bandas Hueso con bordes curvos y decorar los títulos con subrayados Verde Lima o garabatos Zanahoria.
- Mostrar la matrícula profesional visible en el hero o el footer.
- Diseñar mobile first: la mayoría de los pacientes reserva desde el celular.

## No hacer

- No usar negro ni grises neutros en títulos.
- No usar Verde Lima como texto sobre Papel o Hueso, ni como fondo de áreas grandes.
- No usar el Verde Lima como anillo de foco sobre fondos claros: el foco va en Verde Bosque.
- No hacer controles con esquinas rectas: botones, tabs y toggles son siempre píldoras.
- No poner títulos enteros en bold.
- No usar tracking negativo.
- No usar el Pimentón en botones ni títulos. Va solo en precios y errores.
- No usar estética hospitalaria: azul médico, cruces, estetoscopios ni fotos de stock de "doctor con planilla".
- No mostrar fotos de cuerpos, básculas ni "antes y después". La comunicación es positiva, sin culpa ni promesas de resultados.
- No inventar testimonios ni métricas.
- No llevar garabatos, cinta ni fotos decorativas al panel admin.

## Contenido pendiente (completar antes de construir)

- [ ] Nombre profesional y, si existe, logo o logotipo
- [ ] Matrícula (MN/MP)
- [ ] Foto recortada para el hero + 2 fotos en contexto
- [ ] Slogan para la cinta
- [ ] Servicios: nombre, descripción, duración y arancel (o si no se muestran precios)
- [ ] Sucursales: nombre, dirección, días y horarios de cada una
- [ ] Obras sociales aceptadas
- [ ] Testimonios reales (opcional)
- [ ] Preguntas frecuentes
- [ ] WhatsApp, email e Instagram
