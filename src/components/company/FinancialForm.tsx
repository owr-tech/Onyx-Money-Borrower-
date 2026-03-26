import React, { useState } from 'react';
import { db, auth } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { FinancialData } from '../../types';
import { ArrowLeft, Loader2, Save, TrendingUp, Building2, PieChart } from 'lucide-react';

interface FinancialFormProps {
  initialData: FinancialData | null;
  onComplete: () => void;
}

export const FinancialForm: React.FC<FinancialFormProps> = ({ initialData, onComplete }) => {
  // Fundamentals
  const [sector, setSector] = useState('');
  const [yearsInBusiness, setYearsInBusiness] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');
  
  // Financial Statements
  const [purchases, setPurchases] = useState(initialData?.purchases?.toString() || '');
  const [sales, setSales] = useState(initialData?.sales?.toString() || '');
  const [expenses, setExpenses] = useState(initialData?.expenses?.toString() || '');
  const [loading, setLoading] = useState(false);

  // Auto-calculated fields
  const revenue = parseFloat(sales) || 0;
  const benefit = revenue - (parseFloat(purchases) || 0) - (parseFloat(expenses) || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
      const data: any = {
        companyUid: auth.currentUser.uid,
        fundamentals: {
          sector,
          yearsInBusiness: parseInt(yearsInBusiness),
          employeeCount: parseInt(employeeCount)
        },
        purchases: parseFloat(purchases),
        sales: parseFloat(sales),
        expenses: parseFloat(expenses),
        revenue,
        profit: benefit,
        period: "Q1 2026",
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'financials', auth.currentUser.uid), data);
      onComplete();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onComplete} className="p-2 bg-white rounded-xl shadow-sm">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold">Soumission Financière</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-10">
        {/* Section 1: Fondamentaux */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Building2 className="w-5 h-5 text-onyx-blue" />
            <h3 className="font-bold text-neutral-800 uppercase text-sm tracking-wider">1. Fondamentaux de l'entreprise</h3>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-400 uppercase px-1">Secteur d'activité</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-onyx-yellow outline-none"
                placeholder="Ex: Commerce, Services, Industrie"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 uppercase px-1">Années d'existence</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-onyx-yellow outline-none"
                  value={yearsInBusiness}
                  onChange={(e) => setYearsInBusiness(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 uppercase px-1">Nombre d'employés</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-onyx-yellow outline-none"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: États financiers */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <PieChart className="w-5 h-5 text-onyx-blue" />
            <h3 className="font-bold text-neutral-800 uppercase text-sm tracking-wider">2. États financiers</h3>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-400 uppercase px-1">Ventes (Total)</label>
              <input
                type="number"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-onyx-yellow outline-none"
                value={sales}
                onChange={(e) => setSales(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-400 uppercase px-1">Achats (Total)</label>
              <input
                type="number"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-onyx-yellow outline-none"
                value={purchases}
                onChange={(e) => setPurchases(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-400 uppercase px-1">Dépenses Opérationnelles</label>
              <input
                type="number"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-onyx-yellow outline-none"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-onyx-bg p-3 rounded-xl border border-onyx-yellow/20">
                <p className="text-[10px] font-bold text-neutral-400 uppercase">Chiffre d'affaires</p>
                <p className="text-lg font-bold text-onyx-blue">{revenue.toLocaleString()} €</p>
              </div>
              <div className={`p-3 rounded-xl border ${benefit >= 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                <p className={`text-[10px] font-bold uppercase ${benefit >= 0 ? 'text-green-400' : 'text-red-400'}`}>Bénéfice</p>
                <p className={`text-lg font-bold ${benefit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{benefit.toLocaleString()} €</p>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-onyx-yellow text-onyx-blue py-4 rounded-xl font-bold shadow-lg shadow-onyx-yellow/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" /> : <TrendingUp className="w-5 h-5" />}
          Soumettre le dossier financier
        </button>
      </form>
    </div>
  );
};
