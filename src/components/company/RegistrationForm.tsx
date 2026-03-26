import React, { useState } from 'react';
import { db, auth } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { CompanyProfile } from '../../types';
import { ArrowLeft, Camera, Upload, Loader2, Save } from 'lucide-react';

interface RegistrationFormProps {
  initialData: CompanyProfile | null;
  onComplete: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ initialData, onComplete }) => {
  const [companyName, setCompanyName] = useState(initialData?.companyName || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [ownerName, setOwnerName] = useState(initialData?.ownerName || '');
  const [nifNumber, setNifNumber] = useState(initialData?.nifNumber || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
      const profile: CompanyProfile = {
        ownerUid: auth.currentUser.uid,
        companyName,
        address,
        ownerName,
        nifNumber,
        idCardUrl: "https://picsum.photos/seed/id/400/250", // Simulated upload
        isVerified: false,
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'companies', auth.currentUser.uid), profile);
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
        <button onClick={onComplete} className="p-2 bg-neutral-100 rounded-xl">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold">Formulaire d'Enregistrement</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-neutral-500 uppercase px-1">Nom de l'entreprise</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-onyx-blue outline-none"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-neutral-500 uppercase px-1">Adresse du siège social</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-onyx-blue outline-none"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-neutral-500 uppercase px-1">Propriétaire de l'entreprise</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-onyx-blue outline-none"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-neutral-500 uppercase px-1">Numéro NIF (Identifiant Fiscal)</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-onyx-blue outline-none"
              value={nifNumber}
              onChange={(e) => setNifNumber(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-neutral-500 uppercase px-1">Pièce d'identité du propriétaire</label>
            <div className="flex gap-4">
              <button type="button" className="flex-1 flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-neutral-200 rounded-2xl text-neutral-400 hover:border-onyx-blue hover:text-onyx-blue transition-all">
                <Camera className="w-8 h-8" />
                <span className="text-xs font-bold uppercase">Caméra</span>
              </button>
              <button type="button" className="flex-1 flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-neutral-200 rounded-2xl text-neutral-400 hover:border-onyx-blue hover:text-onyx-blue transition-all">
                <Upload className="w-8 h-8" />
                <span className="text-xs font-bold uppercase">Charger</span>
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-onyx-blue text-white py-4 rounded-xl font-bold shadow-lg shadow-onyx-blue/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
          Enregistrer le profil
        </button>
      </form>
    </div>
  );
};
