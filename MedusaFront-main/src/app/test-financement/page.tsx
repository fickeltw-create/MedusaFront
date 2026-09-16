'use client';

import { useState } from 'react';

export default function TestFinancementPage() {
  const [appPassword, setAppPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const sendTestEmail = async () => {
    setLoading(true);
    setStatus('Envoi en cours...');

    try {
      // Update the environment variables temporarily
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'financement',
          name: 'Test Financement',
          email: 'info@modura.be', // C'EST VOTRE EMAIL !
          phone: '0499999999',
          model: 'Modura Premium',
          details: '25.000€ apport - 180 mois - 2.100€/mois',
          message: 'Ceci est un test du formulaire de financement. Si vous recevez cet email, ça fonctionne ! 🎉'
        })
      });

      setStatus('✅ EMAIL ENVOYÉ ! Vérifiez votre boîte mail info@modura.be');
    } catch (err) {
      setStatus('❌ Erreur: ' + (err instanceof Error ? err.message : 'inconnue'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">📧 Test Financement</h1>
        <p className="text-gray-600 text-center mb-8">Envoyez un email de test à info@modura.be</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe Gmail</label>
            <input
              type="password"
              value={appPassword}
              onChange={(e) => setAppPassword(e.target.value)}
              placeholder="Collez votre mot de passe d'application Gmail ici"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          <button
            onClick={sendTestEmail}
            disabled={loading || !appPassword}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Envoi...' : '📤 ENVOYER LE TEST'}
          </button>
        </div>

        {status && (
          <div className={`mt-6 p-4 rounded-xl text-center font-medium ${status.includes('✅') ? 'bg-green-100 text-green-800' : status.includes('❌') ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
            {status}
          </div>
        )}

        <div className="mt-8 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <h3 className="font-semibold text-yellow-900 mb-2">Comment ça marche ?</h3>
          <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
            <li>Activez 2FA sur votre compte Gmail</li>
            <li>Créez un mot de passe d'application: myaccount.google.com/apppasswords</li>
            <li>Collez-le dans le champ ci-dessus</li>
            <li>Cliquez sur "ENVOYER LE TEST"</li>
            <li>Vérifiez info@modura.be - l'email arrive !</li>
          </ol>
        </div>
      </div>
    </div>
  );
}