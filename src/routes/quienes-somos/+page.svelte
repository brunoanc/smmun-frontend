<script lang="ts">
    import SmmunEdition from "$lib/components/SmmunEdition.svelte";
    import { registroConfig } from "$lib/data/registro";

    const mission = "Ofrecer una experiencia formativa que reconozca y celebre la esencia única de cada persona, construyendo espacios donde las juventudes puedan expresar sus ideas, descubrir su voz y asumirse como agentes de cambio. A través del debate, la reflexión y la convivencia, buscamos fomentar habilidades como la empatía, la colaboración, la escucha activa y el liderazgo con propósito.\n\nBuscamos crear una experiencia que trascienda lo académico y permita encender en cada asistente esa chispa interior que impulsa a crear un mundo más justo, consciente y profundamente humano.";

    const vision = `Ser la edición donde cada persona encuentre un espacio para reconocerse, conectar con su voz y compartir lo que la mueve. Un Modelo que abrace la autenticidad, celebre la diversidad y permita que las ideas surjan desde lo más íntimo para proyectarse hacia lo colectivo. ${registroConfig.edicion} será un punto de encuentro entre historias, emociones y visiones del mundo; un lugar donde las chispas individuales se enciendan al encontrarse con otras, creando una comunidad que inspire, transforme y deje huella más allá del debate.`;

    const ediciones = [
        {
            year: 2026,
            edition: "UNA NUEVA HISTORIA",
            color: "#ffffff",
            bgColor: "#ff6b6b",
            imageDimensions: [[1800, 703], [1800, 1200], [1800, 1200]],
            text: "En la onceava edición del SMMUN, dimos inicio a una nueva etapa para el modelo bajo el lema “Una Nueva Historia”. Esta edición representó un momento de evolución, reconociendo el camino construido desde 2016 y abriendo nuevas oportunidades para que más juventudes continúen participando, aprendiendo y creciendo dentro de este espacio.\n\nDurante la edición se impulsaron diversas actividades para fortalecer la comunidad, destacando especialmente el Día de los Futuros, un evento emblemático que invitó a reflexionar sobre el papel de las nuevas generaciones en la construcción del mundo que viene.\n\nAsimismo, el modelo amplió su visión internacional mediante un viaje académico a Colombia, donde integrantes de SMMUN representaron al sureste mexicano en espacios de diálogo y cooperación con la comunidad internacional de Modelos de Naciones Unidas."
        },
        {
            year: 2025,
            edition: "LEGADO DE LÍDERES",
            color: "#ffffff",
            bgColor: "#00608a",
            imageDimensions: [[2000, 1500], [960, 720], [2000, 1500]],
            text: "“De soñadores en acción, para líderes con pasión”\n\nEn la décima edición aniversario del SMMUN, vivimos muchas sorpresas y aventuras, rompiendo récords previamente establecidos. Más de 500 participantes formaron parte de 10 comités que representaban a cada una de las ediciones del Modelo desde su origen en 2016.\n\nPor primera vez se realizó un viaje internacional a dos destinos: Madrid, España, para participar en URJCMUN, y París, Francia, para visitar la sede de la UNESCO. También se realizó el primer viaje nacional a Puebla, México, para ser parte de UPAMUN.\n\nDurante la edición se llevaron a cabo cinco eventos para honrar la historia y el crecimiento del Modelo, entre ellos el Día SM, RLMMUN, Leadership Lab y una Entrega de Kits inolvidable."
        },
        {
            year: 2024,
            edition: "FOR EQUALITY",
            color: "#ffffff",
            bgColor: "#ff57b6",
            imageDimensions: [[2000, 1500], [2000, 1500], [2000, 1500]],
            text: "Trabajando con base en el Objetivo de Desarrollo Sostenible 10, Reducción de las desigualdades, se buscó impulsar una igualdad sustantiva e interseccional. Un mundo pacífico, justo y sostenible se construye con la participación activa de todas las personas; nuestras delegaciones representan esa ciudadanía que se educa y promueve el bienestar de su comunidad.\n\nEn esta edición se conmemora la segunda delegación oficial del SM que participó en un Modelo Internacional: McMUN en Montreal, Canadá."
        },
        {
            year: 2023,
            edition: "FOR DIVERSITY",
            color: "#ffffff",
            bgColor: "#6841c7",
            imageDimensions: [[960, 720], [960, 720], [960, 720]],
            text: "Las sociedades son grandes, cambiantes y diversas. En un mundo altamente relacionado, celebrar la diversidad es necesario; cada persona tiene cualidades propias que benefician la vida en conjunto.\n\nPara respetar esta diversidad, se promovió el uso de comités a distancia en modalidad digital; además, fue la primera vez que se recibieron presencialmente delegaciones oficiales de otros países. También se conmemora a la primera delegación oficial del SM que participó en un Modelo Internacional: FWWMUN en Nueva York, Estados Unidos."
        },
        {
            year: 2022,
            edition: "FOR YOUTH",
            color: "#190f5b",
            bgColor: "#67e3ff",
            imageDimensions: [[2000, 1500], [2000, 1500], [2000, 1500]],
            text: "Por primera vez, el Modelo se enfocó en su público objetivo: las juventudes. Buscando dejar atrás el adultocentrismo, se visibilizó el deseo e interés de participar en la política por parte de sus delegaciones. La inclusión de estas juventudes en temas políticos demuestra el compromiso de construir un futuro que responda a las necesidades e intereses de todas las generaciones. Trabajando en conjunto y de manera interseccional, se regresó a debatir bajo la nueva normalidad y se impulsó la reapertura de actividades académicas en Mérida."
        },
        {
            year: 2021,
            edition: "FOR HEALTH",
            color: "#ffffff",
            bgColor: "#042654",
            imageDimensions: [[1421, 1066], [949, 712], [1421, 1066]],
            text: "Aún viviendo una pandemia, el SMMUN procuró brindar un espacio de diálogo y entendimiento a las delegaciones interesadas. Con participación nacional e internacional en modalidad digital, se aportaron soluciones a problemáticas presentes en sus espacios de crecimiento. Incluso con un futuro incierto ante las contingencias sanitarias, las delegaciones demostraron que es posible mantenerse optimista ante los cambios en nuestra sociedad."
        },
        {
            year: 2020,
            edition: "FOR WOMEN",
            color: "#190f5b",
            bgColor: "#84b8fd",
            imageDimensions: [[1421, 1066], [1421, 1066], [1421, 1066]],
            text: "Relacionado principalmente con el Objetivo de Desarrollo Sostenible 5, garantizar la igualdad de género ha representado una meta en todos los ámbitos. El desafío de la nueva época es visibilizar que se debe hablar sobre mujeres desde la pluralidad, manteniendo una perspectiva interseccional de sus problemáticas. Las delegaciones, aún a la distancia, aprendieron a trabajar en equipo y a utilizar herramientas digitales para promover un futuro más inclusivo."
        },
        {
            year: 2019,
            edition: "FOR PEACE",
            color: "#ffffff",
            bgColor: "#5962cb",
            imageDimensions: [[1072, 804], [1280, 960], [1072, 804]],
            text: "La paz es el principio fundacional de la ONU, además de ser el principal objetivo a alcanzar en un mundo que vive en conflicto. Al conocer diferentes historias, realidades y preocupaciones, nuestras delegaciones entendieron las situaciones que dificultan alcanzar la paz. También aprendieron que el diálogo es la mejor herramienta para una vida en armonía y que su voz es importante para lograr un cambio en el mundo."
        },
        {
            year: 2018,
            edition: "FOR DEVELOPMENT",
            color: "#ffffff",
            bgColor: "#0097b2",
            imageDimensions: [[996, 747], [1080, 810], [1080, 810]],
            text: "El desarrollo se define como un proceso continuo destinado a mejorar la calidad de vida de la ciudadanía. Esta edición permitió a las delegaciones trabajar con cada una de sus aristas más importantes: estabilidad económica, progreso social, protección al medio ambiente, participación política activa, igualdad y justicia en la sociedad.\n\nTener una ciudadanía informada garantiza un correcto desarrollo a futuro y nuestras delegaciones liderarán el cambio."
        },
        {
            year: 2017,
            edition: "FOR CHILDREN",
            color: "#190f5b",
            bgColor: "#5ce1e6",
            imageDimensions: [[1549, 1162], [639, 479], [1549, 1162]],
            text: "Las infancias son uno de los grupos más vulnerables de la población, por lo que se buscó crear conciencia sobre sus problemáticas a lo largo de esta edición, promoviendo derechos como vivir en un mundo libre de violencia, explotación y discriminación; el derecho a la salud y al bienestar, y el derecho a una educación de calidad, entre otros."
        },
        {
            year: 2016,
            edition: "FOR EDUCATION",
            color: "#190f5b",
            bgColor: "#fdca40",
            imageDimensions: [[1820, 1365], [1064, 798], [1080, 810]],
            text: "La educación es un tema fundamental para el desarrollo del SMMUN, ya que es un derecho humano y un bien público esencial. Todas las infancias, juventudes y personas adultas tienen derecho a una educación de calidad que les permita desarrollar todo su potencial y contribuir plenamente a la sociedad.\n\nLa educación debe ser inclusiva y de calidad para todas las personas, adaptándose a sus necesidades independientemente de su origen, género, discapacidad o cualquier otra condición."
        }
    ];
</script>

<section class="about-hero">
    <img class="about-star" src="/assets/img/stars/2.svg" alt="" />
    <div class="about-heading">
        <span>Conoce nuestra historia</span>
        <h1>¿Quiénes somos?</h1>
    </div>

    <div class="about-card">
        <div class="about-copy">
            <p>El Modelo de Naciones Unidas del Sureste Mexicano (SMMUN) es un espacio donde las ideas, las voces y la pasión de las juventudes cobran vida. Inspirado en la Organización de las Naciones Unidas, reúne a estudiantes con motivaciones únicas para entender el mundo y transformarlo.</p>
            <p>Aquí, cada persona tiene la oportunidad de descubrir su voz, compartir sus ideas y aprender del encuentro con otras perspectivas. A través del debate, la reflexión y la convivencia, el SMMUN busca que las juventudes desarrollen empatía, pensamiento crítico y liderazgo con propósito.</p>
            <p>Tras el éxito de su primer año en 2016, se llevan a cabo ediciones anuales en Mérida, Yucatán. Estudiantes de secundaria, preparatoria y universidad entre los {registroConfig.participantes.edadMinima} y {registroConfig.participantes.edadMaxima} años están invitados a participar en uno de los principales espacios de participación juvenil inspirados en la ONU en el sureste de México.</p>
        </div>
        <figure>
            <img src="/assets/img/about.webp" alt="Participante de SMMUN" />
        </figure>
    </div>
</section>

<section class="spark-section">
    <div class="spark-copy">
        <h2>¿Qué buscamos con esta edición?</h2>
        <p>En un mundo donde lo colectivo opaca lo personal, esta edición busca volver a mirar al individuo. A cada historia, cada emoción, cada pregunta, cada esfuerzo.</p>
        <p>Porque el cambio que buscamos para el mundo no comienza en una idea abstracta: comienza en una persona. Y esa primera chispa, cuando encuentra a otras que brillan y sueñan igual que ella, se convierte en fuego.</p>
        <p>“{registroConfig.lema}” es un homenaje a la humanidad hecha persona. A lo que somos cuando reconocemos nuestro valor, compartimos lo que nos mueve y decidimos construir algo con sentido.</p>
        <strong>Somos personas encendiendo su chispa.</strong>
    </div>
    <figure>
        <img src="/assets/img/edition-galaxy.webp" alt={`Galaxia, inspiración visual de ${registroConfig.lema}`} loading="lazy" />
    </figure>
</section>

<section class="purpose-section mission">
    <div class="purpose-copy">
        <span class="vertical-label">MISIÓN</span>
        <p>{mission}</p>
    </div>
    <figure>
        <img src="/assets/img/mission.webp" alt="Equipo de SMMUN" loading="lazy" />
    </figure>
</section>

<section class="purpose-section vision">
    <figure>
        <img src="/assets/img/vision.webp" alt="Integrantes de SMMUN" loading="lazy" />
    </figure>
    <div class="purpose-copy">
        <span class="vertical-label">VISIÓN</span>
        <p>{vision}</p>
    </div>
</section>

<aside class="sagan-quote">
    <p>“We are starstuff pondering the stars”</p>
    <span>Carl Sagan</span>
</aside>

<section class="history-intro">
    <span>Desde 2016</span>
    <h2>Nuestra historia sigue encendiendo nuevas chispas</h2>
</section>

<section class="editions" aria-label="Ediciones anteriores del SMMUN">
    {#each ediciones as edition, index}
        <SmmunEdition {...edition} reverse={index % 2 === 1} />
    {/each}
</section>

<style>
    .about-hero {
        position: relative;
        overflow: hidden;
        padding: clamp(4rem, 7vw, 7rem) 6vw clamp(5rem, 8vw, 8rem);
        background:
            radial-gradient(circle at 90% 8%, rgba(103, 227, 255, 0.34), transparent 23%),
            linear-gradient(180deg, #ffffff, #f7f5ff);
    }

    .about-star {
        position: absolute;
        top: 4rem;
        right: 6vw;
        width: clamp(4rem, 8vw, 8rem);
        opacity: 0.44;
    }

    .about-heading {
        width: min(88vw, 1450px);
        margin: 0 auto clamp(2.2rem, 4vw, 4rem);
    }

    .about-heading span,
    .history-intro > span {
        color: var(--pink);
        font-size: 0.74rem;
        font-weight: 800;
        letter-spacing: 0.22em;
        text-transform: uppercase;
    }

    .about-heading h1 {
        margin: 0.5rem 0 0;
        color: var(--navy);
        font-family: "Binate", "Raleway", sans-serif;
        font-size: clamp(3rem, 7vw, 7.5rem);
        line-height: 0.92;
    }

    .about-card {
        width: min(88vw, 1450px);
        min-height: 35rem;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1.15fr 0.85fr;
        overflow: hidden;
        border-radius: 2rem;
        color: #ffffff;
        background:
            radial-gradient(circle at 0 100%, rgba(255, 87, 182, 0.26), transparent 33%),
            var(--navy);
        box-shadow: 0 2rem 5rem rgba(25, 15, 91, 0.2);
    }

    .about-copy {
        align-self: center;
        padding: clamp(2.2rem, 5vw, 5.5rem);
    }

    .about-copy p {
        margin: 0;
        font-size: clamp(0.95rem, 1.2vw, 1.1rem);
        line-height: 1.78;
    }

    .about-copy p + p {
        margin-top: 1.2rem;
    }

    .about-card figure,
    .about-card img {
        width: 100%;
        height: 100%;
    }

    .about-card img {
        display: block;
        object-fit: cover;
        object-position: center top;
        filter: grayscale(1) contrast(1.08);
    }

    .spark-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        min-height: 44rem;
        background: #ffffff;
    }

    .spark-copy {
        align-self: center;
        padding: clamp(3rem, 7vw, 8rem);
    }

    .spark-copy h2 {
        margin: 0.55rem 0 1.8rem;
        color: var(--navy);
        font-family: "Binate", "Raleway", sans-serif;
        font-size: clamp(2.4rem, 5.3vw, 5.7rem);
        line-height: 0.96;
    }

    .spark-copy p {
        margin: 0 0 1rem;
        color: #413b61;
        line-height: 1.72;
    }

    .spark-copy strong {
        display: block;
        margin-top: 2rem;
        color: var(--coral);
        font-family: "Caveat", cursive;
        font-size: clamp(1.8rem, 3vw, 3rem);
        font-weight: 600;
    }

    .spark-section figure,
    .spark-section img {
        width: 100%;
        height: 100%;
    }

    .spark-section img {
        display: block;
        object-fit: cover;
    }

    .purpose-section {
        display: grid;
        grid-template-columns: 1.03fr 0.97fr;
        min-height: 39rem;
        color: #ffffff;
        background: var(--navy);
    }

    .purpose-section.vision {
        grid-template-columns: 0.97fr 1.03fr;
        background: #ffffff;
        color: var(--navy);
    }

    .purpose-copy {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: clamp(1.5rem, 3vw, 3.5rem);
        align-items: center;
        padding: clamp(3rem, 6vw, 7rem);
    }

    .vertical-label {
        color: var(--yellow);
        font-family: "Binate", "Raleway", sans-serif;
        font-size: clamp(2.1rem, 4vw, 4rem);
        letter-spacing: 0.15em;
        writing-mode: vertical-rl;
        transform: rotate(180deg);
    }

    .vision .vertical-label {
        color: var(--pink);
    }

    .purpose-copy p {
        margin: 0;
        font-size: clamp(0.96rem, 1.25vw, 1.12rem);
        line-height: 1.78;
        white-space: pre-line;
    }

    .purpose-section figure,
    .purpose-section img {
        width: 100%;
        height: 100%;
    }

    .purpose-section img {
        display: block;
        object-fit: cover;
    }

    .sagan-quote {
        padding: clamp(3rem, 5vw, 5rem) 6vw;
        color: #ffffff;
        text-align: center;
        background: var(--navy);
    }

    .sagan-quote p {
        margin: 0;
        font-family: "Binate", "Raleway", sans-serif;
        font-size: clamp(1.7rem, 3vw, 3rem);
    }

    .sagan-quote span {
        display: block;
        margin-top: 0.7rem;
        color: var(--yellow);
        font-family: "Caveat", cursive;
        font-size: 1.7rem;
    }

    .history-intro {
        padding: clamp(5rem, 9vw, 9rem) 6vw;
        text-align: center;
        background: #f8f7ff;
    }

    .history-intro h2 {
        width: min(58rem, 100%);
        margin: 0.8rem auto 0;
        color: var(--navy);
        font-family: "Binate", "Raleway", sans-serif;
        font-size: clamp(2.3rem, 5vw, 5.2rem);
        line-height: 0.98;
    }

    @media (max-width: 900px) {
        .about-card,
        .spark-section,
        .purpose-section,
        .purpose-section.vision {
            grid-template-columns: 1fr;
        }

        .about-card {
            width: min(90vw, 44rem);
        }

        .about-card figure {
            min-height: 28rem;
        }

        .spark-section figure {
            min-height: 30rem;
        }

        .purpose-section figure {
            min-height: 28rem;
        }

        .vision figure {
            order: 2;
        }

        .vision .purpose-copy {
            order: 1;
        }
    }

    @media (max-width: 560px) {
        .about-hero {
            padding-inline: 5vw;
        }

        .about-card {
            border-radius: 1.2rem;
        }

        .about-copy {
            padding: 2rem 1.5rem;
        }

        .about-card figure,
        .spark-section figure,
        .purpose-section figure {
            min-height: 23rem;
        }

        .purpose-copy {
            grid-template-columns: 1fr;
            padding: 3rem 7vw;
        }

        .vertical-label {
            writing-mode: horizontal-tb;
            transform: none;
        }
    }
</style>
