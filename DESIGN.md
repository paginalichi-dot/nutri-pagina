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
| Hueso Panel | `#ece9df` | Fondo de todo `/admin` (token `--panel`, `bg-panel`): un hueso más marcado para que las tarjetas Papel se separen también en monitores grandes y brillantes, donde Hueso casi no se distingue del blanco (pedido del dev, 2026-11-08). |
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
| Controles del panel (botones, toggles, flechas) | 12px |

## Componentes — sitio público

### Nav con logo centrado
Barra Papel con borde inferior gris de 1px al hacer scroll (transparente con texto blanco sobre el hero). A la izquierda, links en mayúsculas 15px/600 con +1px de tracking: SOBRE MÍ · SERVICIOS · SUCURSALES · PREGUNTAS. Al centro, el logotipo de Lisandro en Verde Bosque. A la derecha, el botón Verde Lima "RESERVAR TURNO" (radio 50px, padding 15px 35px). En mobile: logo a la izquierda, botón Verde Lima redondo de menú a la derecha y "Reservar" fijo abajo.

### Hero enmarcado
Sección a todo el ancho con un borde Papel sólido de 35px (16px en mobile) y radio de 88px alrededor de un fondo de color plano Verde Bosque (recomendado: el recorte de Lisandro resalta y el detalle puede ir en Verde Lima) o Hueso. **Lisandro recortado, sin fondo** (de cintura para arriba, sonriente, con ropa de color liso), parado delante de su nombre o del logotipo gigante en blanco. Garabatos dibujados a mano alrededor: blancos o Verde Lima sobre Verde Bosque, Zanahoria sobre Hueso. Abajo a la izquierda, una píldora Papel con flecha: "Reservá tu primera consulta". Abajo a la derecha, el selector de sucursal. Debajo del hero va una línea de presentación, porque el nombre solo no alcanza para explicar qué hace: "Licenciado en Nutrición · MN [número]".

**Disposición vigente (US-6, según `docs/wireframes/ejemplo-presentacion.png`):**
- Nombre en Manrope 800, sin tracking negativo: "LISANDRO" blanco macizo y "LÓPEZ" en contorno Verde Lima (relleno
  transparente). Una línea desde 1024px, dos en pantallas más chicas. Sin píldora de credencial arriba (descartada
  por el dev) y sin matrícula por ahora.
- Foto recortada al centro, apoyada abajo y grande: la cabeza tapa cerca del 45% de abajo de las letras. En mobile
  la foto sube `8vw` sobre el nombre: asoma la parte de arriba de la «P» y la persona sigue por encima (pedido del
  dev, 2026-11-07).
- Frase del cliente en dos bloques a los costados de la foto, abajo, en Hueso con las palabras clave en Verde Lima
  700. El ancho de cada bloque es el espacio libre entre el borde y la foto (`--phrase-w` en `hero.tsx`) y el tamaño
  de letra sale de ese ancho (`--phrase-w / 9.2`): la frase ocupa el costado con aire, grande pero sin competir con el
  nombre (pedido del dev, 2026-11-07). Debajo de 1024px va en columna, debajo de la foto, a
  `clamp(1.25rem, 5.2vw, 1.875rem)`.
- Sin píldora del hero ni selector de sucursal: reservar es el botón flotante.
- Líneas a mano (US-36, `hero-strokes.tsx`, según `docs/wireframes/hero-animado.png`): trazos finos Verde Lima
  (2.5px, sin relleno, `aria-hidden`). Desde 1024px, tres curvas alrededor de Lisandro (hombro izquierdo, cuello a la
  derecha y largo del brazo derecho); bajo la frase de apertura, un subrayado corto (el corchete de su derecha se
  sacó a pedido del dev, 2026-11-08); junto a la de cierre, un corchete recto, de líneas verticales y horizontales, a
  su izquierda que baja y se vuelve subrayado. En mobile, las tres curvas del cuerpo (más chicas, con la foto) y un subrayado corto bajo cada frase. Tras la entrada del
  hero se revelan con una máscara de izquierda a derecha (`clip-path`: DrawSVG no puede medir trazos con
  `non-scaling-stroke` en un SVG estirado); sin intro, quedan dibujadas.
- En notebooks bajas (p. ej. 1280×600) el marco baja hasta 520px y el nombre se limita también por alto
  (`min(8.4vw, 8.5rem, 15svh)`); el ancho de la frase se mide sobre el marco (`cqw`), no sobre la ventana, para que
  la barra de scroll no la empuje afuera. «Sobre mí» limita su arco y su padding al alto de la pantalla y, con la variante `short` (desktop de
  hasta 760px de alto), achica títulos y texto para entrar entera; si igual no entra, no hace la pausa. El `body`
  lleva `overflow-x: clip` como red contra cualquier desborde horizontal.

### Intro de marca (US-7)
Cada vez que se llega a la home (al entrar, al recargar y al volver navegando desde otra página; US-40) aparece una
presentación breve, de unos 3.5 s:

1. Pantalla Papel con una caja Verde Bosque al centro (`min(80vw, 440px)` × 120px, radio 25px). Adentro sube desde una
   máscara «Lic. Lisandro López»: «Lic.» en Niebla 500 y el nombre en Hueso 600.
2. El nombre se mantiene al menos hasta 1.6 s desde que empezó la carga, y además espera a que estén listas la fuente
   y la foto del hero (con un tope de 2.5 s). Después sube y se funde.
3. La caja se expande (`power4.inOut`, 1.2 s) como máscara de revelado (`clip-path` sobre `<main>`) y termina
   exactamente en el marco del hero, con su radio: la caja se convierte en el hero. El borde Papel del marco coincide
   con el fondo Papel, así que no hay corte.
4. Durante la expansión entra el hero (ver «Movimiento»). Al terminar, el preloader desaparece y se libera el scroll.

Nunca es un spinner ni una pantalla vacía: la caja y el nombre están en el HTML y se animan con CSS desde el primer
pintado. Con "reducir movimiento", sin JavaScript o si se entra a un ancla (`/#sobre-mi`), no hay intro. Durante la
intro la página empieza siempre arriba.

### Botón flotante de reserva (US-4, rediseñado en US-6)
Píldora Verde Lima fija abajo al centro de la home durante todo el scroll, como en el wireframe: ícono de calendario
(Lucide `CalendarCheck`), "Reservá tu turno" en 600 y un disco Verde Bosque con una flecha `ArrowUpRight` Verde Lima
que gira 45° al pasar el mouse. 64px de alto en mobile y 72px en desktop, con un halo Verde Lima suave hacia abajo y
el área segura de iOS. Lleva a `/reservar`. Es la única píldora Verde Lima de la home. La home deja abajo un espacio
Hueso más alto que el botón para que nunca tape el final. El foco suma un halo blanco y un anillo Verde Bosque.

### Sobre mí (US-6)
Banda Hueso con borde curvo arriba. A la izquierda, la foto en un marco en arco (arriba redondo, abajo radio 30px),
sólo desde 768px: en mobile no se muestra (pedido del dev, 2026-11-07);
mientras falta, el placeholder `[Completar: foto Sobre mí]` con borde punteado. A la derecha: el `h2` «Sobre **mí**»
con un subrayado Verde Lima dibujado a mano y una flecha Zanahoria a mano que baja hacia la foto (desde 1024px); el
primer párrafo en display (28px/38.4px, 500, con «Licenciado en Nutrición» y «Universidad Favaloro» en 700) y el
resto del texto en dos columnas desde 768px, con menos de 75 caracteres por línea.

### Flecha para bajar (US-19, movida en US-37)
Una flecha dibujada a mano, con el rulo de la de «Sobre mí» pero apuntando derecho hacia abajo (trazo de 3, 32×56px
en mobile y 54×96px desde 768px; se agrandó a pedido del dev, 2026-11-08). En «Sobre mí» va en la esquina inferior
derecha, en Zanahoria sobre Hueso. En el hero va blanca sobre Verde Bosque: en desktop, a la derecha de la frase de
apertura, a la altura de su última línea, en el hueco entre el texto y la foto; en mobile, al borde izquierdo del
marco, a la altura de «la base de tu salud» y por encima del botón flotante. Rebota lento (2.6 s) sólo sin «reducir movimiento», no se puede tocar y es
decorativa (`aria-hidden`). Nunca pisa el botón flotante ni el texto. La última sección no la lleva.

### Ícono de cuenta del hero (US-35)
Botón redondo arriba a la derecha del marco del hero (`cuenta-1.png` / `cuenta-2.png`), separado de la esquina
(56px, a 16px del borde de arriba y 20px del derecho en mobile; 64px a 48px del borde de arriba y 56px del derecho desde 1024px): fondo Verde Bosque,
aro Verde Lima de 2px, ícono Lucide `UserRound` en Papel y tres chispas Verde Lima a su izquierda, en abanico y
apuntando hacia afuera desde el centro del botón (`aria-hidden`). Un brillo de vidrio (franja Papel translúcida en
diagonal) lo cruza cada 1 s (sólo `transform`; sin brillo con «reducir movimiento»). En mobile el marco suma aire
arriba para que no pise el nombre. Se abre con clic o toque (y con teclado) una tarjeta
Verde Bosque con borde `line-on-dark`, radio 25px, padding 20px, 18rem de ancho (máximo `100vw - 48px`) y
`shadow-modal`; se cierra con Escape (el foco vuelve al botón) o tocando afuera. Entra sólo con `transform` y
`opacity`, y quieta con «reducir movimiento».
- Sin sesión: ícono + «Mi espacio» (Papel 600), «Accedé a tu espacio personal para gestionar tus consultas y
  seguimiento.» (Niebla), la píldora Verde Lima «Iniciar sesión» con disco de flecha, una línea `line-on-dark` y
  «¿Todavía no tenés una cuenta? **Registrate**» (Registrate en Verde Lima 700).
- Paciente: «Hola, Nombre», píldora «Ir a mi espacio» y «Cerrar sesión» como texto subrayado.
- Admin: «Hola, Lisandro» y la píldora «Ir al panel».
- **Excepción a «una sola píldora Verde Lima por pantalla»:** la píldora «Iniciar sesión» (o «Ir a mi espacio») sólo
  existe con la tarjeta abierta; cerrada, la única píldora Verde Lima de la home sigue siendo el botón flotante.
- El ícono es un hueco dinámico (PPR): la home se pre-renderiza con el ícono sin sesión y `AccountStatus` lo
  reemplaza, ya con la sesión leída, sin cambiar de tamaño. Lleva `data-intro`: aparece al final de la intro.

### Mi espacio (US-31 a US-33, rediseñado en US-38 según `docs/wireframes/bandeja-usuario.png`)
Página `/mi-espacio` del paciente sobre Hueso, contenido de hasta 1100px.
- Barra superior: logo LLN y «LIC. LISANDRO LÓPEZ» (link al inicio), la píldora Verde Bosque «Cerrar sesión» con
  ícono `LogOut` y un disco Verde Lima con la inicial.
- «Hola, Nombre» en 700, grande (48px desktop / 34px mobile), con el nombre subrayado en Verde Lima, y «← Volver al
  inicio» en Gris Piedra.
- A la izquierda (desde 1024px), la tarjeta Verde Bosque «Tus próximos turnos» (clase `theme-forest`, ver Tokens):
  disco Verde Lima con calendario, «Ver todos ›» hacia `/mi-espacio/turnos`, hasta dos turnos en filas translúcidas
  («Martes 12 de noviembre · 10:30 hs», ubicación y dirección o «Por videollamada», chip de estado; confirmado en Verde
  Lima con tilde) y la píldora Verde Lima «Reservá tu turno» con disco Verde Bosque. Cada fila es un link al detalle
  del turno.
  Debajo, la tarjeta Papel «Recordatorios» («Te avisamos por email 24 h antes de tu turno.»).
- A la derecha, la tarjeta Papel «Mi cuenta» con pestañas (`role="tablist"`, flechas del teclado): Tus datos, Tu
  email, Tu contraseña y, al pie, «Eliminar mi cuenta» en Pimentón con `Trash2`. Desde 1280px van en columna a la
  izquierda (activa con fondo Verde Lima al 20% y barra Verde Lima); más angosto, en una fila que se desplaza arriba del formulario. Los
  botones de los formularios son píldoras Verde Bosque a todo el ancho (`PUBLIC_DARK`).
- Pie: «Lic. Lisandro López · Nutrición».
- `/mi-espacio/turnos`: la misma barra, «← Volver a Mi espacio» y las tarjetas Papel «Tus próximos turnos» y «Tus
  turnos anteriores»; cada turno es un link (con chevron) a su detalle.
- `/mi-espacio/turnos/[id]` (Sprint 4): tarjeta Papel con el chip de estado, el día y la hora, el lugar y la obra
  social. Pendiente: aviso «Lisandro todavía no lo confirmó». Online y confirmado: «Entrar a la videollamada» (píldora
  Verde Bosque; nunca antes de confirmar). Con más de 24 h: «Reprogramar» y «Cancelar turno» (píldoras Gris Nube;
  cancelar pide confirmación). Con menos: «Faltan menos de 24 h…» y «Escribile por WhatsApp» si está
  `LISANDRO_WHATSAPP`.

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

### Tarjeta de sucursal (nueva; vigente desde US-19)
Sección «Dónde atiendo» después de «Sobre mí»: banda Papel con borde curvo que sube sobre «Sobre mí» (profundidad
US-8), título con «atiendo» en 700 subrayado Verde Lima, una tarjeta por ubicación activa y las obras sociales una
sola vez debajo, como chips Papel («Particular» primero). La online va sin mapa ni dirección. Sin «Reservar acá» por
ahora (la única píldora Verde Lima de la home es el botón flotante); «Cómo llegar» es una píldora Papel porque la
tarjeta es Gris Nube.

Propuesta original:
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

Vigente desde US-40 (wireframes del dev del 2026-11-09: `docs/wireframes/paso-previo-reserva.png`,
`flujo-presencial-*.png` y `flujo-virtual-*.png`). Reservar pide cuenta (ADR 0007): sin sesión, `/reservar` lleva al
login y vuelve. Todo va en la URL (`?modalidad=&ubicacion=&dia=&hora=&mes=&paso=`): anda sin JavaScript y con «atrás».
Títulos en Manrope (500 con la palabra clave en 700): el wireframe usa una serifa, pero el dev eligió mantener Manrope.

- **Modalidad** (`modality-choice.tsx` y `modality-panel.tsx`, iteración del dev del 2026-11-10): pantalla completa
  **sin barra superior ni pie y sin la pregunta** (queda un `h1` sólo para lectores de pantalla). Mitad izquierda
  Presencial en Verde Bosque (`theme-forest`) y mitad derecha Virtual en Papel, cada una de todo el alto; en mobile,
  apiladas (Presencial arriba). Arriba a la derecha flota «Cerrar sesión» (píldora Verde Bosque desde 768px; Papel en
  mobile, porque cae sobre el verde). Arriba a la izquierda, sobre el verde y alineado con la columna del contenido (la flecha sobre el borde del
  ícono), un «← Volver» sutil (texto Niebla 15px/600 sin
  fondo; al pasar el mouse, blanco con fondo Papel al 10%; foco Verde Lima) que lleva al inicio (o al turno, al
  reprogramar) y entra junto con la mitad Presencial. Cada mitad: un ícono Lucide enorme al 7% de fondo, una luz Verde Lima difusa, una
  tarjeta de ícono Verde Lima (80px, radio 25px, halo Verde Lima), el título 72px/500, la bajada, tres chips con borde
  y la píldora Verde Lima «Elegir presencial / virtual» con disco Verde Bosque. Textos y chips, los del wireframe.
  - **Cada mitad entera es el link** de su modalidad (`aria-label` «Elegir …», descrito por la bajada): se elige
    tocando cualquier punto, también el fondo. La píldora queda como indicador visual, sin clic propio. Hover: el
    panel se aclara apenas (blanco al 5% sobre el verde, Verde Lima al 10% sobre el Papel), el ícono crece a 1.05 y el
    disco de la flecha se corre 4px, en 300 ms. Foco: anillo de 4px hacia adentro (Verde Lima sobre el verde, Verde
    Bosque sobre el Papel). Si una modalidad no tiene ubicaciones: «Por ahora no hay turnos …es.», sin link.
  - **Excepción:** dos píldoras Verde Lima en la misma pantalla (una por mitad), por el wireframe del dev.
- **Despliegue de la modalidad** (`src/app/entrance.css`): cada mitad entra **entera** (fondo y contenido juntos)
  desde afuera de la pantalla: Presencial desde la izquierda y Virtual desde la derecha, hasta juntarse en el centro;
  en mobile, desde arriba y desde abajo. 900 ms con `--ease-out`, sólo `transform`. Se repite en cada llegada; con
  «reducir movimiento», quietas.
- **Al elegir** (y en cada recarga de los pasos): la barra de Mi espacio baja desde arriba y el título, la tarjeta de
  los pasos y la tarjeta «Tu turno» entran desde la izquierda, escalonados (80, 160 y 240 ms). **En cada paso** (también
  al volver con «Atrás» o al llegar al final), el contenido del paso entra desde la izquierda en 500 ms. Los pasos
  navegan sin recargar (`next/form` y `Link`), así lo que no cambia queda quieto.
- **Pasos** (`booking-flow.tsx`): título «Reservá tu **turno**» (56px desktop) con la bajada; a la izquierda la tarjeta
  Papel de los pasos (radio 30px, sombra larga y suave) y a la derecha, 340px y `sticky`, la tarjeta «Tu turno». Una
  luz Verde Lima suave, fija arriba a la derecha.
  - Presencial: Ubicación → Día → Horario → Confirmar. Virtual: Día → Horario → Confirmar (no se habla de ubicación;
    por detrás se usa la ubicación online activa).
  - Píldoras de 44px: la actual en Verde Lima con disco Papel y halo Verde Lima; las hechas en Verde Bosque con disco
    Verde Lima y tilde (son links para volver); las que faltan, con borde. En mobile sólo la actual muestra su nombre.
    Al enviar la solicitud, la última también pasa a hecha, con tilde (`group-has-[[data-booking-done]]`).
  - Cada paso es un form GET: se marca la opción y «Continuar» (píldora gris que pasa a Verde Bosque con disco Verde
    Lima cuando hay una elegida, `group-has-[:checked]`) avanza; «Atrás» vuelve al paso anterior con lo elegido marcado.
    Arriba del pie, una línea Línea Salvia.
- **Ubicación** (sólo las presenciales): tarjetas Gris Nube en dos columnas (radio 25px) con disco Papel y pin, nombre
  18px/600 y dirección; la elegida pasa a Papel con borde Verde Lima de 2px, disco Verde Lima y halo.
- **Día:** un mes por vez en una caja Gris Nube (radio 25px), con flechas redondas Papel (sólo hacia meses con días
  libres) y L M X J V S D. Los días libres son discos Papel de 48px (40px en mobile) en 600; el elegido, Verde Lima; los
  demás, el número apagado.
- **Horario:** «Elegí un horario» con el día debajo (minúsculas). Grilla de 3 columnas (2 en mobile) de rectángulos Gris
  Nube (radio 12px, 56px de alto) con reloj y la hora en 700; el elegido en Verde Lima; los ocupados o bloqueados,
  apagados y tachados, sin poder elegirse.
- **Confirmar:** «Revisá y confirmá», una caja Gris Nube con filas separadas por Línea Salvia (disco Papel con ícono,
  etiqueta 12px en mayúsculas con +1px y el valor 17px/600: Lugar, Día y Horario), el selector «Obra social
  (opcional)» con «Particular» primero y la píldora Verde Bosque «Confirmar turno» con disco Verde Lima.
- **Final:** en el lugar de la tarjeta, centrado: disco Verde Lima de 80px con tilde y aro Verde Lima al 25%,
  «¡Solicitud enviada!» (700), la fecha y hora, el lugar y «Lisandro la confirma y te avisamos por email.», con «Ver
  mis turnos» (píldora Verde Bosque) y «Reservar otro turno» (link, sólo si le queda lugar para otro). Recibe el foco.
- **Tarjeta «Tu turno»** (`booking-summary-card.tsx`): Verde Bosque (radio 30px) con una luz Verde Lima abajo:
  «TU TURNO · PRESENCIAL / VIRTUAL» en Verde Lima 13px/700 con +1px y «Cambiar» (vuelve a la modalidad); filas Lugar
  (o Modalidad «Por videollamada»), Día y Horario con disco (Verde Lima si ya está, translúcido si «Pendiente»); la
  barra de progreso Verde Lima con «Paso X de N»; una línea y el aviso con escudo «Podés reprogramar o cancelar tu
  turno hasta 24 hs antes.». En mobile va arriba y compacta: título, «Cambiar», lo elegido en hasta dos líneas y la
  barra.
- **Tope:** con 2 turnos por venir, en lugar del flujo se dice «Ya tenés dos turnos por venir…» con «Ir a Mi espacio».
- **Reprogramar** (`/mi-espacio/turnos/[id]/reprogramar`): el mismo flujo (modalidad, pasos y tarjeta) con
  «Reprogramá tu **turno**»; la tarjeta dice el turno de hoy, Confirmar suma la fila «Antes», el botón es «Pedir el
  cambio» y el final, «¡Pedido enviado!».
- **Áreas táctiles:** 44×44px mínimo, salvo los días del calendario en mobile (40px, por las 7 columnas). Todo se usa
  con teclado (los radios reciben el foco con anillo Verde Bosque).

## Componentes — panel admin

El panel es una herramienta de trabajo diario, así que usa una **versión silenciosa del sistema**: misma tipografía,
mismos colores, sin garabatos, sin cinta y sin fotos. El Verde Lima se reserva para la acción principal de cada vista.
La referencia es el wireframe del dev `docs/wireframes/panel-administrador.png` (US-26, 2026-11-08), con Lisandro
como **nutricionista**.

- **Controles del panel (US-26, decisión del dev):** botones, flechas, «Hoy», el toggle Día/Semana, los horarios y los
  inputs son rectángulos con radio 12px (`rounded-control`), no píldoras: así lo pide el wireframe. `PRIMARY_BUTTON` (Verde
  Lima) y `SECONDARY_BUTTON` (Gris Nube) miden 44px de alto, 15px/600, con ícono Lucide a la izquierda. Los chips de
  estado sí siguen en píldora (no son botones). En el sitio público todo sigue en píldora.
- **Hover del panel (US-26 CA-11, pedido del dev):** todo lo que se toca lleva la clase `hover-shade`
  (`src/app/hover-shade.css`). Con el mouse encima, el control se funde en degradé, de izquierda a derecha, hacia un
  tono más oscuro de su propio color (Verde Bosque al 16% por encima de su fondo), con un fundido de opacidad de 200 ms.
  Sobre Verde Bosque (menú lateral) se suma `hover-shade-on-dark` y el degradé va hacia un tono más claro (blanco al 14%).
  No aparece en touch ni en botones deshabilitados. Los links de texto subrayados no lo llevan.
- **Títulos del panel:** el `h1` de cada vista va en 700, 32px (28px en mobile), como en el wireframe; los títulos de
  tarjeta, 18–20px/600.
- **Sidebar (T-4, US-26):** desde 768px, Verde Bosque fija a la izquierda (240px). Arriba, el logo LLN en un disco
  Papel, «Lisandro López» (17px/600, blanco) y «NUTRICIONISTA» (11px/600, Niebla, +1px). Links Agenda, Pacientes,
  Ubicaciones, Ajustes y Mi cuenta (ícono Lucide + texto 15px/600 en Niebla); el activo en blanco, con fondo blanco al
  10% a todo el ancho y una barra Verde Lima pegada al borde izquierdo. Al pie, una línea `line-on-dark` y «Cerrar
  sesión». El foco sobre Verde Bosque es un anillo Verde Lima (7.9:1). El contenido va sobre Hueso Panel (`bg-panel`).
- **Mobile:** la sidebar pasa a una barra inferior fija con 5 íconos y su texto (11px; la barrita del activo, arriba).
  «Cerrar sesión» va dentro de Mi cuenta.
- **Agenda (US-26):** vista `max-w-7xl`.
  - Cabecera: «Agenda», el saludo según la hora argentina («Buen día / Buenas tardes / Buenas noches, Lisandro») y
    «Acá tenés un resumen de tus turnos y de tu semana.»; a la derecha «+ Nuevo turno» (Verde Lima) y «Bloquear
    horario» (Gris Nube con marco Gris Piedra de 1px, candado: sin el marco se perdía sobre Hueso).
  - Cuatro tarjetas Papel radio 16px: disco Verde Lima al 25% con el ícono, label 14px/500, número 28px/700 y bajada
    13px Gris Piedra («+2 que ayer», «+12% vs. semana anterior», «Esta semana», «De 10 disponibles» u «Hoy no atendés»).
    2×2 hasta 1280px; en mobile, sin el disco del ícono.
  - A la izquierda, la tarjeta de la agenda: título «Hoy, 8 de noviembre de 2026» con, al lado, un cuadrado de 44px
    con calendario (US-45) que abre el selector de fecha del navegador y va a ese día (o a su semana); a la derecha, el toggle
    Día/Semana, flechas cuadradas con borde Línea Salvia y «Hoy» en Gris Nube. La vista día es una
    línea de horas (de 08:00 a 18:00, estirada si algo cae afuera; 54px por hora, más compacta para que el día entre en la pantalla) con cada turno en su lugar: bloque
    radio 6px con barra izquierda de 4px, «**Nombre** · Obra social» y «09:00 – 09:45 · Ubicación»; confirmado en
    `bg-confirmed` con barra Verde Lima, pendiente en Hueso con borde Línea Salvia, barra Verde Bosque y su chip. Los cancelados no van en la
    línea (se ven en la semana y en el detalle). Los bloqueos son un bloque rayado Gris Nube / Línea Salvia con
    «Bloqueado · motivo».
  - Vista semana (US-26, pedido del dev): ocupa exactamente el mismo lugar y la misma forma que la vista día; cambiar
    Día/Semana sólo cambia la grilla. Es una tabla con los días en la columna izquierda («Lun 9», link a ese día; hoy
    en 700) y cada día partido en franjas de 4 horas (08–12, 12–16 y 16–20, estiradas de a 4 h si algo cae afuera),
    separadas con líneas Línea Salvia. Cada turno no cancelado es un cuadradito de 44px con su hora de inicio y el
    color de su estado (confirmado `bg-confirmed` con borde Verde Lima, pendiente Hueso con borde Verde Bosque); el
    nombre va en `title` y en el `aria-label`. La franja que toca un bloqueo se ve rayada.
  - A la derecha (340px), en las dos vistas. En mobile el orden es próximo turno, agenda y calendario: «Próximo turno» (avatar en disco Verde Lima al 25%,
    nombre, obra social, reloj con «10:30 – 11:15» y, debajo, «Hoy», «Mañana» o la fecha, pin con ubicación y dirección o «Por videollamada»;
    «Confirmar» Verde Lima si está pendiente o «Ver turno», y «WhatsApp» Gris Nube; «⋯» lleva al detalle) y el
    calendario del mes (L a D, el día elegido en disco Verde Bosque, punto en los días con turnos (Verde
    Bosque; Verde Lima sobre el elegido), hoy en 700 con un aro Línea Salvia, días de otros meses en Gris Piedra; cada día
    de 44px es un link).
- **Pacientes (US-43, `docs/wireframes/lista-pacientes.png`):** «Pacientes» y «N pacientes registrados»; un
  buscador (input del panel sobre Papel, con lupa) y los filtros Todos / Activos / Nuevos este mes / Sin turno próximo
  (controles de 12px, el activo en Verde Bosque). Tarjeta Papel radio 16px con la tabla: encabezados 12px en mayúsculas
  con +1px en Gris Piedra; Paciente (iniciales en disco Verde Lima o Verde Bosque con iniciales Verde Lima, alternados,
  nombre 600 y email), Teléfono, Último turno, Próximo turno (punto Verde Lima delante), Estado (chips Activo
  `bg-confirmed`, Nuevo Verde Lima al 25%, Inactivo Gris Nube) y «Ver» + «⋯» (WhatsApp y Nuevo turno). En mobile, una
  tarjeta por paciente. Abajo «Mostrando 1–20 de N» y el paginado (flechas con borde Línea Salvia y la página en Verde
  Bosque). La ficha (`/admin/pacientes/[id]`): datos, WhatsApp y «Nuevo turno» en Gris Nube, y dos tarjetas con los
  turnos por venir y anteriores. Sin «Nuevo paciente» ni «Exportar».
- **Ubicaciones (US-41, `docs/wireframes/apartado-de-ubicacion.png`):** «Tus **ubicaciones**» con «+ Nueva ubicación»
  (Verde Lima). Desde 1024px, lista (5/12) y ficha (7/12) en tarjetas Papel radio 16px. Cada fila: miniatura Gris Nube
  de 56px con disco Verde Lima y pin (o cámara), nombre 17px/600, dirección o «Videollamada», chip Presencial
  (`bg-confirmed`), Online (Gris Nube) o Desactivada, y chevron; la elegida con fondo Verde Lima al 15% y barra Verde
  Lima a la izquierda. La ficha: nombre 24px/700, chip, «⋯» (Editar datos), el mapa radio 16px con «Abrir en Google
  Maps ↗» subrayado, «HORARIOS DE ATENCIÓN» (13px, mayúsculas, +1px), una fila por franja (lápiz y tacho de 44px) o
  «sin atención», «+ Agregar horario» subrayado, una caja Gris Nube con dos números (28px/700: turnos y bloqueos del
  mes) y, abajo a la derecha, «Desactivar ubicación» en Pimentón. Sin «Guardar cambios», % de asistencia ni
  «Exportar» (decisión del dev).
- **Nueva ubicación (US-42, `docs/wireframes/nueva-ubicacion1/2/3.png`):** «Nuevo consultorio» / «Nuevo espacio
  online» en Manrope (el wireframe usa una serifa). Cuatro tarjetas Papel radio 30px con disco Verde Bosque numerado
  (número Verde Lima): 1 Tipo de atención (dos tarjetas Gris Nube radio 16px con disco e ícono; la elegida con borde
  Verde Lima de 2px, fondo Verde Lima al 20% y tilde), 2 Datos, 3 Horarios (un interruptor por día: pista Verde
  Bosque con perilla Verde Lima; prendido muestra desde/hasta y «+ Franja»; sin atajos) y 4 Visibilidad (caja Gris
  Nube con ojo en disco Verde Lima e interruptor). A la derecha (`sticky`, 340px; abajo en mobile) la tarjeta «Vista
  del paciente» (`theme-forest`, luz Verde Lima): chip Visible/Oculta, la ubicación como la ve el paciente, la semana
  y «Horas por semana» en 32px/700. Abajo, «Guardar consultorio» / «Guardar ubicación online» (Verde Lima radio 12px,
  56px de alto, con disco Verde Bosque y tilde) y «Cancelar».
- **Ajustes (US-44, `docs/wireframes/nuevo-ajustes1.png` y `2`):** «Ajustes» y «Configurá cómo funciona tu agenda.»;
  pestañas «Duración de los turnos» y «Obras sociales» (12px; la activa en Verde Bosque). Duración: 30, 45, 60 y 90
  minutos en Gris Nube (la elegida en Verde Lima), un separador, el campo «Minutos, por ejemplo 50» y «Guardar
  cambios». Obras sociales: «+ Nueva obra social» (Verde Lima) y, por fila, nombre, chip Gris Nube «N turnos»,
  interruptor y lápiz; la desactivada en Gris Piedra. Sin la pestaña «Recordatorios» ni la «Anticipación máxima».
- **Solicitudes (US-39):** el link «Agenda» del menú lleva un contador Verde Lima con las solicitudes por confirmar
  (en mobile, arriba a la derecha del ícono). En el tablero, si hay alguna, una tarjeta Papel arriba de las métricas
  («Tenés N solicitudes por confirmar», disco Verde Lima al 25% con `Inbox` y «Ver solicitudes» en Verde Bosque).
  `/admin/solicitudes` lista una tarjeta por solicitud (nombre, día y hora, ubicación y obra social, teléfono) con
  «Confirmar», «Reprogramar», «Cancelar turno» y «Ver el turno». Al confirmarla sale de la lista.
- **Bloquear disponibilidad (US-14):** página `/admin/bloqueos` (no modal: se usa igual con teclado y en el
  celular) con desde/hasta, motivo opcional y el botón Verde Lima «Bloquear», más la lista de bloqueos por venir.
- **Horarios en el panel:** botones Gris Nube de 48px en grilla; el elegido pasa a Verde Lima (los mismos de la
  reserva, con radio 12px). Tras guardar, confirmar, cancelar o reprogramar, una franja `bg-confirmed` con el
  resultado y el botón Gris Nube «Avisar por WhatsApp» (ícono `MessageCircle`, abre `wa.me` en otra pestaña).
- **Login (T-3, US-34; `docs/wireframes/login.png`):** en `/login`, el mismo para el admin y los pacientes, con los
  controles del sitio público (inputs radio 25px, botones píldora). Desde 1024px, dos mitades: a la izquierda un panel
  Verde Bosque a toda la altura con el logo en un disco Verde Lima y «LIC. LISANDRO LÓPEZ» (15px/600, +1px, blanco),
  el título «Tu salud, / en **foco.**» (800, blanco; «foco.» en Verde Lima macizo, US-38), la bajada en Niebla y dos
  íconos Lucide en discos con borde (Turnos, Historial). A la derecha, Hueso con la tarjeta **Verde Bosque** (US-38,
  `docs/wireframes/componente-login-verde.png`; radio 30px, borde Verde Lima al 60%, clase `theme-forest`): logo y
  «LIC. LISANDRO LÓPEZ», «Ingresá a tu cuenta», «Gestioná tus turnos y tu historial» en Niebla, Email, Contraseña (con
  ojo, `aria-pressed`) con inputs translúcidos de borde claro, «¿Olvidaste tu contraseña?» subrayado en Niebla, el
  botón Verde Lima «Entrar →» y «¿No tenés cuenta? **Registrate**» (Registrate en Verde Lima). Sin Google ni separador
  «o». Los errores van en una franja Papel con texto Pimentón (sobre Verde Bosque no se leen). Detrás de la tarjeta, una luz Verde Lima desenfocada que se prende y se apaga cada 1 s
  (entre 60 % y 85 % de opacidad: nunca deja de verse; sólo `opacity` y `transform`; quieta con «reducir movimiento»). Debajo de 1024px sólo se ve la tarjeta sobre Hueso.
  Si el login responde «Activá tu cuenta», debajo del error aparece «Reenviar el email», y su aviso sale debajo del
  botón.
- **Registro, Recuperar y links de email (US-28, US-30, US-38):** la misma tarjeta Verde Bosque con luz sobre Hueso,
  sin el panel verde. `/registro` («Creá tu cuenta», centrado, según `docs/wireframes/planilla-creacion-cuenta.png`,
  con «LIC. LISANDRO LÓPEZ» en Verde Lima): nombre, email, teléfono, contraseña con la pista «Al menos 8 caracteres.»,
  casilla Verde Lima «Leí y acepto la política de privacidad» (link Verde Lima) y «Crear mi cuenta» con disco de
  flecha. `/recuperar` («Recuperá tu contraseña»): email y «Mandarme el link».
- **«¡Ya casi está!» (US-38, `docs/wireframes/cuenta-creada.png`):** al terminar el registro o «olvidé mi
  contraseña», la página muestra sólo una tarjeta **Papel** con luz y dos hojas Verde Lima translúcidas detrás: un
  sobre (`Mail`) sobre una nube Verde Lima suave con un disco de tilde y dos chispas, «¡Ya casi está!» (700, recibe el
  foco), el texto en Gris Piedra, un recuadro Verde Lima al 15% con reloj e indicación, y la píldora con borde
  «Volver a iniciar sesión →». En «olvidé» el texto sigue siendo genérico («Si el email tiene una cuenta…»). `/verificar/[token]`, `/restablecer/[token]` y `/confirmar-email/[token]`: el GET no
  toca nada; sólo muestra un botón (Activar mi cuenta, Guardar la contraseña, Confirmar mi email). Son `noindex` y
  sin `referrer`. Una sola píldora Verde Lima por pantalla.
- **Política de privacidad (US-20):** `/privacidad`, indexable. Banda Hueso con una tarjeta Papel (radio 30px) y texto
  de hasta 70 caracteres por línea; `h1` «Política de **privacidad**» con subrayado Verde Lima y un `h2` de 20px/600 por
  tema. Lo que falta va como `[Completar: …]` visible.
- **Acceso denegado (T-3):** la ve cualquiera que entre a `/admin/**` sin sesión, así que usa el lenguaje del sitio
  público: banda Hueso, tarjeta Papel, título "Acceso **denegado**" con subrayado Verde Lima, la línea "Esta sección
  es privada." y la píldora Verde Lima "Volver al inicio" con disco de flecha. Ningún link al login.
- **Mi cuenta (US-5):** sobre Hueso, dos tarjetas Papel con radio 16px ("Cambiar el email" y "Cambiar la contraseña"),
  cada una con su título 20px/500, los inputs de la tarjeta de login y su botón Verde Lima "Guardar …". Es una de las
  vistas con dos botones Verde Lima: cada uno cierra su propio formulario. El éxito va en una franja `bg-confirmed`.

## Movimiento (US-3, US-7 y US-8)

Tesis: "el hilo que atraviesa". Un solo momento de autor, la intro de marca que se convierte en el hero; el resto
acompaña el scroll.

- **Scroll con inercia** (Lenis, `src/components/motion/smooth-scroll.tsx`) sólo en la home, sólo sin "reducir
  movimiento" y recién cuando termina la intro. En touch el scroll es el nativo del celular. ScrollTrigger se
  actualiza con cada scroll de Lenis.
- **Intro de marca** (US-7, ver «Intro de marca»): al entrar o recargar la home, la caja con «Lic. Lisandro López» se
  expande hasta ser el marco del hero, y durante la expansión entra el hero, cada parte desde su lado (pedido del dev,
  2026-11-07): la foto crece desde el centro (0.6 → 1); las letras del nombre bajan desde arriba de a una (desfase de
  0.035 s); «La alimentación…» entra desde la izquierda y «Y aprender…» desde la derecha; al final sube el botón
  flotante. Todo con `expo.out`, en `intro-timeline.ts`.
- **Profundidad entre secciones** (US-8, `depth.ts`): al bajar, la sección actual queda fija (`pin` de ScrollTrigger,
  desde que se ve entera hasta abajo) y se aleja hacia el fondo: su tarjeta se achica a 0.9 y se apaga a 0.5. La
  siguiente sube con el scroll, por encima (`relative z-10`), y la tapa; su borde curvo deja ver la capa de atrás.
  Todo atado al scroll (`scrub`), sin animaciones sueltas. Cada sección ocupa al menos una pantalla (`min-h-svh`,
  contenido centrado): así la anterior ya quedó tapada antes de que la actual empiece a alejarse, y nunca se ven tres
  capas a la vez. Cuando la siguiente la tapó del todo, la sección de atrás se oculta (vuelve al subir): si no, se
  vería a través de la que se aleja y se apaga. «Sobre mí» además hace una pausa: ya vista entera, queda quieta
  durante 1,25 pantallas de scroll antes de que suba «Dónde atiendo» (`hold` de `depthScene`, pedido del dev,
  2026-11-07). Se usa `pin` y no `position: sticky` porque el hero en
  mobile y "Sobre mí" son más altos que la pantalla: con `sticky; top: 0` su parte de abajo nunca se vería.
- **Escena del hero al scrollear** (dentro de la misma profundidad): la foto sigue creciendo (hasta 1.08, desde
  abajo) y el nombre sube más rápido y se apaga a 0.25. La frase no se mueve: el texto no lleva parallax.
- **"Sobre mí"** (`about-motion.tsx`): el título sube palabra por palabra y el párrafo display línea por línea, con
  máscara (SplitText); el marco en arco se revela de abajo hacia arriba con `clip-path`; el subrayado Verde Lima y la
  flecha Zanahoria se dibujan con el scroll (DrawSVG): es "el hilo".
- **Sin parpadeo y sin contenido perdido**: un script mínimo en `<head>`, sólo en `/` y sin ancla en la URL, marca
  `motion-pending`: el CSS muestra la caja y oculta lo marcado con `data-intro` desde el primer pintado, antes de que
  cargue el JS. La intro toma el control al montar (`data-intro-state='playing'`) y, si el JS no llega, el gate se
  libera solo a los 2.5 s y la home se ve sin intro.
- **Reducir movimiento / sin JavaScript**: sin Lenis, sin preloader, sin intro, sin profundidad y sin escenas; todo
  se ve quieto, con los trazos dibujados.
- Para animar una sección nueva: un componente cliente como `about-motion.tsx` que envuelva la sección, con
  `gsap.matchMedia(MOTION_OK)`. Sólo `transform`, `opacity`, `clip-path` y trazos SVG. Para sumarla a la
  profundidad, la sección anterior llama a `depthScene({ layer, next, content })` con su envoltorio, el de la
  siguiente y su tarjeta visible, y la sección nueva va `relative` con un `z-index` mayor.

## Elevación

- **Halo de píldora:** `rgba(0,0,0,0.05) 0px 6px 34px 0px`
- **Glow de barra de reserva:** `rgba(0,0,0,0.05) 0px 0px 30px 6px`
- **Elevación de toggle:** `rgba(0,0,0,0.21) 0px 6px 34px 0px`
- **Modal (panel):** `rgba(31,61,43,0.12) 0px 12px 40px 0px`

## Superficies

- **Papel** (`#ffffff`): canvas, header, tarjetas de testimonios y beneficios.
- **Hueso** (`#f6f5ef`): bandas alternadas detrás de bordes curvos.
- **Hueso Panel** (`#ece9df`): fondo del panel admin.
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
  (8px), `rounded-panel` (16px), `rounded-control` (12px, controles del panel). Las píldoras usan `rounded-full`.
- Sombras: `shadow-halo`, `shadow-glow`, `shadow-toggle`, `shadow-benefit`, `shadow-modal`.
- Tema oscuro local (US-38): la clase `theme-forest` (en `tokens.css`) redefine adentro `--background` (Verde
  Bosque), `--foreground` (Papel), `--secondary` y `--border` (blanco translúcido) y `--muted-foreground` (Niebla). Así
  los mismos controles del sitio público se ven bien sobre Verde Bosque sin duplicar componentes.
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
- No hacer controles con esquinas rectas: en el sitio público, botones, tabs y toggles son siempre píldoras; en el panel, rectángulos con radio 12px.
- No poner títulos enteros en bold.
- No usar tracking negativo.
- No usar el Pimentón en botones ni títulos. Va solo en precios y errores. Única excepción, en el panel: el botón
  «Desactivar» de las obras sociales en Ajustes (`DANGER_BUTTON`, texto blanco, 5.1:1), con «Guardar» en Verde Lima y
  «Agregar» en Verde Bosque (`DARK_BUTTON`), a pedido del dev (2026-11-09). En el celular los tres ocupan todo el ancho.
  Otra excepción (US-38, wireframe del dev): la pestaña «Eliminar mi cuenta» de Mi espacio va en Pimentón sobre Papel
  (5.1:1). Y otra (US-41, wireframe del dev): «Desactivar ubicación» en la ficha de la ubicación, como texto Pimentón
  sobre Papel (5.1:1). Desde US-44 las obras sociales ya no usan «Desactivar» rojo: se apagan con un interruptor.
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
