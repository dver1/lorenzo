// Configuración de audio
let audioContext;
let backgroundMusicInterval;

// Inicializar AudioContext
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Web Audio API no soportada');
    }
}

// Sonido cómico cuando Lorenzo dice la hora - más cómico y divertido
function playTimeSound() {
    if (!audioContext) {
        // Si no hay audioContext, intentar inicializarlo
        initAudio();
        if (!audioContext) return;
    }
    
    const duration = 0.6; // Duración total del sonido
    
    // Sonido tipo "boing" cómico - sube y baja rápidamente
    const boingOsc = audioContext.createOscillator();
    const boingGain = audioContext.createGain();
    boingOsc.connect(boingGain);
    boingGain.connect(audioContext.destination);
    
    boingOsc.type = 'sine';
    // Frecuencia que sube rápidamente y luego baja (efecto "boing")
    boingOsc.frequency.setValueAtTime(300, audioContext.currentTime);
    boingOsc.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.15);
    boingOsc.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.4);
    boingOsc.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + duration);
    
    boingGain.gain.setValueAtTime(0, audioContext.currentTime);
    boingGain.gain.linearRampToValueAtTime(0.0035, audioContext.currentTime + 0.05);
    boingGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    boingOsc.start();
    boingOsc.stop(audioContext.currentTime + duration);
    
    // Sonido secundario - "pop" cómico
    const popOsc = audioContext.createOscillator();
    const popGain = audioContext.createGain();
    popOsc.connect(popGain);
    popGain.connect(audioContext.destination);
    
    popOsc.type = 'square';
    popOsc.frequency.setValueAtTime(600, audioContext.currentTime);
    popOsc.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
    
    popGain.gain.setValueAtTime(0, audioContext.currentTime);
    popGain.gain.linearRampToValueAtTime(0.002, audioContext.currentTime + 0.01);
    popGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    popOsc.start();
    popOsc.stop(audioContext.currentTime + 0.2);
}

// Música de fondo: Audio desde archivo
let backgroundAudio = null;

function playBackgroundMusic() {
    // Si hay un archivo de audio, usarlo
    if (backgroundAudio) {
        // Asegurar que se repita cuando termine
        backgroundAudio.loop = true;
        backgroundAudio.volume = 0.3; // Volumen bajo para no distraer
        
        // Event listener para cuando termine (por si acaso el loop no funciona)
        backgroundAudio.addEventListener('ended', function() {
            console.log('Música terminó, reiniciando...');
            backgroundAudio.currentTime = 0;
            backgroundAudio.play().catch(e => {
                console.error('Error al reiniciar música:', e);
            });
        });
        
        const playPromise = backgroundAudio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Música de fondo reproduciéndose (se repetirá automáticamente)');
                })
                .catch(error => {
                    console.error('Error al reproducir audio:', error);
                    // Si falla, intentar con música generada
                    if (!audioContext) {
                        initAudio();
                    }
                    if (audioContext) {
                        playBackgroundMusic();
                    }
                });
        }
        return;
    }
    
    // Fallback: música generada (si no hay archivo)
    if (!audioContext) return;
    
    // Función para obtener frecuencias de notas
    const getNote = (octave, note) => {
        const baseFreq = 261.63; // Do4 (C4)
        const semitones = [0, 2, 4, 5, 7, 9, 11]; // Do, Re, Mi, Fa, Sol, La, Si
        return baseFreq * Math.pow(2, (octave - 4) + semitones[note] / 12);
    };
    
    // Melodía principal de "The Entertainer" - versión simplificada del tema inicial
    // Esta es la parte más reconocible que suena al principio de la película
    const melody = [
        // Primera frase característica
        { freq: getNote(5, 0), duration: 150 }, // Do
        { freq: getNote(5, 2), duration: 150 }, // Mi
        { freq: getNote(5, 4), duration: 150 }, // Sol
        { freq: getNote(5, 0), duration: 150 }, // Do
        { freq: getNote(5, 2), duration: 150 }, // Mi
        { freq: getNote(5, 4), duration: 300 }, // Sol
        
        { freq: getNote(5, 4), duration: 150 }, // Sol
        { freq: getNote(5, 2), duration: 150 }, // Mi
        { freq: getNote(5, 0), duration: 150 }, // Do
        { freq: getNote(5, 2), duration: 150 }, // Mi
        { freq: getNote(5, 4), duration: 300 }, // Sol
        
        // Segunda frase
        { freq: getNote(5, 4), duration: 150 }, // Sol
        { freq: getNote(5, 5), duration: 150 }, // La
        { freq: getNote(5, 4), duration: 150 }, // Sol
        { freq: getNote(5, 2), duration: 150 }, // Mi
        { freq: getNote(5, 0), duration: 300 }, // Do
        
        { freq: getNote(4, 5), duration: 150 }, // La (octava inferior)
        { freq: getNote(5, 0), duration: 150 }, // Do
        { freq: getNote(5, 2), duration: 150 }, // Mi
        { freq: getNote(5, 4), duration: 300 }, // Sol
        
        // Tercera frase (descendente característica)
        { freq: getNote(5, 4), duration: 150 }, // Sol
        { freq: getNote(5, 2), duration: 150 }, // Mi
        { freq: getNote(5, 0), duration: 150 }, // Do
        { freq: getNote(4, 5), duration: 150 }, // La
        { freq: getNote(4, 4), duration: 300 }, // Sol
        
        { freq: getNote(4, 4), duration: 150 }, // Sol
        { freq: getNote(4, 2), duration: 150 }, // Mi
        { freq: getNote(4, 0), duration: 150 }, // Do
        { freq: getNote(3, 5), duration: 150 }, // La (octava inferior)
        { freq: getNote(4, 0), duration: 300 }, // Do
        
        // Repetición de la primera frase
        { freq: getNote(5, 0), duration: 150 }, // Do
        { freq: getNote(5, 2), duration: 150 }, // Mi
        { freq: getNote(5, 4), duration: 150 }, // Sol
        { freq: getNote(5, 0), duration: 150 }, // Do
        { freq: getNote(5, 2), duration: 150 }, // Mi
        { freq: getNote(5, 4), duration: 600 }, // Sol (nota final más larga)
    ];
    
    let noteIndex = 0;
    
    function playNextNote() {
        if (!audioContext) return;
        
        // Repetir la melodía indefinidamente
        if (noteIndex >= melody.length) {
            noteIndex = 0;
            // Pausa más larga entre repeticiones para el ragtime
            backgroundMusicInterval = setTimeout(playNextNote, 800);
            return;
        }
        
        const note = melody[noteIndex];
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Usar 'square' para un sonido más parecido al piano ragtime
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(note.freq, audioContext.currentTime);
        
        // Envelope más marcado para el estilo ragtime
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.duration / 1000);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + note.duration / 1000);
        
        noteIndex++;
        backgroundMusicInterval = setTimeout(playNextNote, note.duration);
    }
    
    playNextNote();
}

// Función para mostrar la hora en el bocadillo
function displayTime(timeString) {
    const timeDisplay = document.getElementById('timeDisplay');
    const speechBubble = document.getElementById('speechBubble');
    const armLeft = document.getElementById('arm-left-group');
    const armRight = document.getElementById('arm-right-group');
    const eyebrowLeft = document.getElementById('eyebrow-left-group');
    const eyebrowRight = document.getElementById('eyebrow-right-group');
    
    if (timeDisplay && speechBubble) {
        timeDisplay.textContent = timeString;
        speechBubble.classList.add('show');
        
        // Mover los brazos cuando dice la hora
        if (armLeft && armRight) {
            // Remover la clase anterior si existe
            armLeft.classList.remove('animate');
            armRight.classList.remove('animate');
            
            // Forzar reflow para reiniciar la animación
            void armLeft.offsetWidth;
            void armRight.offsetWidth;
            
            // Añadir la clase de animación
            armLeft.classList.add('animate');
            armRight.classList.add('animate');
            
            // Remover la clase después de la animación
            setTimeout(() => {
                armLeft.classList.remove('animate');
                armRight.classList.remove('animate');
            }, 800);
        }
        
        // Levantar las cejas cuando dice la hora
        if (eyebrowLeft && eyebrowRight) {
            // Remover la clase anterior si existe
            eyebrowLeft.classList.remove('animate');
            eyebrowRight.classList.remove('animate');
            
            // Forzar reflow para reiniciar la animación
            void eyebrowLeft.offsetWidth;
            void eyebrowRight.offsetWidth;
            
            // Añadir la clase de animación
            eyebrowLeft.classList.add('animate');
            eyebrowRight.classList.add('animate');
            
            // Remover la clase después de la animación
            setTimeout(() => {
                eyebrowLeft.classList.remove('animate');
                eyebrowRight.classList.remove('animate');
            }, 800);
        }
        
        // Reproducir sonido cuando dice la hora
        playTimeSound();
        
        // Ocultar el bocadillo después de 5 segundos
        setTimeout(() => {
            speechBubble.classList.remove('show');
        }, 5000);
    }
}

// Función para obtener la hora del servidor
async function showTime() {
    try {
        const response = await fetch('/time');
        if (response.ok) {
            const data = await response.json();
            displayTime(data.time);
        } else {
            throw new Error('Response not ok');
        }
    } catch (error) {
        // Fallback: usar hora local si falla la petición
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeString = `${hours}:${minutes}:${seconds}`;
        displayTime(timeString);
    }
}

// Esperar a que el DOM esté completamente cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Animación cíclica de la boca
function animateMouth() {
    const mouth = document.getElementById('mouth');
    if (!mouth) return;
    
    const paths = [
        "M 110 135 Q 125 142 140 135",
        "M 110 137 Q 125 145 140 137",
        "M 110 135 Q 125 140 140 135",
        "M 110 138 Q 125 146 140 138",
        "M 110 135 Q 125 142 140 135"
    ];
    
    let currentIndex = 0;
    setInterval(() => {
        currentIndex = (currentIndex + 1) % paths.length;
        mouth.setAttribute('d', paths[currentIndex]);
    }, 150);
}

function init() {
    const timeButton = document.getElementById('timeButton');
    
    if (timeButton) {
        timeButton.addEventListener('click', showTime);
        timeButton.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showTime();
            }
        });
    }
    
    // Iniciar animación de la boca
    animateMouth();
    
    // Intentar cargar archivo de audio de fondo
    backgroundAudio = new Audio('golpe.mp3');
    backgroundAudio.preload = 'auto';
    
    // Manejar errores de carga
    backgroundAudio.addEventListener('error', function(e) {
        console.error('Error cargando golpe.mp3:', e);
        console.log('Usando música generada como respaldo');
        backgroundAudio = null;
        initAudio();
    });
    
    // Verificar cuando el archivo esté listo
    backgroundAudio.addEventListener('canplaythrough', function() {
        console.log('Archivo golpe.mp3 cargado correctamente');
    });
    
    // Iniciar música de fondo cuando el usuario interactúe por primera vez
    let musicStarted = false;
    function startMusicOnInteraction() {
        if (musicStarted) return;
        musicStarted = true;
        
        if (backgroundAudio && backgroundAudio.readyState >= 2) {
            // Usar archivo de audio
            console.log('Iniciando música de fondo: golpe.mp3');
            playBackgroundMusic();
        } else if (backgroundAudio) {
            // Esperar a que el archivo esté listo
            backgroundAudio.addEventListener('canplaythrough', function() {
                console.log('Iniciando música de fondo: golpe.mp3');
                playBackgroundMusic();
            }, { once: true });
        } else if (audioContext) {
            // Usar música generada
            console.log('Usando música generada');
            if (audioContext.state === 'suspended') {
                audioContext.resume().then(() => {
                    playBackgroundMusic();
                });
            } else {
                playBackgroundMusic();
            }
        }
    }
    
    // Intentar iniciar música cuando el usuario haga clic o toque
    document.addEventListener('click', startMusicOnInteraction, { once: true });
    document.addEventListener('touchstart', startMusicOnInteraction, { once: true });
    
    // También intentar iniciar cuando se haga clic en el botón
    if (timeButton) {
        timeButton.addEventListener('click', function() {
            if (!musicStarted) {
                startMusicOnInteraction();
            }
        }, { once: true });
    }
}


