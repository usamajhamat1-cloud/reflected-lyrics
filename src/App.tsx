/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { MUSIC_CATALOG, TESTIMONIALS, PARTNERS } from './data/catalog';
import { Track } from './types';
import BookReader from './components/BookReader';
import CinemaModal from './components/CinemaModal';
import SongwritingModal from './components/SongwritingModal';
import InquiryForm from './components/InquiryForm';

const LOGO_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz1JfYe8jvVTNPvawwTJ6VUI5_Xd5kxjAxEd78oq13b5iZhFf1gNSS9AG2huaVXYQeXm3Fsu0fcx5HaGefk8xGYNOHV0YYlq7AFLH93Gprfek-pAFUpnnCgNjHqwQUS0Pi6lsKKg3xgOHPkvN-F1WhaSUZj_t0rh5RYuZb_9O6ItdK7ci787dvuy4SF8vVPNf5Jg8Ih8EuBYYLGN_gkmRiEtyccAKSXjJf2o9RWuh0hoVx5AnOP02c8BUKcZdEPbxq99LqA17lIwo';
const HERO_BG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJiyowx0NFdi5mZw5bzFcKeWmEXsdndh2wS1C5lo8I4I3Oaub8dOdTYy9wJIy0rNBQRWiW_ClPOv2aGHbDwChYDqtn2i7q64tPL_7jDflWqvUwyUc2Uy8gfGBBCeA2Apo59dVF-LKUHqLzBOoqv4fHaxaPzGuCm_M0BFOOlOzUpnzYNOZnP42kfFugKKcv9JGK2Got0QPOD45n07hCY4P1uPD2Boqrs_FKzKkIsP7TNO76x9SXD9QCSxvqc6t9niDrpBU4JC9xHLU';
const BOOK_COVER = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkBYHKfoOp8P6J1XIpjLWhOEqDzWhuDIaYyreYm5K9CN1vOTkb0pyJ6NEAoRJUchTUw3610rj89phzyezgfQxr2H7lUSYF3Vbjld4Cx405F4HFhtnqkdALgvvMYZlKC9FirfsoOF56x_fb851sOzTavyRbtgdxtbSLWqULd_nisR9VesNqXR0wMSl9ib6q2sZlGAMnB2K8kBXWxIm2htY5Hm3bVZGfZNBM2-a--vzYcpWm0PHIKn6fmzIkIjpuW6JTWl6A1iM1E-o';
const FILM_THUMB = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwqLfsNSizsE3M2n-6zlTLIunALvYWXWQg4YjYy2s6mkmINPVo00tyaRpIDCVWy_oSzOn0O-rDm9-JVVDhkmo1uhZfkaexynQHXTHydIeErYoaCxQuyvtxlTeU7tCLmM6RwaDSOIFJ4vNO4ymUSLWwYZcy1FJ0-e5gEbW6pl2ffHG1uNxi-se7-03RXI9Y4lRyAnxvHnWg9Wnm-E9eOUbB1aMHkIWqPca1VxgReybKqQg-K4T45VtyOAQuCbSRI9PL9Ag6qRzyQwc';
const ALBUM_COVER = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSy3l_MguCPtrYv_xy07iG24JzCDKtI-IxvwAw1CmhR0urLKb7-iS8fX_cVu_g63DBWNrEMehYwiQ4dAnhLdMBeftK47ZHGx2JevarYLEQoivgrME8nwI1Xt7pvFQGO5pkqDlNL-zECVLwAA-ewNq_VOzrigu4s-sWwEcbJB6RYen7UN8SR9LjhJbLSpDNjZHD2KRaw0abFuc7gsit6dTHin9--bm2vXr70_XDJbL9yf-wzx-K8wCtSEqomsBCgRsRjFSEoJUmaJ8';

export default function App() {
  const [currentTrack, setCurrentTrack] = useState<Track>(MUSIC_CATALOG[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(MUSIC_CATALOG[0].duration);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  // Modals
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isCinemaOpen, setIsCinemaOpen] = useState(false);
  const [isSongwritingOpen, setIsSongwritingOpen] = useState(false);

  // Mobile menu
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // DOM elements
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Track state syncing
  useEffect(() => {
    // If audio element doesn't exist, create it
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;
    
    // Set source
    if (currentTrack.audioUrl) {
      audio.src = currentTrack.audioUrl;
    }
    audio.load();
    audio.volume = isMuted ? 0 : volume;

    // Listeners
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setTrackDuration(audio.duration || currentTrack.duration);
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        handleSkipNext();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    if (isPlaying) {
      // Chrome/Vite might block autoplay till click - we wrap in catch
      audio.play()
        .then(() => {
          startSynthesizerBackground(currentTrack.synthFrequency || 100);
        })
        .catch(() => {
          // Fallback - play synthetic backing only
          startSynthesizerBackground(currentTrack.synthFrequency || 100);
        });
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      stopSynthesizerBackground();
    };
  }, [currentTrack]);

  // Volume state updates
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    if (gainRef.current && audioContextRef.current) {
      gainRef.current.gain.setValueAtTime(isMuted ? 0 : volume * 0.15, audioContextRef.current.currentTime);
    }
  }, [volume, isMuted]);

  // Global Keypress commands & parallax
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const heroBg = document.querySelector('.hero-parallax') as HTMLElement;
      if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.15}px) scale(1.05)`;
      }

      const nav = document.querySelector('nav') as HTMLElement;
      if (nav) {
        if (scrolled > 80) {
          nav.classList.add('py-4', 'shadow-2xl', 'bg-background/95');
          nav.classList.remove('py-8', 'bg-background/80');
        } else {
          nav.classList.add('py-8', 'bg-background/80');
          nav.classList.remove('py-4', 'shadow-2xl', 'bg-background/95');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Web Audio Synth backup implementation
  const startSynthesizerBackground = (frequency: number) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Clear standard previous oscillator
      if (oscRef.current) {
        try { oscRef.current.disconnect(); } catch (e) {}
      }
      if (gainRef.current) {
        try { gainRef.current.disconnect(); } catch (e) {}
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(isMuted ? 0 : volume * 0.15, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
    } catch (e) {
      console.warn("Synthesizer bypassed due to sandbox layout restrictions.", e);
    }
  };

  const stopSynthesizerBackground = () => {
    try {
      const activeGain = gainRef.current;
      const activeCtx = audioContextRef.current;
      const activeOsc = oscRef.current;
      if (activeGain && activeCtx) {
        activeGain.gain.setValueAtTime(activeGain.gain.value, activeCtx.currentTime);
        activeGain.gain.linearRampToValueAtTime(0, activeCtx.currentTime + 0.4);
        setTimeout(() => {
          try {
            activeOsc?.stop();
            activeOsc?.disconnect();
          } catch(e){}
        }, 500);
      }
    } catch (e) {}
  };

  // Playback Control Handlers
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      stopSynthesizerBackground();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          startSynthesizerBackground(currentTrack.synthFrequency || 100);
          setIsPlaying(true);
        })
        .catch(() => {
          startSynthesizerBackground(currentTrack.synthFrequency || 100);
          setIsPlaying(true);
        });
    }
  };

  const selectTrackToPlay = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleSkipNext = () => {
    const currentIndex = MUSIC_CATALOG.findIndex(t => t.id === currentTrack.id);
    let nextIndex = 0;
    
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * MUSIC_CATALOG.length);
    } else if (currentIndex < MUSIC_CATALOG.length - 1) {
      nextIndex = currentIndex + 1;
    }
    
    setCurrentTrack(MUSIC_CATALOG[nextIndex]);
    setIsPlaying(true);
  };

  const handleSkipPrevious = () => {
    const currentIndex = MUSIC_CATALOG.findIndex(t => t.id === currentTrack.id);
    let prevIndex = MUSIC_CATALOG.length - 1;
    
    if (isShuffle) {
      prevIndex = Math.floor(Math.random() * MUSIC_CATALOG.length);
    } else if (currentIndex > 0) {
      prevIndex = currentIndex - 1;
    }
    
    setCurrentTrack(MUSIC_CATALOG[prevIndex]);
    setIsPlaying(true);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const targetTime = percentage * trackDuration;
    
    audioRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="bg-background text-on-surface film-grain selection:bg-primary-container selection:text-on-primary-container min-h-screen relative overflow-x-hidden antialiased pb-24 xl:pb-32">
      
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-2xl transition-all duration-700 px-6 md:px-12 py-8 max-w-[2000px] mx-auto left-0 right-0 border-b border-white/5">
        <div className="flex justify-between items-center">
          
          {/* Logo brand */}
          <div className="flex items-center">
            <a href="#home" className="hover:opacity-80 transition-opacity">
              <img 
                src={LOGO_URL} 
                alt="Reflected Lyrical Productions LLC Logo" 
                className="w-auto object-contain transition-all duration-700 h-20 md:h-24 referrerPolicy='no-referrer'" 
              />
            </a>
          </div>

          {/* Desktop links */}
          <div className="hidden xl:flex gap-10 items-center ml-24">
            <a className="font-sans text-xs uppercase tracking-[0.2em] text-on-surface hover:text-primary transition-colors duration-300 nav-link-underline" href="#catalog">♫ Song Catalog</a>
            <a className="font-sans text-xs uppercase tracking-[0.2em] text-on-surface hover:text-primary transition-colors duration-300 nav-link-underline" href="#songwriting">Songwriting &amp; Publishing</a>
            <a className="font-sans text-xs uppercase tracking-[0.2em] text-on-surface hover:text-primary transition-colors duration-300 nav-link-underline" href="#books">Books &amp; Literary Works</a>
            <a className="font-sans text-xs uppercase tracking-[0.2em] text-on-surface hover:text-primary transition-colors duration-300 nav-link-underline" href="#musicals">Musicals</a>
            <a className="font-sans text-xs uppercase tracking-[0.2em] text-on-surface hover:text-primary transition-colors duration-300 nav-link-underline" href="#film">TV &amp; Film Development</a>
            <a className="font-sans text-xs uppercase tracking-[0.2em] text-on-surface hover:text-primary transition-colors duration-300 nav-link-underline" href="#about">About Amy Matthew</a>
            
            <div className="ml-4 pl-10 border-l border-white/10">
              <a className="font-sans text-xs uppercase tracking-[0.2em] text-primary hover:text-white transition-all duration-300 border-b border-primary/40 hover:border-white pb-1" href="#contact">Licensing &amp; Contact</a>
            </div>
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            className="xl:hidden text-primary focus:outline-none"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            aria-label="Toggle Mobile Menu"
          >
            <span className="material-symbols-outlined text-3xl">
              {isMobileNavOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 top-[110px] z-40 bg-background/95 backdrop-blur-3xl xl:hidden p-8 border-t border-white/5 animate-fade-in overflow-y-auto">
          <div className="flex flex-col gap-8 text-center pt-8">
            <a onClick={() => setIsMobileNavOpen(false)} className="font-sans text-sm uppercase tracking-[0.22em] text-on-surface hover:text-primary transition-colors" href="#catalog">♫ Song Catalog</a>
            <a onClick={() => setIsMobileNavOpen(false)} className="font-sans text-sm uppercase tracking-[0.22em] text-on-surface hover:text-primary transition-colors" href="#songwriting">Songwriting &amp; Publishing</a>
            <a onClick={() => setIsMobileNavOpen(false)} className="font-sans text-sm uppercase tracking-[0.22em] text-on-surface hover:text-primary transition-colors" href="#books">Books &amp; Literary Works</a>
            <a onClick={() => setIsMobileNavOpen(false)} className="font-sans text-sm uppercase tracking-[0.22em] text-on-surface hover:text-primary transition-colors" href="#musicals">Musicals</a>
            <a onClick={() => setIsMobileNavOpen(false)} className="font-sans text-sm uppercase tracking-[0.22em] text-on-surface hover:text-primary transition-colors" href="#film">TV &amp; Film Development</a>
            <a onClick={() => setIsMobileNavOpen(false)} className="font-sans text-sm uppercase tracking-[0.22em] text-on-surface hover:text-primary transition-colors" href="#about">About Amy Matthew</a>
            
            <div className="h-[1px] bg-white/10 my-4 max-w-xs mx-auto w-full"></div>
            
            <a onClick={() => setIsMobileNavOpen(false)} className="font-sans text-xs uppercase tracking-[0.2em] text-primary hover:text-white transition-all py-3 border border-primary/20 max-w-xs mx-auto w-full rounded" href="#contact">
              Licensing &amp; Contact
            </a>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden" id="home">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Hero Cinematic Production Background" 
            className="w-full h-full object-cover brightness-[0.35] scale-105 hero-parallax referrerPolicy='no-referrer'" 
            src={HERO_BG} 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background"></div>
          <div className="absolute inset-0 spotlight"></div>
        </div>

        <div className="relative z-10 text-center px-6 md:px-24">
          <span className="font-sans text-[10px] uppercase tracking-[0.6em] text-primary/80 mb-6 block font-semibold animate-fade-in">
            A Curated Creative Collective
          </span>
          <h1 className="font-serif text-4xl md:text-7xl max-w-5xl mx-auto mb-8 leading-none text-white font-bold tracking-tight">
            Where Every Lyric <br/>Finds Its Reflection
          </h1>
          <p className="font-sans text-sm md:text-lg text-on-surface-variant/80 mb-12 tracking-[0.14em] max-w-2xl mx-auto uppercase">
            Cinematic Soundscapes • Literary Worlds • Stage &amp; Screen
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a 
              className="group relative px-10 py-4.5 font-sans text-[10px] uppercase tracking-[0.25em] text-on-primary bg-primary hover:bg-white hover:text-black transition-all duration-500 font-semibold rounded-sm" 
              href="#catalog"
            >
              Explore Catalog
            </a>
            <a 
              className="px-10 py-4.5 border border-primary/30 text-primary font-sans text-[10px] uppercase tracking-[0.25em] hover:bg-primary/5 hover:border-primary transition-all duration-500 font-semibold rounded-sm" 
              href="#film"
            >
              Film Development
            </a>
          </div>
        </div>

        {/* Scroll indicator anchor */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <span className="material-symbols-outlined text-primary text-2xl font-light">expand_more</span>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 md:py-36 bg-background spotlight border-b border-white/5" id="about">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div className="space-y-4">
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-primary mb-2 block font-semibold">
                The Legacy of Amy Matthew
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-white font-medium tracking-tight leading-snug">
                The intersection of poetic vision and cinematic scale.
              </h2>
            </div>
            
            <div className="space-y-8">
              <p className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed">
                Reflected Lyrical Productions LLC, founded by Amy Matthew, stands at the vanguard of modern storytelling. We believe that great art doesn't live in silos—it flows between the piano, the page, and the projection.
              </p>
              <div className="space-y-4 border-l border-primary/40 pl-8 py-2">
                <p className="font-sans text-base text-on-surface-variant italic leading-relaxed">
                  "I've always seen music as a visual medium and stories as rhythmic experiences. This production house is the home for that duality."
                </p>
                <p className="font-serif text-lg text-primary">— Amy Matthew</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Creative Divisions */}
      <section className="py-24 md:py-36 bg-surface-container-low" id="divisions">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16">
          
          <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-8 gap-4">
            <div>
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/60 mb-2 block font-semibold">
                Creative Portfolio
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-white font-medium">Primary Creative Doors</h2>
            </div>
            <div>
              <a className="font-sans text-[10px] uppercase tracking-[0.1em] text-on-surface-variant hover:text-primary transition-colors border-b border-white/10 hover:border-primary pb-1" href="#contact">View All Projects</a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Music Catalog Division Key */}
            <div className="md:col-span-8 group relative overflow-hidden h-[450px] md:h-[550px] rounded bg-black" id="catalog-card">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-[1.5s] opacity-25"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent"></div>
              <div className="absolute bottom-0 p-8 md:p-12 w-full space-y-4 md:space-y-6">
                <div className="flex items-center gap-4">
                  <span className="h-[1px] w-12 bg-primary/40"></span>
                  <span className="font-sans text-[10px] uppercase tracking-widest text-primary font-semibold">01. ♫ Song Catalog</span>
                </div>
                <h3 className="font-serif text-3xl md:text-4xl text-white tracking-wide group-hover:translate-x-2 transition-transform duration-500 font-medium">Curated Compositions</h3>
                <p className="font-sans text-sm text-on-surface-variant font-light max-w-lg leading-relaxed">
                  Access an elite library of mastered acoustic recordings, orchestral scores, and high-fidelity licensing projects.
                </p>
                <a className="inline-block font-sans text-xs uppercase tracking-widest border-b border-primary pb-1 hover:text-primary transition-all" href="#catalog">Enter Library Sampler</a>
              </div>
            </div>

            {/* Songwriting Division Key */}
            <div className="md:col-span-4 group relative overflow-hidden h-[450px] md:h-[550px] rounded bg-black" id="songwriting-card">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-[1.5s] opacity-25"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent"></div>
              <div className="absolute bottom-0 p-8 md:p-12 space-y-4 md:space-y-6">
                <div className="flex items-center gap-4">
                  <span className="h-[1px] w-12 bg-primary/40"></span>
                  <span className="font-sans text-[10px] uppercase tracking-widest text-primary font-semibold">02. Songwriting</span>
                </div>
                <h3 className="font-serif text-3xl text-white tracking-wide group-hover:translate-x-2 transition-transform duration-500 font-medium">Lyrical Craft</h3>
                <p className="font-sans text-sm text-on-surface-variant font-light leading-relaxed">
                  Collaborative lyric writing and custom lyrical publishing structures built in sync with world-class artists.
                </p>
                <button 
                  onClick={() => setIsSongwritingOpen(true)}
                  className="font-sans text-xs uppercase tracking-widest border-b border-primary pb-1 hover:text-primary transition-all text-left block"
                >
                  Publishing Workbench
                </button>
              </div>
            </div>

            {/* Books Card */}
            <div className="md:col-span-4 group relative overflow-hidden h-[450px] md:h-[500px] rounded bg-black" id="books-card">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-[1.5s] opacity-25"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent"></div>
              <div className="absolute bottom-0 p-8 md:p-12 space-y-4 md:space-y-6">
                <div className="flex items-center gap-4">
                  <span className="h-[1px] w-12 bg-primary/40"></span>
                  <span className="font-sans text-[10px] uppercase tracking-widest text-primary font-semibold">03. Books</span>
                </div>
                <h3 className="font-serif text-3xl text-white tracking-wide group-hover:translate-x-2 transition-transform duration-500 font-medium">Literary Works</h3>
                <p className="font-sans text-sm text-on-surface-variant font-light leading-relaxed">
                  Immersive fantasy narratives, poetry anthologies, and children’s literature crossing from page to theatrical stage.
                </p>
                <button 
                  onClick={() => setIsBookOpen(true)}
                  className="font-sans text-xs uppercase tracking-widest border-b border-primary pb-1 hover:text-primary transition-all text-left block"
                >
                  View Titles
                </button>
              </div>
            </div>

            {/* Musicals & Film Column combinations */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="group relative overflow-hidden h-[450px] md:h-[500px] rounded bg-black" id="musicals-card">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503095396549-80705bc06071?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-[1.5s] opacity-25"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent"></div>
                <div className="absolute bottom-0 p-8 md:p-12 space-y-4">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="h-[1px] w-12 bg-primary/40"></span>
                    <span className="font-sans text-[10px] uppercase tracking-widest text-primary font-semibold font-mono">04. Musicals</span>
                  </div>
                  <h3 className="font-serif text-3xl text-white font-medium">The Stage</h3>
                  <a className="inline-block font-sans text-xs uppercase tracking-widest border-b border-primary pb-1 hover:text-primary transition-all mt-4" href="#contact">Production Inquiries</a>
                </div>
              </div>

              <div className="group relative overflow-hidden h-[450px] md:h-[500px] rounded bg-black" id="film-card">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-[1.5s] opacity-25"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent"></div>
                <div className="absolute bottom-0 p-8 md:p-12 space-y-4">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="h-[1px] w-12 bg-primary/40"></span>
                    <span className="font-sans text-[10px] uppercase tracking-widest text-primary font-semibold font-mono">05. TV &amp; film</span>
                  </div>
                  <h3 className="font-serif text-3xl text-white font-medium">Development</h3>
                  <button 
                    onClick={() => setIsCinemaOpen(true)}
                    className="inline-block font-sans text-xs uppercase tracking-widest border-b border-primary pb-1 hover:text-primary transition-all text-left mt-4"
                  >
                    Current Dev Slate
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Audio Sampler Section */}
      <section className="py-24 md:py-36 bg-background spotlight border-y border-white/5" id="catalog">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            
            <div className="w-full lg:w-1/2 space-y-8">
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-primary mb-2 block font-semibold">
                Audio Sampler
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-white tracking-tight font-medium leading-none">
                Reflected Compositions
              </h2>
              <p className="font-sans text-base text-on-surface-variant max-w-md leading-relaxed">
                Each track is an individual narrative, crafted to evoke stark emotional depth and physical auditory projection.
              </p>
              
              <button 
                onClick={() => selectTrackToPlay(MUSIC_CATALOG[0])}
                className="group flex items-center gap-4 font-sans text-xs uppercase tracking-[0.3em] text-white hover:text-primary transition-all font-semibold"
              >
                <span className="w-12 h-12 flex items-center justify-center border border-white/20 rounded-full group-hover:border-primary transition-all bg-white/5">
                  <span className="material-symbols-outlined text-sm">play_arrow</span>
                </span>
                Launch Main Sampler
              </button>
            </div>

            <div className="w-full lg:w-1/2 space-y-4">
              {MUSIC_CATALOG.map((track) => {
                const isSelected = track.id === currentTrack.id;
                return (
                  <div 
                    key={track.id}
                    onClick={() => selectTrackToPlay(track)}
                    className={`glass p-6 md:p-8 border rounded-lg flex items-center gap-6 cursor-pointer transition-all hover:bg-white/[0.04] ${isSelected ? 'border-primary bg-primary/5 shadow-lg' : 'border-white/5 bg-white/[0.01]'}`}
                  >
                    <button 
                      className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${isSelected && isPlaying ? 'bg-primary text-on-primary' : 'border border-primary text-primary hover:bg-primary hover:text-on-primary'}`}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {isSelected && isPlaying ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                    
                    <div className="flex-grow">
                      <h4 className="font-sans text-lg text-white font-semibold mb-1">{track.title}</h4>
                      <div className="flex items-center gap-3">
                        <p className="font-sans text-[10px] text-primary/80 uppercase tracking-widest font-mono">{track.category}</p>
                        <span className="text-white/20 text-xs font-mono">&bull;</span>
                        <p className="font-sans text-[10px] text-on-surface-variant/60 uppercase tracking-widest font-mono">{formatTime(track.duration)}</p>
                      </div>

                      {/* Micro Seeker Fill for Active Track */}
                      {isSelected && (
                        <div className="seeker-bar mt-4 rounded-full overflow-hidden h-1 bg-white/5">
                          <div 
                            className="seeker-fill rounded-full" 
                            style={{ width: `${(currentTime / trackDuration) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* Books Preview Section */}
      <section className="py-24 md:py-36 bg-surface-container-low overflow-hidden" id="books">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            <div className="relative flex justify-center">
              <div className="absolute -inset-10 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
              <img 
                alt="Book cover mockup: The Midnight Library of Wonders" 
                className="relative w-full max-w-sm rounded-lg shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8)] transition-transform duration-1000 hover:scale-[1.02] cursor-pointer border border-white/5 referrerPolicy='no-referrer'" 
                src={BOOK_COVER}
                onClick={() => setIsBookOpen(true)}
              />
            </div>

            <div className="space-y-8">
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-primary mb-2 block font-semibold">
                Current Publication
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-white tracking-wide font-medium leading-tight">
                The Midnight Library <br/>of Wonders
              </h2>
              <p className="font-sans text-sm md:text-base text-on-surface-variant leading-relaxed">
                A magical odyssey traversing timeless galleries where every volume acts as a localized passage. Amy Matthew’s latest work weaves a profound chronicle of acoustic memory, ancient crafts, and silent resolutions.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  onClick={() => setIsBookOpen(true)}
                  className="px-8 py-3.5 bg-primary text-on-primary font-sans text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 font-semibold rounded-sm"
                >
                  Order Desk Edition
                </button>
                <button 
                  onClick={() => setIsBookOpen(true)}
                  className="px-8 py-3.5 border border-white/20 text-white font-sans text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-all duration-300 font-semibold rounded-sm bg-white/5"
                >
                  Read Free Chapter
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TV & Film Development Spotlight */}
      <section className="py-24 md:py-36 bg-background spotlight relative border-t border-white/5" id="film">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 text-center space-y-16">
          
          <div className="space-y-4">
            <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-2 block font-semibold">
              Cinematic Feature In Development
            </span>
            <h2 className="font-serif text-4xl md:text-7xl text-white font-bold tracking-wide">
              The First Verse
            </h2>
          </div>

          <div 
            onClick={() => setIsCinemaOpen(true)}
            className="relative max-w-5xl mx-auto overflow-hidden shadow-[0_40px_90px_-20px_rgba(0,0,0,0.9)] rounded-lg group cursor-pointer border border-white/10"
          >
            <img 
              alt="Cinematic production mockup placeholder" 
              className="w-full grayscale brightness-50 transition-all duration-[2s] group-hover:grayscale-0 group-hover:brightness-75 group-hover:scale-102 referrerPolicy='no-referrer'" 
              src={FILM_THUMB} 
            />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center border border-primary/40 rounded-full backdrop-blur-sm group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-700">
                <span className="material-symbols-outlined text-primary text-5xl md:text-6xl font-light">
                  play_arrow
                </span>
              </div>
            </div>

            <div className="absolute bottom-0 w-full p-8 md:p-16 text-left bg-gradient-to-t from-background via-background/60 to-transparent flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <h3 className="font-sans text-lg md:text-2xl font-bold text-white tracking-[0.2em] uppercase">
                  A MUSICAL FILM PRODUCTION
                </h3>
                <p className="font-sans text-xs text-primary/80 uppercase tracking-widest font-mono mt-2">
                  Launch Script / Production Bible Deck
                </p>
              </div>
              <p className="font-sans text-[10px] text-primary bg-primary/10 border border-primary/20 tracking-widest uppercase py-2 px-4 rounded font-mono font-semibold">
                EXPECTED FALL 2026
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Industry Relations & Partners */}
      <section className="py-24 md:py-32 bg-background border-t border-white/5" id="relations">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16">
          
          <div className="text-center mb-20 space-y-4">
            <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-primary mb-2 block font-semibold">
              Industry Relations
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-white font-medium">Global Partners</h2>
          </div>

          {/* Logo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-16 items-center mb-24 border-b border-white/5 pb-16">
            {PARTNERS.map((partner, idx) => (
              <div 
                key={idx}
                className="flex flex-col items-center justify-center text-center group py-4 opacity-40 hover:opacity-100 transition-all duration-500"
              >
                <span className="font-serif text-lg md:text-2xl tracking-tighter text-white group-hover:text-primary transition-colors font-bold">
                  {partner.name}
                </span>
                <span className="font-sans text-[8px] uppercase tracking-wider text-on-surface-variant/50 group-hover:text-primary/70 transition-colors mt-2">
                  {partner.category}
                </span>
              </div>
            ))}
          </div>

          {/* Core Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {TESTIMONIALS.map((t, idx) => (
              <div 
                key={idx}
                className="p-8 md:p-12 border-l border-white/5 bg-white/[0.01] hover:border-primary hover:bg-white/[0.02] transition-colors duration-700 relative rounded-r-lg"
              >
                <span className="material-symbols-outlined text-primary mb-6 text-4xl font-light">
                  format_quote
                </span>
                <p className="font-sans text-lg md:text-xl text-white mb-8 italic leading-relaxed">
                  "{t.quote}"
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-primary/10 to-white/5 flex items-center justify-center border border-white/10">
                    <span className="material-symbols-outlined text-sm text-primary">verified_user</span>
                  </div>
                  <div>
                    <p className="font-sans text-xs text-primary uppercase tracking-widest font-semibold mb-1">
                      {t.author}
                    </p>
                    <p className="font-sans text-[10px] text-on-surface-variant uppercase tracking-wider font-mono">
                      {t.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Press and Download Media Assets */}
      <section className="py-24 bg-surface-container border-t border-white/5" id="media">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 text-center space-y-16">
          <h2 className="font-serif text-3xl md:text-5xl text-white font-medium">Press &amp; Media Assets</h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { label: 'EPK / Press Kit', icon: 'download', file: 'epk_main_reflected_lyrical.pdf' },
              { label: 'Gallery Assets', icon: 'image', file: 'gallery_highres_package.zip' },
              { label: 'Division Briefs', icon: 'description', file: 'briefs_deck_vol1.pdf' },
              { label: 'Brand Guides', icon: 'brand_awareness', file: 'brand_typography_assets.zip' }
            ].map((asset, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  alert(`Starting licensing server request to fetch archive: ${asset.file}`);
                }}
                className="p-8 md:p-12 border border-white/5 rounded hover:bg-primary hover:text-background transition-all duration-500 cursor-pointer group flex flex-col items-center justify-center gap-4 hover:shadow-xl hover:border-transparent bg-background/25"
              >
                <span className="material-symbols-outlined text-3xl md:text-4xl font-light text-primary group-hover:text-background transition-colors">
                  {asset.icon}
                </span>
                <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.25em] font-semibold text-white group-hover:text-background transition-colors text-center">
                  {asset.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 md:py-36 bg-background spotlight" id="contact">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16">
          <InquiryForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-background relative border-t border-white/5 py-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 space-y-16">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-24">
            
            <div className="space-y-6 max-w-sm">
              <img 
                src={LOGO_URL} 
                alt="Reflected Lyrical Logo in footer" 
                className="h-16 w-auto object-contain referrerPolicy='no-referrer'" 
              />
              <p className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed font-light">
                A premier entertainment production collective dedicated to the pristine craft of storytelling through acoustic sound and cinematic vision.
              </p>
              <div className="flex gap-4">
                {['share', 'video_library', 'music_note'].map((icon, idx) => (
                  <button 
                    key={idx}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">{icon}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 sm:gap-24 w-full lg:w-auto">
              <div className="space-y-6">
                <h4 className="font-sans text-xs text-primary uppercase tracking-[0.2em] font-semibold">Creative Divisions</h4>
                <ul className="space-y-4 font-sans text-xs text-on-surface-variant/80">
                  <li><a className="hover:text-primary transition-colors block" href="#catalog">♫ Song Catalog</a></li>
                  <li><a className="hover:text-primary transition-colors block" href="#film">Filmography</a></li>
                  <li><a className="hover:text-primary transition-colors block" href="#songwriting">Songwriting</a></li>
                  <li><a className="hover:text-primary transition-colors block" href="#books">Authorship</a></li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="font-sans text-xs text-primary uppercase tracking-[0.2em] font-semibold">Connections</h4>
                <ul className="space-y-4 font-sans text-xs text-on-surface-variant/80">
                  <li><a className="hover:text-primary transition-colors block" href="#contact">Inquiries</a></li>
                  <li><a className="hover:text-primary transition-colors block" href="#media">Press Kit</a></li>
                  <li><a className="hover:text-primary transition-colors block" href="#relations">Client Deck</a></li>
                  <li><a className="hover:text-primary transition-colors block" href="#about">About Amy</a></li>
                </ul>
              </div>
            </div>

          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-center">
            <p className="font-sans text-[10px] text-on-surface-variant/40 uppercase tracking-[0.2em]">
              © 2026 Reflected Lyrical Productions LLC. Excellence by Design.
            </p>
            <div className="flex gap-6">
              <span className="font-sans text-[9px] text-on-surface-variant/30 uppercase tracking-widest">Studio 01: Los Angeles</span>
              <span className="font-sans text-[9px] text-on-surface-variant/30 uppercase tracking-widest">Studio 02: New York</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Persistent Bottom Media Player Bar */}
      <div className="fixed bottom-0 w-full bg-background/95 backdrop-blur-3xl py-4.5 px-6 md:px-12 z-50 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Cover & Track metadata */}
          <div className="flex items-center gap-4 w-full md:w-1/4">
            <div className="w-12 h-12 bg-white/5 overflow-hidden rounded relative border border-white/10 flex-shrink-0">
              <img 
                alt="Track jacket artwork" 
                className={`w-full h-full object-cover opacity-60 referrerPolicy='no-referrer' ${isPlaying ? 'animate-pulse' : ''}`} 
                src={ALBUM_COVER} 
              />
            </div>
            <div className="truncate">
              <h5 className="text-[11px] font-sans text-primary tracking-widest uppercase font-bold truncate">
                {currentTrack.title}
              </h5>
              <p className="text-[9px] text-on-surface-variant uppercase tracking-[0.2em] mt-0.5 truncate font-mono">
                {currentTrack.album}
              </p>
            </div>
          </div>

          {/* Central Playback elements */}
          <div className="flex flex-col items-center gap-2.5 w-full md:w-1/2">
            <div className="flex items-center gap-8">
              <button 
                onClick={() => setIsShuffle(!isShuffle)}
                className={`flex items-center focus:outline-none transition-colors ${isShuffle ? 'text-primary' : 'text-on-surface-variant/50 hover:text-white'}`}
                title="Shuffle Tracks"
              >
                <span className="material-symbols-outlined text-lg font-light">shuffle</span>
              </button>
              
              <button 
                onClick={handleSkipPrevious}
                className="text-on-surface-variant/80 hover:text-primary transition-colors focus:outline-none"
                title="Previous Track"
              >
                <span className="material-symbols-outlined text-2xl font-light">skip_previous</span>
              </button>
              
              <button 
                onClick={handlePlayPause}
                className="w-11 h-11 flex items-center justify-center bg-white text-background rounded-full hover:bg-primary hover:text-background transition-all focus:outline-none"
                title={isPlaying ? "Pause" : "Play"}
              >
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>
              
              <button 
                onClick={handleSkipNext}
                className="text-on-surface-variant/80 hover:text-primary transition-colors focus:outline-none"
                title="Next Track"
              >
                <span className="material-symbols-outlined text-2xl font-light">skip_next</span>
              </button>
              
              <button 
                onClick={() => setIsRepeat(!isRepeat)}
                className={`flex items-center focus:outline-none transition-colors ${isRepeat ? 'text-primary' : 'text-on-surface-variant/50 hover:text-white'}`}
                title="Repeat Track"
              >
                <span className="material-symbols-outlined text-lg font-light">repeat</span>
              </button>
            </div>

            {/* Progress Seeker and Counters */}
            <div className="w-full flex items-center gap-4">
              <span className="text-[9px] font-mono text-on-surface-variant/40 select-none">
                {formatTime(currentTime)}
              </span>
              
              <div 
                onClick={handleSeek}
                className="seeker-bar flex-grow rounded-full overflow-hidden"
              >
                <div 
                  className="seeker-fill rounded-full" 
                  style={{ width: `${(currentTime / trackDuration) * 100}%` }}
                />
              </div>
              
              <span className="text-[9px] font-mono text-on-surface-variant/40 select-none">
                {formatTime(trackDuration)}
              </span>
            </div>
          </div>

          {/* Volume Control bar */}
          <div className="flex items-center justify-end gap-6 w-full md:w-1/4">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="text-on-surface-variant/60 hover:text-primary transition-colors focus:outline-none"
              title={isMuted ? "Unmute" : "Mute"}
            >
              <span className="material-symbols-outlined font-light text-base">
                {isMuted || volume === 0 ? 'volume_off' : 'volume_up'}
              </span>
            </button>
            
            <input 
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-20 md:w-24 accent-primary h-[2px] bg-white/10 cursor-pointer focus:outline-none"
            />
          </div>

        </div>
      </div>

      {/* Overlay Modals */}
      <BookReader 
        isOpen={isBookOpen} 
        onClose={() => setIsBookOpen(false)} 
      />
      <CinemaModal 
        isOpen={isCinemaOpen} 
        onClose={() => setIsCinemaOpen(false)} 
      />
      <SongwritingModal 
        isOpen={isSongwritingOpen} 
        onClose={() => setIsSongwritingOpen(false)} 
      />

    </div>
  );
}
