import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { MobileContainer } from './components/layout/MobileContainer';
import { CompanyDashboard } from './components/company/CompanyDashboard';
import { Loader2, Building2 } from 'lucide-react';
import { UserProfile } from './types';

export default function App() {
  const { user, profile, loading } = useAuth();
  const [mockProfile, setMockProfile] = useState<UserProfile | null>(null);

  if (loading) {
    return (
      <MobileContainer>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-10 h-10 text-onyx-blue animate-spin" />
        </div>
      </MobileContainer>
    );
  }

  const currentProfile = profile || mockProfile;
  const isAuthenticated = !!user || !!mockProfile;

  if (!isAuthenticated) {
    return (
      <MobileContainer>
        <div className="p-8 flex flex-col items-center justify-center h-full space-y-8 bg-onyx-bg">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black text-onyx-blue tracking-tighter">Onyx</h1>
            <p className="text-neutral-500 font-medium">Accès rapide à l'application</p>
          </div>
          
          <div className="w-full space-y-4">
            <button 
              onClick={() => setMockProfile({ 
                uid: 'demo-company', 
                role: 'company', 
                displayName: 'Entreprise Démo', 
                email: 'demo@onyx.com', 
                createdAt: new Date().toISOString() 
              })}
              className="w-full bg-onyx-yellow text-onyx-blue p-6 rounded-2xl font-bold shadow-xl shadow-onyx-yellow/20 flex items-center gap-4 transition-all active:scale-95"
            >
              <div className="w-10 h-10 bg-onyx-blue/10 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-onyx-blue" />
              </div>
              <div className="text-left">
                <p className="text-sm opacity-80 font-medium">Accéder à l'application</p>
                <p className="text-lg">Espace Entreprise</p>
              </div>
            </button>
          </div>
          
          <p className="text-xs text-neutral-400 text-center px-8">
            Ceci est un accès direct pour la démonstration. Aucune donnée réelle ne sera sauvegardée de manière permanente.
          </p>
        </div>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer>
      {currentProfile?.role === 'company' ? (
        <CompanyDashboard />
      ) : (
        <div className="p-8 text-center">
          <p className="text-red-500">Erreur: Profil non trouvé ou rôle non autorisé.</p>
          <button 
            onClick={() => {
              setMockProfile(null);
              window.location.reload();
            }}
            className="mt-4 text-onyx-blue underline"
          >
            Réessayer
          </button>
        </div>
      )}
    </MobileContainer>
  );
}
