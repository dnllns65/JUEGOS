// Base de datos de personajes famosos para AdivinaQuién AI
// Contiene año de nacimiento, año de fallecimiento (null si está vivo), país de origen, gentilicios y pistas.
const CHARACTERS = [
  // --- DEPORTES ---
  {
    name: "Lionel Messi",
    filters: { region: "latam", area: "sports", nature: "real", era: "current" },
    birthYear: 1987,
    deathYear: null,
    country: "Argentina",
    demonyms: ["argentino", "argentina", "rosarino", "rosarina", "sudamericano", "sudamericana", "latinoamericano", "latinoamericana", "latino", "latina"],
    description: "Futbolista argentino, campeón del mundo y múltiple ganador del Balón de Oro.",
    attributes: {
      hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false,
      deportista: true, futbolista: true, argentino: true, latino: true, sudamericano: true,
      barcelona: true, miami: true, mundial: true, balon_oro: true, zurdo: true, barbudo: true,
      casado: true, hijos: true, joven: true, veterano: false, bajo: true, alto: false,
      pelota: true, copa: true, capitan: true
    },
    synonyms: ["messi", "lio messi", "lionel messi", "la pulga", "pulga", "lionel"],
    clues: [
      "Su dorsal de camiseta más icónico es el número 10.",
      "Desarrolló la mayor parte de su carrera profesional en el F.C. Barcelona.",
      "Nació en Rosario, Argentina, y levantó la copa de campeón del mundo en Catar 2022."
    ]
  },
  {
    name: "Cristiano Ronaldo",
    filters: { region: "europa", area: "sports", nature: "real", era: "current" },
    birthYear: 1985,
    deathYear: null,
    country: "Portugal",
    demonyms: ["portugues", "portuguesa", "europeo", "europea"],
    description: "Futbolista portugués conocido por su potencia física y gran cantidad de goles.",
    attributes: {
      hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false,
      deportista: true, futbolista: true, portugues: true, europeo: true, latino: false,
      madrid: true, manchester: true, al_nassr: true, zurdo: false, diestro: true,
      alto: true, bajo: false, musculoso: true, vanidoso: true, copa: true, balon_oro: true
    },
    synonyms: ["cristiano", "cr7", "ronaldo", "cristiano ronaldo", "el bicho", "bicho", "penaldo"],
    clues: [
      "Es apodado mundialmente por una combinación de sus iniciales y su número de camiseta.",
      "Es el máximo goleador histórico del Real Madrid y de la selección de Portugal.",
      "Nació en la isla de Madeira y actualmente juega en el club Al-Nassr de Arabia Saudita."
    ]
  },
  {
    name: "Diego Maradona",
    filters: { region: "latam", area: "sports", nature: "real", era: "historical" },
    birthYear: 1960,
    deathYear: 2020,
    country: "Argentina",
    demonyms: ["argentino", "argentina", "sudamericano", "sudamericana", "latinoamericano", "latinoamericana", "latino", "latina"],
    description: "Leyenda del fútbol argentino, famoso por su gol 'la mano de Dios' y el Gol del Siglo.",
    attributes: {
      hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false,
      deportista: true, futbolista: true, argentino: true, latino: true, sudamericano: true,
      napoles: true, boca: true, mundial: true, zurdo: true, rebelde: true, polemico: true,
      bajo: true, gordo: true, barba: true
    },
    synonyms: ["maradona", "diego", "diego maradona", "el pelusa", "pelusa", "el diez", "dios"],
    clues: [
      "Su apodo de la infancia es 'El Pelusa'.",
      "Es considerado una deidad futbolística en Argentina y en la ciudad de Nápoles, Italia.",
      "Es el autor de dos de los goles más famosos de la historia del fútbol (ambos a Inglaterra en 1986)."
    ]
  },
  {
    name: "Michael Jordan",
    filters: { region: "usa", area: "sports", nature: "real", era: "historical" },
    birthYear: 1963,
    deathYear: null,
    country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Considerado el mejor jugador de baloncesto de todos los tiempos, figura de los Chicago Bulls.",
    attributes: {
      hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false,
      deportista: true, basquetbolista: true, americano: true, estadounidense: true, negro: true,
      chicago: true, toros: true, bulls: true, alto: true, calvo: true, millonario: true,
      zapatillas: true, aire: true
    },
    synonyms: ["jordan", "michael jordan", "air jordan", "mj"],
    clues: [
      "Su marka de zapatillas deportivas es un ícono global de la moda urbana.",
      "Ganó seis anillos de campeonato con el equipo de los Chicago Bulls.",
      "Protagonizó la película animada 'Space Jam' junto a los Looney Tunes."
    ]
  },
  {
    name: "Serena Williams",
    filters: { region: "usa", area: "sports", nature: "real", era: "current" },
    birthYear: 1981,
    deathYear: null,
    country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Tenista estadounidense ganadora de 23 títulos de Grand Slam en individuales.",
    attributes: {
      hombre: false, mujer: true, vivo: true, muerto: false, real: true, ficticio: false,
      deportista: true, tenista: true, americana: true, estadounidense: true, negra: true,
      raqueta: true, fuerte: true, campeona: true, hermana: true
    },
    synonyms: ["serena", "serena williams", "williams"],
    clues: [
      "Su hermana mayor, Venus, también ha sido una tenista número uno del mundo.",
      "Tiene el récord de mayor cantidad de títulos individuales de Grand Slam en la era abierta (23).",
      "Su deporte se juega con raqueta sobre césped, arcilla o cemento."
    ]
  },
  {
    name: "Usain Bolt",
    filters: { region: "latam", area: "sports", nature: "real", era: "current" },
    birthYear: 1986,
    deathYear: null,
    country: "Jamaica",
    demonyms: ["jamaicano", "jamaicana", "jamaiquino", "jamaiquina", "caribeño", "caribeña"],
    description: "El hombre más rápido de la historia, atleta jamaicano de velocidad.",
    attributes: {
      hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false,
      deportista: true, atleta: true, velocista: true, jamaicano: true, negro: true,
      rapido: true, alto: true, records: true, rayo: true
    },
    synonyms: ["bolt", "usain bolt", "usain", "el rayo"],
    clues: [
      "Su pose de celebración imita a un relámpago o rayo apuntando al cielo.",
      "Es el hombre más rápido registrado en la historia de la humanidad (récord de 100m en 9.58s).",
      "Nació en Jamaica y dominó las pruebas de atletismo en Pekín 2008, Londres 2012 y Río 2016."
    ]
  },

  // --- MÚSICA / CINE ---
  {
    name: "Shakira",
    filters: { region: "latam", area: "music", nature: "real", era: "current" },
    birthYear: 1977,
    deathYear: null,
    country: "Colombia",
    demonyms: ["colombiano", "colombiana", "barranquillero", "barranquillera", "sudamericano", "sudamericana", "latinoamericano", "latinoamericana", "latino", "latina"],
    description: "Cantante y compositora colombiana, reina del pop latino conocida por su baile.",
    attributes: {
      hombre: false, mujer: true, vivo: true, muerto: false, real: true, ficticio: false,
      artista: true, cantante: true, colombiana: true, latina: true, sudamericana: true,
      rubia: true, bailarina: true, caderas: true, ex_pique: true, bilingue: true
    },
    synonyms: ["shakira", "shak", "shaki"],
    clues: [
      "Es conocida a nivel mundial por el control y movimiento de sus caderas.",
      "Es la autora del tema musical 'Waka Waka (This Time for Africa)' del Mundial 2010.",
      "Nació en Barranquilla, Colombia, y canta fluidamente tanto en español como en inglés."
    ]
  },
  {
    name: "Taylor Swift",
    filters: { region: "usa", area: "music", nature: "real", era: "current" },
    birthYear: 1989,
    deathYear: null,
    country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Cantante y compositora estadounidense de pop y country de escala global masiva.",
    attributes: {
      hombre: false, mujer: true, vivo: true, muerto: false, real: true, ficticio: false,
      artista: true, cantante: true, americana: true, estadounidense: true, rubia: true,
      alta: true, gatos: true, guitarras: true, joven: true, millonaria: true, swifties: true
    },
    synonyms: ["taylor", "taylor swift", "swift", "tay"],
    clues: [
      "Sus seguidores y fanáticos son conocidos como 'Swifties'.",
      "Su mega-gira 'The Eras Tour' se convirtió en la gira musical más lucrativa de todos los tiempos.",
      "Inició su carrera musical en Nashville cantando música Country y luego pasó al Pop."
    ]
  },
  {
    name: "Michael Jackson",
    filters: { region: "usa", area: "music", nature: "real", era: "historical" },
    birthYear: 1958,
    deathYear: 2009,
    country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "El Rey del Pop, famoso por Thriller, Billie Jean y su baile Moonwalk.",
    attributes: {
      hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false,
      artista: true, cantante: true, bailarin: true, americano: true, estadounidense: true,
      negro: true, blanco: true, cirugias: true, guante: true, sombrero: true, moonwalk: true
    },
    synonyms: ["michael jackson", "jackson", "rey del pop", "michael", "mj"],
    clues: [
      "Patentó un paso de baile en el que parece caminar hacia atrás simulando flotar (el Moonwalk).",
      "Su álbum de 1982 'Thriller' es el más vendido en la historia de la música.",
      "Es ampliamente aclamado y conocido en todo el planeta como el 'Rey del Pop'."
    ]
  },
  {
    name: "Freddie Mercury",
    filters: { region: "europa", area: "music", nature: "real", era: "historical" },
    birthYear: 1946,
    deathYear: 1991,
    country: "Reino Unido",
    demonyms: ["britanico", "britanica", "ingles", "inglesa", "europeo", "europea", "zanzibareño", "zanzibareña"],
    description: "Vocalista de la mítica banda británica Queen, con una voz inigualable.",
    attributes: {
      hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false,
      artista: true, cantante: true, musico: true, britanico: true, ingles: true, europeo: true,
      bigote: true, piano: true, queen: true, rock: true, SIDA: true, dientes: true
    },
    synonyms: ["freddie", "freddie mercury", "mercury", "queen"],
    clues: [
      "Su distintivo bigote y su vestimenta con chaqueta amarilla y pantalones blancos son legendarios.",
      "Fue el compositor principal y cantante líder del grupo de rock británico Queen.",
      "Su nombre de nacimiento era Farrokh Bulsara y compuso himnos de rock como 'Bohemian Rhapsody'."
    ]
  },
  {
    name: "Robert Downey Jr",
    filters: { region: "usa", area: "music", nature: "real", era: "current" },
    birthYear: 1965,
    deathYear: null,
    country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Actor estadounidense famoso por interpretar a Iron Man / Tony Stark.",
    attributes: {
      hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false,
      artista: true, actor: true, americano: true, estadounidense: true, ironman: true,
      marvel: true, barba: true, elegante: true, rehabilitado: true, oscar: true
    },
    synonyms: ["robert downey jr", "robert downey", "downey", "rdj", "iron man", "tony stark"],
    clues: [
      "Ganó su primer Premio Óscar interpretando a Lewis Strauss en la aclamada película 'Oppenheimer'.",
      "Inició el Universo Cinematográfico de Marvel como el multimillonario Tony Stark.",
      "También interpretó una versión muy popular del detective británico Sherlock Holmes en el cine."
    ]
  },
  {
    name: "Marilyn Monroe",
    filters: { region: "usa", area: "music", nature: "real", era: "historical" },
    birthYear: 1926,
    deathYear: 1962,
    country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Ícono pop y actriz estadounidense de la época dorada de Hollywood.",
    attributes: {
      hombre: false, mujer: true, vivo: false, muerto: true, real: true, ficticio: false,
      artista: true, actriz: true, modelo: true, americana: true, estadounidense: true,
      rubia: true, bella: true, modelo_sensual: true, vestido_blanco: true, triste: true
    },
    synonyms: ["marilyn", "marilyn monroe", "monroe"],
    clues: [
      "Nació bajo el nombre de Norma Jeane Mortenson.",
      "Su imagen con un vestido blanco flotando sobre una rejilla de ventilación del metro es uno de los mayores íconos pop.",
      "Fue la estrella más brillante del cine de Hollywood en los años 50 y cantó 'Happy Birthday Mr. President' a JFK."
    ]
  },

  // --- CIENCIA Y TECNOLOGÍA ---
  {
    name: "Albert Einstein",
    filters: { region: "europa", area: "science", nature: "real", era: "historical" },
    birthYear: 1879,
    deathYear: 1955,
    country: "Alemania",
    demonyms: ["aleman", "alemana", "europeo", "europea", "judio", "judia"],
    description: "Físico teórico alemán, autor de la teoría de la relatividad general (E=mc²).",
    attributes: {
      hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false,
      cientifico: true, fisico: true, aleman: true, judio: true, europeo: true,
      inteligente: true, bigote: true, pelo_despeinado: true, relatividad: true, nobel: true,
      lengua: true
    },
    synonyms: ["einstein", "albert einstein", "albert"],
    clues: [
      "Su retrato más famoso e informal lo muestra sacándole la lengua a los fotógrafos.",
      "Formuló la ecuación más conocida de la física sobre la equivalencia de masa y energía: E=mc².",
      "Es el físico teórico alemán que desarrolló la revolucionaria Teoría de la Relatividad."
    ]
  },
  {
    name: "Marie Curie",
    filters: { region: "europa", area: "science", nature: "real", era: "historical" },
    birthYear: 1867,
    deathYear: 1934,
    country: "Polonia",
    demonyms: ["polaco", "polaca", "frances", "francesa", "europeo", "europea"],
    description: "Científica polaca-francesa, pionera en radiactividad y ganadora de dos Premios Nobel.",
    attributes: {
      hombre: false, mujer: true, vivo: false, muerto: true, real: true, ficticio: false,
      cientifica: true, quimica: true, fisica: true, polaca: true, francesa: true, europea: true,
      radiactividad: true, nobel: true, inteligente: true, radiacion: true
    },
    synonyms: ["marie curie", "curie", "madame curie", "maria salomea"],
    clues: [
      "Sus cuadernos de notas originales siguen siendo tan radiactivos que deben guardarse en cajas de plomo.",
      "Fue la primera mujer en ganar un Premio Nobel y la única persona en ganarlo en dos especialidades científicas distintas (Física y Química).",
      "Nació en Varsovia, Polonia, y acuñó el término 'radiactividad' tras descubrir los elementos Polonio y Radio."
    ]
  },
  {
    name: "Steve Jobs",
    filters: { region: "usa", area: "science", nature: "real", era: "historical" },
    birthYear: 1955,
    deathYear: 2011,
    country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Cofundador de Apple, visionario de la tecnología móvil y la computación personal.",
    attributes: {
      hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false,
      tecnologia: true, inventor: true, empresario: true, americano: true, estadounidense: true,
      apple: true, iphone: true, mac: true, anteojos: true, sueter_negro: true, calvo: true, genio: true
    },
    synonyms: ["steve jobs", "jobs", "steve"],
    clues: [
      "Su atuendo emblemático consistía en un suéter negro de cuello alto, jeans azules y zapatillas grises.",
      "Fue el cofundador de Apple que presentó el primer iPhone al mundo en 2007.",
      "Fue despedido de su propia compañía en 1985, fundó NeXT y compró el estudio que luego se convirtió en Pixar."
    ]
  },
  {
    name: "Elon Musk",
    filters: { region: "usa", area: "science", nature: "real", era: "current" },
    birthYear: 1971,
    deathYear: null,
    country: "Estados Unidos", // Nació en Sudáfrica pero opera en USA y tiene nacionalidad
    demonyms: ["sudafricano", "sudafricana", "estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Magnate tecnológico, fundador de SpaceX, CEO de Tesla y dueño de X (Twitter).",
    attributes: {
      hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false,
      tecnologia: true, empresario: true, millonario: true, americano: true, sudafricano: true,
      tesla: true, spacex: true, twitter: true, x: true, cohetes: true, polemico: true, rico: true
    },
    synonyms: ["elon", "musk", "elon musk"],
    clues: [
      "Su objetivo a largo plazo es llevar a la humanidad a colonizar el planeta Marte.",
      "Adquirió la red social Twitter por 44 mil millones de dólares y cambió su logo azul por una letra 'X'.",
      "Nació en Sudáfrica y lidera las compañías aeroespaciales SpaceX y automotrices Tesla."
    ]
  },
  {
    name: "Stephen Hawking",
    filters: { region: "europa", area: "science", nature: "real", era: "historical" },
    birthYear: 1942,
    deathYear: 2018,
    country: "Reino Unido",
    demonyms: ["britanico", "britanica", "ingles", "inglesa", "europeo", "europea"],
    description: "Físico teórico británico conocido por sus estudios sobre los agujeros negros y la ELA.",
    attributes: {
      hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false,
      cientifico: true, fisico: true, cosmologo: true, britanico: true, ingles: true, europeo: true,
      silla_de_ruedas: true, parálisis: true, voz_computadora: true, agujeros_negros: true, inteligente: true
    },
    synonyms: ["hawking", "stephen hawking", "stephen"],
    clues: [
      "Escribió el best-seller de divulgación científica 'Breve historia del tiempo'.",
      "Fue un físico teórico inglés que teorizó que los agujeros negros emiten radiación térmica.",
      "Padeció de ELA (esclerosis lateral amiotrófica), lo que lo obligó a usar una icónica silla de ruedas con sintetizador de voz."
    ]
  },
  {
    name: "Nikola Tesla",
    filters: { region: "europa", area: "science", nature: "real", era: "historical" },
    birthYear: 1856,
    deathYear: 1943,
    country: "Croacia", // Imperio Austríaco, hoy Croacia. Origen serbio.
    demonyms: ["serbio", "serbia", "croata", "austriaco", "austriaca", "europeo", "europea"],
    description: "Inventor e ingeniero serbocroata, pionero del electromagnetismo y la corriente alterna.",
    attributes: {
      hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false,
      cientifico: true, inventor: true, fisico: true, serbio: true, croata: true, europeo: true,
      electricity: true, corriente_alterna: true, bobina: true, palomas: true, pobre: true, bigote: true
    },
    synonyms: ["tesla", "nikola tesla", "nikola"],
    clues: [
      "Mantenía una famosa obsesión y afecto por las palomas callejeras en su vejez en Nueva York.",
      "Fue el gran rival de Thomas Alva Edison en la histórica 'Guerra de las Corrientes'.",
      "Es el inventor de origen serbio que diseñó el motor de inducción y el sistema de corriente alterna para la electricidad."
    ]
  },

  // --- HISTORIA Y POLÍTICA ---
  {
    name: "Cleopatra",
    filters: { region: "asia_africa", area: "history", nature: "real", era: "historical" },
    birthYear: -69,
    deathYear: -30,
    country: "Egipto",
    demonyms: ["egipcio", "egipcia", "africano", "africana", "griego", "griega"],
    description: "Última gobernante de la dinastía ptolemaica del Antiguo Egipto, famosa por su belleza y astucia.",
    attributes: {
      hombre: false, mujer: true, vivo: false, muerto: true, real: true, ficticio: false,
      reina: true, gobernante: true, egipcia: true, africana: true, antigua: true,
      bella: true, serpiente: true, julio_cesar: true, roma: true
    },
    synonyms: ["cleopatra", "cleopatra vii"],
    clues: [
      "La leyenda cuenta que murió provocando que una cobra egipcia (áspid) la mordiera.",
      "Mantuvo célebres relaciones políticas y amorosas con los líderes romanos Julio César y Marco Antonio.",
      "Fue la última reina soberana de la dinastía ptolemaica en el Antiguo Egipto."
    ]
  },
  {
    name: "Julio César",
    filters: { region: "europa", area: "history", nature: "real", era: "historical" },
    birthYear: -100,
    deathYear: -44,
    country: "Italia", // Antigua Roma, hoy Italia
    demonyms: ["romano", "romana", "italiano", "italiana", "europeo", "europea"],
    description: "Líder militar y político romano de la República tardía, autoproclamado dictador vitalicio.",
    attributes: {
      hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false,
      militar: true, politico: true, emperador: false, romano: true, europeo: true, antiguo: true,
      traicionado: true, asesinato: true, laurel: true, toga: true
    },
    synonyms: ["julio cesar", "cesar", "julius caesar"],
    clues: [
      "Pronunció la famosa frase 'Alea iacta est' (La suerte está echada) al cruzar el río Rubicón.",
      "Murió trágicamente tras ser apuñalado 23 veces en el Senado romano por sus propios colegas en los Idus de Marzo.",
      "Fue el militar y dictador de la República de Roma que conquistó las Galias y cuyo nombre bautizó el mes de julio."
    ]
  },
  {
    name: "Abraham Lincoln",
    filters: { region: "usa", area: "history", nature: "real", era: "historical" },
    birthYear: 1809,
    deathYear: 1865,
    country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Presidente de EE. UU. que abolió la esclavitud y lideró el país durante la Guerra de Secesión.",
    attributes: {
      hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false,
      politico: true, presidente: true, americano: true, estadounidense: true,
      esclavitud: true, guerra_civil: true, sombrero_alto: true, barba: true, alto: true, asesinado: true
    },
    synonyms: ["lincoln", "abraham lincoln", "abe lincoln"],
    clues: [
      "Era conocido por su elevada estatura y su sombrero de copa de seda negro extra alto.",
      "Lideró a los Estados Unidos durante su sangrienta Guerra Civil (Guerra de Secesión).",
      "Fue el 16º presidente de EE. UU., firmó la abolición de la esclavitud y fue asesinado en el Teatro Ford."
    ]
  },
  {
    name: "Simón Bolívar",
    filters: { region: "latam", area: "history", nature: "real", era: "historical" },
    birthYear: 1783,
    deathYear: 1830,
    country: "Venezuela",
    demonyms: ["venezolano", "venezolana", "sudamericano", "sudamericana", "latinoamericano", "latinoamericana", "latino", "latina"],
    description: "Militar y político venezolano, prócer de la independencia de múltiples naciones sudamericanas.",
    attributes: {
      hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false,
      militar: true, politico: true, libertador: true, venezolano: true, latino: true, sudamericano: true,
      espada: true, caballo: true, independencia: true, uniforme: true
    },
    synonyms: ["bolivar", "simon bolivar", "el libertador"],
    clues: [
      "La moneda oficial de Venezuela lleva su apellido.",
      "Soñó con unificar América del Sur bajo una sola gran nación llamada 'La Gran Colombia'.",
      "Es el militar de origen caraqueño conocido en América Latina como 'El Libertador'."
    ]
  },
  {
    name: "Napoleon Bonaparte",
    filters: { region: "europa", area: "history", nature: "real", era: "historical" },
    birthYear: 1769,
    deathYear: 1821,
    country: "Francia",
    demonyms: ["frances", "francesa", "corso", "corsa", "europeo", "europea"],
    description: "Militar y emperador francés, conquistador de gran parte de Europa a inicios del siglo XIX.",
    attributes: {
      hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false,
      militar: true, emperador: true, frances: true, europeo: true,
      bajo: true, mano_en_chaleco: true, sombrero: true, destierro: true, conquista: true
    },
    synonyms: ["napoleon", "napoleon bonaparte", "bonaparte"],
    clues: [
      "Es retratado popularmente con su sombrero de dos picos horizontal y su mano derecha metida en el chaleco.",
      "Sufrió una derrota militar catastrófica y final en la Batalla de Waterloo.",
      "Fue un genio militar corso que se autocoronó Emperador de Francia y conquistó gran parte de Europa."
    ]
  },
  {
    name: "Mahatma Gandhi",
    filters: { region: "asia_africa", area: "history", nature: "real", era: "historical" },
    birthYear: 1869,
    deathYear: 1948,
    country: "India",
    demonyms: ["indio", "india", "hindu", "asiatico", "asiatica"],
    description: "Líder pacifista indio que dirigió la independencia de la India mediante la no violencia.",
    attributes: {
      hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false,
      politico: true, pacifista: true, indio: true, asiatico: true,
      calvo: true, anteojos: true, sabio: true, no_violencia: true, asesinado: true, delgado: true, tunica: true
    },
    synonyms: ["gandhi", "mahatma gandhi", "mahatma"],
    clues: [
      "Lideró la famosa 'Marcha de la Sal' en 1930 para protestar de forma pacífica contra los monopolios británicos.",
      "Vestía únicamente con una tela blanca tejida por él mismo llamada dhoti y sandalias sencillas.",
      "Fue el abogado y pensador indio pionero del principio de la 'Satyagraha' (resistencia pacífica y no violenta)."
    ]
  },

  // --- PERSONAJES FICTICIOS ---
  {
    name: "Harry Potter",
    filters: { region: "europa", area: "fiction", nature: "fictional", era: "current" },
    birthYear: 1980,
    deathYear: null,
    country: "Reino Unido",
    demonyms: ["ingles", "inglesa", "britanico", "britanica", "europeo", "europea"],
    description: "Mago huérfano protagonista de una famosa saga de libros y películas escrita por J.K. Rowling.",
    attributes: {
      hombre: true, mujer: false, vivo: true, muerto: false, real: false, ficticio: true,
      mago: true, magia: true, britanico: true, ingles: true, europeo: true, cicatriz: true,
      lentes: true, anteojos: true, varita: true, lechuza: true, rayo: true, gryffindor: true, joven: true
    },
    synonyms: ["harry potter", "harry", "potter", "el niño que sobrevivio"],
    clues: [
      "Su mascota favorita es una lechuza blanca llamada Hedwig.",
      "Estudió hechicería en el Colegio Hogwarts y pertenece a la casa Gryffindor.",
      "Tiene una distintiva cicatriz roja en forma de rayo en la frente debido a un hechizo de Lord Voldemort."
    ]
  },
  {
    name: "Batman",
    filters: { region: "usa", area: "fiction", nature: "fictional", era: "current" },
    birthYear: 1939,
    deathYear: null,
    country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana", "gothamita"],
    description: "Superhéroe de DC Comics, protector de Gotham City, cuya identidad es Bruce Wayne.",
    attributes: {
      hombre: true, mujer: false, vivo: true, muerto: false, real: false, ficticio: true,
      superheroe: true, murcielago: true, rico: true, millonario: true, negro: true, capa: true,
      mascara: true, gotham: true, huerfano: true, artes_marciales: true, detective: true
    },
    synonyms: ["batman", "bruce wayne", "bruno diaz", "caballero de la noche", "caballero oscuro"],
    clues: [
      "Perdió a sus padres en un callejón y juró venganza entrenando al límite de la capacidad humana.",
      "Su base secreta se encuentra oculta bajo la mansión familiar de la familia Wayne.",
      "Es el alter ego de Bruce Wayne, un millonario que viste de murciélago para patrullar Gotham."
    ]
  },
  {
    name: "Spider-Man",
    filters: { region: "usa", area: "fiction", nature: "fictional", era: "current" },
    birthYear: 1962,
    deathYear: null,
    country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana", "neoyorquino", "neoyorquina"],
    description: "Superhéroe de Marvel, picado por una araña radiactiva, cuya identidad es Peter Parker.",
    attributes: {
      hombre: true, mujer: false, vivo: true, muerto: false, real: false, ficticio: true,
      superheroe: true, araña: true, rojo: true, azul: true, telaraña: true, joven: true,
      pobre: true, fotografo: true, picadura: true, Nueva_York: true, tio_ben: true
    },
    synonyms: ["spiderman", "spider-man", "peter parker", "el hombre araña", "hombre araña", "spidey"],
    clues: [
      "Combate el crime trepando paredes y balanceándose por los rascacielos de Nueva York usando telarañas.",
      "Fue criado por sus tíos Ben y May tras quedar huérfano.",
      "Su identidad civil es Peter Parker, un joven fotógrafo picado por una araña radiactiva."
    ]
  },
  {
    name: "Sherlock Holmes",
    filters: { region: "europa", area: "fiction", nature: "fictional", era: "historical" },
    birthYear: 1854,
    deathYear: null,
    country: "Reino Unido",
    demonyms: ["ingles", "inglesa", "britanico", "britanica", "europeo", "europea"],
    description: "El detective consultor más famoso de la literatura, creado por Arthur Conan Doyle.",
    attributes: {
      hombre: true, mujer: false, vivo: false, muerto: true, real: false, ficticio: true,
      detective: true, britanico: true, ingles: true, europeo: true, antiguo: true,
      pipa: true, lupa: true, inteligente: true, watson: true, sombrero_cazador: true, violin: true
    },
    synonyms: ["sherlock holmes", "sherlock", "holmes"],
    clues: [
      "Utiliza una lupa para analizar huellas y fuma tabaco en una pipa de calabaza.",
      "Su residencia se encuentra en el 221B de Baker Street en Londres, la cual comparte con el Dr. John Watson.",
      "Es el detective literario victoriano que utiliza el método de la deducción lógica para resolver crímenes."
    ]
  },
  {
    name: "Don Quijote de la Mancha",
    filters: { region: "europa", area: "fiction", nature: "fictional", era: "historical" },
    birthYear: 1605,
    deathYear: null,
    country: "España",
    demonyms: ["español", "española", "manchego", "manchega", "europeo", "europea"],
    description: "Caballero andante de la célebre novela de Miguel de Cervantes, famoso por su locura.",
    attributes: {
      hombre: true, mujer: false, vivo: false, muerto: true, real: false, ficticio: true,
      caballero: true, español: true, europeo: true, antiguo: true, loco: true,
      molinos: true, caballo: true, rocinante: true, sancho: true, armadura: true, flaco: true, lanza: true
    },
    synonyms: ["don quijote", "quijote", "don quijote de la mancha", "el caballero de la triste figura"],
    clues: [
      "Su montura es un caballo desgarbado llamado Rocinante.",
      "Se volvió loco leyendo libros de caballería e inició un viaje acompañado de su escudero Sancho Panza.",
      "Es el protagonista de la obra cumbre de la literatura española escrita por Miguel de Cervantes."
    ]
  },
  {
    name: "Homero Simpson",
    filters: { region: "usa", area: "fiction", nature: "fictional", era: "current" },
    birthYear: 1956,
    deathYear: null,
    country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana", "springfieldiano", "springfieldiana"],
    description: "Padre de la familia Simpson, amante de las rosquillas y la cerveza Duff.",
    attributes: {
      hombre: true, mujer: false, vivo: true, muerto: false, real: false, ficticio: true,
      dibujo: true, animado: true, amarillo: true, gordo: true, calvo: true, tonto: true,
      cerveza: true, rosquilla: true, planta_nuclear: true, casado: true, hijos: true
    },
    synonyms: ["homero", "homer", "homero simpson", "homer simpson"],
    clues: [
      "Su exclamación característica ante un error propio es el famoso ¡D'oh! (traducido como ¡Ouch!).",
      "Es calvo, amarillo, le encantan las donas/rosquillas y trabaja como inspector de seguridad nuclear.",
      "Es el patriarca de la familia de caricaturas más famosa de la televisión de EE.UU., casado con Marge."
    ]
  },
  {
    name: "Goku",
    filters: { region: "asia_africa", area: "fiction", nature: "fictional", era: "current" },
    birthYear: 737,
    deathYear: null,
    country: "Planeta Vegeta",
    demonyms: ["saiyajin", "alienigena", "extraterrestre", "japones", "japonesa", "asiatico", "asiatica"],
    description: "Guerrero saiyajin de la serie Dragon Ball, protector de la Tierra.",
    attributes: {
      hombre: true, mujer: false, vivo: true, muerto: false, real: false, ficticio: true,
      dibujo: true, anime: true, japones: true, asiatico: true, alienigena: true, saiyajin: true,
      fuerte: true, pelo_parado: true, artes_marciales: true, nube: true, cola: true, mono: true
    },
    synonyms: ["goku", "son goku", "kakaroto", "gokuh"],
    clues: [
      "Puede transformarse en una forma legendaria con cabello dorado erizado conocida como Súper Saiyajin.",
      "Fue enviado a la Tierra de bebé desde el planeta Vegeta con el nombre natal de Kakaroto.",
      "Es el protagonista de anime creado por Akira Toriyama que busca recolectar las Esferas del Dragón."
    ]
  },
  {
    name: "Darth Vader",
    filters: { region: "usa", area: "fiction", nature: "fictional", era: "current" },
    birthYear: 1977,
    deathYear: 1983,
    country: "Tatooine",
    demonyms: ["tatooinense", "sith", "espacial", "alienigena", "extraterrestre"],
    description: "Señor Oscuro de los Sith en la saga Star Wars, originalmente Anakin Skywalker.",
    attributes: {
      hombre: true, mujer: false, vivo: false, muerto: true, real: false, ficticio: true,
      malo: true, villano: true, espacio: true, espada_laser: true, negro: true, mascara: true,
      fuerza: true, casco: true, respiracion: true, padre: true, robot: true
    },
    synonyms: ["darth vader", "vader", "anakin skywalker", "anakin", "lord vader"],
    clues: [
      "Viste una armadura negra con un casco hermético y produce un característico sonido de respiración mecánica.",
      "Le revela al protagonista Luke Skywalker una de las verdades familiares más famosas del cine: 'Yo soy tu padre'.",
      "Fue un Caballero Jedi llamado Anakin Skywalker antes de pasarse al Lado Oscuro de la Fuerza en Star Wars."
    ]
  },
  {
    name: "Barbie",
    filters: { region: "usa", area: "fiction", nature: "fictional", era: "current" },
    birthYear: 1959,
    deathYear: null,
    country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Muñeca de moda de fama mundial de Mattel, protagonista de múltiples películas.",
    attributes: {
      hombre: false, mujer: true, vivo: true, muerto: false, real: false, ficticio: true,
      muñeca: true, juguete: true, rubia: true, rosa: true, rosado: true, estadounidense: true,
      bella: true, novio_ken: true, muchas_profesiones: true
    },
    synonyms: ["barbie", "barby", "muñeca barbie"],
    clues: [
      "Su novio de toda la vida es un muñeco llamado Ken.",
      "Tiene un convertible y su color de identidad corporativa y estética es el rosa brillante.",
      "Es la muñeca de juguete de plástico más vendida del mundo, creada por Ruth Handler para Mattel."
    ]
  }
];

// Hacer disponible la base de datos globalmente si estamos en navegador
if (typeof window !== 'undefined') {
  window.CHARACTERS = CHARACTERS;
}
// Exportar para Node si es necesario
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CHARACTERS };
}
