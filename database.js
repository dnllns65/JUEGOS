// Base de datos de personajes famosos para AdivinaQuién AI
// Contiene 100 personajes famosos con año de nacimiento, año de fallecimiento (null si está vivo), país, gentilicios y pistas.
const CHARACTERS = [
  // ==========================================
  // --- DEPORTES (1-20) ---
  // ==========================================
  {
    name: "Lionel Messi",
    filters: { region: "latam", area: "sports", nature: "real", era: "current" },
    birthYear: 1987, deathYear: null, country: "Argentina",
    demonyms: ["argentino", "argentina", "rosarino", "rosarina", "sudamericano", "sudamericana", "latinoamericano", "latinoamericana", "latino", "latina"],
    description: "Futbolista argentino, campeón del mundo y múltiple ganador del Balón de Oro.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false, deportista: true, futbolista: true, argentino: true, latino: true, sudamericano: true },
    synonyms: ["messi", "lio messi", "lionel messi", "la pulga", "pulga", "lionel"],
    clues: ["Su dorsal de camiseta más icónico es el número 10.", "Desarrolló la mayor parte de su carrera profesional en el F.C. Barcelona.", "Nació en Rosario, Argentina, y levantó la copa de campeón del mundo en Catar 2022."]
  },
  {
    name: "Cristiano Ronaldo",
    filters: { region: "europa", area: "sports", nature: "real", era: "current" },
    birthYear: 1985, deathYear: null, country: "Portugal",
    demonyms: ["portugues", "portuguesa", "europeo", "europea"],
    description: "Futbolista portugués conocido por su potencia física y gran cantidad de goles.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false, deportista: true, futbolista: true, portugues: true, europeo: true, latino: false },
    synonyms: ["cristiano", "cr7", "ronaldo", "cristiano ronaldo", "el bicho", "bicho", "penaldo"],
    clues: ["Es apodado mundialmente por una combinación de sus iniciales y su número de camiseta.", "Es el máximo goleador histórico del Real Madrid y de la selección de Portugal.", "Nació en la isla de Madeira y actualmente juega en el club Al-Nassr de Arabia Saudita."]
  },
  {
    name: "Diego Maradona",
    filters: { region: "latam", area: "sports", nature: "real", era: "historical" },
    birthYear: 1960, deathYear: 2020, country: "Argentina",
    demonyms: ["argentino", "argentina", "sudamericano", "sudamericana", "latinoamericano", "latinoamericana", "latino", "latina"],
    description: "Leyenda del fútbol argentino, famoso por su gol 'la mano de Dios' y el Gol del Siglo.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, deportista: true, futbolista: true, argentino: true, latino: true, sudamericano: true },
    synonyms: ["maradona", "diego", "diego maradona", "el pelusa", "pelusa", "el diez", "dios"],
    clues: ["Su apodo de la infancia es 'El Pelusa'.", "Es considerado una deidad futbolística en Argentina y en la ciudad de Nápoles, Italia.", "Es el autor de dos de los goles más famosos de la historia del fútbol (ambos a Inglaterra en 1986)."]
  },
  {
    name: "Michael Jordan",
    filters: { region: "usa", area: "sports", nature: "real", era: "historical" },
    birthYear: 1963, deathYear: null, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Considerado el mejor jugador de baloncesto de todos los tiempos, figura de los Chicago Bulls.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false, deportista: true, basquetbolista: true, americano: true, estadounidense: true },
    synonyms: ["jordan", "michael jordan", "air jordan", "mj"],
    clues: ["Su marca de zapatillas deportivas es un ícono global de la moda urbana.", "Ganó seis anillos de campeonato con el equipo de los Chicago Bulls.", "Protagonizó la película animada 'Space Jam' junto a los Looney Tunes."]
  },
  {
    name: "Serena Williams",
    filters: { region: "usa", area: "sports", nature: "real", era: "current" },
    birthYear: 1981, deathYear: null, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Tenista estadounidense ganadora de 23 títulos de Grand Slam en individuales.",
    attributes: { hombre: false, mujer: true, vivo: true, muerto: false, real: true, ficticio: false, deportista: true, tenista: true, americana: true, estadounidense: true },
    synonyms: ["serena", "serena williams", "williams"],
    clues: ["Su hermana mayor, Venus, también ha sido una tenista número uno del mundo.", "Tiene el récord de mayor cantidad de títulos individuales de Grand Slam en la era abierta (23).", "Su deporte se juega con raqueta sobre césped, arcilla o cemento."]
  },
  {
    name: "Usain Bolt",
    filters: { region: "latam", area: "sports", nature: "real", era: "current" },
    birthYear: 1986, deathYear: null, country: "Jamaica",
    demonyms: ["jamaicano", "jamaicana", "jamaiquino", "jamaiquina", "caribeño", "caribeña"],
    description: "El hombre más rápido de la historia, atleta jamaicano de velocidad.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false, deportista: true, atleta: true, velocista: true, jamaicano: true },
    synonyms: ["bolt", "usain bolt", "usain", "el rayo"],
    clues: ["Su pose de celebración imita a un relámpago o rayo apuntando al cielo.", "Es el hombre más rápido registrado en la historia de la humanidad (récord de 100m en 9.58s).", "Nació en Jamaica y dominó las pruebas de atletismo en Pekín 2008, Londres 2012 y Río 2016."]
  },
  {
    name: "Pelé",
    filters: { region: "latam", area: "sports", nature: "real", era: "historical" },
    birthYear: 1940, deathYear: 2022, country: "Brasil",
    demonyms: ["brasileño", "brasileña", "brasilero", "brasilera", "sudamericano", "sudamericana", "latinoamericano", "latino"],
    description: "Histórico futbolista brasileño, considerado uno de los mejores de todos los tiempos y tricampeón mundial.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, deportista: true, futbolista: true, brasileño: true, latino: true, sudamericano: true },
    synonyms: ["pele", "edson arantes", "edson arantes do nascimento", "o rei", "el rey pele"],
    clues: ["Es conocido mundialmente como 'O Rei' (El Rey).", "Es el único futbolista en la historia que ha ganado tres Copas del Mundo (1958, 1962, 1970).", "Pasó casi toda su carrera profesional en el club Santos de su país natal."]
  },
  {
    name: "Muhammad Ali",
    filters: { region: "usa", area: "sports", nature: "real", era: "historical" },
    birthYear: 1942, deathYear: 2016, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Legendario boxeador estadounidense de peso pesado, activista social y figura cultural global.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, deportista: true, boxeador: true, americano: true, estadounidense: true },
    synonyms: ["muhammad ali", "mohamed ali", "ali", "cassius clay"],
    clues: ["Su lema más famoso era: 'Flota como una mariposa, pica como una abeja'.", "Nació bajo el nombre de Cassius Clay y cambió su nombre tras convertirse al Islam.", "Ganó la medalla de oro olímpica en Roma 1960 y fue tres veces campeón mundial de peso pesado."]
  },
  {
    name: "Roger Federer",
    filters: { region: "europa", area: "sports", nature: "real", era: "current" },
    birthYear: 1981, deathYear: null, country: "Suiza",
    demonyms: ["suizo", "suiza", "europeo", "europea"],
    description: "Tenista suizo, célebre por su técnica elegante y dominio del deporte durante décadas.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false, deportista: true, tenista: true, suizo: true, europeo: true },
    synonyms: ["federer", "roger federer", "su majestad", "el expreso suizo"],
    clues: ["Se le apoda 'Su Majestad' debido a su elegancia suprema dentro de la cancha.", "Es el tenista masculino con más títulos ganados en el torneo de Wimbledon (8 títulos).", "Nació en Basilea, Suiza, y mantuvo una legendaria rivalidad con Rafael Nadal y Novak Djokovic."]
  },
  {
    name: "Rafael Nadal",
    filters: { region: "europa", area: "sports", nature: "real", era: "current" },
    birthYear: 1986, deathYear: null, country: "España",
    demonyms: ["español", "española", "mallorquin", "europeo", "europea"],
    description: "Tenista español considerado el mejor de todos los tiempos en canchas de tierra batida.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false, deportista: true, tenista: true, español: true, europeo: true, zurdo: true },
    synonyms: ["nadal", "rafael nadal", "rafa", "el rey de la arcilla"],
    clues: ["Es conocido como 'El Rey de la Arcilla' por su absoluto dominio en superficies de tierra batida.", "Es zurdo al jugar al tenis (aunque escribe con la mano derecha) y destaca por su increíble garra física.", "Ganó la increíble cantidad de 14 títulos individuales del torneo de Roland Garros en Francia."]
  },
  {
    name: "Michael Phelps",
    filters: { region: "usa", area: "sports", nature: "real", era: "current" },
    birthYear: 1985, deathYear: null, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Nadador estadounidense, el atleta olímpico más condecorado de todos los tiempos.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false, deportista: true, nadador: true, americano: true, estadounidense: true },
    synonyms: ["phelps", "michael phelps", "el tiburon de baltimore"],
    clues: ["Es conocido como 'El Tiburón de Baltimore'.", "Tiene el récord absoluto de más medallas de oro olímpicas ganadas (23 medallas de oro).", "Su deporte se practica en una piscina olímpica, destacando en estilo mariposa y libre."]
  },
  {
    name: "Lewis Hamilton",
    filters: { region: "europa", area: "sports", nature: "real", era: "current" },
    birthYear: 1985, deathYear: null, country: "Reino Unido",
    demonyms: ["britanico", "britanica", "ingles", "inglesa", "europeo", "europea"],
    description: "Piloto británico de Fórmula 1, poseedor de múltiples récords mundiales en la máxima categoría del automovilismo.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false, deportista: true, piloto: true, automovilista: true, ingles: true, britanico: true },
    synonyms: ["hamilton", "lewis hamilton", "sir lewis hamilton"],
    clues: ["Es el único piloto negro en competir e intentar ganar campeonatos de la Fórmula 1.", "Comparte el récord histórico de más campeonatos mundiales de Fórmula 1 ganados (7 títulos, empatado con Michael Schumacher).", "Condujo coches históricos para los equipos McLaren y Mercedes."]
  },
  {
    name: "Ayrton Senna",
    filters: { region: "latam", area: "sports", nature: "real", era: "historical" },
    birthYear: 1960, deathYear: 1994, country: "Brasil",
    demonyms: ["brasileño", "brasileña", "brasilero", "brasilera", "sudamericano", "sudamericana", "latinoamericano", "latino"],
    description: "Legendario piloto brasileño de Fórmula 1, tricampeón mundial fallecido trágicamente en competencia.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, deportista: true, piloto: true, automovilista: true, brasileño: true, latino: true },
    synonyms: ["senna", "ayrton senna", "ayrton senna da silva"],
    clues: ["Era considerado el rey absoluto bajo la lluvia debido a su increíble control de tracción en pistas mojadas.", "Ganó tres campeonatos mundiales de Fórmula 1 pilotando para el equipo McLaren-Honda.", "Falleció trágicamente en un accidente durante el Gran Premio de San Marino de 1994 en Imola."]
  },
  {
    name: "Diego Forlán",
    filters: { region: "latam", area: "sports", nature: "real", era: "historical" },
    birthYear: 1979, deathYear: null, country: "Uruguay",
    demonyms: ["uruguayo", "uruguaya", "sudamericano", "sudamericana", "latinoamericano", "latino"],
    description: "Futbolista uruguayo, mejor jugador y goleador del Mundial de Sudáfrica 2010.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false, deportista: true, futbolista: true, uruguayo: true, latino: true, sudamericano: true },
    synonyms: ["forlan", "diego forlan", "cachavacha"],
    clues: ["Su apodo de toda la vida es 'Cachavacha'.", "Ganó el Balón de Oro al mejor jugador en el Mundial de Sudáfrica 2010.", "Brilló en clubes europeos como el Villarreal y el Atlético de Madrid."]
  },
  {
    name: "Zinédine Zidane",
    filters: { region: "europa", area: "sports", nature: "real", era: "historical" },
    birthYear: 1972, deathYear: null, country: "Francia",
    demonyms: ["frances", "francesa", "europeo", "europea"],
    description: "Futbolista y entrenador francés de renombre mundial, campeón del mundo en 1998.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false, deportista: true, futbolista: true, frances: true, europeo: true },
    synonyms: ["zidane", "zinedine zidane", "zizou"],
    clues: ["Su apodo cariñoso es 'Zizou'.", "Marcó un gol histórico de volea en la final de la Champions League de 2002 con el Real Madrid.", "Su último partido profesional terminó polémicamente al ser expulsado por darle un cabezazo a Materazzi en la final del Mundial 2006."]
  },
  {
    name: "LeBron James",
    filters: { region: "usa", area: "sports", nature: "real", era: "current" },
    birthYear: 1984, deathYear: null, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Estrella del baloncesto estadounidense, máximo anotador histórico de la NBA.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false, deportista: true, basquetbolista: true, americano: true, estadounidense: true },
    synonyms: ["lebron", "lebron james", "king james", "james"],
    clues: ["Es apodado 'The King' (El Rey) y utiliza la corona como su marca personal.", "Es el máximo anotador histórico de la NBA, superando a Kareem Abdul-Jabbar.", "Ha ganado campeonatos de la NBA con Miami Heat, Cleveland Cavaliers y Los Angeles Lakers."]
  },
  {
    name: "Stephen Curry",
    filters: { region: "usa", area: "sports", nature: "real", era: "current" },
    birthYear: 1988, deathYear: null, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Baloncestista estadounidense, considerado el mejor tirador de triples de la historia de la NBA.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false, deportista: true, basquetbolista: true, americano: true, estadounidense: true },
    synonyms: ["curry", "stephen curry", "steph curry"],
    clues: ["Es considerado unánimemente el mejor lanzador de tres puntos (triples) en la historia del baloncesto.", "Lideró la dinastía de los Golden State Warriors ganando 4 anillos de la NBA.", "Su padre Dell y su hermano Seth también jugaron baloncesto en la NBA."]
  },
  {
    name: "Ronaldinho",
    filters: { region: "latam", area: "sports", nature: "real", era: "historical" },
    birthYear: 1980, deathYear: null, country: "Brasil",
    demonyms: ["brasileño", "brasileña", "brasilero", "brasilera", "sudamericano", "sudamericana", "latinoamericano", "latino"],
    description: "Exfutbolista brasileño célebre por su magia con el balón, sonrisa característica y títulos mundiales.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false, deportista: true, futbolista: true, brasileño: true, latino: true, sudamericano: true },
    synonyms: ["ronaldinho", "ronaldinho gaucho", "ronaldo de assis moreira"],
    clues: ["Es famoso por jugar siempre con una sonrisa carismática en su rostro y por su estilo de juego de fantasía ('Joga Bonito').", "Ganó el Balón de Oro en 2005 y la Copa del Mundo en 2002 con la selección de Brasil.", "Es recordado por ser ovacionado por la afición del Real Madrid en el Santiago Bernabéu vistiendo la camiseta del F.C. Barcelona."]
  },
  {
    name: "Zico",
    filters: { region: "latam", area: "sports", nature: "real", era: "historical" },
    birthYear: 1953, deathYear: null, country: "Brasil",
    demonyms: ["brasileño", "brasileña", "brasilero", "brasilera", "sudamericano", "sudamericana", "latinoamericano", "latino"],
    description: "Legendario futbolista brasileño, conocido como el 'Pelé blanco' y máximo ídolo del Flamengo.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false, deportista: true, futbolista: true, brasileño: true, latino: true, sudamericano: true },
    synonyms: ["zico", "arthur antunes coimbra"],
    clues: ["Era apodado 'El Pelé Blanco' debido a su increíble talento ofensivo y de creación.", "Es considerado el mayor ídolo de la historia del club Flamengo de Río de Janeiro.", "Destacó por ser un excelso cobrador de tiros libres y liderar a Brasil en los mundiales de los 80."]
  },
  {
    name: "Simone Biles",
    filters: { region: "usa", area: "sports", nature: "real", era: "current" },
    birthYear: 1997, deathYear: null, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Gimnasta artística estadounidense, considerada la mejor de todos los tiempos con decenas de medallas mundiales.",
    attributes: { hombre: false, mujer: true, vivo: true, muerto: false, real: true, ficticio: false, deportista: true, gimnasta: true, americana: true, estadounidense: true },
    synonyms: ["simone biles", "biles", "simone"],
    clues: ["Es una atleta de muy baja estatura (1.42 m) que compite en el deporte de gimnasia artística.", "Tiene múltiples saltos y elementos acrobáticos bautizados en su honor en el código de puntuación mundial.", "Es la gimnasta artística más laureada de todos los tiempos en Campeonatos Mundiales y Juegos Olímpicos."]
  },

  // ==========================================
  // --- MÚSICA / CINE / ARTES (21-45) ---
  // ==========================================
  {
    name: "Shakira",
    filters: { region: "latam", area: "music", nature: "real", era: "current" },
    birthYear: 1977, deathYear: null, country: "Colombia",
    demonyms: ["colombiano", "colombiana", "barranquillero", "barranquillera", "sudamericano", "sudamericana", "latinoamericano", "latino"],
    description: "Cantante y compositora colombiana, reina del pop latino conocida por su baile.",
    attributes: { hombre: false, mujer: true, vivo: true, muerto: false, real: true, ficticio: false, artista: true, cantante: true, colombiana: true, latina: true, sudamericana: true },
    synonyms: ["shakira", "shak", "shaki"],
    clues: ["Es conocida a nivel mundial por el control y movimiento de sus caderas.", "Es la autora del tema musical 'Waka Waka (This Time for Africa)' del Mundial 2010.", "Nació en Barranquilla, Colombia, y canta fluidamente tanto en español como en inglés."]
  },
  {
    name: "Taylor Swift",
    filters: { region: "usa", area: "music", nature: "real", era: "current" },
    birthYear: 1989, deathYear: null, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Cantante y compositora estadounidense de pop y country de escala global masiva.",
    attributes: { hombre: false, mujer: true, vivo: true, muerto: false, real: true, ficticio: false, artista: true, cantante: true, americana: true, estadounidense: true },
    synonyms: ["taylor", "taylor swift", "swift", "tay"],
    clues: ["Sus seguidores y fanáticos son conocidos como 'Swifties'.", "Su mega-gira 'The Eras Tour' se convirtió en la gira musical más lucrativa de todos los tiempos.", "Inició su carrera musical en Nashville cantando música Country y luego pasó al Pop."]
  },
  {
    name: "Michael Jackson",
    filters: { region: "usa", area: "music", nature: "real", era: "historical" },
    birthYear: 1958, deathYear: 2009, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "El Rey del Pop, famoso por Thriller, Billie Jean y su baile Moonwalk.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, artista: true, cantante: true, bailarin: true, americano: true, estadounidense: true },
    synonyms: ["michael jackson", "jackson", "rey del pop", "michael", "mj"],
    clues: ["Patentó un paso de baile en el que parece caminar hacia atrás simulando flotar (el Moonwalk).", "Su álbum de 1982 'Thriller' es el más vendido en la historia de la música.", "Es ampliamente aclamado y conocido en todo el planeta como el 'Rey del Pop'."]
  },
  {
    name: "Freddie Mercury",
    filters: { region: "europa", area: "music", nature: "real", era: "historical" },
    birthYear: 1946, deathYear: 1991, country: "Reino Unido",
    demonyms: ["britanico", "britanica", "ingles", "inglesa", "europeo", "europea", "zanzibareño", "zanzibareña"],
    description: "Vocalista de la mítica banda británica Queen, con una voz inigualable.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, artista: true, cantante: true, musico: true, britanico: true, ingles: true, europeo: true },
    synonyms: ["freddie", "freddie mercury", "mercury", "queen"],
    clues: ["Su distintivo bigote y su vestimenta con chaqueta amarilla y pantalones blancos son legendarios.", "Fue el compositor principal y cantante líder del grupo de rock británico Queen.", "Su nombre de nacimiento era Farrokh Bulsara y compuso himnos de rock como 'Bohemian Rhapsody'."]
  },
  {
    name: "Robert Downey Jr",
    filters: { region: "usa", area: "music", nature: "real", era: "current" },
    birthYear: 1965, deathYear: null, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Actor estadounidense famoso por interpretar a Iron Man / Tony Stark.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false, artista: true, actor: true, americano: true, estadounidense: true },
    synonyms: ["robert downey jr", "robert downey", "downey", "rdj", "iron man", "tony stark"],
    clues: ["Ganó su primer Premio Óscar interpretando a Lewis Strauss en la aclamada película 'Oppenheimer'.", "Inició el Universo Cinematográfico de Marvel como el multimillonario Tony Stark.", "También interpretó una versión muy popular del detective británico Sherlock Holmes en el cine."]
  },
  {
    name: "Marilyn Monroe",
    filters: { region: "usa", area: "music", nature: "real", era: "historical" },
    birthYear: 1926, deathYear: 1962, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Ícono pop y actriz estadounidense de la época dorada de Hollywood.",
    attributes: { hombre: false, mujer: true, vivo: false, muerto: true, real: true, ficticio: false, artista: true, actriz: true, modelo: true, americana: true, estadounidense: true },
    synonyms: ["marilyn", "marilyn monroe", "monroe"],
    clues: ["Nació bajo el nombre de Norma Jeane Mortenson.", "Su imagen con un vestido blanco flotando sobre una rejilla de ventilación del metro es uno de los mayores íconos pop.", "Fue la estrella más brillante del cine de Hollywood en los años 50 y cantó 'Happy Birthday Mr. President' a JFK."]
  },
  {
    name: "Elvis Presley",
    filters: { region: "usa", area: "music", nature: "real", era: "historical" },
    birthYear: 1935, deathYear: 1977, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "El Rey del Rock and Roll, cantante y actor que revolucionó la música popular estadounidense.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, artista: true, cantante: true, musico: true, americano: true, estadounidense: true },
    synonyms: ["elvis", "elvis presley", "el rey del rock", "presley"],
    clues: ["Sus movimientos de cadera frenéticos escandalizaron a la televisión estadounidense en los años 50.", "Nació en Tupelo, Misisipi, y su mansión familiar en Memphis se llama 'Graceland'.", "Se le conoce de manera indiscutida y universal como el 'Rey del Rock and Roll'."]
  },
  {
    name: "John Lennon",
    filters: { region: "europa", area: "music", nature: "real", era: "historical" },
    birthYear: 1940, deathYear: 1980, country: "Reino Unido",
    demonyms: ["britanico", "britanica", "ingles", "inglesa", "europeo", "europea"],
    description: "Músico, compositor y activista británico, cofundador de The Beatles y autor de 'Imagine'.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, artista: true, cantante: true, musico: true, ingles: true, britanico: true },
    synonyms: ["lennon", "john lennon", "the beatles"],
    clues: ["Utilizaba unos icónicos anteojos redondos metálicos de estilo 'granny'.", "Fue uno de los líderes y compositores principales del legendario grupo británico The Beatles.", "Es el compositor del himno pacifista universal 'Imagine' y fue asesinado en Nueva York por Mark Chapman."]
  },
  {
    name: "Madonna",
    filters: { region: "usa", area: "music", nature: "real", era: "current" },
    birthYear: 1958, deathYear: null, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Cantante y compositora estadounidense, apodada la 'Reina del Pop' por su impacto cultural y reinventiva constante.",
    attributes: { hombre: false, mujer: true, vivo: true, muerto: false, real: true, ficticio: false, artista: true, cantante: true, americana: true, estadounidense: true },
    synonyms: ["madonna", "madona", "reina del pop", "madonna ciccone"],
    clues: ["Su vestuario con corsé de conos dorados diseñado por Jean Paul Gaultier causó furor mundial.", "Interpretó a Eva Perón en la película musical 'Evita' de 1996.", "Es la cantante femenina que ostenta el título indiscutido de 'Reina del Pop'."]
  },
  {
    name: "Lady Gaga",
    filters: { region: "usa", area: "music", nature: "real", era: "current" },
    birthYear: 1986, deathYear: null, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Cantante, compositora y actriz estadounidense, célebre por su estilo visual extravagante y versatilidad musical.",
    attributes: { hombre: false, mujer: true, vivo: true, muerto: false, real: true, ficticio: false, artista: true, cantante: true, actriz: true, americana: true, estadounidense: true },
    synonyms: ["lady gaga", "gaga", "stefani germanotta"],
    clues: ["Es famosa por sus vestuarios bizarros, incluyendo un vestido hecho completamente de carne cruda en 2010.", "Ganó un premio Óscar por su canción 'Shallow' en la película 'A Star Is Born'.", "Su nombre artístico proviene de una famosa canción de la banda de rock Queen: 'Radio Ga Ga'."]
  },
  {
    name: "Beyoncé",
    filters: { region: "usa", area: "music", nature: "real", era: "current" },
    birthYear: 1981, deathYear: null, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Cantante, bailarina y productora estadounidense, una de las mayores fuerzas de la música pop contemporánea.",
    attributes: { hombre: false, mujer: true, vivo: true, muerto: false, real: true, ficticio: false, artista: true, cantante: true, americana: true, estadounidense: true },
    synonyms: ["beyonce", "queen bey", "beyonce knowles"],
    clues: ["Sus fanáticos se autodenominan la 'BeyHive' y su apodo es 'Queen Bey'.", "Inició su estrellato musical a finales de los 90 como la líder del grupo femenino Destiny's Child.", "Es la artista con más nominaciones y premios Grammy en toda la historia de la música."]
  },
  {
    name: "Luis Miguel",
    filters: { region: "latam", area: "music", nature: "real", era: "current" },
    birthYear: 1970, deathYear: null, country: "México", // Nació en Puerto Rico pero es mexicano por nacionalidad e identidad
    demonyms: ["mexicano", "mexicana", "latino", "latina", "latinoamericano", "latinoamericana"],
    description: "Cantante mexicano nacido en Puerto Rico, una de las voces masculinas más influyentes de la música en español.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false, artista: true, cantante: true, mexicano: true, latino: true },
    synonyms: ["luis miguel", "luismiguel", "luismi", "el sol de mexico", "el sol"],
    clues: ["Se le conoce mundialmente con el apodo de 'El Sol de México'.", "Revolucionó el género del bolero en los años 90 con su exitoso álbum 'Romance'.", "Nació en Puerto Rico pero desarrolló toda su vida y su carrera artística como un ícono de México."]
  },
  {
    name: "Gustavo Cerati",
    filters: { region: "latam", area: "music", nature: "real", era: "historical" },
    birthYear: 1959, deathYear: 2014, country: "Argentina",
    demonyms: ["argentino", "argentina", "sudamericano", "sudamericana", "latinoamericano", "latino"],
    description: "Músico y cantautor argentino de rock, líder de la influyente banda Soda Stereo.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, artista: true, cantante: true, musico: true, argentino: true, latino: true, sudamericano: true },
    synonyms: ["cerati", "gustavo cerati", "soda stereo"],
    clues: ["Al final de sus conciertos de la gira 'El Último Concierto' inmortalizó la frase '¡Gracias totales!'.", "Fue el vocalista, guitarrista y compositor líder de la banda de rock Soda Stereo.", "Nació en Buenos Aires, Argentina, y tuvo una aclamada carrera solista con álbumes como 'Bocanada'."]
  },
  {
    name: "Eminem",
    filters: { region: "usa", area: "music", nature: "real", era: "current" },
    birthYear: 1972, deathYear: null, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Rapero, productor y actor estadounidense, uno de los artistas más vendidos en la historia del hip-hop.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false, artista: true, cantante: true, rapero: true, americano: true, estadounidense: true },
    synonyms: ["eminem", "marshall mathers", "slim shady"],
    clues: ["Utiliza el alter ego de 'Slim Shady' para sus canciones más oscuras y satíricas.", "Protagonizó la película semiautobiográfica '8 Mile' y ganó un Óscar por la canción 'Lose Yourself'.", "Nació en Detroit con el nombre de Marshall Mathers y es catalogado como uno de los mejores raperos del mundo."]
  },
  {
    name: "Johnny Depp",
    filters: { region: "usa", area: "music", nature: "real", era: "current" },
    birthYear: 1963, deathYear: null, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Actor estadounidense famoso por sus interpretaciones de personajes excéntricos y góticos.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false, artista: true, actor: true, americano: true, estadounidense: true },
    synonyms: ["johnny depp", "depp", "johnny dep"],
    clues: ["Mantuvo una célebre y larga relación creativa con el director de cine gótico Tim Burton.", "Interpretó al excéntrico capitán pirata Jack Sparrow en la saga de Disney.", "Protagonizó películas de culto como 'Edward Scissorhands' (El joven manos de tijera) y 'Charlie and the Chocolate Factory'."]
  },
  {
    name: "Steven Spielberg",
    filters: { region: "usa", area: "music", nature: "real", era: "current" }, // Cine/Artes
    birthYear: 1946, deathYear: null, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Director, guionista y productor estadounidense, uno de los cineastas más taquilleros e influyentes de la historia.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false, artista: true, director: true, cineasta: true, americano: true, estadounidense: true },
    synonyms: ["spielberg", "steven spielberg"],
    clues: ["Es el director de clásicos taquilleros como 'Tiburón' (Jaws), 'E.T., el extraterrestre' y 'Parque Jurásico' (Jurassic Park).", "Ganó el Premio Óscar a mejor director por películas serias e históricas como 'La lista de Schindler' y 'Rescatando al soldado Ryan'.", "Cofundó la famosa productora cinematográfica DreamWorks Studios."]
  },
  {
    name: "Quentin Tarantino",
    filters: { region: "usa", area: "music", nature: "real", era: "current" },
    birthYear: 1963, deathYear: null, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Director de cine estadounidense conocido por sus diálogos ingeniosos, violencia estilizada y homenajes al cine clásico.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false, artista: true, director: true, cineasta: true, americano: true, estadounidense: true },
    synonyms: ["tarantino", "quentin tarantino"],
    clues: ["Es famoso por su obsesión con enfocar planos de los pies descalzos de las actrices en casi todas sus películas.", "Dirigió obras maestras del cine independiente y comercial como 'Pulp Fiction', 'Kill Bill' e 'Inglourious Basterds'.", "Trabajó en un videoclub de alquiler de películas antes de saltar a la fama con su película debut 'Reservoir Dogs'."]
  },
  {
    name: "Vincent van Gogh",
    filters: { region: "europa", area: "music", nature: "real", era: "historical" }, // Pintura
    birthYear: 1853, deathYear: 1890, country: "Países Bajos",
    demonyms: ["holandes", "holandesa", "neerlandes", "neerlandesa", "europeo", "europea"],
    description: "Pintor postimpresionista holandés, autor de obras de arte icónicas como 'La noche estrellada'.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, artista: true, pintor: true, holandés: true, europeo: true },
    synonyms: ["van gogh", "vincent van gogh", "vincent"],
    clues: ["Es trágicamente conocido por haberse cortado el lóbulo de la oreja izquierda tras una fuerte disputa con Paul Gauguin.", "Es el autor de los célebres cuadros al óleo 'Los girasoles' y 'La noche estrellada'.", "Nació en los Países Bajos, sufrió de graves enfermedades mentales y solo vendió un cuadro en toda su vida activa."]
  },
  {
    name: "Leonardo da Vinci",
    filters: { region: "europa", area: "music", nature: "real", era: "historical" }, // Pintor / Polímata antiguo
    birthYear: 1452, deathYear: 1519, country: "Italia",
    demonyms: ["italiano", "italiana", "florentino", "europeo", "europea"],
    description: "Polímata florentino del Renacimiento italiano, pintor de la 'Mona Lisa' y visionario tecnológico.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, artista: true, pintor: true, inventor: true, italiano: true, europeo: true },
    synonyms: ["da vinci", "leonardo da vinci", "leonardo"],
    clues: ["Escribía la mayoría de sus notas utilizando escritura especular (es decir, en espejo de derecha a izquierda).", "Pintó el retrato más famoso y analizado del mundo: la 'Mona Lisa' (La Gioconda) y el mural 'La última cena'.", "Fue un genio italiano del Renacimiento que dibujó diseños primitivos de helicópteros, tanques de guerra y planeadores."]
  },
  {
    name: "Frida Kahlo",
    filters: { region: "latam", area: "music", nature: "real", era: "historical" }, // Pintura
    birthYear: 1907, deathYear: 1954, country: "México",
    demonyms: ["mexicano", "mexicana", "latino", "latina", "latinoamericano", "latinoamericana"],
    description: "Pintora mexicana conocida por sus autorretratos cargados de dolor personal y folclore de su país.",
    attributes: { hombre: false, mujer: true, vivo: false, muerto: true, real: true, ficticio: false, artista: true, pintora: true, mexicana: true, latina: true },
    synonyms: ["frida kahlo", "frida", "kahlo"],
    clues: ["Es famosa por sus característicos autorretratos donde resalta orgullosamente su uniceja y bigote.", "Vivió la mayor parte de su vida en la famosa 'Casa Azul' en Coyoacán y estuvo casada con el muralista Diego Rivera.", "Su obra pictórica está fuertemente influenciada por la cultura folclórica mexicana y sus graves padecimientos físicos tras un accidente."]
  },
  {
    name: "Bob Marley",
    filters: { region: "latam", area: "music", nature: "real", era: "historical" },
    birthYear: 1945, deathYear: 1981, country: "Jamaica",
    demonyms: ["jamaicano", "jamaicana", "jamaiquino", "jamaiquina", "caribeño", "caribeña"],
    description: "Músico jamaicano, máximo exponente de la música reggae y del movimiento rastafari.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, artista: true, cantante: true, musico: true, jamaicano: true },
    synonyms: ["bob marley", "marley", "bob"],
    clues: ["Llevaba su cabello en largas rastas (dreadlocks) y era un fiel practicante de la religión rastafari.", "Es el intérprete de himnos de música reggae como 'No Woman, No Cry', 'One Love' y 'Redemption Song'.", "Nació en Nine Mile, Jamaica, y fue un embajador mundial de la paz mediante la música."]
  },
  {
    name: "Ludwig van Beethoven",
    filters: { region: "europa", area: "music", nature: "real", era: "historical" },
    birthYear: 1770, deathYear: 1827, country: "Alemania",
    demonyms: ["aleman", "alemana", "europeo", "europea"],
    description: "Compositor, director de orquesta y pianista alemán, uno de los más importantes de la música clásica y romántica.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, artista: true, compositor: true, musico: true, aleman: true, europeo: true },
    synonyms: ["beethoven", "ludwig van beethoven"],
    clues: ["Compuso algunas de sus mejores sinfonías de música orquestal cuando ya estaba completamente sordo.", "Es el autor de la célebre 'Quinta Sinfonía' (con su famoso inicio tatan-ta-tan) y el 'Himno a la Alegría' (Novena Sinfonía).", "Nació en Bonn, Alemania, y es un pilar fundamental en la transición entre el clasicismo y el romanticismo."]
  },
  {
    name: "Wolfgang Amadeus Mozart",
    filters: { region: "europa", area: "music", nature: "real", era: "historical" },
    birthYear: 1756, deathYear: 1791, country: "Austria",
    demonyms: ["austriaco", "austriaca", "europeo", "europea"],
    description: "Compositor austríaco de la época clásica, niño prodigio y creador de óperas inmortales.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, artista: true, compositor: true, musico: true, austriaco: true, europeo: true },
    synonyms: ["mozart", "wolfgang amadeus mozart", "amadeus"],
    clues: ["Fue un niño prodigio que ya componía e interpretaba conciertos en piano y violín a los cinco años de edad.", "Compuso famosas óperas como 'La flauta mágica' y 'Las bodas de Fígaro', además de su inconcluso 'Réquiem'.", "Nació en Salzburgo, Austria, y falleció a la temprana edad de 35 años en la mayor pobreza."]
  },
  {
    name: "Walt Disney",
    filters: { region: "usa", area: "music", nature: "real", era: "historical" },
    birthYear: 1901, deathYear: 1966, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Cofundador de The Walt Disney Company, animador y creador de Mickey Mouse.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, artista: true, caricaturista: true, empresario: true, americano: true, estadounidense: true },
    synonyms: ["walt disney", "disney", "walter elias disney"],
    clues: ["Es la persona que más premios Óscar de la Academia de Cine ha ganado en toda la historia (22 premios en total).", "Fue el creador del personaje Mickey Mouse e inicialmente le dio su propia voz al personaje animado.", "Fundó el primer gran parque temático del mundo en California y revolucionó los largometrajes animados."]
  },
  {
    name: "Lady Di",
    filters: { region: "europa", area: "music", nature: "real", era: "historical" }, // Figura pública
    birthYear: 1961, deathYear: 1997, country: "Reino Unido",
    demonyms: ["britanico", "britanica", "ingles", "inglesa", "europeo", "europea"],
    description: "Princesa de Gales, icono de la moda y destacada activista humanitaria británica, conocida como la 'princesa del pueblo'.",
    attributes: { hombre: false, mujer: true, vivo: false, muerto: true, real: true, ficticio: false, noble: true, princesa: true, inglesa: true, britanica: true },
    synonyms: ["lady di", "diana de gales", "princesa diana", "lady diana", "diana spencer"],
    clues: ["Es apodada cariñosamente 'La Princesa del Pueblo' debido a su gran cercanía con la gente común y obras benéficas.", "Estuvo casada con el actual Rey Carlos III de Inglaterra.", "Falleció trágicamente en un accidente automovilístico en un túnel de París en 1997 mientras era perseguida por paparazzi."]
  },

  // ==========================================
  // --- CIENCIA Y TECNOLOGÍA (46-65) ---
  // ==========================================
  {
    name: "Albert Einstein",
    filters: { region: "europa", area: "science", nature: "real", era: "historical" },
    birthYear: 1879, deathYear: 1955, country: "Alemania",
    demonyms: ["aleman", "alemana", "europeo", "europea"],
    description: "Físico teórico alemán, autor de la teoría de la relatividad general (E=mc²).",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, cientifico: true, fisico: true, aleman: true, europeo: true },
    synonyms: ["einstein", "albert einstein", "albert"],
    clues: ["Su retrato más famoso e informal lo muestra sacándole la lengua a los fotógrafos.", "Formuló la ecuación más conocida de la física sobre la equivalencia de masa y energía: E=mc².", "Es el físico teórico alemán que desarrolló la revolucionaria Teoría de la Relatividad."]
  },
  {
    name: "Marie Curie",
    filters: { region: "europa", area: "science", nature: "real", era: "historical" },
    birthYear: 1867, deathYear: 1934, country: "Polonia",
    demonyms: ["polaco", "polaca", "frances", "francesa", "europeo", "europea"],
    description: "Científica polaca-francesa, pionera en radiactividad y ganadora de dos Premios Nobel.",
    attributes: { hombre: false, mujer: true, vivo: false, muerto: true, real: true, ficticio: false, cientifica: true, quimica: true, fisica: true, polaca: true, francesa: true, europea: true },
    synonyms: ["marie curie", "curie", "madame curie", "maria salomea"],
    clues: ["Sus cuadernos de notas originales siguen siendo tan radiactivos que deben guardarse en cajas de plomo.", "Fue la primera mujer en ganar un Premio Nobel y la única persona en ganarlo en dos especialidades científicas distintas (Física y Química).", "Nació en Varsovia, Polonia, y acuñó el término 'radiactividad' tras descubrir los elementos Polonio y Radio."]
  },
  {
    name: "Steve Jobs",
    filters: { region: "usa", area: "science", nature: "real", era: "historical" },
    birthYear: 1955, deathYear: 2011, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Cofundador de Apple, visionario de la tecnología móvil y la computación personal.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, tecnologia: true, inventor: true, empresario: true, americano: true, estadounidense: true },
    synonyms: ["steve jobs", "jobs", "steve"],
    clues: ["Su atuendo emblemático consistía en un suéter negro de cuello alto, jeans azules y zapatillas grises.", "Fue el cofundador de Apple que presentó el primer iPhone al mundo en 2007.", "Fue despedido de su propia compañía en 1985, fundó NeXT y compró el estudio que luego se convirtió en Pixar."]
  },
  {
    name: "Elon Musk",
    filters: { region: "usa", area: "science", nature: "real", era: "current" },
    birthYear: 1971, deathYear: null, country: "Estados Unidos",
    demonyms: ["sudafricano", "sudafricana", "estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Magnate tecnológico, fundador de SpaceX, CEO de Tesla y dueño de X (Twitter).",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false, tecnologia: true, empresario: true, millonario: true, americano: true, sudafricano: true },
    synonyms: ["elon", "musk", "elon musk"],
    clues: ["Su objetivo a largo plazo es llevar a la humanidad a colonizar el planeta Marte.", "Adquirió la red social Twitter por 44 mil millones de dólares y cambió su logo azul por una letra 'X'.", "Nació en Sudáfrica y lidera las compañías aeroespaciales SpaceX y automotrices Tesla."]
  },
  {
    name: "Stephen Hawking",
    filters: { region: "europa", area: "science", nature: "real", era: "historical" },
    birthYear: 1942, deathYear: 2018, country: "Reino Unido",
    demonyms: ["britanico", "britanica", "ingles", "inglesa", "europeo", "europea"],
    description: "Físico teórico británico conocido por sus estudios sobre los agujeros negros y la ELA.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, cientifico: true, fisico: true, cosmologo: true, britanico: true, ingles: true, europeo: true },
    synonyms: ["hawking", "stephen hawking", "stephen"],
    clues: ["Escribió el best-seller de divulgación científica 'Breve historia del tiempo'.", "Fue un físico teórico inglés que teorizó que los agujeros negros emiten radiación térmica.", "Padeció de ELA (esclerosis lateral amiotrófica), lo que lo obligó a usar una icónica silla de ruedas con sintetizador de voz."]
  },
  {
    name: "Nikola Tesla",
    filters: { region: "europa", area: "science", nature: "real", era: "historical" },
    birthYear: 1856, deathYear: 1943, country: "Croacia",
    demonyms: ["serbio", "serbia", "croata", "austriaco", "austriaca", "europeo", "europea"],
    description: "Inventor e ingeniero serbocroata, pionero del electromagnetismo y la corriente alterna.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, cientifico: true, inventor: true, fisico: true, serbio: true, croata: true, europeo: true },
    synonyms: ["tesla", "nikola tesla", "nikola"],
    clues: ["Mantenía una famosa obsesión y afecto por las palomas callejeras en su vejez en Nueva York.", "Fue el gran rival de Thomas Alva Edison en la histórica 'Guerra de las Corrientes'.", "Es el inventor de origen serbio que diseñó el motor de inducción y el sistema de corriente alterna para la electricidad."]
  },
  {
    name: "Galileo Galilei",
    filters: { region: "europa", area: "science", nature: "real", era: "historical" },
    birthYear: 1564, deathYear: 1642, country: "Italia",
    demonyms: ["italiano", "italiana", "florentino", "europeo", "europea"],
    description: "Astronomo y físico italiano del Renacimiento, defensor de la teoría heliocéntrica.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, cientifico: true, astronomo: true, fisico: true, italiano: true, europeo: true },
    synonyms: ["galileo", "galilei", "galileo galilei"],
    clues: ["Se le atribuye haber susurrado la célebre frase 'Eppur si muove' (Y sin embargo se mueve) ante el tribunal de la Inquisición.", "Mejoró drásticamente el diseño del telescopio, utilizándolo para descubrir las cuatro lunas más grandes de Júpiter.", "Nació en Pisa, Italia, y defendió firmemente que la Tierra giraba alrededor del Sol (Heliocentrismo)."]
  },
  {
    name: "Isaac Newton",
    filters: { region: "europa", area: "science", nature: "real", era: "historical" },
    birthYear: 1643, deathYear: 1727, country: "Reino Unido",
    demonyms: ["britanico", "britanica", "ingles", "inglesa", "europeo", "europea"],
    description: "Físico y matemático británico que formuló las leyes de la gravedad y del movimiento.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, cientifico: true, fisico: true, matematico: true, ingles: true, britanico: true },
    synonyms: ["newton", "isaac newton"],
    clues: ["La leyenda urbana más famosa dice que formuló su teoría de la gravedad tras ver caer una manzana de un árbol.", "Escribió los 'Philosophiae Naturalis Principia Mathematica' y desarrolló el cálculo matemático.", "Es el creador de las leyes del movimiento y de la gravitación universal."]
  },
  {
    name: "Charles Darwin",
    filters: { region: "europa", area: "science", nature: "real", era: "historical" },
    birthYear: 1809, deathYear: 1882, country: "Reino Unido",
    demonyms: ["britanico", "britanica", "ingles", "inglesa", "europeo", "europea"],
    description: "Naturalista británico que formuló la teoría de la evolución por selección natural.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, cientifico: true, biologo: true, naturalista: true, ingles: true, britanico: true },
    synonyms: ["darwin", "charles darwin"],
    clues: ["Desarrolló sus ideas evolutivas clave tras estudiar pinzones y tortugas gigantes en las Islas Galápagos.", "Escribió el libro fundacional de la biología moderna 'El origen de las especies' en 1859.", "Es el formulador de la teoría de la evolución de los seres vivos mediante selección natural."]
  },
  {
    name: "Alan Turing",
    filters: { region: "europa", area: "science", nature: "real", era: "historical" },
    birthYear: 1912, deathYear: 1954, country: "Reino Unido",
    demonyms: ["britanico", "britanica", "ingles", "inglesa", "europeo", "europea"],
    description: "Matemático y pionero de la informática británico, descifrador de la máquina Enigma en la Segunda Guerra Mundial.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, cientifico: true, informatico: true, matematico: true, ingles: true, britanico: true },
    synonyms: ["turing", "alan turing"],
    clues: ["Es el creador del test de inteligencia artificial que mide la capacidad de una máquina para imitar el comportamiento humano.", "Lideró el equipo en Bletchley Park que descifró los códigos de la máquina alemana 'Enigma' durante la guerra.", "Es considerado el padre teórico de la computación moderna y de la informática."]
  },
  {
    name: "Bill Gates",
    filters: { region: "usa", area: "science", nature: "real", era: "current" },
    birthYear: 1955, deathYear: null, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Cofundador de Microsoft, informático y filántropo estadounidense.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false, tecnologia: true, empresario: true, millonario: true, americano: true, estadounidense: true },
    synonyms: ["gates", "bill gates", "william gates"],
    clues: ["Se convirtió en el multimillonario más joven del mundo en su época tras popularizar el sistema operativo MS-DOS y Windows.", "Cofundó la gigantesca compañía de software Microsoft junto a Paul Allen.", "Actualmente lidera junto a su exesposa una gran fundación benéfica global que financia vacunas y salud pública."]
  },
  {
    name: "Mark Zuckerberg",
    filters: { region: "usa", area: "science", nature: "real", era: "current" },
    birthYear: 1984, deathYear: null, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Creador y cofundador de Facebook (hoy Meta) y empresario tecnológico estadounidense.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false, tecnologia: true, empresario: true, millonario: true, americano: true, estadounidense: true },
    synonyms: ["zuckerberg", "mark zuckerberg", "zuck"],
    clues: ["Creó su famosa plataforma social en su habitación de la Universidad de Harvard en 2004.", "Es el director ejecutivo y creador de Facebook y actual dueño de Instagram y WhatsApp.", "Su historia y los pleitos por su creación se retratan en la película 'The Social Network' (La red social)."]
  },
  {
    name: "Ada Lovelace",
    filters: { region: "europa", area: "science", nature: "real", era: "historical" },
    birthYear: 1815, deathYear: 1852, country: "Reino Unido",
    demonyms: ["britanico", "britanica", "ingles", "inglesa", "europeo", "europea"],
    description: "Matemática británica, considerada la primera programadora de computadoras de la historia.",
    attributes: { hombre: false, mujer: true, vivo: false, muerto: true, real: true, ficticio: false, cientifica: true, matematica: true, informatica: true, inglesa: true, britanica: true },
    synonyms: ["ada lovelace", "lovelace", "ada byron"],
    clues: ["Fue la hija del famoso poeta romántico Lord Byron, aunque ella se dedicó a las ciencias exactas.", "Escribió el primer algoritmo destinado a ser procesado por una máquina de cálculo teórico (la máquina analítica de Babbage).", "Es celebrada en todo el mundo como la primera programadora informática de la historia."]
  },
  {
    name: "Louis Pasteur",
    filters: { region: "europa", area: "science", nature: "real", era: "historical" },
    birthYear: 1822, deathYear: 1895, country: "Francia",
    demonyms: ["frances", "francesa", "europeo", "europea"],
    description: "Químico y bacteriólogo francés, creador de la vacuna contra la rabia y del proceso de pasteurización.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, cientifico: true, quimico: true, biologo: true, frances: true, europeo: true },
    synonyms: ["pasteur", "louis pasteur"],
    clues: ["Su apellido dio origen a la técnica química de calentar líquidos para eliminar bacterias (la Pasteurización).", "Desarrolló y probó con éxito la primera vacuna contra la enfermedad mortal de la rabia (hidrofobia).", "Fue un químico y microbiólogo francés que refutó definitivamente la teoría de la generación espontánea."]
  },
  {
    name: "Alexander Fleming",
    filters: { region: "europa", area: "science", nature: "real", era: "historical" },
    birthYear: 1881, deathYear: 1955, country: "Reino Unido",
    demonyms: ["britanico", "britanica", "escoces", "escocesa", "europeo", "europea"],
    description: "Científico escocés que descubrió la penicilina, el primer antibiótico de uso masivo.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, cientifico: true, medico: true, escocés: true, britanico: true },
    synonyms: ["fleming", "alexander fleming"],
    clues: ["Descubrió su hallazgo medicinal más importante por accidente, al regresar de vacaciones y notar un hongo en un plato de cultivo olvidado.", "Su descubrimiento de la Penicilina dio inicio a la era médica de los antibióticos.", "Nació en Escocia y compartió el Premio Nobel de Medicina en 1945 por salvar millones de vidas."]
  },
  {
    name: "Carl Sagan",
    filters: { region: "usa", area: "science", nature: "real", era: "historical" },
    birthYear: 1934, deathYear: 1996, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Astrónomo, cosmólogo y divulgador científico estadounidense, creador de la serie 'Cosmos'.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, cientifico: true, astronomo: true, americano: true, estadounidense: true },
    synonyms: ["carl sagan", "sagan", "carl"],
    clues: ["Escribió e interpretó la legendaria serie documental sobre el universo titulada 'Cosmos: un viaje personal' (1980).", "Promovió activamente la búsqueda de vida extraterrestre (proyecto SETI) y diseñó el disco de oro de las naves Voyager.", "Fue un astrónomo neoyorquino pionero en alertar sobre el calentamiento global y el efecto invernadero."]
  },
  {
    name: "Richard Feynman",
    filters: { region: "usa", area: "science", nature: "real", era: "historical" },
    birthYear: 1918, deathYear: 1988, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Físico teórico estadounidense, ganador del Nobel, famoso por su personalidad excéntrica y diagramas de física cuántica.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, cientifico: true, fisico: true, americano: true, estadounidense: true },
    synonyms: ["feynman", "richard feynman"],
    clues: ["Era un virtuoso tocador de bongos y le gustaba descifrar cajas fuertes en proyectos de alto secreto gubernamentales.", "Creó un método visual simplificado mediante diagramas para representar la interacción de partículas subatómicas (Diagramas de Feynman).", "Nació en Queens, Nueva York, participó en el Proyecto Manhattan para crear la bomba atómica y ganó el Premio Nobel de Física."]
  },
  {
    name: "Thomas Edison",
    filters: { region: "usa", area: "science", nature: "real", era: "historical" },
    birthYear: 1847, deathYear: 1931, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Prolífico inventor estadounidense, perfeccionador de la bombilla eléctrica y defensor de la corriente continua.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, tecnologia: true, inventor: true, americano: true, estadounidense: true },
    synonyms: ["edison", "thomas edison", "thomas alva edison"],
    clues: ["Registró la increíble cifra récord de 1093 patentes comerciales a lo largo de su vida.", "Fundó el laboratorio de investigación industrial de Menlo Park y perfeccionó el fonógrafo y la bombilla incandescente.", "Defendió a muerte el uso de la corriente continua (CC) y electrocutó animales para asustar sobre el peligro de la corriente alterna de Tesla."]
  },
  {
    name: "Ada Yonath",
    filters: { region: "asia_africa", area: "science", nature: "real", era: "current" },
    birthYear: 1939, deathYear: null, country: "Israel",
    demonyms: ["israeli", "asiatico", "asiatica"],
    description: "Cristalógrafa israelí galardonada con el Premio Nobel de Química por sus estudios sobre la estructura del ribosoma.",
    attributes: { hombre: false, mujer: true, vivo: true, muerto: false, real: true, ficticio: false, cientifica: true, quimica: true, israeli: true },
    synonyms: ["ada yonath", "yonath", "ada"],
    clues: ["Es una cristalógrafa de origen israelí que investigó durante años en condiciones de temperaturas extremadamente bajas (criocristalografía).", "Logró mapear mediante rayos X la estructura tridimensional del ribosoma celular responsable de producir proteínas.", "Se convirtió en la primera mujer de Oriente Medio en ganar un Premio Nobel en ciencias (Química, 2009)."]
  },
  {
    name: "Tim Berners-Lee",
    filters: { region: "europa", area: "science", nature: "real", era: "current" },
    birthYear: 1955, deathYear: null, country: "Reino Unido",
    demonyms: ["britanico", "britanica", "ingles", "inglesa", "europeo", "europea"],
    description: "Científico de la computación británico, inventor de la World Wide Web (WWW).",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: true, ficticio: false, tecnologia: true, informatico: true, ingles: true, britanico: true },
    synonyms: ["tim berners-lee", "berners-lee", "tim berners"],
    clues: ["Escribió la primera propuesta de un sistema de hipertexto que daría origen a la red de internet moderna mientras trabajaba en el CERN.", "Es el creador de las siglas 'WWW', del protocolo HTTP y del lenguaje HTML.", "Nació en Londres, estudió en Oxford y decidió no patentar su invento para que fuera abierto y gratuito en todo el mundo."]
  },

  // ==========================================
  // --- HISTORIA Y POLÍTICA (66-85) ---
  // ==========================================
  {
    name: "Cleopatra",
    filters: { region: "asia_africa", area: "history", nature: "real", era: "historical" },
    birthYear: -69, deathYear: -30, country: "Egipto",
    demonyms: ["egipcio", "egipcia", "africano", "africana", "griego", "griega"],
    description: "Última gobernante de la dinastía ptolemaica del Antiguo Egipto, famosa por su belleza y astucia.",
    attributes: { hombre: false, mujer: true, vivo: false, muerto: true, real: true, ficticio: false, reina: true, gobernante: true, egipcia: true, africana: true, antigua: true },
    synonyms: ["cleopatra", "cleopatra vii"],
    clues: ["La leyenda cuenta que murió provocando que una cobra egipcia (áspid) la mordiera.", "Mantuvo célebres relaciones políticas y amorosas con los líderes romanos Julio César y Marco Antonio.", "Fue la última reina soberana de la dinastía ptolemaica en el Antiguo Egipto."]
  },
  {
    name: "Julio César",
    filters: { region: "europa", area: "history", nature: "real", era: "historical" },
    birthYear: -100, deathYear: -44, country: "Italia",
    demonyms: ["romano", "romana", "italiano", "italiana", "europeo", "europea"],
    description: "Líder militar y político romano de la República tardía, autoproclamado dictador vitalicio.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, militar: true, politico: true, romano: true, europeo: true, antiguo: true },
    synonyms: ["julio cesar", "cesar", "julius caesar"],
    clues: ["Pronunció la famosa frase 'Alea iacta est' (La suerte está echada) al cruzar el río Rubicón.", "Murió trágicamente tras ser apuñalado 23 veces en el Senado romano por sus propios colegas en los Idus de Marzo.", "Fue el militar y dictador de la República de Roma que conquistó las Galias y cuyo nombre bautizó el mes de julio."]
  },
  {
    name: "Abraham Lincoln",
    filters: { region: "usa", area: "history", nature: "real", era: "historical" },
    birthYear: 1809, deathYear: 1865, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Presidente de EE. UU. que abolió la esclavitud y lideró el país durante la Guerra de Secesión.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, politico: true, presidente: true, americano: true, estadounidense: true },
    synonyms: ["lincoln", "abraham lincoln", "abe lincoln"],
    clues: ["Era conocido por su elevada estatura y su sombrero de copa de seda negro extra alto.", "Lideró a los Estados Unidos durante su sangrienta Guerra Civil (Guerra de Secesión).", "Fue el 16º presidente de EE. UU., firmó la abolición de la esclavitud y fue asesinado en el Teatro Ford."]
  },
  {
    name: "Simón Bolívar",
    filters: { region: "latam", area: "history", nature: "real", era: "historical" },
    birthYear: 1783, deathYear: 1830, country: "Venezuela",
    demonyms: ["venezolano", "venezolana", "sudamericano", "sudamericana", "latinoamericano", "latinoamericana", "latino", "latina"],
    description: "Militar y político venezolano, prócer de la independencia de múltiples naciones sudamericanas.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, militar: true, politico: true, libertador: true, venezolano: true, latino: true, sudamericano: true },
    synonyms: ["bolivar", "simon bolivar", "el libertador"],
    clues: ["La moneda oficial de Venezuela lleva su apellido.", "Soñó con unificar América del Sur bajo una sola gran nación llamada 'La Gran Colombia'.", "Es el militar de origen caraqueño conocido en América Latina como 'El Libertador'."]
  },
  {
    name: "Napoleon Bonaparte",
    filters: { region: "europa", area: "history", nature: "real", era: "historical" },
    birthYear: 1769, deathYear: 1821, country: "Francia",
    demonyms: ["frances", "francesa", "corso", "corsa", "europeo", "europea"],
    description: "Militar y emperador francés, conquistador de gran parte de Europa a inicios del siglo XIX.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, militar: true, emperador: true, frances: true, europeo: true },
    synonyms: ["napoleon", "napoleon bonaparte", "bonaparte"],
    clues: ["Es retratado popularmente con su sombrero de dos picos horizontal y su mano derecha metida en el chaleco.", "Sufrió una derrota militar catastrófica y final en la Batalla de Waterloo.", "Fue un genio militar corso que se autocoronó Emperador de Francia y conquistó gran parte de Europa."]
  },
  {
    name: "Mahatma Gandhi",
    filters: { region: "asia_africa", area: "history", nature: "real", era: "historical" },
    birthYear: 1869, deathYear: 1948, country: "India",
    demonyms: ["indio", "india", "hindu", "asiatico", "asiatica"],
    description: "Líder pacifista indio que dirigió la independencia de la India mediante la no violencia.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, politico: true, pacifista: true, indio: true, asiatico: true },
    synonyms: ["gandhi", "mahatma gandhi", "mahatma"],
    clues: ["Lideró la famosa 'Marcha de la Sal' en 1930 para protestar de forma pacífica contra los monopolios británicos.", "Vestía únicamente con una tela blanca tejida por él mismo llamada dhoti y sandalias sencillas.", "Fue el abogado y pensador indio pionero del principio de la 'Satyagraha' (resistencia pacífica y no violenta)."]
  },
  {
    name: "Alejandro Magno",
    filters: { region: "europa", area: "history", nature: "real", era: "historical" },
    birthYear: -356, deathYear: -323, country: "Grecia", // Reino de Macedonia antigua, hoy Grecia
    demonyms: ["macedonio", "macedonia", "griego", "griega", "europeo", "europea"],
    description: "Rey de Macedonia y legendario conquistador de la antigüedad, creador de uno de los imperios más grandes.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, militar: true, rey: true, gobernante: true, griego: true, antiguo: true },
    synonyms: ["alejandro magno", "alejandro de macedonia", "alejandro iii"],
    clues: ["Su maestro de la infancia fue el célebre filósofo Aristóteles y su caballo favorito se llamaba Bucéfalo.", "Logró cortar el famoso 'Nudo Gordiano' cortándolo con su espada.", "Fue el joven rey de Macedonia que derrotó al Imperio Persa y conquistó casi todo el mundo conocido antes de morir a los 32 años."]
  },
  {
    name: "Juana de Arco",
    filters: { region: "europa", area: "history", nature: "real", era: "historical" },
    birthYear: 1412, deathYear: 1431, country: "Francia",
    demonyms: ["frances", "francesa", "europeo", "europea"],
    description: "Heroína militar y santa francesa, figura clave en la Guerra de los Cien Años.",
    attributes: { hombre: false, mujer: true, vivo: false, muerto: true, real: true, ficticio: false, militar: true, francesa: true, europea: true },
    synonyms: ["juana de arco", "santa juana", "la doncella de orleans"],
    clues: ["Afirmaba recibir visiones del Arcángel Miguel y de santos que le ordenaban salvar a su reino.", "Se vistió de hombre y lideró con éxito a las tropas francesas en el histórico asedio de Orleans.", "Fue capturada y quemada viva en la hoguera por los ingleses bajo cargos de herejía a los 19 años de edad."]
  },
  {
    name: "Nelson Mandela",
    filters: { region: "asia_africa", area: "history", nature: "real", era: "historical" },
    birthYear: 1918, deathYear: 2013, country: "Sudáfrica",
    demonyms: ["sudafricano", "sudafricana", "africano", "africana"],
    description: "Activista contra el apartheid, presidente de Sudáfrica y Premio Nobel de la Paz.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, politico: true, presidente: true, sudafricano: true },
    synonyms: ["mandela", "nelson mandela", "madiba"],
    clues: ["Su clan y su apodo respetuoso en su país es 'Madiba'.", "Pasó 27 años encarcelado por oponerse al sistema segregacionista racial (Apartheid).", "Se convirtió en el primer presidente negro de Sudáfrica y ganó el Premio Nobel de la Paz en 1993."]
  },
  {
    name: "Martin Luther King Jr.",
    filters: { region: "usa", area: "history", nature: "real", era: "historical" },
    birthYear: 1929, deathYear: 1968, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Pastor bautista y defensor de los derechos civiles en EE. UU., famoso por su lucha no violenta.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, pacifista: true, activista: true, americano: true, estadounidense: true },
    synonyms: ["martin luther king", "luther king", "mlk"],
    clues: ["Pronunció un célebre e histórico discurso de derechos civiles que iniciaba con la frase 'I have a dream' (Tengo un sueño).", "Lideró el boicot de autobuses en Montgomery y promovió la protesta no violenta inspirándose en Gandhi.", "Fue un pastor bautista negro estadounidense que ganó el Premio Nobel de la Paz en 1964 y fue asesinado en Memphis."]
  },
  {
    name: "Che Guevara",
    filters: { region: "latam", area: "history", nature: "real", era: "historical" },
    birthYear: 1928, deathYear: 1967, country: "Argentina", // Nació en Argentina, lideró en Cuba
    demonyms: ["argentino", "argentina", "cubano", "cubana", "sudamericano", "sudamericana", "latinoamericano", "latino"],
    description: "Revolucionario y médico argentino-cubano, figura icónica de la Revolución Cubana.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, militar: true, politico: true, argentino: true, latino: true, sudamericano: true },
    synonyms: ["che guevara", "el che", "ernesto guevara", "che", "ernesto che guevara"],
    clues: ["Su imagen icónica con boina negra y mirada al horizonte fotografiada por Alberto Korda es un símbolo mundial.", "Fue el médico argentino que comandó junto a Fidel Castro la victoria de la Revolución Cubana en 1959.", "Murió ejecutado en una selva de Bolivia mientras intentaba expandir focos guerrilleros revolucionarios."]
  },
  {
    name: "Reina Isabel II",
    filters: { region: "europa", area: "history", nature: "real", era: "historical" },
    birthYear: 1926, deathYear: 2022, country: "Reino Unido",
    demonyms: ["britanico", "britanica", "ingles", "inglesa", "europeo", "europea"],
    description: "Monarca británica con el reinado más largo en la historia de su país (70 años).",
    attributes: { hombre: false, mujer: true, vivo: false, muerto: true, real: true, ficticio: false, reina: true, gobernante: true, inglesa: true, britanica: true },
    synonyms: ["isabel ii", "reina isabel", "queen elizabeth", "elizabeth ii"],
    clues: ["Fue coronada en el año 1953 en lo que fue la primera transmisión en directo por televisión de escala masiva.", "Vivió y gobernó durante el transcurso de mandatos de 15 primeros ministros británicos (desde Churchill hasta Liz Truss).", "Fue la jefa de Estado y Reina del Reino Unido durante 70 años, residiendo en el Palacio de Buckingham."]
  },
  {
    name: "José de San Martín",
    filters: { region: "latam", area: "history", nature: "real", era: "historical" },
    birthYear: 1778, deathYear: 1850, country: "Argentina",
    demonyms: ["argentino", "argentina", "sudamericano", "sudamericana", "latinoamericano", "latino"],
    description: "Militar y prócer argentino, libertador de Argentina, Chile y Perú en la independencia sudamericana.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, militar: true, libertador: true, argentino: true, latino: true, sudamericano: true },
    synonyms: ["san martin", "jose de san martin", "el padre de la patria"],
    clues: ["Lideró una de las mayores hazañas militares del continente al cruzar la Cordillera de los Andes con su ejército en 1817.", "Es recordado históricamente en Argentina con el título de 'Padre de la Patria'.", "Nació en Yapeyú y proclamó formalmente la declaración de independencia de Chile y de Perú."]
  },
  {
    name: "Winston Churchill",
    filters: { region: "europa", area: "history", nature: "real", era: "historical" },
    birthYear: 1874, deathYear: 1965, country: "Reino Unido",
    demonyms: ["britanico", "britanica", "ingles", "inglesa", "europeo", "europea"],
    description: "Primer ministro británico que lideró al Reino Unido durante la Segunda Guerra Mundial.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, politico: true, ingles: true, britanico: true },
    synonyms: ["churchill", "winston churchill"],
    clues: ["Inmortalizó el gesto de la mano formando una 'V' para simbolizar la victoria e hizo famoso su sombrero y puro de tabaco.", "Pronunció el histórico discurso en el que prometió únicamente 'sangre, esfuerzo, lágrimas y sudor' ante la invasión nazi.", "Fue primer ministro británico durante la Segunda Guerra Mundial y ganó el Premio Nobel de Literatura en 1953."]
  },
  {
    name: "Genghis Khan",
    filters: { region: "asia_africa", area: "history", nature: "real", era: "historical" },
    birthYear: 1162, deathYear: 1227, country: "Mongolia",
    demonyms: ["mongol", "asiatico", "asiatica"],
    description: "Fundador y primer Gran Kan del Imperio mongol, el imperio contiguo más grande de la historia.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, militar: true, gobernante: true, mongol: true, antiguo: true },
    synonyms: ["genghis khan", "gengis kan", "temujin"],
    clues: ["Su nombre de nacimiento era Temuyín y unificó a todas las tribus nómadas de las estepas del norte de Asia.", "Es el creador del Imperio Mongol, famoso por sus temibles arqueros a caballo.", "Es responsable de campañas que redujeron drásticamente la población mundial, pero conectaron Asia con Europa mediante la Ruta de la Seda."]
  },
  {
    name: "Cristóbal Colón",
    filters: { region: "europa", area: "history", nature: "real", era: "historical" },
    birthYear: 1451, deathYear: 1506, country: "Italia", // Origen genovés, navegó para España
    demonyms: ["genoves", "genovesa", "italiano", "italiana", "español", "española", "europeo", "europea"],
    description: "Navegante genovés que lideró la expedición española que llegó a América en 1492.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, navegante: true, explorador: true, italiano: true, europeo: true },
    synonyms: ["colon", "cristobal colon", "cristoforo colombo"],
    clues: ["Lideró una histórica expedición financiada por los Reyes Católicos que cruzó el océano en tres carabelas (la Pinta, la Niña y la Santa María).", "Murió creyendo que había llegado a las Indias orientales en lugar de a un nuevo continente.", "Su llegada a las costas americanas el 12 de octubre de 1492 cambió para siempre el rumbo de la historia universal."]
  },
  {
    name: "George Washington",
    filters: { region: "usa", area: "history", nature: "real", era: "historical" },
    birthYear: 1732, deathYear: 1799, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Primer presidente de los Estados Unidos y comandante en jefe del Ejército Continental.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, militar: true, presidente: true, americano: true, estadounidense: true },
    synonyms: ["washington", "george washington"],
    clues: ["Es el único presidente en la historia de su país que ha sido elegido de manera unánime por el Colegio Electoral.", "Lideró al Ejército Continental en la Guerra de Independencia contra el Imperio Británico.", "Fue el primer presidente de los EE. UU. y su rostro adorna el billete de un dólar."]
  },
  {
    name: "Marco Polo",
    filters: { region: "europa", area: "history", nature: "real", era: "historical" },
    birthYear: 1254, deathYear: 1324, country: "Italia",
    demonyms: ["veneciano", "veneciana", "italiano", "italiana", "europeo", "europea"],
    description: "Mercader y explorador veneciano, famoso por sus viajes a Asia descritos en el 'Libro de las maravillas'.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: true, ficticio: false, explorador: true, viajero: true, italiano: true, europeo: true },
    synonyms: ["marco polo", "polo"],
    clues: ["Pasó 17 años trabajando al servicio del emperador mongol Kublai Kan en Catay (antiguo nombre de China).", "Sus aventuras y descripciones del lejano Oriente se dictaron y compilaron en prisión bajo el título 'El libro de las maravillas'.", "Nació en Venecia e introdujo a la Europa medieval los conceptos de papel moneda, carbón y pasta provenientes de China."]
  },
  {
    name: "Juana la Loca",
    filters: { region: "europa", area: "history", nature: "real", era: "historical" },
    birthYear: 1479, deathYear: 1555, country: "España",
    demonyms: ["español", "española", "europeo", "europea"],
    description: "Reina de Castilla, hija de los Reyes Católicos, apartada del poder debido a su presunta inestabilidad mental.",
    attributes: { hombre: false, mujer: true, vivo: false, muerto: true, real: true, ficticio: false, reina: true, española: true, europea: true },
    synonyms: ["juana la loca", "juana i de castilla", "juana de castilla"],
    clues: ["Fue hija de los célebres monarcas Isabel la Católica y Fernando de Aragón.", "Sufrió el encierro durante casi 46 años en el castillo de Tordesillas por orden de su padre y luego de su propio hijo, Carlos I.", "Su apodo popular describe una inestabilidad mental agudizada tras la muerte de su esposo, Felipe el Hermoso."]
  },
  {
    name: "Eva Perón",
    filters: { region: "latam", area: "history", nature: "real", era: "historical" },
    birthYear: 1919, deathYear: 1952, country: "Argentina",
    demonyms: ["argentino", "argentina", "sudamericano", "sudamericana", "latinoamericano", "latino"],
    description: "Actriz y líder política argentina, impulsora del sufragio femenino y de ayuda social masiva.",
    attributes: { hombre: false, mujer: true, vivo: false, muerto: true, real: true, ficticio: false, politica: true, argentina: true, latina: true, sudamericana: true },
    synonyms: ["eva peron", "evita", "evita peron", "maria eva duarte"],
    clues: ["Se inmortalizó con sus discursos ante multitudes desde el balcón de la Casa Rosada y era llamada cariñosamente 'Evita'.", "Logró la sanción de la ley de sufragio femenino (voto de la mujer) en Argentina en 1947.", "Fue esposa del tres veces presidente Juan Domingo Perón y falleció de cáncer a los 33 años."]
  },

  // ==========================================
  // --- PERSONAJES FICTICIOS (86-100) ---
  // ==========================================
  {
    name: "Harry Potter",
    filters: { region: "europa", area: "fiction", nature: "fictional", era: "current" },
    birthYear: 1980, deathYear: null, country: "Reino Unido",
    demonyms: ["ingles", "inglesa", "britanico", "britanica", "europeo", "europea"],
    description: "Mago huérfano protagonista de una famosa saga de libros y películas escrita por J.K. Rowling.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: false, ficticio: true, mago: true, magia: true, britanico: true, ingles: true, europeo: true },
    synonyms: ["harry potter", "harry", "potter", "el niño que sobrevivio"],
    clues: ["Su mascota favorita es una lechuza blanca llamada Hedwig.", "Estudió hechicería en el Colegio Hogwarts y pertenece a la casa Gryffindor.", "Tiene una distintiva cicatriz roja en forma de rayo en la frente debido a un hechizo de Lord Voldemort."]
  },
  {
    name: "Batman",
    filters: { region: "usa", area: "fiction", nature: "fictional", era: "current" },
    birthYear: 1939, deathYear: null, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana", "gothamita"],
    description: "Superhéroe de DC Comics, protector de Gotham City, cuya identidad es Bruce Wayne.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: false, ficticio: true, superheroe: true, murcielago: true, rico: true, millonario: true, capa: true, mascara: true },
    synonyms: ["batman", "bruce wayne", "bruno diaz", "caballero de la noche", "caballero oscuro"],
    clues: ["Perdió a sus padres en un callejón y juró venganza entrenando al límite de la capacidad humana.", "Su base secreta se encuentra oculta bajo la mansión de la familia Wayne.", "Es el alter ego de Bruce Wayne, un millonario que viste de murciélago para patrullar Gotham."]
  },
  {
    name: "Spider-Man",
    filters: { region: "usa", area: "fiction", nature: "fictional", era: "current" },
    birthYear: 1962, deathYear: null, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana", "neoyorquino", "neoyorquina"],
    description: "Superhéroe de Marvel, picado por una araña radiactiva, cuya identidad es Peter Parker.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: false, ficticio: true, superheroe: true, araña: true, rojo: true, azul: true, telaraña: true },
    synonyms: ["spiderman", "spider-man", "peter parker", "el hombre araña", "hombre araña", "spidey"],
    clues: ["Combate el crimen trepando paredes y balanceándose por los rascacielos de Nueva York usando telarañas.", "Fue criado por sus tíos Ben y May tras quedar huérfano.", "Su identidad civil es Peter Parker, un joven fotógrafo picado por una araña radiactiva."]
  },
  {
    name: "Sherlock Holmes",
    filters: { region: "europa", area: "fiction", nature: "fictional", era: "historical" },
    birthYear: 1854, deathYear: null, country: "Reino Unido",
    demonyms: ["ingles", "inglesa", "britanico", "britanica", "europeo", "europea"],
    description: "El detective consultor más famoso de la literatura, creado por Arthur Conan Doyle.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: false, ficticio: true, detective: true, britanico: true, ingles: true, europeo: true },
    synonyms: ["sherlock holmes", "sherlock", "holmes"],
    clues: ["Utiliza una lupa para analizar huellas y fuma tabaco en una pipa de calabaza.", "Su residencia se encuentra en el 221B de Baker Street en Londres, la cual comparte con el Dr. John Watson.", "Es el detective literario victoriano que utiliza el método de la deducción lógica para resolver crímenes."]
  },
  {
    name: "Don Quijote de la Mancha",
    filters: { region: "europa", area: "fiction", nature: "fictional", era: "historical" },
    birthYear: 1605, deathYear: null, country: "España",
    demonyms: ["español", "española", "manchego", "manchega", "europeo", "europea"],
    description: "Caballero andante de la célebre novela de Miguel de Cervantes, famoso por su locura.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: false, ficticio: true, caballero: true, español: true, europeo: true, loco: true },
    synonyms: ["don quijote", "quijote", "don quijote de la mancha", "el caballero de la triste figura"],
    clues: ["Su montura es un caballo desgarbado llamado Rocinante.", "Se volvió loco leyendo libros de caballería e inició un viaje acompañado de su escudero Sancho Panza.", "Es el protagonista de la obra cumbre de la literatura española escrita por Miguel de Cervantes."]
  },
  {
    name: "Homero Simpson",
    filters: { region: "usa", area: "fiction", nature: "fictional", era: "current" },
    birthYear: 1956, deathYear: null, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana", "springfieldiano"],
    description: "Padre de la familia Simpson, amante de las rosquillas y la cerveza Duff.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: false, ficticio: true, dibujo: true, animado: true, amarillo: true, gordo: true, calvo: true },
    synonyms: ["homero", "homer", "homero simpson", "homer simpson"],
    clues: ["Su exclamación característica ante un error propio es el famoso ¡D'oh! (traducido como ¡Ouch!).", "Es calvo, amarillo, le encantan las donas/rosquillas y trabaja como inspector de seguridad nuclear.", "Es el patriarca de la familia de caricaturas más famosa de la televisión de EE.UU., casado con Marge."]
  },
  {
    name: "Goku",
    filters: { region: "asia_africa", area: "fiction", nature: "fictional", era: "current" },
    birthYear: 737, deathYear: null, country: "Planeta Vegeta",
    demonyms: ["saiyajin", "alienigena", "extraterrestre", "japones", "japonesa", "asiatico", "asiatica"],
    description: "Guerrero saiyajin de la serie Dragon Ball, protector de la Tierra.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: false, ficticio: true, dibujo: true, anime: true, japones: true, asiatico: true, alienigena: true, saiyajin: true },
    synonyms: ["goku", "son goku", "kakaroto", "gokuh"],
    clues: ["Puede transformarse en una forma legendaria con cabello dorado erizado conocida como Súper Saiyajin.", "Fue enviado a la Tierra de bebé desde el planeta Vegeta con el nombre natal de Kakaroto.", "Es el protagonista de anime creado por Akira Toriyama que busca recolectar las Esferas del Dragón."]
  },
  {
    name: "Darth Vader",
    filters: { region: "usa", area: "fiction", nature: "fictional", era: "current" },
    birthYear: 1977, deathYear: 1983, country: "Tatooine",
    demonyms: ["tatooinense", "sith", "espacial", "alienigena", "extraterrestre"],
    description: "Señor Oscuro de los Sith en la saga Star Wars, originalmente Anakin Skywalker.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: false, ficticio: true, malo: true, villano: true, espacio: true, espada_laser: true, negro: true, mascara: true },
    synonyms: ["darth vader", "vader", "anakin skywalker", "anakin", "lord vader"],
    clues: ["Viste una armadura negra con un casco hermético y produce un característico sonido de respiración mecánica.", "Le revela al protagonista Luke Skywalker una de las verdades familiares más famosas del cine: 'Yo soy tu padre'.", "Fue un Caballero Jedi llamado Anakin Skywalker antes de pasarse al Lado Oscuro de la Fuerza en Star Wars."]
  },
  {
    name: "Barbie",
    filters: { region: "usa", area: "fiction", nature: "fictional", era: "current" },
    birthYear: 1959, deathYear: null, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana", "norteamericano", "norteamericana"],
    description: "Muñeca de moda de fama mundial de Mattel, protagonista de múltiples películas.",
    attributes: { hombre: false, mujer: true, vivo: true, muerto: false, real: false, ficticio: true, muñeca: true, juguete: true, rubia: true, rosa: true, rosado: true },
    synonyms: ["barbie", "barby", "muñeca barbie"],
    clues: ["Su novio de toda la vida es un muñeco llamado Ken.", "Tiene un convertible y su color de identidad corporativa y estética es el rosa brillante.", "Es la muñeca de juguete de plástico más vendida del mundo, creada por Ruth Handler para Mattel."]
  },
  {
    name: "Frodo Bolsón",
    filters: { region: "europa", area: "fiction", nature: "fictional", era: "historical" }, // Fantasía épica medieval
    birthYear: 2968, deathYear: null, country: "La Comarca", // Calendario de la Tierra Media
    demonyms: ["hobbit", "mediano", "comarcano", "fantastico", "fantastica"],
    description: "Hobbit de la Comarca, protagonista de 'El Señor de los Anillos' y portador del Anillo Único.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: false, ficticio: true, hobbit: true, pequeño: true, fantasia: true },
    synonyms: ["frodo", "frodo bolson", "frodo baggins"],
    clues: ["Es un personaje de muy baja estatura perteneciente a una raza de seres con pies peludos y sin barbas (Hobbit).", "Su mejor amigo y fiel sirviente se llama Samwise Gamyi (Sam).", "Le fue encomendada la heroica misión de destruir el Anillo Único en los fuegos del Monte del Destino."]
  },
  {
    name: "Luke Skywalker",
    filters: { region: "usa", area: "fiction", nature: "fictional", era: "current" },
    birthYear: 1977, deathYear: null, country: "Tatooine",
    demonyms: ["tatooinense", "jedi", "espacial", "alienigena"],
    description: "Héroe de Star Wars, caballero Jedi clave en la caída del Imperio Galáctico.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: false, ficticio: true, superheroe: true, jedi: true, espada_laser: true, piloto: true },
    synonyms: ["luke", "luke skywalker", "skywalker"],
    clues: ["Fue criado como granjero de humedad en el árido planeta desértico de Tatooine por sus tíos.", "Su primer maestro espiritual en las artes de la Fuerza fue el sabio y pequeño maestro Yoda.", "Es el joven portador de un sable de luz verde que destruyó la primera Estrella de la Muerte en Star Wars."]
  },
  {
    name: "Mickey Mouse",
    filters: { region: "usa", area: "fiction", nature: "fictional", era: "current" },
    birthYear: 1928, deathYear: null, country: "Estados Unidos",
    demonyms: ["estadounidense", "americano", "americana"],
    description: "Ratón antropomórfico animado de Disney, icono de la cultura pop mundial.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: false, ficticio: true, dibujo: true, animado: true, raton: true, negro: true },
    synonyms: ["mickey", "mickey mouse", "raton mickey", "miki mouse"],
    clues: ["Viste unos característicos pantalones cortos rojos con dos botones blancos en el frente.", "Tiene una novia eterna llamada Minnie y un perro fiel y no parlante llamado Pluto.", "Es el ratón animado creado por Walt Disney que es el ícono corporativo global de su compañía."]
  },
  {
    name: "Super Mario",
    filters: { region: "asia_africa", area: "fiction", nature: "fictional", era: "current" }, // Origen Nintendo (Japón)
    birthYear: 1981, deathYear: null, country: "Reino Champiñón",
    demonyms: ["italiano", "italiana", "fontanero", "japones", "japonesa"],
    description: "Fontanero de los videojuegos de Nintendo, héroe del Reino Champiñón.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: false, ficticio: true, fontanero: true, gorra: true, bigote: true, videojuego: true },
    synonyms: ["mario", "super mario", "mario bros", "mario mario"],
    clues: ["Es un fontanero que viste un overol azul sobre una camiseta roja, y lleva una gorra con su inicial.", "Su hermano menor viste de verde y se llama Luigi.", "Su misión principal es rescatar a la Princesa Peach de las garras de la tortuga gigante Bowser."]
  },
  {
    name: "Pikachu",
    filters: { region: "asia_africa", area: "fiction", nature: "fictional", era: "current" }, // Pokémon (Japón)
    birthYear: 1996, deathYear: null, country: "Kanto", // Mundo Pokémon
    demonyms: ["pokemon", "japones", "japonesa", "electrico", "fantastico"],
    description: "Pokémon de tipo eléctrico de color amarillo, mascota oficial de la franquicia Pokémon.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: false, ficticio: true, pokemon: true, amarillo: true, electrico: true, cola: true },
    synonyms: ["pikachu", "pika"],
    clues: ["Su cola tiene la forma distintiva de un rayo y tiene círculos rojos en sus mejillas.", "Su poder principal consiste en descargar electricidad, siendo su ataque más famoso el 'Impactrueno'.", "Es la mascota oficial de la franquicia japonesa Pokémon y el fiel compañero de Ash Ketchum."]
  },
  {
    name: "Superman",
    filters: { region: "usa", area: "fiction", nature: "fictional", era: "current" },
    birthYear: 1938, deathYear: null, country: "Criptón", // Nació en Krypton, vive en USA
    demonyms: ["criptoniano", "criptoniana", "estadounidense", "americano", "americana", "alienigena"],
    description: "Superhéroe de DC Comics de origen alienígena, defensor de Metropolis con capa roja.",
    attributes: { hombre: true, mujer: false, vivo: true, muerto: false, real: false, ficticio: true, superheroe: true, capa: true, fuerte: true, vuela: true, anteojos: true },
    synonyms: ["superman", "clark kent", "kal-el", "el hombre de acero"],
    clues: ["Su único punto débil es la exposición a un mineral radiactivo verde de su planeta de origen (Kryptonita).", "Trabaja en secreto como el tímido periodista Clark Kent en el periódico 'Daily Planet'.", "Lleva una gran letra 'S' en el pecho, tiene capa roja y vuela para defender la ciudad de Metrópolis."]
  },
  {
    name: "Sherlock Holmes",
    filters: { region: "europa", area: "fiction", nature: "fictional", era: "historical" },
    birthYear: 1854, deathYear: null, country: "Reino Unido",
    demonyms: ["ingles", "inglesa", "britanico", "britanica", "europeo", "europea"],
    description: "El detective consultor más famoso de la literatura, creado por Arthur Conan Doyle.",
    attributes: { hombre: true, mujer: false, vivo: false, muerto: true, real: false, ficticio: true, detective: true, britanico: true, ingles: true, europeo: true },
    synonyms: ["sherlock holmes", "sherlock", "holmes"],
    clues: ["Utiliza una lupa para analizar huellas y fuma tabaco en una pipa de calabaza.", "Su residencia se encuentra en el 221B de Baker Street en Londres, la cual comparte con el Dr. John Watson.", "Es el detective literario victoriano que utiliza el método de la deducción lógica para resolver crímenes."]
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
