
import React, { useState, useRef } from 'react';
import { Language, translations } from './types';
import { transformToPlush } from './geminiService';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('EN');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleTransform = async () => {
    if (!uploadedImage) {
      setError(t.errorUpload);
      return;
    }

    setIsTransforming(true);
    setError(null);
    setResultImage(null);

    try {
      const base64Data = uploadedImage.split(',')[1];
      const mimeType = uploadedImage.split(',')[0].split(':')[1].split(';')[0];
      
      const plushResult = await transformToPlush(base64Data, mimeType);
      if (plushResult) {
        setResultImage(plushResult);
      } else {
        setError(t.errorTransform);
      }
    } catch (err: any) {
      setError(err.message || t.errorTransform);
    } finally {
      setIsTransforming(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pb-20 px-4 md:px-8 bg-[#0f1115] text-white">
      {/* Header */}
      <header className="w-full max-w-7xl flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-black text-xs font-black">🧸</span>
          </div>
          <span className="text-xl font-black tracking-tighter">PLUSHIFY</span>
        </div>
        
        <div className="flex items-center gap-4">
          <a 
            href="https://x.com/i/communities/2013607195569492303" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#1d2128] hover:bg-[#2d323b] transition-colors border border-gray-800 px-4 py-1.5 rounded-md text-sm font-semibold"
          >
            {t.community}
          </a>
          
          <div className="flex items-center bg-[#1d2128] rounded-md overflow-hidden border border-gray-800">
            <button 
              onClick={() => setLang('EN')}
              className={`px-3 py-1.5 text-xs font-bold transition-colors ${lang === 'EN' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLang('ZH')}
              className={`px-3 py-1.5 text-xs font-bold transition-colors ${lang === 'ZH' ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white'}`}
            >
              ZH
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="w-full max-w-5xl flex flex-col items-center mt-12 md:mt-24">
        <h1 className="text-6xl md:text-8xl font-black text-yellow-400 mb-4 tracking-tighter text-center">
          {t.title}
        </h1>
        <p className="text-gray-400 text-lg md:text-xl font-medium mb-12 text-center">
          {t.subtitle}
        </p>

        {/* Workspace Card */}
        <div className="w-full bg-[#161a20] border border-gray-800 rounded-[32px] p-6 md:p-10 flex flex-col md:flex-row gap-8 shadow-2xl">
          
          {/* Step 1: Upload */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <span className="bg-[#242930] text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded-sm mt-1">01</span>
              <div>
                <h3 className="font-bold text-lg leading-tight">{t.uploadTitle}</h3>
                <p className="text-gray-500 text-sm">{t.uploadDesc}</p>
              </div>
            </div>

            <div 
              onClick={triggerFileUpload}
              className="relative aspect-square w-full bg-[#0f1115] rounded-3xl border-2 border-dashed border-gray-800 flex flex-col items-center justify-center cursor-pointer hover:border-gray-600 transition-colors group overflow-hidden"
            >
              {uploadedImage ? (
                <img src={uploadedImage} alt="Preview" className="w-full h-full object-cover rounded-3xl" />
              ) : (
                <>
                  <div className="bg-[#1d2128] p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-black text-gray-500 tracking-widest">{t.clickToSelect}</span>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept="image/*"
              />
            </div>

            <button 
              onClick={handleTransform}
              disabled={isTransforming}
              className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
                isTransforming 
                  ? 'bg-yellow-400/20 text-yellow-400/40 cursor-not-allowed' 
                  : 'bg-[#7d6b35] hover:bg-[#8e7b3f] text-black shadow-[0_0_20px_rgba(250,204,21,0.2)]'
              }`}
            >
              {isTransforming ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t.transforming}
                </>
              ) : (
                <>
                  {t.transformButton} 🪄
                </>
              )}
            </button>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mt-2">
                <p className="text-red-500 text-[11px] text-center font-bold uppercase tracking-wider leading-relaxed">
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* Step 2: Result */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <span className="bg-[#242930] text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded-sm mt-1">02</span>
              <div>
                <h3 className="font-bold text-lg leading-tight">{t.resultTitle}</h3>
                <p className="text-gray-500 text-sm">{t.resultDesc}</p>
              </div>
            </div>

            <div className="relative aspect-square w-full bg-[#0f1115] rounded-3xl border border-gray-800 flex flex-col items-center justify-center overflow-hidden">
              {resultImage ? (
                <>
                  <img src={resultImage} alt="Result" className="w-full h-full object-cover rounded-3xl" />
                  <a 
                    href={resultImage} 
                    download="plushy.png"
                    className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md p-3 rounded-full hover:bg-black/80 transition-colors"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                </>
              ) : (
                <div className="flex flex-col items-center opacity-20">
                  <div className="relative mb-6">
                    <svg className="w-24 h-24 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12c0 2.82 1.2 5.39 3.12 7.19.14.13.34.19.54.19.26 0 .5-.11.66-.31.31-.38.25-.94-.13-1.25C4.7 16.48 4 14.33 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 2.33-.7 4.48-2.19 5.82-.38.31-.44.87-.13 1.25.16.2.4.31.66.31.2 0 .4-.06.54-.19C20.8 17.39 22 14.82 22 12c0-5.52-4.48-10-10-10zm-3 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM12 18c2.67 0 5-1.33 6.16-3.33-.31-.44-.87-.54-1.31-.23-.44.31-.54.87-.23 1.31.81 1.41 2.37 2.25 4.38 2.25s3.57-.84 4.38-2.25c.31-.44.21-1-.23-1.31-.44-.31-1-.21-1.31.23C17 16.67 14.67 18 12 18s-5-1.33-6.16-3.33c-.31-.44-.87-.54-1.31-.23-.44.31-.54.87-.23 1.31C5.33 16.67 7.67 18 12 18z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-black tracking-widest text-center">{t.resultPlaceholder}</span>
                </div>
              )}
              {isTransforming && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-10">
                   <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="absolute inset-0 flex items-center justify-center text-xl">🧵</span>
                      </div>
                      <p className="text-yellow-400 text-xs font-black animate-pulse uppercase tracking-widest">{t.transforming}</p>
                   </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      <footer className="mt-auto pt-10 text-gray-600 text-[10px] font-bold tracking-widest uppercase text-center">
        © 2024 Plushify • Powered by Gemini Flash
      </footer>
    </div>
  );
};

export default App;
