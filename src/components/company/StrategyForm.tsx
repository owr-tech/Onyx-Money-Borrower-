import React, { useState } from 'react';
import { db, auth } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { StrategyWarranty } from '../../types';
import { ArrowLeft, Loader2, ShieldCheck, FileText, CheckCircle, Camera, Upload } from 'lucide-react';

interface StrategyFormProps {
  initialData: StrategyWarranty | null;
  onComplete: () => void;
}

export const StrategyForm: React.FC<StrategyFormProps> = ({ initialData, onComplete }) => {
  const [hasTitreFoncier, setHasTitreFoncier] = useState(false);
  const [hasContratBail, setHasContratBail] = useState(false);
  const [isCertified, setIsCertified] = useState(initialData?.isWarrantyCertified || false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
      const data: any = {
        companyUid: auth.currentUser.uid,
        warranties: {
          titreFoncierUrl: hasTitreFoncier ? "https://picsum.photos/seed/titre/400/600" : null,
          contratBailUrl: hasContratBail ? "https://picsum.photos/seed/bail/400/600" : null,
        },
        isWarrantyCertified: isCertified,
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'strategies', auth.currentUser.uid), data);
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
        <h2 className="text-xl font-bold">Soumission des Garanties</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-10">
        <div className="space-y-6">
          {/* Titre Foncier */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-neutral-500 uppercase px-1">Titre Foncier</label>
            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={() => setHasTitreFoncier(true)}
                className={`flex-1 flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-3xl transition-all ${hasTitreFoncier ? 'bg-onyx-yellow/10 border-onyx-yellow text-onyx-blue' : 'bg-white border-neutral-200 text-neutral-400 hover:border-onyx-yellow'}`}
              >
                <Camera className="w-8 h-8" />
                <span className="text-xs font-bold uppercase">{hasTitreFoncier ? 'Capturé' : 'Caméra'}</span>
              </button>
              <button 
                type="button" 
                onClick={() => setHasTitreFoncier(true)}
                className={`flex-1 flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-3xl transition-all ${hasTitreFoncier ? 'bg-onyx-yellow/10 border-onyx-yellow text-onyx-blue' : 'bg-white border-neutral-200 text-neutral-400 hover:border-onyx-yellow'}`}
              >
                <Upload className="w-8 h-8" />
                <span className="text-xs font-bold uppercase">{hasTitreFoncier ? 'Chargé' : 'Charger'}</span>
              </button>
            </div>
          </div>

          {/* Contrat de Bail */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-neutral-500 uppercase px-1">Contrat de Bail Locatif</label>
            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={() => setHasContratBail(true)}
                className={`flex-1 flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-3xl transition-all ${hasContratBail ? 'bg-onyx-yellow/10 border-onyx-yellow text-onyx-blue' : 'bg-white border-neutral-200 text-neutral-400 hover:border-onyx-yellow'}`}
              >
                <Camera className="w-8 h-8" />
                <span className="text-xs font-bold uppercase">{hasContratBail ? 'Capturé' : 'Caméra'}</span>
              </button>
              <button 
                type="button" 
                onClick={() => setHasContratBail(true)}
                className={`flex-1 flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-3xl transition-all ${hasContratBail ? 'bg-onyx-yellow/10 border-onyx-yellow text-onyx-blue' : 'bg-white border-neutral-200 text-neutral-400 hover:border-onyx-yellow'}`}
              >
                <Upload className="w-8 h-8" />
                <span className="text-xs font-bold uppercase">{hasContratBail ? 'Chargé' : 'Charger'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-1 pt-4">
            <div 
              onClick={() => setIsCertified(!isCertified)}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex items-center gap-4 ${isCertified ? 'bg-onyx-blue text-white border-onyx-blue' : 'bg-white border-neutral-200 text-neutral-400'}`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isCertified ? 'bg-white border-white text-onyx-blue' : 'border-neutral-300'}`}>
                {isCertified && <CheckCircle className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">Certification de Garantie</p>
                <p className="text-xs opacity-70">Je certifie l'authenticité des documents</p>
              </div>
              <ShieldCheck className={`w-6 h-6 ${isCertified ? 'text-onyx-yellow' : 'text-neutral-300'}`} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-onyx-yellow text-onyx-blue py-4 rounded-xl font-bold shadow-lg shadow-onyx-yellow/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" /> : <FileText className="w-5 h-5" />}
          Soumettre les garanties
        </button>
      </form>
    </div>
  );
};
