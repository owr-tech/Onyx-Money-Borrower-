import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { CompanyProfile, ConfidenceRating, FinancialData } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  ShieldCheck, 
  LogOut,
  ChevronRight,
  Building2,
  Star,
  ArrowUpRight,
  Info
} from 'lucide-react';

export const InvestorDashboard: React.FC = () => {
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [ratings, setRatings] = useState<Record<string, ConfidenceRating>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'promoted'>('all');
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    const unsubCompanies = onSnapshot(collection(db, 'companies'), (snapshot) => {
      const companyList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CompanyProfile));
      setCompanies(companyList);
      setLoading(false);
    });

    const unsubRatings = onSnapshot(collection(db, 'ratings'), (snapshot) => {
      const ratingMap: Record<string, ConfidenceRating> = {};
      snapshot.docs.forEach(doc => {
        ratingMap[doc.id] = doc.data() as ConfidenceRating;
      });
      setRatings(ratingMap);
    });

    return () => {
      unsubCompanies();
      unsubRatings();
    };
  }, []);

  const handleLogout = () => auth.signOut();

  const filteredCompanies = companies.filter(c => {
    if (filter === 'promoted') return ratings[c.ownerUid]?.isPromoted;
    return true;
  });

  return (
    <div className="h-full flex flex-col bg-neutral-50">
      {/* Header */}
      <div className="p-6 bg-white border-b border-neutral-100 shrink-0">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Onyx borrower</h2>
            <p className="text-neutral-500">Tableau de Bord Investisseur</p>
          </div>
          <button onClick={handleLogout} className="p-2 text-neutral-400 hover:text-red-500 transition-colors">
            <LogOut className="w-6 h-6" />
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Rechercher une entreprise..." 
              className="w-full pl-10 pr-4 py-3 bg-neutral-100 border-none rounded-xl focus:ring-2 focus:ring-onyx-blue outline-none text-sm"
            />
          </div>
          <button 
            onClick={() => setFilter(filter === 'all' ? 'promoted' : 'all')}
            className={`p-3 rounded-xl transition-all ${filter === 'promoted' ? 'bg-onyx-blue text-white shadow-lg shadow-onyx-blue/20' : 'bg-white border border-neutral-200 text-neutral-600'}`}
          >
            <Star className={`w-5 h-5 ${filter === 'promoted' ? 'fill-onyx-yellow text-onyx-yellow' : ''}`} />
          </button>
        </div>
      </div>

      {/* Company List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-neutral-800">
            {filter === 'promoted' ? 'Entreprises Mises en Avant' : 'Toutes les Entreprises'}
          </h3>
          <span className="text-xs font-bold text-neutral-400 uppercase">{filteredCompanies.length} Résultats</span>
        </div>

        {filteredCompanies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
            <Building2 className="w-16 h-16 mb-4" />
            <p>Aucune entreprise trouvée</p>
          </div>
        ) : (
          filteredCompanies.map((company) => (
            <CompanyCard 
              key={company.ownerUid} 
              company={company} 
              rating={ratings[company.ownerUid]} 
              onClick={() => setSelectedCompany(company)}
            />
          ))
        )}
      </div>

      {/* Company Detail Modal (Simulated) */}
      <AnimatePresence>
        {selectedCompany && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 bg-white z-50 flex flex-col"
          >
            <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
              <button onClick={() => setSelectedCompany(null)} className="p-2 bg-neutral-100 rounded-xl">
                <ChevronRight className="w-6 h-6 rotate-180" />
              </button>
              <h3 className="font-bold">Détails de l'Entreprise</h3>
              <div className="w-10" />
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-onyx-blue/10 rounded-3xl mx-auto mb-4 flex items-center justify-center">
                  <Building2 className="w-10 h-10 text-onyx-blue" />
                </div>
                <h2 className="text-2xl font-bold">{selectedCompany.companyName}</h2>
                <p className="text-neutral-500">{selectedCompany.address}</p>
              </div>

              {/* Rating Detail */}
              <div className="bg-onyx-blue rounded-3xl p-6 text-white shadow-xl shadow-onyx-blue/20">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold uppercase tracking-wider text-xs text-blue-200">Indice de Confiance</span>
                  <div className="px-3 py-1 bg-onyx-yellow text-onyx-blue rounded-full text-[10px] font-bold uppercase">
                    {ratings[selectedCompany.ownerUid]?.readiness === 'High' ? 'Éligibilité Élevée' : 'Éligibilité Moyenne'}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-6xl font-bold">{ratings[selectedCompany.ownerUid]?.score || 0}</div>
                  <div className="flex-1 space-y-2">
                    <ScoreBar label="Santé Financière" value={ratings[selectedCompany.ownerUid]?.breakdown.financialHealth || 0} max={50} />
                    <ScoreBar label="Documentation" value={ratings[selectedCompany.ownerUid]?.breakdown.documentation || 0} max={30} />
                    <ScoreBar label="Garantie" value={ratings[selectedCompany.ownerUid]?.breakdown.warranty || 0} max={20} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-neutral-800">Informations Légales</h4>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Propriétaire" value={selectedCompany.ownerName} />
                  <InfoItem label="Numéro NIF" value={selectedCompany.nifNumber} />
                </div>
              </div>

              <button className="w-full bg-onyx-blue text-white py-4 rounded-xl font-bold shadow-lg shadow-onyx-blue/20 flex items-center justify-center gap-2 transition-all active:scale-95">
                Contacter l'Entreprise
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CompanyCard = ({ company, rating, onClick }: any) => (
  <motion.button 
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="w-full bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-4 text-left"
  >
    <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center ${rating?.isPromoted ? 'bg-onyx-blue text-white' : 'bg-neutral-100 text-neutral-400'}`}>
      <span className="text-xl font-bold leading-none">{rating?.score || 0}</span>
      <span className="text-[8px] font-bold uppercase opacity-70">Score</span>
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-bold text-neutral-900 truncate">{company.companyName}</h4>
      <p className="text-xs text-neutral-500 truncate">{company.address}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${rating?.readiness === 'High' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
          {rating?.readiness === 'High' ? 'Élevé' : 'Moyen'}
        </span>
        {rating?.isPromoted && (
          <span className="text-[10px] font-bold text-onyx-blue flex items-center gap-1">
            <Star className="w-3 h-3 fill-onyx-yellow text-onyx-yellow" />
            Premium
          </span>
        )}
      </div>
    </div>
    <ChevronRight className="w-5 h-5 text-neutral-300" />
  </motion.button>
);

const ScoreBar = ({ label, value, max }: any) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] font-bold uppercase text-blue-200">
      <span>{label}</span>
      <span>{value}/{max}</span>
    </div>
    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
      <div className="h-full bg-onyx-yellow" style={{ width: `${(value / max) * 100}%` }} />
    </div>
  </div>
);

const InfoItem = ({ label, value }: any) => (
  <div className="bg-white p-3 rounded-xl border border-neutral-100">
    <p className="text-[10px] font-bold text-neutral-400 uppercase">{label}</p>
    <p className="text-sm font-bold text-neutral-800">{value}</p>
  </div>
);
