
import React, { useState, useEffect } from 'react';
import { 
  saveArticleConfig, 
  getAllArticles, 
  deleteArticleConfig, 
  subscribeToAllArticles, 
  ArticleData 
} from '../utils/firebase';

export const AdminPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [editingArticle, setEditingArticle] = useState<ArticleData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form States
  const [formTitle, setFormTitle] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formImages, setFormImages] = useState<string[]>(['', '', '']);
  const [customId, setCustomId] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToAllArticles((data) => {
      setArticles(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const openNew = () => {
    setEditingArticle(null);
    setFormTitle('New nintendo 3ds xl Animal Crossing Edition limitée');
    setFormPrice('197.20');
    setFormImages(['https://i.postimg.cc/nc3Qr70V/IMG-20260420-154403-152.jpg', '', '']);
    setCustomId('');
    setIsEditing(true);
    setMessage('');
  };

  const openEdit = (article: ArticleData) => {
    setEditingArticle(article);
    setFormTitle(article.title);
    setFormPrice(article.price);
    setFormImages([...(article.images || []), '', '', ''].slice(0, 3));
    setCustomId(article.id || '');
    setIsEditing(true);
    setMessage('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    // Generate ID if not provided and not editing
    const idToUse = (customId || editingArticle?.id || `site-${Math.random().toString(36).substr(2, 5)}`).trim().toLowerCase().replace(/\s+/g, '-');

    try {
      const filteredImages = formImages.filter(img => img.trim() !== '');
      await saveArticleConfig(idToUse, {
        title: formTitle,
        price: formPrice,
        images: filteredImages,
        createdAt: editingArticle?.createdAt || Date.now()
      });
      setMessage('Lien enregistré avec succès !');
      setTimeout(() => setIsEditing(false), 1500);
    } catch (error: any) {
      console.error(error);
      setMessage(`Erreur: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Supprimer définitivement ce lien ?')) return;
    
    try {
      await deleteArticleConfig(id);
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la suppression');
    }
  };

  const copyLink = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/item/${id}`;
    navigator.clipboard.writeText(url);
    alert('Lien copié dans le presse-papier !');
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formImages];
    newImages[index] = value;
    setFormImages(newImages);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0866FF]"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 my-6 min-h-[80vh]">
      {!isEditing ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 leading-none">Mes Liens Dupliqués</h2>
              <p className="text-sm text-gray-500 mt-2">Gérez et créez vos différentes versions du site.</p>
            </div>
            <button 
              onClick={openNew}
              className="bg-[#0866FF] hover:bg-[#0759e0] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <i className="fas fa-plus"></i> Créer Nouveau Lien
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map(art => (
              <div 
                key={art.id} 
                onClick={() => openEdit(art)}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-[#0866FF] transition-all cursor-pointer group relative"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                    <img src={art.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{art.title}</h3>
                    <p className="text-[#0866FF] font-bold mt-1">{art.price} €</p>
                    <p className="text-[11px] text-gray-400 mt-2 truncate">ID: {art.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                   <button 
                    onClick={(e) => copyLink(art.id!, e)}
                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2"
                   >
                     <i className="fas fa-copy"></i> Copier Lien
                   </button>
                   <button 
                    onClick={(e) => handleDelete(art.id!, e)}
                    className="w-10 h-8 flex items-center justify-center text-red-100 bg-red-50 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                   >
                     <i className="fas fa-trash-alt"></i>
                   </button>
                </div>
              </div>
            ))}

            {articles.length === 0 && (
              <div className="col-span-full py-12 text-center bg-white rounded-2xl border-2 border-dashed border-gray-100">
                <i className="fas fa-link text-3xl text-gray-200 mb-3 block"></i>
                <p className="text-gray-400 font-medium">Aucun lien créé pour le moment.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#0866FF] p-6 text-white flex items-center justify-between">
            <h2 className="text-xl font-bold">{editingArticle ? 'Modifier le lien' : 'Créer un nouveau lien'}</h2>
            <button onClick={() => setIsEditing(false)} className="text-white/80 hover:text-white">
               <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <form onSubmit={handleSave} className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">ID Unique (suffixe URL)</label>
                    <input 
                      type="text" 
                      value={customId} 
                      onChange={(e) => setCustomId(e.target.value)}
                      disabled={!!editingArticle}
                      className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#0866FF] focus:ring-4 focus:ring-blue-50 outline-none transition-all font-mono text-sm disabled:bg-gray-50 disabled:text-gray-400"
                      placeholder="la-nintendo-de-pierre"
                      required
                    />
                    {!editingArticle && <p className="text-[10px] text-gray-400 mt-1 italic">Sera utilisé dans l'URL: /item/{customId || 'id-ici'}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Titre de l'objet</label>
                    <input 
                      type="text" 
                      value={formTitle} 
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#0866FF] focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                      placeholder="Ex: Console de jeu..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Prix (€)</label>
                    <input 
                      type="text" 
                      value={formPrice} 
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#0866FF] focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold"
                      placeholder="197.20"
                      required
                    />
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Images (Jusqu'à 3 URLs)</label>
                  <div className="space-y-3">
                    {formImages.map((img, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <div className="flex-1">
                           <input 
                            type="text" 
                            value={img} 
                            onChange={(e) => handleImageChange(idx, e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#0866FF] outline-none text-xs"
                            placeholder={`URL Image ${idx + 1}`}
                          />
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                          {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-200"><i className="fas fa-image"></i></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <p className="text-[10px] text-blue-600 leading-relaxed">
                        <i className="fas fa-info-circle mr-1"></i>
                        Collez les liens d'images directs (hébergés sur imgur, postimg, etc.) pour qu'elles s'affichent instantanément.
                      </p>
                  </div>
               </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button 
                type="submit" 
                disabled={saving}
                className="flex-1 bg-[#0866FF] hover:bg-[#0759e0] text-white font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center disabled:bg-gray-300"
              >
                {saving ? 'Enregistrement...' : 'Valider et Sauvegarder'}
              </button>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="px-8 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition-all"
              >
                Annuler
              </button>
            </div>

            {message && (
              <div className={`p-4 rounded-xl text-center font-bold text-sm ${message.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
