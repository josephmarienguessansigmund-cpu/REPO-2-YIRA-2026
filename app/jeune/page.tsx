'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api, endpoints } from '@/lib/api';
import { GraduationCap, Brain, BookOpen, Briefcase, ChevronRight, CheckCircle } from 'lucide-react';

export default function EspaceJeune() {
  const router = useRouter();
  const [tab, setTab] = useState('accueil');
  const [form, setForm] = useState({
    prenom: '', nom: '', telephone: '', date_naissance: '',
    niveau_etude: 'bepc', district: 'Abidjan', genre: 'homme',
  });
  const [codeYira, setCodeYira] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [codeRecherche, setCodeRecherche] = useState('');

  const inscrire = async () => {
    setLoading(true);
    setMessage('');
    try {
      const data = await api.post(endpoints.auth.inscription, {
        ...form,
        consentement_rgpd: true,
        canal_inscription: 'web',
        country_code: 'CI',
      });
      setCodeYira(data.code_yira ?? data.data?.code_yira ?? '');
      setMessage('Inscription reussie !');
      setTab('code');
    } catch (err: any) {
      setMessage('Erreur : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const S = {
    header: { background: '#fff', borderBottom: '1px solid #E5EDE9', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky' as const, top: 0, zIndex: 50 },
    tab: (active: boolean) => ({ padding: '16px 0', fontSize: 13, fontWeight: active ? 600 : 400, color: active ? '#1D9E75' : '#6B8F7A', borderBottom: active ? '2px solid #1D9E75' : '2px solid transparent', background: 'none', border: 'none', borderBottomStyle: 'solid' as const, borderBottomWidth: 2, borderBottomColor: active ? '#1D9E75' : 'transparent', cursor: 'pointer' }),
    card: { background: '#fff', borderRadius: 16, border: '1px solid #E5EDE9', padding: 24 },
    input: { width: '100%', border: '1px solid #E5EDE9', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const },
    label: { fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6, display: 'block' },
  };

  return (
    <main style={{ minHeight: '100vh', background: '#F8FAF9', fontFamily: 'system-ui, sans-serif' }}>
      <header style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/')} style={{ fontSize: 13, color: '#6B8F7A', background: 'none', border: 'none', cursor: 'pointer' }}>Accueil</button>
          <div style={{ width: 1, height: 16, background: '#E5EDE9' }} />
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>Y</span>
          </div>
          <div style={{ fontWeight: 600, color: '#0F2419' }}>Espace Jeune</div>
        </div>
        <div style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, background: '#E8F8F2', color: '#0F6E56', fontWeight: 500 }}>YIRA Africa</div>
      </header>

      <div style={{ background: '#fff', borderBottom: '1px solid #E5EDE9', padding: '0 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', gap: 24 }}>
          {[
            { id: 'accueil', label: 'Accueil' },
            { id: 'inscription', label: 'Inscription' },
            { id: 'evaluation', label: 'Evaluation' },
            { id: 'parcours', label: 'Mon Parcours' },
            { id: 'carte', label: 'Ma Carte' },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={S.tab(tab === t.id)}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>

        {tab === 'accueil' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ ...S.card, textAlign: 'center', padding: '48px 32px' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: '#E8F8F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <GraduationCap size={32} color="#1D9E75" />
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0F2419', marginBottom: 10 }}>Bienvenue sur YIRA Africa</h1>
              <p style={{ fontSize: 15, color: '#6B8F7A', marginBottom: 32, lineHeight: 1.6 }}>Votre plateforme d'orientation et d'insertion professionnelle</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', maxWidth: 360, margin: '0 auto' }}>
                <button onClick={() => setTab('inscription')} style={{ flex: 1, padding: '14px', borderRadius: 10, background: '#1D9E75', color: '#fff', fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer' }}>
                  S'inscrire
                </button>
                <button onClick={() => setTab('evaluation')} style={{ flex: 1, padding: '14px', borderRadius: 10, background: '#fff', color: '#1D9E75', fontWeight: 600, fontSize: 15, border: '2px solid #1D9E75', cursor: 'pointer' }}>
                  Reprendre
                </button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { label: 'Evaluation SigmundTest', desc: 'Decouvrez votre profil RIASEC', icon: Brain, color: '#185FA5', bg: '#E6F1FB' },
                { label: 'Formation CQP/NVQ', desc: 'Trouvez votre filiere', icon: BookOpen, color: '#6B3FA0', bg: '#F0EAF8' },
                { label: 'Insertion emploi', desc: 'Matchez avec 500+ employeurs', icon: Briefcase, color: '#E07B00', bg: '#FEF3E2' },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.label} style={{ ...S.card, padding: 20 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                      <Icon size={20} color={c.color} />
                    </div>
                    <div style={{ fontWeight: 600, color: '#0F2419', fontSize: 13, marginBottom: 4 }}>{c.label}</div>
                    <div style={{ fontSize: 12, color: '#6B8F7A' }}>{c.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'inscription' && (
          <div style={{ ...S.card, maxWidth: 520, margin: '0 auto' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F2419', marginBottom: 24 }}>Inscription YIRA</h2>
            {message && (
              <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 16, background: message.includes('Erreur') ? '#FCECEA' : '#E8F8F2', color: message.includes('Erreur') ? '#C0392B' : '#0F6E56', fontSize: 13 }}>
                {message}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={S.label}>Prenom</label>
                  <input style={S.input} placeholder="Kouassi" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} />
                </div>
                <div>
                  <label style={S.label}>Nom</label>
                  <input style={S.input} placeholder="Yao" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={S.label}>Telephone</label>
                <input style={S.input} placeholder="+225 07 00 00 00" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
              </div>
              <div>
                <label style={S.label}>Date de naissance</label>
                <input type="date" style={S.input} value={form.date_naissance} onChange={(e) => setForm({ ...form, date_naissance: e.target.value })} />
              </div>
              <div>
                <label style={S.label}>Genre</label>
                <select style={S.input} value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="nsp">Je ne souhaite pas repondre</option>
                </select>
              </div>
              <div>
                <label style={S.label}>Niveau d'etudes</label>
                <select style={S.input} value={form.niveau_etude} onChange={(e) => setForm({ ...form, niveau_etude: e.target.value })}>
                  <option value="sans">Sans diplome</option>
                  <option value="cepe">CEPE</option>
                  <option value="bepc">BEPC</option>
                  <option value="bac">BAC</option>
                  <option value="bts_licence">BTS / Licence+</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label style={S.label}>District</label>
                <select style={S.input} value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })}>
                  {['Abidjan','Bouake','Yamoussoukro','San-Pedro','Daloa','Korhogo','Bondoukou','Man','Divo','Gagnoa','Odienne','Abengourou','Autre'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <button onClick={inscrire} disabled={loading || !form.prenom || !form.nom || !form.telephone}
                style={{ padding: '12px', borderRadius: 10, background: loading ? '#9DB5AB' : '#1D9E75', color: '#fff', fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer', marginTop: 8, opacity: (!form.prenom || !form.nom || !form.telephone) ? 0.6 : 1 }}>
                {loading ? 'Inscription en cours...' : 'Creer mon compte YIRA'}
              </button>
            </div>
          </div>
        )}

        {tab === 'code' && (
          <div style={{ ...S.card, maxWidth: 480, margin: '0 auto', textAlign: 'center', padding: '48px 32px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#E8F8F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={32} color="#1D9E75" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F2419', marginBottom: 8 }}>Inscription reussie !</h2>
            <p style={{ fontSize: 14, color: '#6B8F7A', marginBottom: 24 }}>Votre code YIRA unique :</p>
            <div style={{ background: '#E8F8F2', border: '1px solid #A8DCC8', borderRadius: 12, padding: '20px', marginBottom: 20 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 26, fontWeight: 800, color: '#1D9E75', letterSpacing: 2 }}>{codeYira}</div>
            </div>
            <p style={{ fontSize: 12, color: '#9DB5AB', marginBottom: 24 }}>Conservez ce code pour reprendre votre evaluation sur n'importe quel canal</p>
            <button onClick={() => setTab('evaluation')} style={{ width: '100%', padding: '12px', borderRadius: 10, background: '#1D9E75', color: '#fff', fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer' }}>
              Demarrer mon evaluation
            </button>
          </div>
        )}

        {tab === 'evaluation' && (
          <div style={{ ...S.card, maxWidth: 480, margin: '0 auto', textAlign: 'center', padding: '40px 32px' }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Brain size={28} color="#185FA5" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F2419', marginBottom: 8 }}>Evaluation SigmundTest</h2>
            <p style={{ fontSize: 14, color: '#6B8F7A', marginBottom: 24 }}>Entrez votre code YIRA pour demarrer</p>
            <input style={{ width: '100%', border: '1px solid #E5EDE9', borderRadius: 8, padding: '12px', fontSize: 16, outline: 'none', textAlign: 'center', fontFamily: 'monospace', letterSpacing: 1, marginBottom: 12, boxSizing: 'border-box' as const }}
              placeholder="YIR-2026-XXXXX" value={codeRecherche} onChange={(e) => setCodeRecherche(e.target.value)} />
            {message && (
              <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 12, background: message.includes('Erreur') ? '#FCECEA' : '#E8F8F2', color: message.includes('Erreur') ? '#C0392B' : '#0F6E56', fontSize: 13 }}>
                {message}
              </div>
            )}
            <button
              onClick={async () => {
                setLoading(true);
                setMessage('');
                try {
                  const data = await api.post(endpoints.evaluation.init, { code_yira: codeRecherche, canal: 'web', country_code: 'CI' });
                  setMessage('Evaluation initialisee ! Ref: ' + (data.assessment_id ?? data.id ?? 'OK'));
                } catch (err: any) {
                  setMessage('Erreur : ' + err.message);
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading || !codeRecherche}
              style={{ width: '100%', padding: '12px', borderRadius: 10, background: '#185FA5', color: '#fff', fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer', opacity: !codeRecherche ? 0.6 : 1 }}>
              {loading ? 'Chargement...' : "Demarrer l'evaluation"}
            </button>
            <p style={{ fontSize: 12, color: '#9DB5AB', marginTop: 16 }}>Pas de code ? Inscrivez-vous d'abord</p>
          </div>
        )}

        {tab === 'parcours' && (
          <div style={{ ...S.card, maxWidth: 480, margin: '0 auto' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F2419', marginBottom: 24 }}>Mon Parcours YIRA</h2>
            <div>
              {[
                { etape: 'Inscription', statut: 'done' },
                { etape: 'Evaluation SigmundTest', statut: 'active' },
                { etape: 'Restitution conseiller', statut: 'pending' },
                { etape: 'Formation CQP', statut: 'pending' },
                { etape: 'Certification', statut: 'pending' },
                { etape: 'Insertion emploi', statut: 'pending' },
                { etape: 'Suivi 12 mois', statut: 'pending' },
              ].map((e, i, arr) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: i < arr.length - 1 ? '1px solid #F0F4F2' : 'none' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0, background: e.statut === 'done' ? '#E8F8F2' : e.statut === 'active' ? '#E6F1FB' : '#F0F4F2', color: e.statut === 'done' ? '#1D9E75' : e.statut === 'active' ? '#185FA5' : '#9DB5AB' }}>
                    {e.statut === 'done' ? <CheckCircle size={18} /> : i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: e.statut === 'pending' ? 400 : 600, color: e.statut === 'pending' ? '#9DB5AB' : '#0F2419' }}>{e.etape}</div>
                    <div style={{ fontSize: 12, color: e.statut === 'done' ? '#1D9E75' : e.statut === 'active' ? '#185FA5' : '#C8D8D0' }}>{e.statut === 'done' ? 'Termine' : e.statut === 'active' ? 'En cours' : 'A venir'}</div>
                  </div>
                  {e.statut !== 'pending' && <ChevronRight size={16} color="#C8D8D0" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'carte' && (
          <div style={{ maxWidth: 360, margin: '0 auto' }}>
            <div style={{ borderRadius: 20, padding: '28px 24px', background: 'linear-gradient(135deg, #0F2419 0%, #1D9E75 60%, #E07B00 100%)', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>YIRA Africa</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Carte de Competences</div>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>Y</span>
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Code YIRA</div>
                <div style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>{codeYira || 'YIR-2026-XXXXX'}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>Statut</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Inscrit</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>Pays</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>CI</div>
                </div>
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5EDE9', padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: '#6B8F7A', marginBottom: 12 }}>QR Code de verification</div>
              <div style={{ width: 100, height: 100, background: '#F0F4F2', borderRadius: 12, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 11, color: '#9DB5AB', textAlign: 'center', padding: 8 }}>Disponible apres certification</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}