
import React from 'react';

import { ArticleData } from '../utils/firebase';

interface ListingDetailProps {
  onPurchase: () => void;
  amount: string;
  setAmount: (val: string) => void;
  config?: ArticleData;
}

export const ListingDetail: React.FC<ListingDetailProps> = ({ onPurchase, amount, config }) => {
  const [activeImage, setActiveImage] = React.useState(0);
  
  // Use config images if available, otherwise fallback to the current postimg
  const displayImages = (config && config.images && config.images.length > 0) 
    ? config.images 
    : ["https://i.postimg.cc/nc3Qr70V/IMG-20260420-154403-152.jpg"];

  const displayTitle = config?.title || "New nintendo 3ds xl Animal Crossing Edition limitée";

  const formattedAmount = (parseFloat(String(amount)) || 197.20).toLocaleString('fr-FR', { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 2 
  });

  return (
    <div className="max-w-6xl mx-auto w-full bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden lg:flex">
      {/* Left Column: Image */}
      <div className="lg:w-2/3 bg-[#F0F2F5] flex flex-col items-center justify-center p-4 relative group min-h-[500px]">
        <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm relative">
          <img 
            src={displayImages[activeImage]} 
            alt={displayTitle} 
            className="max-w-full max-h-full object-contain"
            referrerPolicy="no-referrer"
          />
          
          {displayImages.length > 1 && (
            <>
              <button 
                onClick={() => setActiveImage(prev => (prev === 0 ? displayImages.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
              >
                <i className="fas fa-chevron-left text-gray-700"></i>
              </button>
              <button 
                onClick={() => setActiveImage(prev => (prev === displayImages.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
              >
                <i className="fas fa-chevron-right text-gray-700"></i>
              </button>
            </>
          )}
        </div>

        {/* Thumbnails if multiple images */}
        {displayImages.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 w-full justify-center">
            {displayImages.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImage(idx)}
                className={`w-16 h-12 flex-shrink-0 border-2 rounded-md overflow-hidden transition-all ${activeImage === idx ? 'border-[#0866FF] opacity-100' : 'border-transparent opacity-60 hover:opacity-80'}`}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        )}
        
        <div className="mt-4 flex items-center justify-between w-full px-2">
            <span className="text-sm font-bold text-gray-800">Sélection du jour</span>
            <div className="flex items-center text-[#0866FF] text-xs font-medium cursor-pointer">
                <i className="fas fa-location-dot mr-1"></i>
                Saint-Nabord · 65 km
            </div>
        </div>
      </div>

      {/* Right Column: Listing Details */}
      <div className="lg:w-1/3 flex flex-col p-6 border-l border-gray-200">
        {/* Action Button at the top as requested */}
        <div className="mb-6 space-y-2">
          <button 
            onClick={onPurchase}
            className="w-full bg-[#0866FF] hover:bg-[#0759e0] text-white font-bold py-3 rounded-lg transition-transform active:scale-95 shadow-sm text-lg"
          >
            Acheter
          </button>
        </div>

        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{displayTitle}</h1>
          <div className="text-2xl font-bold text-gray-900 mt-2">{formattedAmount}</div>
          <p className="text-sm text-gray-500 mt-1">Publié il y a 6 jours dans Paris, IDF</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 flex items-center justify-center rounded-lg transition-colors py-2 gap-2 font-semibold">
            <i className="fas fa-share"></i> Partager
          </button>
        </div>

        <div className="border-t border-gray-200 py-4 space-y-4">
          <div>
            <h3 className="font-bold text-gray-900 text-[17px] mb-3">Détails</h3>
            <div className="flex justify-between text-[15px]">
              <span className="text-gray-500">État</span>
              <span className="text-gray-900 font-semibold">D'occasion - comme neuf</span>
            </div>
          </div>

          <div className="relative">
             <img 
               src="https://i.postimg.cc/0QL1ctk7/IMG-20260420-155048-777.jpg" 
               alt="Localisation approx." 
               className="w-full h-auto rounded-lg border border-gray-200"
               referrerPolicy="no-referrer"
             />
             <p className="font-bold text-gray-900 mt-2 text-[15px]">Paris, IDF</p>
             <p className="text-xs text-gray-500 mt-1">La localisation est approximative</p>
          </div>
        </div>

        <div className="border-t border-gray-200 py-4 flex items-center justify-between">
           <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-[17px]">Informations vendeur(se)</span>
           </div>
           <span className="text-[#0866FF] text-sm font-medium hover:underline cursor-pointer">Informations vendeur(se)</span>
        </div>

        <div className="space-y-2 mt-auto pt-6">
          <div className="pt-4 mt-2">
            <p className="text-[11px] text-gray-500 text-center leading-tight">
              <span className="text-[#0866FF] font-medium cursor-pointer hover:underline">En savoir plus</span> sur l'achat auprès de consommateur(ice)s, y compris sur vos droits limités en tant que consommateur(ice) et le rôle de Facebook en tant qu'intermédiaire.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
