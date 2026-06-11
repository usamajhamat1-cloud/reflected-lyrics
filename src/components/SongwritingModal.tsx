import React, { useState } from 'react';

interface SongwritingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const THEME_VERSE_TEMPLATES: Record<string, string[]> = {
  noir: [
    "The streetlights leak in amber splinters.",
    "Whispered names on silent keys,",
    "Through the glass or through the winter,",
    "We are only dust on summer breeze."
  ],
  velvet: [
    "Your cello strings are heavy with regret,",
    "A minor chord we could not quite resolve,",
    "Beneath the lamps where wet sidewalks reflect,",
    "The promises we watched the night dissolve."
  ],
  horizon: [
    "Golden light across the valley floor.",
    "Oversized dreams in a small, crowded room,",
    "We locked the gate but left the front double door,",
    "Waiting for the midnight rose to bloom."
  ],
  mystic: [
    "She has standard calendars with empty squares,",
    "And a clock that strictly counts backwards to noon,",
    "Trading steps on spiral marble stairs,",
    "To reach the bright reflection of the moon."
  ]
};

export default function SongwritingModal({ isOpen, onClose }: SongwritingModalProps) {
  const [selectedTheme, setSelectedTheme] = useState<string>('noir');
  const [userLyrics, setUserLyrics] = useState<string>('');
  const [generatedStanzas, setGeneratedStanzas] = useState<string[]>(THEME_VERSE_TEMPLATES.noir);
  const [isTypingEffect, setIsTypingEffect] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = (themeKey: string) => {
    setSelectedTheme(themeKey);
    setIsTypingEffect(true);
    setGeneratedStanzas([]);
    
    // Simulate typewrite stream
    setTimeout(() => {
      setGeneratedStanzas(THEME_VERSE_TEMPLATES[themeKey] || []);
      setIsTypingEffect(false);
    }, 600);
  };

  const handleAddVerseToEditor = () => {
    const verseText = generatedStanzas.join('\n');
    setUserLyrics(prev => prev ? `${prev}\n\n${verseText}` : verseText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-3xl animate-fade-in">
      <div className="relative w-full max-w-4xl bg-surface-container border border-primary/20 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[85vh]">
        
        {/* Header bar */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-white/5 bg-background-dark/50">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-primary block mb-1">LYRICAL CRAFT DESK</span>
            <h3 className="font-serif text-2xl text-white font-medium">Bespoke Lyric Generation & Publishing</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 hover:border-primary/80 hover:text-primary transition-all text-on-surface-variant"
            aria-label="Close Lyric Desk"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Content of the vintage writing desk */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 overflow-hidden">
          
          {/* Left panel: generators and selector */}
          <div className="border-r border-white/5 p-8 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-xs text-primary uppercase tracking-[0.2em] mb-4">1. Select Song Vibe</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'noir', label: 'Cinematic Noir', icon: 'blur_on', desc: 'Moody brass & shadows' },
                    { id: 'velvet', label: 'Melodic Velvet', icon: 'favorite', desc: 'Rich cello & loss' },
                    { id: 'horizon', label: 'Golden Horizon', icon: 'wb_sunny', desc: 'Epic sunrise swells' },
                    { id: 'mystic', label: 'Lyrical Mystic', icon: 'dark_mode', desc: 'Surreal, timeless' }
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => handleGenerate(theme.id)}
                      className={`p-4 border text-left transition-all rounded ${selectedTheme === theme.id ? 'bg-primary/10 border-primary text-white' : 'bg-surface-container-low border-white/5 text-on-surface-variant/80 hover:border-white/10'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-primary text-base">{theme.icon}</span>
                        <span className="font-sans font-semibold text-xs tracking-wide">{theme.label}</span>
                      </div>
                      <p className="text-[10px] text-on-surface-variant/50 uppercase tracking-widest leading-none">{theme.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <h4 className="font-medium text-xs text-primary uppercase tracking-[0.2em] mb-4">2. Interactive Generative Output</h4>
                <div className="bg-background-dark border border-white/5 p-6 rounded min-h-[160px] flex items-center justify-center relative">
                  {isTypingEffect ? (
                    <div className="flex items-center gap-3 font-mono text-xs text-primary/60">
                      <span className="animate-spin material-symbols-outlined text-sm">settings</span>
                      Ink bleeding on paper...
                    </div>
                  ) : generatedStanzas.length > 0 ? (
                    <div className="w-full text-center space-y-2 py-2">
                      {generatedStanzas.map((line, idx) => (
                        <p key={idx} className="font-serif italic text-white text-base leading-relaxed">
                          "{line}"
                        </p>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-on-surface-variant/40 font-mono">Select a theme above to draft.</span>
                  )}
                </div>
              </div>
            </div>

            <button 
              onClick={handleAddVerseToEditor}
              disabled={generatedStanzas.length === 0}
              className={`w-full py-4 bg-primary text-on-primary font-mono text-xs uppercase tracking-widest hover:bg-white transition-all duration-300 mt-6 ${generatedStanzas.length === 0 ? 'opacity-20 cursor-not-allowed' : ''}`}
            >
              ✍ Import into Lyric Pad
            </button>
          </div>

          {/* Right panel: Typewriter Canvas */}
          <div className="bg-surface-container-low p-8 flex flex-col justify-between overflow-hidden">
            <div className="flex-grow flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-[10px] tracking-widest text-[#99907c]">STUDIO PAD V2</span>
                <button 
                  onClick={() => setUserLyrics('')}
                  className="font-mono text-[9px] uppercase tracking-wider text-error/60 hover:text-error"
                >
                  Clear Sheet
                </button>
              </div>

              <div className="flex-grow relative border border-white/5 rounded overflow-hidden">
                <textarea
                  value={userLyrics}
                  onChange={(e) => setUserLyrics(e.target.value)}
                  className="w-full h-full bg-background-dark/30 focus:bg-background-dark/50 text-white font-mono text-sm p-6 focus:ring-0 focus:outline-none border-0 leading-relaxed resize-none placeholder:text-white/10"
                  placeholder="Type your own lyrics here, or click 'Import into Lyric Pad' on the left to stitch together elegant generative verses under the curation of Amy Matthew."
                />
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 mt-6 flex justify-between items-center">
              <span className="font-mono text-[9px] text-on-surface-variant/40 uppercase">characters: {userLyrics.length}</span>
              <button 
                onClick={() => {
                  alert("Lyrics successfully compiled! Our legal and licensing team has saved this stanza template in development.");
                }}
                className="px-6 py-3 border border-primary/20 text-primary font-mono text-xs uppercase tracking-wider hover:border-primary hover:text-white transition-all duration-300"
              >
                💾 Lock Lyrical Draft
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
