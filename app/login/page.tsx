'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api, endpoints } from '@/lib/api';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async () => {
    setLoading(true);
    setError('');
    try {
      let data: any;
      try {
        data = await api.post(endpoints.auth.loginAdmin, { email, password });
        data.role = 'admin';
      } catch {
        try {
          data = await api.post(endpoints.auth.login, { email, password });
        } catch {
          data = await api.post(endpoints.auth.loginDrh, { email, password });
          data.role = 'drh';
        }
      }
      localStorage.setItem('yira_token', data.access_token);
      localStorage.setItem('yira_role', data.role ?? data.conseiller?.role ?? 'conseiller');
      const role = data.role ?? data.conseiller?.role ?? 'conseiller';
      if (role === 'admin') router.push('/admin');
      else if (role === 'drh') router.push('/employeur');
      else if (role === 'formateur') router.push('/formateur');
      else if (role === 'etat') router.push('/opc');
      else router.push('/conseiller');
    } catch {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: '#F8FAF9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 420, padding: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, #1D9E75, #0F6E56)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 24 }}>Y</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F2419', marginBottom: 8 }}>Connexion YIRA</h1>
          <p style={{ fontSize: 14, color: '#6B8F7A' }}>Conseillers, formateurs, DRH, admin</p>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 32, border: '1px solid #E5EDE9' }}>
          {error && (
            <div style={{ background: '#FCECEA', border: '1px solid #F5C6C2', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 14, color: '#C0392B' }}>
              {error}
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6, display: 'block' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              style={{ width: '100%', border: '1px solid #D1FAE5', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6, display: 'block' }}>Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" onKeyDown={(e) => e.key === 'Enter' && login()}
              style={{ width: '100%', border: '1px solid #D1FAE5', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <button onClick={login} disabled={loading || !email || !password}
            style={{ width: '100%', padding: '12px', borderRadius: 10, background: loading ? '#9DB5AB' : '#1D9E75', color: '#fff', fontWeight: 600, fontSize: 15, border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button onClick={() => router.push('/')} style={{ fontSize: 13, color: '#6B8F7A', background: 'none', border: 'none', cursor: 'pointer' }}>
            Retour a l'accueil
          </button>
        </div>
        <div style={{ marginTop: 24, padding: 16, background: '#E8F8F2', borderRadius: 10, border: '1px solid #A8DCC8' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#0F6E56', marginBottom: 8 }}>Compte admin par defaut</div>
          <div style={{ fontSize: 12, color: '#1D9E75' }}>Email: admin@yira-ci.com</div>
          <div style={{ fontSize: 12, color: '#1D9E75' }}>Mot de passe: YiraAdmin2026!</div>
        </div>
      </div>
    </main>
  );
}