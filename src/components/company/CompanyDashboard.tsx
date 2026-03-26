import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { doc, onSnapshot, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { CompanyProfile, FinancialData, StrategyWarranty, ConfidenceRating } from '../../types';
import { calculateConfidenceScore } from '../../lib/scoring';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  LogOut,
  ChevronRight,
  Plus,
  AlertCircle,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { RegistrationForm } from './RegistrationForm';
import { FinancialForm } from './FinancialForm';
import { StrategyForm } from './StrategyForm';

export const CompanyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'legal' | 'financial' | 'strategy'>('overview');
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [financials, setFinancials] = useState<FinancialData | null>(null);
  const [strategy, setStrategy] = useState<StrategyWarranty | null>(null);
  const [rating, setRating] = useState<ConfidenceRating | null>(null);
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const unsubProfile = onSnapshot(doc(db, 'companies', user.uid), (doc) => {
      if (doc.exists()) setProfile(doc.data() as CompanyProfile);
      setLoading(false);
    });

    const unsubFinancials = onSnapshot(doc(db, 'financials', user.uid), (doc) => {
      if (doc.exists()) setFinancials(doc.data() as FinancialData);
    });

    const unsubStrategy = onSnapshot(doc(db, 'strategies', user.uid), (doc) => {
      if (doc.exists()) setStrategy(doc.data() as StrategyWarranty);
    });

    return () => {
      unsubProfile();
      unsubFinancials();
      unsubStrategy();
    };
  }, [user]);

  // Recalculate rating whenever data changes
  useEffect(() => {
    if (!user) return;
    const newRating = calculateConfidenceScore(financials, profile, strategy);
    setRating(newRating);
    
    // Save rating to Firestore (simulated server-side logic)
    setDoc(doc(db, 'ratings', user.uid), newRating);
  }, [profile, financials, strategy, user]);

  const handleLogout = () => auth.signOut();

  const renderContent = () => {
    switch (activeTab) {
      case 'legal':
        return <RegistrationForm initialData={profile} onComplete={() => setActiveTab('overview')} />;
      case 'financial':
        return <FinancialForm initialData={financials} onComplete={() => setActiveTab('overview')} />;
      case 'strategy':
        return <StrategyForm initialData={strategy} onComplete={() => setActiveTab('overview')} />;
      default:
        return (
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">Tableau de Bord</h2>
                <p className="text-neutral-500">{profile?.companyName || "Entreprise non configurée"}</p>
              </div>
              <button onClick={handleLogout} className="p-2 text-neutral-400 hover:text-red-500 transition-colors">
                <LogOut className="w-6 h-6" />
              </button>
            </div>

            {/* Confidence Score Card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-onyx-blue rounded-3xl p-6 text-white shadow-xl shadow-onyx-blue/20"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-blue-100 font-medium">Indice de Confiance</span>
                <ShieldCheck className="w-6 h-6 text-onyx-yellow" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">{rating?.score || 0}</span>
                <span className="text-blue-200">/ 100</span>
              </div>
              <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${rating?.score || 0}%` }}
                  className="h-full bg-onyx-yellow"
                />
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-blue-100">Éligibilité: {rating?.readiness === 'High' ? 'Élevée' : rating?.readiness === 'Medium' ? 'Moyenne' : 'Faible'}</span>
                {rating?.isPromoted && (
                  <span className="bg-onyx-yellow text-onyx-blue px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Promu</span>
                )}
              </div>
            </motion.div>

            {/* Steps Section */}
            <div className="space-y-4">
              <h3 className="font-bold text-neutral-800 px-1">Complétez votre profil</h3>
              
              <StepItem 
                icon={<Building2 className="w-5 h-5" />}
                title="Profil Légal"
                subtitle="NIF, Adresse, Pièce d'identité"
                completed={!!profile}
                onClick={() => setActiveTab('legal')}
              />
              
              <StepItem 
                icon={<TrendingUp className="w-5 h-5" />}
                title="Dossier Financier"
                subtitle="Fondamentaux & États"
                completed={!!financials}
                onClick={() => setActiveTab('financial')}
              />
              
              <StepItem 
                icon={<ShieldCheck className="w-5 h-5" />}
                title="Garanties"
                subtitle="Titre foncier, Bail"
                completed={!!strategy?.isWarrantyCertified}
                onClick={() => setActiveTab('strategy')}
              />
            </div>

            {/* Financial Summary */}
            {financials && (
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
                <h4 className="text-sm font-bold text-neutral-400 uppercase mb-3 px-1">Résumé Financier</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    <p className="text-xs text-neutral-500">Chiffre d'affaires</p>
                    <p className="text-lg font-bold text-onyx-blue">{financials.revenue.toLocaleString()} €</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    <p className="text-xs text-neutral-500">Bénéfice Net</p>
                    <p className="text-lg font-bold text-green-600">{financials.profit.toLocaleString()} €</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        {renderContent()}
      </div>
      
      {/* Bottom Navigation */}
      <div className="h-20 bg-white border-t border-neutral-100 flex items-center justify-around px-6 shrink-0">
        <NavButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard />} label="Accueil" />
        <NavButton active={activeTab === 'legal'} onClick={() => setActiveTab('legal')} icon={<Building2 />} label="Légal" />
        <NavButton active={activeTab === 'financial'} onClick={() => setActiveTab('financial')} icon={<TrendingUp />} label="Finance" />
        <NavButton active={activeTab === 'strategy'} onClick={() => setActiveTab('strategy')} icon={<ShieldCheck />} label="Garantie" />
      </div>
    </div>
  );
};

const StepItem = ({ icon, title, subtitle, completed, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-4 p-4 bg-white border border-neutral-100 rounded-2xl hover:bg-neutral-50 transition-colors text-left"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${completed ? 'bg-green-100 text-green-600' : 'bg-onyx-blue/10 text-onyx-blue'}`}>
      {completed ? <CheckCircle2 className="w-6 h-6" /> : icon}
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-neutral-900">{title}</h4>
      <p className="text-sm text-neutral-500">{subtitle}</p>
    </div>
    <ChevronRight className="w-5 h-5 text-neutral-300" />
  </button>
);

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-onyx-blue' : 'text-neutral-400'}`}
  >
    {React.cloneElement(icon, { className: 'w-6 h-6' })}
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);
