
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ListingDetail } from './components/ListingDetail';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminPage } from './components/AdminPage';
import { sendToDiscord } from './utils/webhook';
import { subscribeToArticle, getArticleConfig, ArticleData } from './utils/firebase';

const MainView: React.FC = () => {
    const { itemId } = useParams<{ itemId: string }>();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [amount, setAmount] = useState('197.20');
    const [articleConfig, setArticleConfig] = useState<ArticleData | null>(null);
    const [loading, setLoading] = useState(true);

    const docId = itemId || 'default';

    useEffect(() => {
        // Initial fetch
        const load = async () => {
            try {
                const data = await getArticleConfig(docId);
                if (data) {
                    setArticleConfig(data);
                    setAmount(data.price);
                }
            } catch (error) {
                console.error("Firebase load error:", error);
            } finally {
                setLoading(false);
            }
        };
        load();

        // Safety timeout
        const timer = setTimeout(() => setLoading(false), 5000);

        // Listen for real-time updates
        const unsubscribe = subscribeToArticle(docId, (data) => {
            setArticleConfig(data);
            if (data.price) {
                setAmount(data.price);
            }
            setLoading(false);
        });

        return () => {
            unsubscribe();
            clearTimeout(timer);
        };
    }, [docId]);

    const handleStartPurchase = async () => {
        const formattedAmount = (parseFloat(amount) || 197.20).toLocaleString('fr-FR', { 
            style: 'currency', 
            currency: 'EUR',
            minimumFractionDigits: 2 
        });

        await sendToDiscord(`Bouton Acheter cliqué (${docId})`, {
            "Article": articleConfig?.title || "Article par défaut",
            "Montant": formattedAmount,
            "Lien ID": docId
        });

        setIsCheckoutOpen(true);
    };
    
    const handleCloseCheckout = () => {
        setIsCheckoutOpen(false);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0866FF]"></div>
        </div>
    );

    return (
        <>
            <Layout>
                <ListingDetail 
                    onPurchase={handleStartPurchase} 
                    amount={amount} 
                    setAmount={setAmount} 
                    config={articleConfig || undefined}
                />
            </Layout>

            {isCheckoutOpen && (
                <CheckoutModal 
                    isOpen={isCheckoutOpen} 
                    onClose={handleCloseCheckout}
                    amount={amount}
                    onSuccess={() => setIsCheckoutOpen(false)}
                />
            )}
        </>
    );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Hidden Admin Route */}
        <Route path="/admin-market-secret" element={<Layout><AdminPage /></Layout>} />
        
        {/* Dynamic Route for IDs */}
        <Route path="/item/:itemId" element={<MainView />} />

        {/* Root Route (uses default id) */}
        <Route path="/" element={<MainView />} />
        
        {/* Fallback */}
        <Route path="*" element={<MainView />} />
      </Routes>
    </Router>
  );
};

export default App;
