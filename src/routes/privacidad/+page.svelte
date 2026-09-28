<script lang="ts">
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    const privacidad = $derived(data.privacidad);
</script>

<svelte:head>
    <meta name="robots" content="noindex, nofollow, nosnippet, noimageindex" />
    <meta name="referrer" content="no-referrer" />
</svelte:head>

<section class="privacy">
    <header>
        <span class="eyebrow">SMMUN · ValladolidMUN</span>
        <h1>Aviso de privacidad integral</h1>
        <p>Aviso de privacidad de los registros realizados en smmun.com, incluido ValladolidMUN 2026: El derecho a imaginar.</p>
        <span class="updated">Versión del 28 de septiembre de 2026</span>
    </header>
    <article>
        <section data-nosnippet>
            <h2>Quién trata tus datos</h2>
            <p>{privacidad.responsable}, como responsable del tratamiento de los datos de registro del equipo independiente de SMMUN y ValladolidMUN, utiliza los datos para organizar los eventos y atender las solicitudes relacionadas con tu inscripción.</p>
            <p>Domicilio para oír y recibir notificaciones: {privacidad.domicilio}.</p>
            <p>Contacto: <a href={`mailto:${privacidad.correo}`}>{privacidad.correo}</a>.</p>
        </section>
        <section>
            <h2>Qué datos recoge el registro</h2>
            <ul>
                <li>Nombre, apellidos, pronombres, correo electrónico, edad, teléfono y escuela o institución.</li>
                <li>Matrícula, cuando seleccionas Universidad Modelo Valladolid, para validar tu pertenencia a la Universidad.</li>
                <li>Nombre, parentesco y teléfono de tu contacto de emergencia.</li>
                <li>Modalidad de delegación y, cuando corresponde, nombre y correo de la persona Faculty o asesora.</li>
                <li>Preferencias de comités y delegaciones, folio y datos necesarios para identificar tu solicitud.</li>
                <li>Cuando corresponde pagar: importe y comprobante de pago, que puede incluir datos personales y financieros de quien realizó el pago. No adjuntes información ajena a la comprobación del pago.</li>
            </ul>
            <p>El campo de alergias o condiciones médicas es opcional. La información de salud que decidas proporcionar es un dato personal sensible y se utilizará para prever necesidades de atención y actuar ante emergencias relacionadas con el evento.</p>
            <p>Si proporcionas datos de tu contacto de emergencia, Faculty o de quien realizó el pago, informa a esa persona sobre este aviso y asegúrate de contar con autorización para compartirlos.</p>
        </section>
        <section>
            <h2>Para qué se utilizan</h2>
            <p>Para tramitar y confirmar tu inscripción, asignar comités y delegaciones, comunicar información del evento, verificar pagos o confirmar la cuota correspondiente a estudiantes Modelo, y contactar a la persona indicada ante una emergencia.</p>
            <p>La información de salud es voluntaria: puedes dejar el campo vacío y completar el registro. El registro no incluye una suscripción a publicidad ni autoriza publicar tus datos personales.</p>
        </section>
        <section>
            <h2>Dónde se guardan y quién puede acceder</h2>
            <p>El registro utiliza Google Apps Script y Google Sheets para procesar y guardar los datos, y Google Drive para almacenar los comprobantes. Estos servicios son prestados por Google y pueden procesar información fuera de México. Puedes consultar la <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">política de privacidad de Google</a>.</p>
            <p>El acceso debe limitarse a las personas de la organización que necesiten gestionar inscripciones, pagos, validación universitaria o atención de emergencias. Los comprobantes no se publican mediante enlaces de acceso abierto.</p>
            <p>La validación de la matrícula requiere comprobar la pertenencia a Universidad Modelo Valladolid. Si para ello se necesita comunicar datos a un tercero distinto de quienes gestionan el registro, se deberá informar y obtener el consentimiento que corresponda antes de esa comunicación.</p>
        </section>
        <section>
            <h2>Conservación</h2>
            <p>Los datos se conservarán durante el tiempo necesario para gestionar el evento, atender aclaraciones y cumplir las obligaciones aplicables. Una vez cumplidas esas finalidades, se eliminarán o bloquearán cuando corresponda. La información de salud se conservará únicamente durante el periodo mínimo necesario para las finalidades de atención previstas en este aviso.</p>
        </section>
        <section>
            <h2>Tus derechos y cómo ejercerlos</h2>
            <p>Puedes solicitar acceso a tus datos, su rectificación, cancelación u oposición al tratamiento (derechos ARCO), así como revocar tu consentimiento o limitar su uso o divulgación.</p>
            <p>Escribe a <a href={`mailto:${privacidad.correo}`}>{privacidad.correo}</a> con el asunto “Privacidad”, tu nombre, un medio para responderte, tu folio si lo tienes y una descripción clara de tu solicitud. Para rectificaciones, indica el dato a corregir. La organización podrá solicitar la información necesaria para acreditar tu identidad o representación por un medio adecuado; evita enviar documentos sensibles que no se te hayan solicitado.</p>
            <p>Las solicitudes se atenderán en los plazos aplicables. La cancelación o revocación puede impedir continuar gestionando tu inscripción cuando los datos sean necesarios para ello, y no tiene efectos retroactivos.</p>
        </section>
        <section>
            <h2>Participantes menores de edad</h2>
            <p>Si eres menor de edad, revisa este aviso con tu madre, padre o representante legal. El tratamiento de tus datos y la participación en el evento requieren la intervención y las autorizaciones que correspondan de tu representante legal.</p>
        </section>
        <section>
            <h2>Almacenamiento en tu navegador y servicios externos</h2>
            <p>El formulario guarda un borrador en el almacenamiento de sesión de tu navegador para recuperar los datos al recargar y evitar duplicados en los reintentos. El borrador incluye los campos del formulario y tus preferencias, pero no el archivo del comprobante. Se elimina al confirmar el registro; en equipos compartidos, cierra la pestaña al terminar.</p>
            <p>La página principal muestra contenido de Instagram mediante Behold. Al cargar contenido o servicios externos, sus proveedores pueden recibir información técnica, como tu dirección IP y datos del navegador. Sus prácticas se describen en sus propios avisos de privacidad.</p>
        </section>
        <section>
            <h2>Cambios a este aviso</h2>
            <p>Las actualizaciones se publicarán en esta página con su nueva fecha o versión. Si se propone un uso que requiera un consentimiento adicional, se solicitará antes de realizarlo.</p>
        </section>
        <a class="back" href="/registro/valladolidmun/">Volver al registro →</a>
    </article>
</section>

<style>
    .privacy { padding: clamp(3rem, 6vw, 6rem) 6vw; color: var(--navy); background: #faf8ff; }
    header, article { width: min(100%, 52rem); margin-inline: auto; }
    .eyebrow { color: #a82b76; font-size: .78rem; font-weight: 800; letter-spacing: .15em; text-transform: uppercase; }
    h1 { margin: 1rem 0; font-family: 'Binate', 'Raleway', sans-serif; font-size: clamp(2.6rem, 7vw, 5rem); line-height: 1.05; overflow-wrap: anywhere; }
    header p { font-size: 1.1rem; line-height: 1.7; }
    .updated { display: block; font-size: .85rem; margin: 1.5rem 0 2rem; }
    article { padding: clamp(1.2rem, 4vw, 3rem); border-radius: 1.5rem; background: white; box-sizing: border-box; }
    article section + section { margin-top: 2rem; }
    h2 { font-size: 1.35rem; line-height: 1.35; }
    p, li { line-height: 1.75; overflow-wrap: anywhere; }
    ul { padding-left: 1.3rem; } li + li { margin-top: .5rem; }
    a { color: #86235f; text-decoration: underline; text-underline-offset: .2em; }
    a:focus-visible { outline: 3px solid var(--navy); outline-offset: 4px; }
    .back { display: inline-block; margin-top: 2rem; font-weight: 800; }
</style>
