/* ============================================================
   multimedia.js
   Control de audio personalizado y video banner
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ============================================================
    // PASO 2: AUDIO PERSONALIZADO
    // ============================================================
    
    const audio = document.getElementById('miAudio');
    const btnPlayPause = document.getElementById('btnPlayPause');
    const audioProgress = document.getElementById('audioProgress');
    const audioTime = document.getElementById('audioTime');
    const estadoAudio = document.getElementById('estadoAudio');
    const volumenAudio = document.getElementById('volumenAudio');

    // Verificar que todos los elementos existan
    if (!audio || !btnPlayPause || !audioProgress || !audioTime || !estadoAudio || !volumenAudio) {
        console.warn('⚠️ Algunos elementos del audio personalizado no se encontraron');
        return;
    }

    // Formatear tiempo en mm:ss
    function formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds)) return '00:00';
        const min = Math.floor(seconds / 60);
        const seg = Math.floor(seconds % 60);
        return `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
    }

    // Actualizar barra de progreso y tiempo
    function updateProgress() {
        if (audio.duration) {
            const percent = (audio.currentTime / audio.duration) * 100;
            audioProgress.style.width = percent + '%';
            audioTime.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
        }
    }

    // Actualizar estado del audio
    function updateStatus() {
        if (audio.paused) {
            estadoAudio.innerHTML = '<i class="fa-regular fa-circle"></i> Detenido';
        } else {
            estadoAudio.innerHTML = '<i class="fa-solid fa-circle"></i> Reproduciendo';
        }
    }

    // Actualizar botón Play/Pause
    function updateButton() {
        if (audio.paused) {
            btnPlayPause.innerHTML = '<i class="fa-solid fa-play"></i>';
            btnPlayPause.classList.remove('playing');
            btnPlayPause.setAttribute('aria-label', 'Reproducir');
        } else {
            btnPlayPause.innerHTML = '<i class="fa-solid fa-pause"></i>';
            btnPlayPause.classList.add('playing');
            btnPlayPause.setAttribute('aria-label', 'Pausar');
        }
    }

    // Eventos del audio
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('play', () => { updateButton(); updateStatus(); });
    audio.addEventListener('pause', () => { updateButton(); updateStatus(); });
    audio.addEventListener('ended', () => {
        audio.currentTime = 0;
        audioProgress.style.width = '0%';
        audioTime.textContent = `00:00 / ${formatTime(audio.duration)}`;
        updateButton();
        updateStatus();
    });

    // Cargar metadata
    audio.addEventListener('loadedmetadata', () => {
        audioTime.textContent = `00:00 / ${formatTime(audio.duration)}`;
    });

    // Botón Play/Pause
    btnPlayPause.addEventListener('click', function() {
        if (audio.paused) {
            audio.play().catch(e => console.warn('Error al reproducir:', e));
        } else {
            audio.pause();
        }
    });

    // Soporte para teclado (accesibilidad)
    btnPlayPause.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btnPlayPause.click();
        }
    });

    // Click en barra de progreso para saltar
    const progressContainer = audioProgress.parentElement;
    progressContainer.addEventListener('click', function(e) {
        if (audio.duration) {
            const rect = this.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audio.currentTime = percent * audio.duration;
        }
    });

    // Control de volumen
    volumenAudio.addEventListener('input', function() {
        audio.volume = this.value;
        const icon = this.previousElementSibling;
        if (this.value === '0') {
            icon.className = 'fa-solid fa-volume-xmark';
        } else if (this.value < 0.5) {
            icon.className = 'fa-solid fa-volume-low';
        } else {
            icon.className = 'fa-solid fa-volume-high';
        }
    });

    // Inicializar estado
    updateButton();
    updateStatus();


    // ============================================================
    // PASO 3: VIDEO BANNER
    // ============================================================
    
    const videoBanner = document.getElementById('videoBanner');
    const btnBannerPlay = document.getElementById('btnBannerPlay');

    if (videoBanner && btnBannerPlay) {
        // Estado del banner
        let bannerPlaying = false;

        // Reproducir/Pausar banner
        btnBannerPlay.addEventListener('click', function() {
            if (videoBanner.paused) {
                videoBanner.play();
                this.innerHTML = '<i class="fa-solid fa-pause"></i> Pausar banner';
                bannerPlaying = true;
            } else {
                videoBanner.pause();
                this.innerHTML = '<i class="fa-solid fa-play"></i> Reproducir banner';
                bannerPlaying = false;
            }
        });

        // Cuando el banner termina, reiniciar
        videoBanner.addEventListener('ended', () => {
            btnBannerPlay.innerHTML = '<i class="fa-solid fa-play"></i> Reproducir banner';
            bannerPlaying = false;
        });

        // Pausar cuando la pestaña no está visible (ahorro de recursos)
        document.addEventListener('visibilitychange', function() {
            if (document.hidden && bannerPlaying) {
                videoBanner.pause();
                btnBannerPlay.innerHTML = '<i class="fa-solid fa-play"></i> Reproducir banner';
                bannerPlaying = false;
            }
        });
    }


    // ============================================================
    // EFECTO DE ANIMACIÓN AL HACER SCROLL
    // ============================================================
    
    // Animar elementos cuando aparecen en el viewport
    const animatedElements = document.querySelectorAll('.galeria-item, .audio-card');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    } else {
        // Fallback para navegadores antiguos
        animatedElements.forEach(el => {
            el.style.opacity = '1';
        });
    }


    // ============================================================
    // CONSOLA DE DEPURACIÓN
    // ============================================================
    
    console.log('🎵 Multimedia JS cargado correctamente');
    console.log('📌 Reemplaza los archivos de audio y video con tus propios archivos');
    console.log('📌 Actualiza el iframe con el enlace de Rosario Tijeras');
    console.log('📌 Reemplaza el video del río con tu propio contenido');
});