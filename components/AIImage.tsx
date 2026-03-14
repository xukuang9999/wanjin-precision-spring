import React, { useState } from 'react';
import { generateIndustrialImage } from '../services/geminiService';
import { Loader2, RefreshCw } from 'lucide-react';

interface AIImageProps {
  prompt: string;
  alt: string;
  className?: string;
  fallbackSrc: string;
}

export const AIImage: React.FC<AIImageProps> = ({ prompt, alt, className, fallbackSrc }) => {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateIndustrialImage(prompt);
    if (result) {
      setSrc(result);
      setGenerated(true);
    }
    setLoading(false);
  };

  // Initial load logic - to save tokens/quota, we might not auto-generate everything. 
  // Let's auto-generate ONLY if it's a specific key feature, otherwise wait for user interaction?
  // For this demo, let's use a "Click to visualize with AI" overlay to be safe with quota 
  // and give the "Interactive" feel requested.
  
  return (
    <div className={`relative overflow-hidden bg-slate-200 group ${className}`}>
      <img 
        src={src || fallbackSrc} 
        alt={alt} 
        className={`w-full h-full object-cover transition-transform duration-700 ${loading ? 'opacity-50 scale-100' : 'opacity-100 group-hover:scale-105'}`}
      />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}

      {!loading && !generated && (
        <button 
          onClick={(e) => { e.preventDefault(); handleGenerate(); }}
          className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-slate-800 px-3 py-1.5 rounded-md text-xs font-medium shadow-lg shadow-black/40 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0"
        >
          <RefreshCw className="w-3 h-3" />
          Generate AI View
        </button>
      )}
      
      {generated && (
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded">
          AI Generated
        </div>
      )}
    </div>
  );
};
