import React, { useState } from 'react';

interface CinemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SCREENPLAY_SCENES = [
  {
    heading: 'SCENE 1: OVERTURE ON REFLECTED WATER',
    slugline: 'EXT. AMBER RIVER - NIGHT',
    description: 'A black surface of sluggish water. Moonlight cuts through the tree canopy, casting gold-hued reflections. We hear the slow, rhythmic sweep of wooden oars.',
    elements: [
      { character: 'LINN (O.S.)', parenthetical: '(whispering)', text: 'They say water remembers the songs we never sang. That it hoards the chords we abandoned intermediate.' },
      { character: 'OLD MARINER', parenthetical: '(grunts)', text: 'Forget stories, girl. Water doesn’t write books. It only drowns ’em.' }
    ]
  },
  {
    heading: 'SCENE 2: THE MIDNIGHT LIBRARY',
    slugline: 'INT. THE DUST GALLERY - CONTINUOUS',
    description: 'LINN enters the heavy cedar room. Thousand-foot-tall wooden ladders disappear into the absolute dark of the high ceiling. She slides her hand over the calfskin bindings.',
    elements: [
      { character: 'LINN', parenthetical: '(stops, feeling a vibration)', text: 'There is a rhythm beneath the wood. It sounds like a heart... but slower. Much slower.' }
    ]
  }
];

export default function CinemaModal({ isOpen, onClose }: CinemaModalProps) {
  const [activeTab, setActiveTab] = useState<'script' | 'treatment' | 'cast'>('script');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-3xl animate-fade-in">
      <div className="relative w-full max-w-4xl bg-surface-container border border-primary/20 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-white/5 bg-background-dark/50">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-primary block mb-1">STORYBOARD & DEVELOPMENT DECK</span>
            <h3 className="font-serif text-2xl text-white font-medium">The First Verse — Film Screenplay</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 hover:border-primary/80 hover:text-primary transition-all text-on-surface-variant"
            aria-label="Close Cinema Deck"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-8 bg-surface-container-low border-b border-white/5 flex gap-8">
          {(['script', 'treatment', 'cast'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 font-mono text-xs uppercase tracking-widest relative transition-all ${activeTab === tab ? 'text-primary font-semibold' : 'text-on-surface-variant/60 hover:text-white'}`}
            >
              {tab === 'script' && '📄 Pilot Screenplay'}
              {tab === 'treatment' && '🎬 Production Bible'}
              {tab === 'cast' && '🎭 Casting Prototypes'}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"></div>
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        <div className="flex-grow overflow-y-auto p-8 md:p-12 bg-background-dark">
          {activeTab === 'script' && (
            <div className="max-w-2xl mx-auto space-y-10 font-mono text-sm leading-relaxed text-slate-300">
              <div className="text-center text-slate-500 pb-6 border-b border-white/5 uppercase tracking-widest text-[10px]">
                Draft 1.4 • Writer: Amy Matthew &bull; Copyright Reflected Lyrical LLC
              </div>
              
              {SCREENPLAY_SCENES.map((scene, sIdx) => (
                <div key={sIdx} className="space-y-6">
                  <div className="text-primary font-semibold border-l-2 border-primary/40 pl-4 py-1 text-xs">
                    {scene.heading}
                  </div>
                  <div className="font-bold text-white tracking-wide mt-4 uppercase">
                    {scene.slugline}
                  </div>
                  <p className="text-slate-400 italic">
                    {scene.description}
                  </p>
                  
                  <div className="space-y-6 pl-8">
                    {scene.elements.map((elem, eIdx) => (
                      <div key={eIdx} className="text-center max-w-md mx-auto">
                        <div className="font-bold text-white block tracking-wider uppercase mb-1">
                          {elem.character}
                        </div>
                        {elem.parenthetical && (
                          <div className="text-slate-500 italic text-xs mb-1">
                            {elem.parenthetical}
                          </div>
                        )}
                        <p className="text-slate-300 text-justify hyphens-auto">
                          {elem.text}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="h-[1px] bg-white/5 my-8"></div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'treatment' && (
            <div className="max-w-3xl mx-auto space-y-8 font-serif text-base leading-relaxed text-on-surface-variant">
              <div>
                <h4 className="font-sans font-semibold text-xs text-primary uppercase tracking-[0.2em] mb-2">Narrative Core</h4>
                <p>
                  <em>The First Verse</em> is a magical realist feature screenplay detailing the convergence of a sound-designer who loses her hearing and a centuries-old composer who lives within the wooden framework of a historic instrument collection.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="p-6 bg-surface-container border border-white/5 rounded-lg">
                  <h5 className="font-sans font-semibold text-xs text-white uppercase tracking-widest mb-3">Tone & Visual Deck</h5>
                  <p className="text-sm font-sans text-on-surface-variant/80">
                    Moody noir shadows, golden dust motes illuminated by high vertical lights, lens flares reminiscent of classic celluloid film stock.
                  </p>
                </div>
                <div className="p-6 bg-surface-container border border-white/5 rounded-lg">
                  <h5 className="font-sans font-semibold text-xs text-white uppercase tracking-widest mb-3">Acoustic Premise</h5>
                  <p className="text-sm font-sans text-on-surface-variant/80">
                    A soundscape heavy with procedural ambient motifs, real classical recordings, and silence used as a powerful auditory character.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cast' && (
            <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-surface-container border border-white/5 p-6 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-[#b5b2b3] flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-background text-3xl font-light">person</span>
                </div>
                <h4 className="font-serif text-lg text-white mb-1">Linn</h4>
                <p className="font-sans uppercase text-[10px] tracking-widest text-primary mb-3">The Sound Collector</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Quiet, intensely focused, searches for meaning inside frequencies normal people ignore. Experience in piano tuning or synthesis.
                </p>
              </div>

              <div className="bg-surface-container border border-white/5 p-6 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#99907c] to-surface-variant flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-background text-3xl font-light">account_circle</span>
                </div>
                <h4 className="font-serif text-lg text-white mb-1">Gregory</h4>
                <p className="font-sans uppercase text-[10px] tracking-widest text-primary mb-3">The Maker</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  A reclusive instruments curator who possesses letters written by composers in standard ink but formatted in musical staves.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-surface-container border-t border-white/5 flex justify-between items-center font-mono text-[10px] text-on-surface-variant/40">
          <span>PROJECT DIRECT CONTACT: DEVELOPMENT@REFL-LYR.COM</span>
          <span>LA WORKSPACE GROUP</span>
        </div>

      </div>
    </div>
  );
}
