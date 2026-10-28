import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Play, Plus, X } from 'lucide-react';

// La app vive en el mismo sitio, en /app/ (misma pestaña, mismos dibujos guardados)
const APP_URL = '/app/';

// Iconos de las herramientas de la app (mismos trazos y colores)
const INK = '#24262B';
const PINK = '#F49AB9';
const BLUE = '#62C6F2';
const YELLOW = '#FFD866';
const VIOLET = '#B9A3E3';
const ORANGE = '#FFB077';
const GREEN = '#A5D46A';

const ToolIcon: React.FC<{ children: React.ReactNode; width?: number }> = ({ children, width = 2.2 }) => (
  <svg viewBox="0 0 32 32" className="w-7 h-7 shrink-0" fill="none" stroke={INK} strokeWidth={width} strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
    {children}
  </svg>
);

const PencilIcon = () => (
  <ToolIcon>
    <path d="M21 4.5l5.5 5.5L12 24.5l-7 1.5 1.5-7z" fill={YELLOW} />
    <path d="M18 7.5l5.5 5.5" />
    <path d="M4 30c4-2 6 1 10-1" />
  </ToolIcon>
);
const BucketIcon = () => (
  <ToolIcon>
    <path d="M5 17L14.5 7.5l9 9L14 26z" fill={YELLOW} />
    <path d="M14.5 7.5l-3-3.5M26 20c1.8 2.4 2.5 3.8 2.5 5a2.5 2.5 0 01-5 0c0-1.2.7-2.6 2.5-5z" fill={BLUE} />
  </ToolIcon>
);
const ShapesIcon = () => (
  <ToolIcon>
    <circle cx="16" cy="16" r="10.5" fill={BLUE} />
  </ToolIcon>
);
const TextIcon = () => (
  <ToolIcon width={2.6}>
    <path d="M7 8h18M16 8v18M12 26h8" />
  </ToolIcon>
);
const ShapeIcon = () => (
  <ToolIcon>
    <path d="M9 4h14c-4 5-4 8 0 12s4 8 0 12H9c4-4 4-8 0-12S5 9 9 4z" fill={PINK} />
  </ToolIcon>
);
const HoleIcon = () => (
  <ToolIcon width={2.3}>
    <rect x="4.5" y="6" width="23" height="20" rx="4" fill={ORANGE} />
    <circle cx="16" cy="16" r="5.2" fill="#FFFFFF" strokeDasharray="3 2.6" />
  </ToolIcon>
);
const PhotoIcon = () => (
  <ToolIcon>
    <rect x="6" y="8" width="20" height="16" rx="1.5" fill={PINK} />
    <path d="M6 21l6-6 5 5 3-3 6 6" />
    <rect x="3" y="5" width="5" height="5" fill="#FFFFFF" />
    <rect x="24" y="22" width="5" height="5" fill="#FFFFFF" />
  </ToolIcon>
);
const ColorIcon = () => (
  <ToolIcon width={2.3}>
    <path d="M16 4C8.5 4 3.5 9.5 3.5 16s5 12 11.5 12c2.3 0 3.2-1.3 3.2-2.7 0-2.2-1.9-2.6-1.9-4.6 0-1.7 1.4-2.7 3.2-2.7H24c3 0 4.5-2 4.5-4.7C28.5 8.3 23 4 16 4z" fill={BLUE} />
    <g fill={INK} stroke="none">
      <circle cx="10" cy="13" r="1.8" />
      <circle cx="15" cy="9" r="1.8" />
      <circle cx="21" cy="10.5" r="1.8" />
      <circle cx="9.5" cy="19.5" r="1.8" />
    </g>
  </ToolIcon>
);
// Estos dos no tienen botón en la barra de la app: mismo estilo, dibujados a juego
const BedIcon = () => (
  <ToolIcon>
    <rect x="5" y="5" width="22" height="22" rx="4" fill={GREEN} strokeDasharray="4 3" />
  </ToolIcon>
);
const SaveIcon = () => (
  <ToolIcon>
    <path d="M6 5h15l5 5v17H6z" fill={VIOLET} />
    <path d="M11 5v7h9V5M10 27v-8h12v8" fill="#FFFFFF" />
  </ToolIcon>
);

// Cada video está en /images/garabatear-video-<nombre>.webm y .mp4 (respaldo para Safari viejo)
type FeatureVideo = { name: string; label?: string };
type Feature = { title: string; icons: React.FC[]; desc: string; videos?: FeatureVideo[] };

// Con "videos" la card se puede tocar y abre el video en un popup; si hay más de uno se eligen con pestañas
const features: Feature[] = [
  { title: 'Lápiz y balde', videos: [{ name: 'lapiz' }], icons: [PencilIcon, BucketIcon], desc: 'La línea se vuelve una pared fina; si la cerrás, el balde la rellena y queda sólida.' },
  { title: 'Formas y texto', videos: [{ name: 'formas', label: 'Formas' }, { name: 'texto', label: 'Texto' }], icons: [ShapesIcon, TextIcon], desc: 'Círculo, caja, estrella y corazón. Escribí una palabra, elegí la tipografía y se vuelve una figura sólida.' },
  { title: 'Altura, forma y giro', videos: [{ name: 'altura' }], icons: [ShapeIcon], desc: 'Arrastrá las flechas de cada figura: subila, ensanchala, hacé un jarrón, un cono o un globo, o dale giro.' },
  { title: 'Huecos', videos: [{ name: 'huecos' }], icons: [HoleIcon], desc: 'Una figura puede restarse de otras: un agujero pasante o una cavidad desde arriba.' },
  { title: 'Calcar una foto', videos: [{ name: 'calcar' }], icons: [PhotoIcon], desc: 'Poné la foto de un dibujo en papel y calcalo con el lápiz.' },
  { title: 'Color', videos: [{ name: 'color' }], icons: [ColorIcon], desc: 'Cada figura tiene su color, que se guarda en el archivo 3MF.' },
  { title: 'Tamaño de la cama', videos: [{ name: 'cama' }], icons: [BedIcon], desc: 'Elegí 200, 256 o 300 mm según tu impresora.' },
  { title: 'Guardá tus dibujos', videos: [{ name: 'guardar' }], icons: [SaveIcon], desc: 'Quedan guardados en el navegador para seguir cuando quieras.' },
];

const shots = [
  { src: '/images/garabatear-forma.png', title: 'Forma', desc: 'Arrastrá los puntos para ensanchar o afinar la figura, o elegí jarrón, cono, globo u ondas.' },
  { src: '/images/garabatear-giro.png', title: 'Giro', desc: 'Dale un giro a la figura, desde un octavo de vuelta hasta una vuelta entera.' },
  { src: '/images/garabatear-descargar.png', title: 'Descargar', desc: 'Bajá el archivo en STL o en 3MF para abrirlo en tu programa de impresión.' },
  { src: '/images/garabatear-ayuda.png', title: 'Ayuda integrada', desc: 'Una guía de seis pasos dentro de la app, para que cualquiera pueda empezar solo.' },
];

const steps = [
  { title: 'Dibujá', bg: YELLOW, desc: 'Usá el dedo, el mouse o un lápiz táctil para hacer tu garabato o armarlo con formas y texto.' },
  { title: 'Mirá en 3D', bg: BLUE, desc: 'Tu dibujo se levanta del papel y lo podés girar para verlo desde todos los lados.' },
  { title: 'Imprimilo', bg: PINK, desc: 'Descargá el STL o el 3MF y mandalo a la impresora 3D para tenerlo en tus manos.' },
];

const classroom = [
  { title: '**Crear** en vez|de solo mirar', desc: 'Los chicos dejan de consumir pantallas para usarlas como herramienta: lo que imaginan lo diseñan ellos mismos.' },
  { title: 'Probar, equivocarse|y **volver a intentar**', desc: 'Con deshacer y rehacer a mano, el error deja de ser un problema y pasa a ser parte de crear.' },
  { title: 'De la pantalla a las manos', desc: 'Ver su garabato impreso les muestra cómo se diseña y se fabrica, y les despierta curiosidad por la tecnología.' },
];

const faqs = [
  { q: '¿Es gratis?', a: 'Sí, es totalmente gratis. Además es de licencia MIT: el código es abierto, para beneficio de la educación.' },
  { q: '¿Hay que instalar algo o crear una cuenta?', a: 'No. Se abre en el navegador y se empieza a dibujar al instante, sin cuentas y sin instalar nada.' },
  { q: '¿Con qué se dibuja?', a: 'Con el dedo en una tablet, con el mouse o con un lápiz táctil.' },
  { q: '¿Para qué edades está pensada?', a: 'Para el aula y las primeras edades.' },
  { q: '¿Qué archivo descargo?', a: 'Podés bajar tu dibujo en STL o en 3MF. El 3MF guarda también el color de cada figura.' },
  { q: '¿Con qué programa lo imprimo?', a: 'El archivo se abre en cualquier laminador, como Bambu Studio, Cura o PrusaSlicer. En la app podés elegir el tamaño de la cama de tu impresora: 200, 256 o 300 mm.' },
  { q: '¿Necesito una impresora 3D?', a: 'Para dibujar y ver tu garabato en 3D, no. La impresora hace falta solo para tenerlo en tus manos.' },
  { q: '¿Dónde se guardan mis dibujos?', a: 'En el navegador del dispositivo donde los hiciste. Si cambiás de dispositivo o borrás los datos del navegador, no van a aparecer: descargá el archivo para guardarlo.' },
  { q: '¿Quién hizo Garabatear?', a: 'La desarrollamos en Disain junto a los profes Pablo Melgarejo y Diego Carrasco, tomando como referencia el sitio web Doodle3D.' },
];

// Logos de "Ya usan GarabateAR" (archivos en /images). Si la lista está vacía la sección no se muestra.
// "className" ajusta un logo puntual (ej: invertir uno muy claro para que se lea sobre blanco).
// TEMPORAL: el logo de Disain ocupa el lugar hasta tener los de quienes usan GarabateAR.
// Sección oculta por ahora: pasar a true cuando estén los logos reales.
const SHOW_USERS = false;
const users: { name: string; logo: string; className?: string }[] = [
  { name: 'Disain', logo: '/images/logo-disain-gris2.svg', className: 'invert' },
];
// Cada mitad de la cinta repite los logos hasta tener al menos 8, para que no queden huecos al deslizarse
const usersStrip = users.length ? Array.from({ length: Math.ceil(8 / users.length) }, () => users).flat() : [];

// "|" corta la línea y lo que va entre ** se muestra en negrita
const renderTitle = (title: string) =>
  title.split('|').map((line, i) => (
    <React.Fragment key={i}>
      {i > 0 && <br />}
      {line.split('**').map((part, j) => (j % 2 ? <strong key={j} className="font-bold">{part}</strong> : part))}
    </React.Fragment>
  ));

const softGradient =
  'radial-gradient(60% 40% at 12% 50%, #FFD2BD 0%, transparent 70%), radial-gradient(60% 40% at 88% 50%, #CFE2FF 0%, transparent 70%), linear-gradient(to bottom, #FFFFFF 0%, #F1EEFF 50%, #FFFFFF 100%)';

// Mismos colores que softGradient, pero cubriendo toda la tarjeta (sin bordes blancos)
const cardGradient =
  'radial-gradient(90% 130% at 0% 50%, #FFD2BD 0%, transparent 75%), radial-gradient(90% 130% at 100% 50%, #CFE2FF 0%, transparent 75%), #F1EEFF';

// Animaciones de entrada al hacer scroll (mismo recurso que la página Tutoria)
const ScrollReveal: React.FC<{ children: (inView: boolean) => React.ReactNode; className?: string; threshold?: number }> = ({
  children,
  className,
  threshold = 0.1,
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={className}>
      {children(inView)}
    </div>
  );
};

type RevealKind = 'blur' | 'up' | 'left' | 'right';
const rv = (inView: boolean, kind: RevealKind) => (inView ? `gb-${kind}` : 'opacity-0');
const dl = (i: number): React.CSSProperties => ({ animationDelay: `${i * 120}ms` });

const revealStyles = `
  @keyframes gbBlur { 0% { filter: blur(10px); opacity: 0; transform: translateY(14px); } 100% { filter: blur(0); opacity: 1; transform: translateY(0); } }
  @keyframes gbUp { 0% { opacity: 0; transform: translateY(40px); filter: blur(4px); } 100% { opacity: 1; transform: translateY(0); filter: blur(0); } }
  @keyframes gbLeft { 0% { opacity: 0; transform: translateX(-40px); filter: blur(4px); } 100% { opacity: 1; transform: translateX(0); filter: blur(0); } }
  @keyframes gbRight { 0% { opacity: 0; transform: translateX(40px); filter: blur(4px); } 100% { opacity: 1; transform: translateX(0); filter: blur(0); } }
  .gb-blur { animation: gbBlur 1.2s cubic-bezier(0.25, 1, 0.5, 1) both; }
  .gb-up { animation: gbUp 1.2s cubic-bezier(0.25, 1, 0.5, 1) both; }
  .gb-left { animation: gbLeft 1.2s cubic-bezier(0.25, 1, 0.5, 1) both; }
  .gb-right { animation: gbRight 1.2s cubic-bezier(0.25, 1, 0.5, 1) both; }
  @keyframes gbFade { 0% { opacity: 0; } 100% { opacity: 1; } }
  @keyframes gbPop { 0% { opacity: 0; transform: translateY(24px) scale(0.96); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
  .gb-fade { animation: gbFade 0.3s ease-out both; }
  .gb-pop { animation: gbPop 0.45s cubic-bezier(0.25, 1, 0.5, 1) both; }
  @keyframes gbMarquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  .gb-marquee { animation: gbMarquee 30s linear infinite; }
  .gb-marquee:hover { animation-play-state: paused; }
  .gb-mask { mask-image: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent); -webkit-mask-image: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent); }
  @media (prefers-reduced-motion: reduce) {
    .gb-blur, .gb-up, .gb-left, .gb-right, .gb-fade, .gb-pop, .gb-marquee { animation: none; }
  }
`;

// Popup con el video de una herramienta: se cierra con la X, tocando afuera o con Escape
const VideoModal: React.FC<{ feature: Feature; onClose: () => void }> = ({ feature, onClose }) => {
  const videos = feature.videos ?? [];
  const [active, setActive] = useState(0);
  const video = videos[active] ?? videos[0];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm gb-fade"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={feature.title}
    >
      <div
        className="relative w-full max-w-[900px] bg-white rounded-[24px] md:rounded-[32px] p-3 md:p-4 shadow-2xl gb-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-5 right-5 md:top-7 md:right-7 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-black flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>
        {/* key: al cambiar de pestaña el video se recarga con las fuentes nuevas */}
        <video
          key={video.name}
          className="block w-full aspect-[2.1/1] max-h-[65vh] rounded-[16px] md:rounded-[22px] bg-[#F5F5F5] object-contain"
          autoPlay
          loop
          muted
          playsInline
          controls
        >
          <source src={`/images/garabatear-video-${video.name}.webm`} type="video/webm" />
          <source src={`/images/garabatear-video-${video.name}.mp4`} type="video/mp4" />
        </video>
        <div className="px-2 md:px-4 pt-4 pb-2 md:pb-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
          <h3 className="text-lg md:text-2xl font-medium flex items-center gap-2.5 shrink-0">
            <span className="flex items-center gap-0.5">
              {feature.icons.map((Icon, i) => (
                <Icon key={i} />
              ))}
            </span>
            {feature.title}
          </h3>
          <p className="text-[14px] md:text-[15px] text-gray-500 leading-relaxed">{feature.desc}</p>
          {videos.length > 1 && (
            <div className="flex gap-1 p-1 bg-[#F5F5F5] rounded-full w-fit shrink-0 md:ml-auto">
              {videos.map((v, i) => (
                <button
                  key={v.name}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    i === active ? 'bg-[#2B2B2B] text-white' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {v.label ?? v.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Franja superior del celular (área segura) del mismo gris que el hero en esta página: el navegador la pinta con el
// fondo de la página (Safari) o con theme-color (Chrome en Android). Al salir vuelve a lo de siempre.
const HERO_BG = '#F5F5F5';
const useHeroColoredTopArea = () => {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = { html: html.style.backgroundColor, body: body.style.backgroundColor };
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const created = !meta;
    const prevTheme = meta?.content;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    html.style.backgroundColor = HERO_BG;
    body.style.backgroundColor = HERO_BG;
    meta.content = HERO_BG;
    return () => {
      html.style.backgroundColor = prev.html;
      body.style.backgroundColor = prev.body;
      if (created) meta?.remove();
      else if (meta && prevTheme !== undefined) meta.content = prevTheme;
    };
  }, []);
};

export const GarabatearPage: React.FC<{ onNavigateToAbout?: () => void }> = ({ onNavigateToAbout }) => {
  useHeroColoredTopArea();
  const [openFeature, setOpenFeature] = useState<Feature | null>(null);
  const closeVideo = useCallback(() => setOpenFeature(null), []);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  return (
    <main className="relative w-full bg-white text-[#1A1A1A] font-sans">
      <style>{revealStyles}</style>

      {/* Barra superior: marca + acceso directo a la app */}
      <header className="absolute top-0 inset-x-0 z-20">
        <div className="max-w-[1200px] mx-auto px-6 xl:px-0 h-20 flex items-center justify-between">
          <a href="/" className="text-xl md:text-2xl font-semibold tracking-tight text-[#1A1A1A]">
            Garabate<span className="font-bold">AR</span>
          </a>
          <a
            href={APP_URL}
            className="inline-flex items-center gap-2 rounded-full bg-[#2B2B2B] hover:bg-black text-white text-sm font-medium px-5 py-2.5 transition-all hover:scale-105 active:scale-95"
          >
            Abrir la app
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* 1. Presentación */}
      <section className="relative overflow-hidden bg-[#F5F5F5] pt-32 pb-16 md:pt-0 md:pb-0 md:min-h-[720px] flex items-center">
        <ScrollReveal className="relative z-10 w-full">
          {(inView) => (
            <div className="w-full max-w-[1200px] mx-auto px-6 xl:px-0 md:py-24 grid md:grid-cols-[1fr_1.2fr] gap-12 items-center">
              <div>
                <span className={`block font-mono text-sm text-gray-500 mb-6 tracking-wider uppercase ${rv(inView, 'blur')}`}>[ Garabatear ]</span>
                <h1 className={`text-4xl md:text-6xl font-semibold md:font-medium tracking-tight mb-6 ${rv(inView, 'blur')}`} style={dl(1)}>
                  Dibujá un garabato,<br />tocalo en 3D
                </h1>
                <p className={`text-lg md:text-xl text-gray-600 leading-relaxed md:max-w-[500px] mb-8 ${rv(inView, 'blur')}`} style={dl(2)}>
                  Una app para que los chicos dibujen a mano alzada, vean su dibujo cobrar volumen y lo exporten para imprimirlo en una impresora 3D.
                </p>
                <div className={`w-fit ${rv(inView, 'up')}`} style={dl(3)}>
                  <a
                    href={APP_URL}
                    className="group inline-flex items-center bg-[#2B2B2B] hover:bg-black text-white pl-6 pr-1.5 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95 whitespace-nowrap shadow-xl shadow-black/10"
                  >
                    <span className="text-sm font-medium">Abrir la app</span>
                    <div className="ml-3.5 w-9 h-9 bg-white rounded-full flex items-center justify-center text-black transition-transform duration-500 group-hover:rotate-45 shrink-0">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </a>
                </div>
              </div>
              <div className={rv(inView, 'right')} style={dl(2)}>
                <div className="relative w-full rounded-[28px] md:rounded-[40px] bg-[#1A1A1A] p-2.5 md:p-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)] ring-1 ring-black/60">
                  <span className="absolute left-1/2 top-[3px] md:top-1.5 -translate-x-1/2 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#3A3A3A]" />
                  <img
                    src="/images/garabatear-principal.png"
                    fetchPriority="high"
                    alt="GarabateAR: papel para dibujar a la izquierda y el objeto en 3D a la derecha"
                    className="block w-full h-auto rounded-[18px] md:rounded-[26px] bg-white"
                  />
                </div>
              </div>
            </div>
          )}
        </ScrollReveal>
      </section>

      {/* 2. La app */}
      <section className="bg-white pt-[80px] pb-[40px] md:py-24 px-6 xl:px-0">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            {(inView) => (
              <>
                <span className={`block font-mono text-sm text-gray-500 mb-6 tracking-wider uppercase ${rv(inView, 'blur')}`}>[ Qué podés hacer ]</span>
                <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 mb-14">
                  <h2 className={`text-3xl md:text-5xl font-semibold md:font-medium tracking-tight ${rv(inView, 'blur')}`} style={dl(1)}>
                    Una app gratis,<br />abierta y para el aula
                  </h2>
                  <p className={`text-lg text-gray-600 leading-relaxed ${rv(inView, 'blur')}`} style={dl(2)}>
                    <strong className="font-semibold text-[#1A1A1A]">GarabateAR es la herramienta desarrollada por <a href="https://ia.disain.com.ar/" className="underline underline-offset-4 decoration-black/30 hover:decoration-black transition-colors" target="_blank" rel="noopener noreferrer">Disain</a> y los profes <a href="https://www.instagram.com/profepablotic" className="underline underline-offset-4 decoration-black/30 hover:decoration-black transition-colors" target="_blank" rel="noopener noreferrer">Pablo Melgarejo</a> y <a href="https://www.instagram.com/carrascofpd/" className="underline underline-offset-4 decoration-black/30 hover:decoration-black transition-colors" target="_blank" rel="noopener noreferrer">Diego Carrasco</a></strong>: dibujás en 2D, le das altura, forma y giro, y descargás el archivo para imprimir. Tomamos como referencia el sitio web Doodle3D y adaptamos la experiencia al aula y a las primeras edades. Es de licencia MIT, para beneficio de la educación.
                  </p>
                </div>
              </>
            )}
          </ScrollReveal>
          <ScrollReveal>
            {(inView) => (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {features.map((f, n) => {
                  const content = (
                    <>
                      <h3 className="text-base md:text-xl font-medium mb-2 flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-2.5">
                        <span className="flex items-center gap-0.5 shrink-0">
                          {f.icons.map((Icon, i) => (
                            <Icon key={i} />
                          ))}
                        </span>
                        {f.title}
                      </h3>
                      <p className="text-[13px] md:text-[15px] text-gray-500 leading-relaxed">{f.desc}</p>
                    </>
                  );
                  const base = `bg-[#F5F5F5] rounded-[20px] md:rounded-[24px] p-4 md:p-8 ${rv(inView, 'up')}`;
                  return f.videos?.length ? (
                    <button
                      key={f.title}
                      type="button"
                      onClick={() => setOpenFeature(f)}
                      aria-label={`Ver video: ${f.title}`}
                      className={`group relative text-left transition-colors hover:bg-[#EDEDED] ${base}`}
                      style={dl(n % 4)}
                    >
                      <span className="absolute top-3 right-3 md:top-5 md:right-5 text-[#2B2B2B] transition-transform duration-300 group-hover:scale-110">
                        <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                      </span>
                      {content}
                    </button>
                  ) : (
                    <div key={f.title} className={base} style={dl(n % 4)}>
                      {content}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* 3. Capturas */}
      <section className="pt-[40px] pb-[40px] md:py-24 px-6 xl:px-0" style={{ background: softGradient }}>
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            {(inView) => (
              <div className="w-fit max-w-full mx-auto text-center mb-12">
                <h2 className={`text-3xl md:text-5xl font-semibold md:font-medium tracking-tight mb-4 ${rv(inView, 'blur')}`}>Así se ve por dentro</h2>
                <p className={`w-0 min-w-full text-lg text-gray-600 ${rv(inView, 'blur')}`} style={dl(1)}>Capturas de la app funcionando.</p>
              </div>
            )}
          </ScrollReveal>
          <ScrollReveal>
            {(inView) => (
              <div className="flex items-start md:items-stretch md:grid md:grid-cols-2 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 scroll-px-6 no-scrollbar">
                {shots.map((s, n) => (
                  <figure
                    key={s.src}
                    className={`bg-white rounded-[24px] p-4 md:p-5 border border-black/5 shadow-sm shrink-0 w-[85%] md:w-auto snap-center ${rv(inView, n % 2 ? 'right' : 'left')}`}
                    style={dl(n)}
                  >
                    <img
                      src={s.src}
                      alt={`GarabateAR: ${s.title}`}
                      loading="lazy"
                      className="w-full aspect-[1440/860] object-cover rounded-[16px] border border-black/10"
                    />
                    <figcaption className="px-2 pt-4 pb-2">
                      <h3 className="text-xl font-medium mb-1">{s.title}</h3>
                      <p className="text-[15px] text-gray-500 leading-relaxed">{s.desc}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* 4. La app y el aula */}
      <section className="bg-white pt-[40px] pb-[40px] md:py-24 px-6 xl:px-0">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            {(inView) => (
              <>
                <span className={`block font-mono text-sm text-gray-500 mb-6 tracking-wider uppercase ${rv(inView, 'blur')}`}>[ La app y el aula ]</span>
                <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 mb-14">
                  <h2 className={`text-3xl md:text-5xl font-semibold md:font-medium tracking-tight ${rv(inView, 'blur')}`} style={dl(1)}>
                    Creatividad<br />con nuevas tecnologías
                  </h2>
                  <div className={`text-base text-gray-600 leading-relaxed space-y-3 ${rv(inView, 'blur')}`} style={dl(2)}>
                    <p>
                      Una herramienta simple y lúdica acerca la tecnología a los chicos desde las primeras edades: dibujan una idea, la ven cobrar volumen y la tienen en sus manos.
                    </p>
                    <p>
                      Detrás hay una tarea enorme: la de Pablo y Diego, que todos los días llevan tecnología educativa a las aulas y ya acercaron la impresión 3D a miles de chicos. Garabatear nace de ese trabajo diario con docentes y estudiantes.
                    </p>
                  </div>
                </div>
              </>
            )}
          </ScrollReveal>
          <ScrollReveal>
            {(inView) => (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 md:grid-rows-2 gap-3 md:gap-6 md:h-[640px]">
                  <img
                    src="/images/Garabato3d%202.jpg"
                    alt="Un chico dibuja con el dedo en una tablet usando GarabateAR"
                    loading="lazy"
                    className={`w-full h-[320px] md:h-full object-cover object-[30%_50%] rounded-[20px] md:rounded-[24px] col-span-2 md:col-span-1 md:row-span-2 ${rv(inView, 'left')}`}
                  />
                  <img
                    src="/images/BambuLabenCMD_015.webp"
                    alt="Diego y Pablo presentando Garabato3D ante docentes"
                    loading="lazy"
                    className={`w-full h-full min-h-[240px] object-cover rounded-[20px] md:rounded-[24px] row-span-2 md:row-span-1 md:col-span-2 ${rv(inView, 'up')}`}
                    style={dl(2)}
                  />
                  <div
                    className={`rounded-[20px] md:rounded-[24px] p-4 md:p-8 flex flex-col justify-end ${rv(inView, 'right')}`}
                    style={{ background: YELLOW, ...dl(3) }}
                  >
                    <h3 className="text-lg md:text-3xl font-medium tracking-tight leading-tight mb-2">{renderTitle(classroom[0].title)}</h3>
                    <p className="text-[13px] md:text-[15px] text-black/70 leading-relaxed">{classroom[0].desc}</p>
                  </div>
                  <div
                    className={`rounded-[20px] md:rounded-[24px] p-4 md:p-8 flex flex-col justify-end ${rv(inView, 'right')}`}
                    style={{ background: BLUE, ...dl(4) }}
                  >
                    <h3 className="text-lg md:text-3xl font-medium tracking-tight leading-tight mb-2">{renderTitle(classroom[1].title)}</h3>
                    <p className="text-[13px] md:text-[15px] text-black/70 leading-relaxed">{classroom[1].desc}</p>
                  </div>
                </div>
                <p className={`text-lg text-gray-600 leading-relaxed mt-8 md:mt-10 max-w-3xl ${rv(inView, 'blur')}`} style={dl(5)}>
                  <span className="font-medium text-[#1A1A1A]">{classroom[2].title.replace('|', ' ')}.</span> {classroom[2].desc}
                </p>
              </>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* 5. Cómo funciona */}
      <section className="bg-white pt-[40px] pb-[40px] md:py-24 px-6 xl:px-0">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            {(inView) => (
              <>
                <span className={`block font-mono text-sm text-gray-500 mb-6 tracking-wider uppercase ${rv(inView, 'blur')}`}>[ Cómo funciona ]</span>
                <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 mb-14">
                  <h2 className={`text-3xl md:text-5xl font-semibold md:font-medium tracking-tight ${rv(inView, 'blur')}`} style={dl(1)}>
                    De la idea al<br />objeto en tres pasos
                  </h2>
                  <p className={`text-lg text-gray-600 leading-relaxed ${rv(inView, 'blur')}`} style={dl(2)}>
                    Pensada para el aula y las primeras edades: sin cuentas, sin instalar nada y con una experiencia simple y lúdica.
                  </p>
                </div>
              </>
            )}
          </ScrollReveal>
          <ScrollReveal>
            {(inView) => (
              <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                {steps.map((x, i) => (
                  <div key={x.title} className={`rounded-[24px] p-6 md:p-8 ${rv(inView, 'up')}`} style={{ background: x.bg, ...dl(i) }}>
                    <span className="block font-mono text-4xl font-bold text-white leading-none">0{i + 1}</span>
                    <h3 className="text-xl font-medium mt-3 mb-2">{x.title}</h3>
                    <p className="text-[15px] text-black/70 leading-relaxed">{x.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* 6. Preguntas frecuentes */}
      <section className="bg-white pt-[40px] pb-[40px] md:py-24 px-6 xl:px-0">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-[1fr_1.4fr] gap-10 md:gap-16">
          <ScrollReveal>
            {(inView) => (
              <>
                <span className={`block font-mono text-sm text-gray-500 mb-6 tracking-wider uppercase ${rv(inView, 'blur')}`}>[ Preguntas frecuentes ]</span>
                <h2 className={`text-3xl md:text-5xl font-semibold md:font-medium tracking-tight ${rv(inView, 'blur')}`} style={dl(1)}>
                  Lo que necesitás<br />saber para empezar
                </h2>
              </>
            )}
          </ScrollReveal>
          <ScrollReveal>
            {(inView) => (
              <div className={`flex flex-col ${rv(inView, 'up')}`} style={dl(2)}>
                {faqs.map((faq, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div key={faq.q} className="border-t border-black/10 last:border-b">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        className="w-full flex items-center justify-between gap-4 py-5 md:py-6 text-left text-base md:text-lg font-medium text-[#1A1A1A] hover:text-gray-600 transition-colors"
                      >
                        <span>{faq.q}</span>
                        <Plus className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
                      </button>
                      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                          <p className="pb-6 pr-8 text-[15px] text-gray-500 leading-relaxed">{faq.a}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* 7. Ya usan GarabateAR */}
      {SHOW_USERS && users.length > 0 && (
        <section className="bg-white pt-[40px] pb-[40px] md:py-24">
          <ScrollReveal>
            {(inView) => (
              <>
                <div className="px-6 text-center mb-10 md:mb-14">
                  <span className={`block font-mono text-sm text-gray-500 mb-6 tracking-wider uppercase ${rv(inView, 'blur')}`}>[ En el aula ]</span>
                  <h2 className={`text-3xl md:text-5xl font-semibold md:font-medium tracking-tight ${rv(inView, 'blur')}`} style={dl(1)}>
                    Ya usan GarabateAR
                  </h2>
                </div>
                <div className={`max-w-[1200px] mx-auto px-6 xl:px-0 ${rv(inView, 'up')}`} style={dl(2)}>
                  <div className="relative w-full overflow-hidden gb-mask">
                    <div className="flex w-max gb-marquee">
                      {[0, 1].map((half) => (
                        <div key={half} className="flex items-center gap-10 md:gap-20 pr-10 md:pr-20" aria-hidden={half === 1}>
                          {usersStrip.map((u, i) => (
                            <div key={i} className="shrink-0 flex items-center justify-center h-6 md:h-8 min-w-[64px] md:min-w-[96px]">
                              <img
                                src={u.logo}
                                alt={half === 0 && i < users.length ? u.name : ''}
                                loading="lazy"
                                decoding="async"
                                className={`h-full w-auto object-contain opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 ${u.className ?? ''}`}
                              />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </ScrollReveal>
        </section>
      )}

      {/* 8. Cierre */}
      <section className="bg-white pt-[40px] pb-24 md:py-24 px-6 xl:px-0">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            {(inView) => (
              <div
                className={`text-[#1A1A1A] rounded-[32px] border border-black/5 p-10 md:p-16 min-h-[300px] flex flex-col md:flex-row md:items-center justify-between gap-8 ${rv(inView, 'up')}`}
                style={{ background: cardGradient }}
              >
                <div>
                  <h2 className="text-3xl md:text-5xl font-semibold md:font-medium tracking-tight mb-3">
                    Tu garabato,<br />en tus manos
                  </h2>
                  <p className="text-gray-600 max-w-md">
                    El archivo se abre en cualquier laminador (Bambu Studio, Cura, PrusaSlicer) y queda listo para imprimir.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={APP_URL}
                    className="inline-flex items-center justify-center rounded-full bg-[#2B2B2B] text-white px-6 py-3 font-medium hover:bg-black transition-colors"
                  >
                    Abrir la app
                  </a>
                  <a
                    href="https://profes3d.com.ar/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-white text-black border border-black/10 px-6 py-3 font-medium hover:bg-gray-100 transition-colors"
                  >
                    Conocé a los profes
                  </a>
                  <a
                    href="https://ia.disain.com.ar/about"
                    onClick={(e) => {
                      if (!onNavigateToAbout) return;
                      e.preventDefault();
                      onNavigateToAbout();
                    }}
                    className="inline-flex items-center justify-center rounded-full bg-white text-black border border-black/10 px-6 py-3 font-medium hover:bg-gray-100 transition-colors"
                  >
                    Conocé Disain
                  </a>
                </div>
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      {openFeature && <VideoModal feature={openFeature} onClose={closeVideo} />}
    </main>
  );
};
