import React, { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Building2, User as UserIcon, ArrowRight, Loader2 } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('company');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { createProfile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await createProfile(userCredential.user.uid, email, role, displayName);
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 flex flex-col h-full justify-center">
      <div className="mb-12 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-onyx-blue rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
        >
          <Building2 className="text-white w-10 h-10" />
        </motion.div>
        <h1 className="text-3xl font-bold text-neutral-900">Onyx borrower</h1>
        <p className="text-neutral-500 mt-2">
          {isLogin ? "Connectez-vous à votre compte" : "Enregistrez votre entreprise"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AnimatePresence mode="wait">
          {!isLogin && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4 overflow-hidden"
            >
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Nom complet / Nom d'utilisateur"
                  className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-onyx-blue outline-none transition-all"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required={!isLogin}
                />
              </div>

              <div className="flex p-1 bg-neutral-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole('company')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${role === 'company' ? 'bg-white shadow-sm text-onyx-blue' : 'text-neutral-500'}`}
                >
                  Entreprise
                </button>
                <button
                  type="button"
                  onClick={() => setRole('investor')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${role === 'investor' ? 'bg-white shadow-sm text-onyx-blue' : 'text-neutral-500'}`}
                >
                  Investisseur
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <input
            type="email"
            placeholder="E-mail"
            className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-onyx-blue outline-none transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-onyx-blue outline-none transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm px-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-onyx-blue hover:bg-onyx-blue/90 text-white py-4 rounded-xl font-bold shadow-lg shadow-onyx-blue/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" /> : (isLogin ? "Se connecter" : "S'enregistrer")}
          {!loading && <ArrowRight className="w-5 h-5" />}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-onyx-blue font-semibold hover:underline"
        >
          {isLogin ? "Pas encore de compte ? Enregistrez votre entreprise" : "Déjà un compte ? Se connecter"}
        </button>
      </div>
    </div>
  );
};
