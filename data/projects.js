// Edita esta lista para agregar o quitar proyectos.
// category: "creado" | "rediseno" | "movil" | "personal"  (define en qué filtro aparece)
// type: "web" | "app"  (cambia el ícono de la tarjeta)
// description: texto del frente · tasks y stack: lo que aparece al voltear la tarjeta
// stack es opcional: si lo dejas vacío no se muestra
// image: captura del sitio (assets/proyectos) · en apps, image es el ícono y banner el color de fondo
window.PROJECTS = [
  {
    title: "Arty",
    role: "Desarrollo completo · Front-end y back-end",
    category: "creado",
    type: "web",
    url: "https://arty.ativar.com.mx/",
    image: "assets/proyectos/arty.jpg",
    description: "Plataforma de subastas en vivo de obras de arte con sede en Mérida, Yucatán. Los vendedores publican sus piezas y los compradores compiten con pujas en tiempo real.",
    tasks: ["Desarrollo completo del sitio", "Front-end: interfaz y experiencia de usuario", "Back-end: servidor y lógica de las subastas"],
    stack: []
  },
  {
    title: "Codent-Exam",
    role: "Proyecto personal · Front-end y back-end",
    category: "personal",
    type: "web",
    url: "https://codent-exam.vercel.app/",
    image: "assets/proyectos/codent-exam.jpg",
    description: "Plataforma para aplicar exámenes de programación en el navegador. El profesor crea el examen, comparte un código de 6 caracteres y sigue el avance de sus alumnos mientras responden.",
    tasks: ["Proyecto personal estudiantil", "Desarrollo del front-end y del back-end", "Acceso a exámenes con código", "Seguimiento del avance de los alumnos"],
    stack: ["Node.js", "Supabase", "MongoDB"]
  },
  {
    title: "Ativar",
    role: "Rediseño",
    category: "rediseno",
    type: "web",
    url: "https://www.ativar.com.mx/",
    image: "assets/proyectos/ativar.jpg",
    description: "Ativar es una empresa de desarrollo de software en Mérida: software a la medida, apps móviles, páginas web, realidad aumentada y videojuegos. Es donde trabajo actualmente.",
    tasks: ["Rediseño del sitio web"],
    stack: []
  },
  {
    title: "Mérida Living Real Estate",
    role: "Rediseño y bugs",
    category: "rediseno",
    type: "web",
    url: "https://www.meridalivingrealestate.com/",
    image: "assets/proyectos/merida-living.jpg",
    description: "Inmobiliaria bilingüe que publica propiedades en venta en Mérida, el norte de la ciudad, la playa y alrededores, para compradores de habla hispana e inglesa.",
    tasks: ["Rediseño del sitio", "Corrección de errores"],
    stack: []
  },
  {
    title: "Cerberus",
    role: "Rediseño",
    category: "rediseno",
    type: "web",
    url: "https://cerberus-web-3d0011b9a146.herokuapp.com/",
    image: "assets/proyectos/cerberus.jpg",
    description: "Empresa de sistemas de seguridad: alarmas, cámaras de vigilancia, videoporteros, control de acceso, cerca eléctrica y domótica.",
    tasks: ["Rediseño del sitio web"],
    stack: []
  },
  {
    title: "Acri Corporativa",
    role: "Rediseño",
    category: "rediseno",
    type: "web",
    url: "https://acricorp.com/",
    image: "assets/proyectos/acri.jpg",
    description: "Plataforma de cumplimiento normativo: las empresas hacen un autodiagnóstico interactivo de 14 módulos, con contenido cifrado en Blockchain y acceso exclusivo para cada usuario.",
    tasks: ["Rediseño del sitio web"],
    stack: []
  },
  {
    title: "TMKonnect",
    role: "Bugs y mantenimiento",
    category: "rediseno",
    type: "web",
    url: "https://tmkonnect.com/",
    image: "assets/proyectos/tmkonnect.jpg",
    description: "Plataforma que conecta a empresas, emprendedores y creadores con una red internacional de profesionales de propiedad intelectual: marcas, derechos de autor, patentes y diseños industriales.",
    tasks: ["Corrección de errores", "Mantenimiento"],
    stack: []
  },
  {
    title: "Beter App",
    role: "Bugs y mantenimiento",
    category: "movil",
    type: "app",
    url: "https://play.google.com/store/apps/details?id=com.avalerroux.app&hl=es_MX",
    image: "assets/proyectos/beter.png",
    banner: "#2f5a45",
    description: "App móvil publicada en Google Play.",
    tasks: ["Corrección de errores", "Reparaciones y mantenimiento"],
    stack: []
  },
  {
    title: "BeyondLife",
    role: "Bugs y mantenimiento",
    category: "movil",
    type: "app",
    url: "https://play.google.com/store/apps/details?id=com.beyondlife&hl=es_MX",
    image: "assets/proyectos/beyondlife.png",
    banner: "#0e2257",
    description: "App móvil publicada en Google Play.",
    tasks: ["Corrección de errores", "Reparaciones y mantenimiento"],
    stack: []
  }
];
