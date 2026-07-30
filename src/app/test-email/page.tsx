'use client';

import { useState } from 'react';

export default function TestEmailPage() {
  const [config, setConfig] = useState({
    smtpUser: 'info@modura.be',
    smtpPass: '',
    recipientEmail: 'your-email@example.com'
  });
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/send-email');
      const data = await res.json();
      setTestResult({ type: 'connection', ...data });
    } catch (err) {
      setTestResult({ success: false, error: 'Failed to connect' });
    } finally {
      setLoading(false);
    }
  };

  const sendTestFinancingEmail = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'financing',
          name: 'Test User',
          email: config.recipientEmail,
          phone: '+32 499 99 99 99',
          model: 'Modura Classic',
          details: '20.000€ apport - 120 mois - 1.850€/mois',
          message: 'Ceci est un email de test pour vérifier que le système de financement fonctionne correctement.'
        })
      });
      const data = await res.json();
      setTestResult({ type: 'send', ...data });
    } catch (err) {
      setTestResult({ success: false, error: 'Failed to send email' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🧪 Test Email System</h1>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Configuration Email</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (SMTP User)</label>
              <input
                type="email"
                value={config.smtpUser}
                onChange={(e) => setConfig({...config, smtpUser: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe Email (App Password)</label>
              <input
                type="password"
                value={config.smtpPass}
                onChange={(e) => setConfig({...config, smtpPass: e.target.value})}
                placeholder="Entrez votre mot de passe d'application"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Pour Outlook, créez un mot de passe d'application dans les paramètres de sécurité Microsoft</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email de test (où recevoir le test)</label>
              <input
                type="email"
                value={config.recipientEmail}
                onChange={(e) => setConfig({...config, recipientEmail: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <button
              onClick={testConnection}
              disabled={loading}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition disabled:opacity-50"
            >
              🔍 Tester la connexion SMTP
            </button>
            <button
              onClick={sendTestFinancingEmail}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              📧 Envoyer un email de test financement
            </button>
          </div>
        </div>

        {testResult && (
          <div className={`bg-white rounded-2xl shadow-lg p-6 ${testResult.success ? 'border-green-500 border-2' : 'border-red-500 border-2'}`}>
            <h3 className="text-lg font-semibold mb-4">
              {testResult.success ? '✅ Succès !' : '❌ Erreur'}
            </h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">📝 Instructions pour Outlook/Office 365</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
            <li>Activez l'authentification à deux facteurs sur votre compte Microsoft</li>
            <li>Créez un mot de passe d'application : https://account.microsoft.com/security/app-passwords</li>
            <li>Utilisez ce mot de passe dans le champ "Mot de passe Email" ci-dessus</li>
            <li>Mettez à jour votre fichier .env avec ces informations en production</li>
          </ol>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mt-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">⚙️ Configuration actuelle du .env</h3>
          <ul className="space-y-1 text-yellow-800 text-sm">
            <li><strong>SMTP_HOST:</strong> smtp.office365.com (pour Outlook)</li>
            <li><strong>SMTP_PORT:</strong> 587 (TLS)</li>
            <li><strong>SMTP_SECURE:</strong> false</li>
            <li><strong>SMTP_USER:</strong> info@modura.be</li>
            <li><strong>SMTP_PASS:</strong> {process.env.SMTP_PASS ? '✓ configuré' : '✗ à mettre à jour'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}