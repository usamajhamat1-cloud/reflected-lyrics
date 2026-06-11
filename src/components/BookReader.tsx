import React, { useState } from 'react';
import { BOOK_CHAPTERS } from '../data/catalog';

interface BookReaderProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookReader({ isOpen, onClose }: BookReaderProps) {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  if (!isOpen) return null;

  const currentChapter = BOOK_CHAPTERS[currentChapterIndex];
  const totalChapters = BOOK_CHAPTERS.length;

  const handleNextChapter = () => {
    if (currentChapterIndex < totalChapters - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      setCurrentPage(0);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      setCurrentPage(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-3xl animate-fade-in">
      <div className="relative w-full max-w-3xl bg-surface-container border border-primary/20 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[85vh] md:h-[75vh]">
        
        {/* Header decoration */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-white/5 bg-background-dark/50">
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-primary">LITERARY DEPT / VOL I</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
            <span className="text-xs font-serif text-on-surface-variant italic">The Midnight Library of Wonders</span>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 hover:border-primary/80 hover:text-primary transition-all text-on-surface-variant"
            aria-label="Close Reader"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Content body with old-world styling */}
        <div className="flex-grow overflow-y-auto px-8 md:px-16 py-12 flex flex-col justify-between">
          <div className="max-w-xl mx-auto space-y-8">
            <div className="text-center">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary mb-3 block">
                Chapter {currentChapterIndex + 1} of {totalChapters}
              </span>
              <h3 className="font-serif text-3xl md:text-4xl text-white tracking-wide mb-8 font-medium">
                {currentChapter.title}
              </h3>
              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent mx-auto"></div>
            </div>

            <div className="space-y-6 pt-4 text-on-surface-variant font-serif text-base md:text-lg leading-relaxed text-justify">
              {currentChapter.content.map((paragraph, index) => (
                <p 
                  key={index} 
                  className={`first-letter:text-4xl first-letter:font-serif first-letter:text-primary first-letter:mr-2 first-letter:float-left first-letter:leading-none ${index === 0 ? '' : 'first-letter:hidden'}`}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="text-center pt-8 border-t border-white/5 mt-8">
            <p className="font-mono text-[9px] uppercase tracking-widest text-on-surface-variant/40">
              © Amy Matthew • Private Reading Copy • Reflected Lyrical LLC
            </p>
          </div>
        </div>

        {/* Navigation bottom control bar */}
        <div className="px-8 py-6 border-t border-white/5 bg-background-dark/50 flex justify-between items-center">
          <button 
            onClick={handlePrevChapter}
            disabled={currentChapterIndex === 0}
            className={`flex items-center gap-3 font-mono text-xs uppercase tracking-widest transition-all ${currentChapterIndex === 0 ? 'opacity-20 cursor-not-allowed text-on-surface-variant' : 'text-primary hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Prev Chapter
          </button>

          <span className="font-serif italic text-xs text-primary/40">
            Page {currentChapterIndex + 1} / {totalChapters}
          </span>

          <button 
            onClick={handleNextChapter}
            disabled={currentChapterIndex === totalChapters - 1}
            className={`flex items-center gap-3 font-mono text-xs uppercase tracking-widest transition-all ${currentChapterIndex === totalChapters - 1 ? 'opacity-20 cursor-not-allowed text-on-surface-variant' : 'text-primary hover:text-white'}`}
          >
            Next Chapter
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

      </div>
    </div>
  );
}
