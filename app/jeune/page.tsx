'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api, endpoints } from '@/lib/api';
import {
  GraduationCap, Brain, BookOpen, Briefcase, ChevronRight,
  CheckCircle, ArrowRight, School, Wrench, ArrowLeft
} from 'lucide-react';

type EtapeEval = 'code' | 'filtre' | 'test' | 'resultat';
type Parcours = 'scolaire' | 'professionnel' | null;

const METIERS_SCOLAIRES: Record<string, { filieres: string[]; etablissements: string[]; description: string }> = {
  R: { filieres: ['BT Batiment', 'CAP Maconnerie', 'BT Mecanique Industrielle', 'CAP Electricite'], etablissements: ['CPM BAT Koumassi', 'CAFOP Abidjan', 'INSET Yopougon'], description: 'Profil Realiste — vous etes fait pour les metiers techniques et manuels.' },
  I: { filieres: ['BTS Informatique', 'BT Electronique', 'Licence Sciences', 'BTS Analyse Biologique'], etablissements: ['ESATIC Abidjan', 'INPHB Yamoussoukro', 'UVCI en ligne'], description: 'Profil Investigateur — vous etes fait pour les metiers scientifiques et techniques avances.' },
  A: { filieres: ['BTS Communication', 'BT Arts Appliques', 'BTS Design Graphique', 'CAP Couture'], etablissements: ['ESJAC Abidjan', 'INA Abidjan', 'ESMOD Abidjan'], description: 'Profil Artistique — vous etes fait pour les metiers creatifs et de communication.' },
  S: { filieres: ['BTS Action Sociale', 'BT Sciences Medico-Sociales', 'BTS RH', 'CAP Petite Enfance'], etablissements: ['INFAS Abidjan', 'ENSU Abidjan', 'ISAD Abidjan'], description: 'Profil Social — vous etes fait pour les metiers d aide, de soin et d enseignement.' },
  E: { filieres: ['BTS Commerce International', 'BTS Management PME', 'BTS Marketing', 'Licence Gestion'], etablissements: ['INSET Commerce', 'CESAG Abidjan', 'HEC Abidjan'], description: 'Profil Entrepreneur — vous etes fait pour les metiers du commerce et du management.' },
  C: { filieres: ['BTS Comptabilite Gestion', 'BT Secretariat', 'BTS Finance Banque', 'CAP Comptabilite'], etablissements: ['PIGIER Abidjan', 'CCI Business School', 'ESCAE Abidjan'], description: 'Profil Conventionnel — vous etes fait pour les metiers de la gestion et de l administration.' },
};

const METIERS_PRO: Record<string, { metiers: string[]; employeurs: string[]; filiere: string; description: string }> = {
  R: { metiers: ['Technicien BTP', 'Electricien industriel', 'Mecanicien automobile', 'Plombier'], employeurs: ['BNETD', 'CIE', 'CFAO Motors', 'SODECI'], filiere: 'A', description: 'Profil Realiste — fort potentiel dans les secteurs technique et industriel.' },
  I: { metiers: ['Developpeur web', 'Technicien reseau', 'Analyste financier', 'Laborantin'], employeurs: ['Orange CI', 'MTN CI', 'SGBCI', 'CHU Abidjan'], filiere: 'A', description: 'Profil Investigateur — fort potentiel dans les secteurs tech et scientifique.' },
  A: { metiers: ['Graphiste', 'Community manager', 'Journaliste', 'Createur de contenu'], employeurs: ['Havas CI', 'RTI', 'Jeune Afrique', 'Startups tech'], filiere: 'B', description: 'Profil Artistique — fort potentiel dans la communication et les industries creatives.' },
  S: { metiers: ['Charge RH', 'Conseiller clientele', 'Infirmier', 'Formateur'], employeurs: ['Orange CI', 'MTN CI', 'CHU', 'ONGs internationales'], filiere: 'B', description: 'Profil Social — fort potentiel dans les RH, la sante et les services.' },
  E: { metiers: ['Commercial terrain', 'Chef de projet', 'Responsable agence', 'Entrepreneur'], employeurs: ['SIFCA', 'Nestle CI', 'CFAO', 'BICICI'], filiere: 'A', description: 'Profil Entrepreneur — fort potentiel dans le commerce et le management.' },
  C: { metiers: ['Comptable', 'Assistant de direction', 'Agent de microfinance', 'Caissier principal'], employeurs: ['ADVANS CI', 'Baobab', 'BNP Paribas CI', 'NSIA'], filiere: 'B', description: 'Profil Conventionnel — fort potentiel dans la finance et l administration.' },
};

const FILIERES_INSERTION: Record<string, { label: string; color: string; bg: string; desc: string }> = {
  A: { label: 'Filiere A — Emploi Direct', color: '#1D9E75', bg: '#E8F8F2', desc: 'Score eleve — emploi direct en moins d 1 mois' },
  B: { label: 'Filiere B — Accompagnement', color: '#185FA5', bg: '#E6F1FB', desc: 'Score moyen — 2-3 mises en relation en moins de 3 mois' },
  C: { label: 'Filiere C — Stage Passerelle', color: '#E07B00', bg: '#FEF3E2', desc: 'Stage 4 semaines pour renforcer le profil' },
};

export default function EspaceJeune() {
  const router = useRouter();
  const [tab, setTab] = useState('accueil');
  const [form, setForm] = useState({ prenom: '', nom: '', telephone: '', date_naissance: '', niveau_etude: 'bepc', district: 'Abidjan', genre: 'homme' });
  const [codeYira, setCodeYira] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Evaluation state
  const [etapeEval, setEtapeEval] = useState<EtapeEval>('code');
  const [codeRecherche, setCodeRecherche] = useState('');
  const [parcours, setParcours] = useState<Parcours>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [assessmentId, setAssessmentId] = useState<number | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [reponses, setReponses] = useState<Record<string, number>>({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
  const [profilDominant, setProfilDominant] = useState('');
  const [nbQuestions, setNbQuestions] = useState(0);

  const inscrire = async () => {
    setLoading(true);
    setMessage('');
    try {
      const data = await api.post(endpoints.auth.inscription, { ...form, consentement_rgpd: true, canal_inscription: 'web', country_code: 'CI' });
      setCodeYira(data.code_yira ?? '');
      setTab('code');
    } catch (err: any) {
      setMessage('Erreur : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const validerCode = async () => {
    if (!codeRecherche.trim()) return;
    setEtapeEval('filtre');
  };

  const lancerTest = async (choixParcours: Parcours) => {
    setParcours(choixParcours);
    setLoading(true);
    setMessage('');
    try {
      const niveau = form.niveau_etude === 'bts_licence' ? 'N3' : form.niveau_etude === 'bac' ? 'N2' : 'N1';
      const data = await api.post(endpoints.evaluation.init, {
        prenom: form.prenom || 'Beneficiaire',
        nom: form.nom || 'YIRA',
        niveau,
      });
      setAssessmentId(data.assessment_id);
      setQuestions(data.questions ?? []);
      setNbQuestions(data.nb_questions ?? 0);
      setQIndex(0);
      setReponses({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
      setEtapeEval('test');
    } catch (err: any) {
      setMessage('Erreur : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const repondre = (valeur: number) => {
    const q = questions[qIndex];
    const dim = q?.label_question?.includes('RIASEC') ? detecterDimension(q.label_question) : 'S';
    const newReponses = { ...reponses, [dim]: (reponses[dim] ?? 0) + valeur };
    setReponses(newReponses);
    if (qIndex < questions.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      const dominant = Object.entries(newReponses).sort((a, b) => b[1] - a[1])[0][0];
      setProfilDominant(dominant);
      setEtapeEval('resultat');
    }
  };

  const detecterDimension = (label: string): string => {
    if (label.includes('[RIASEC]')) {
      if (label.includes('mains') || label.includes('reparer') || label.includes('physique')) return 'R';
      if (label.includes('analyser') || label.includes('curieux') || label.includes('recherche')) return 'I';
      if (label.includes('creer') || label.includes('artistique') || label.includes('original')) return 'A';
      if (label.includes('aider') || label.includes('enseigner') || label.includes('social')) return 'S';
      if (label.includes('diriger') || label.includes('convaincre') || label.includes('commerce')) return 'E';
      if (label.includes('organiser') || label.includes('precision') || label.includes('procedure')) return 'C';
    }
    return 'S';
  };

  const S = {
    card: { background: '#fff', borderRadius: 16, border: '1px solid #E5EDE9', padding: 24 },
    input: { width: '100%', border: '1px solid #E5EDE9', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const },
    label: { fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6, display: 'block' },
    tabBtn: (active: boolean) => ({ padding: '16px 0', fontSize: 13, fontWeight: active ? 600 : 400, color: active ? '#1D9E75' : '#6B8F7A', background: 'none', border: 'none', borderBottom: active ? '2px solid #1D9E75' : '2px solid transparent', cursor: 'pointer' }),
  };

  const resetEval = () => {
    setEtapeEval('code');
    setParcours(null);
    setQIndex(0);
    setReponses({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
    setProfilDominant('');
    setQuestions([]);
    setMessage('');
  };

  return (
    <main style={{ minHeight: '100vh', background: '#F8FAF9', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #E5EDE9', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
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
          {[{ id: 'accueil', label: 'Accueil' }, { id: 'inscription', label: 'Inscription' }, { id: 'evaluation', label: 'Evaluation' }, { id: 'parcours', label: 'Mon Parcours' }, { id: 'carte', label: 'Ma Carte' }].map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); if (t.id === 'evaluation') resetEval(); }} style={S.tabBtn(tab === t.id)}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>

        {/* ACCUEIL */}
        {tab === 'accueil' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ ...S.card, textAlign: 'center', padding: '48px 32px' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: '#E8F8F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <GraduationCap size={32} color="#1D9E75" />
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0F2419', marginBottom: 10 }}>Bienvenue sur YIRA Africa</h1>
              <p style={{ fontSize: 15, color: '#6B8F7A', marginBottom: 32, lineHeight: 1.6 }}>Votre plateforme d'orientation et d'insertion professionnelle</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', maxWidth: 360, margin: '0 auto' }}>
                <button onClick={() => setTab('inscription')} style={{ flex: 1, padding: '14px', borderRadius: 10, background: '#1D9E75', color: '#fff', fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer' }}>S'inscrire</button>
                <button onClick={() => setTab('evaluation')} style={{ flex: 1, padding: '14px', borderRadius: 10, background: '#fff', color: '#1D9E75', fontWeight: 600, fontSize: 15, border: '2px solid #1D9E75', cursor: 'pointer' }}>Reprendre</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { label: 'Evaluation SigmundTest', desc: 'Profil RIASEC scientifique', icon: Brain, color: '#185FA5', bg: '#E6F1FB' },
                { label: 'Orientation Scolaire', desc: '71 filieres referenciees CI', icon: School, color: '#6B3FA0', bg: '#F0EAF8' },
                { label: 'Insertion Professionnelle', desc: 'Matching IA 500+ employeurs', icon: Briefcase, color: '#E07B00', bg: '#FEF3E2' },
              ].map(c => { const Icon = c.icon; return (
                <div key={c.label} style={{ ...S.card, padding: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <Icon size={20} color={c.color} />
                  </div>
                  <div style={{ fontWeight: 600, color: '#0F2419', fontSize: 13, marginBottom: 4 }}>{c.label}</div>
                  <div style={{ fontSize: 12, color: '#6B8F7A' }}>{c.desc}</div>
                </div>
              ); })}
            </div>
          </div>
        )}

        {/* INSCRIPTION */}
        {tab === 'inscription' && (
          <div style={{ ...S.card, maxWidth: 520, margin: '0 auto' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F2419', marginBottom: 24 }}>Inscription YIRA</h2>
            {message && <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 16, background: '#FCECEA', color: '#C0392B', fontSize: 13 }}>{message}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={S.label}>Prenom</label><input style={S.input} placeholder="Kouassi" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} /></div>
                <div><label style={S.label}>Nom</label><input style={S.input} placeholder="Yao" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} /></div>
              </div>
              <div><label style={S.label}>Telephone</label><input style={S.input} placeholder="+225 07 00 00 00" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} /></div>
              <div><label style={S.label}>Date de naissance</label><input type="date" style={S.input} value={form.date_naissance} onChange={e => setForm({ ...form, date_naissance: e.target.value })} /></div>
              <div><label style={S.label}>Genre</label>
                <select style={S.input} value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })}>
                  <option value="homme">Homme</option><option value="femme">Femme</option><option value="nsp">Je ne souhaite pas repondre</option>
                </select>
              </div>
              <div><label style={S.label}>Niveau d'etudes</label>
                <select style={S.input} value={form.niveau_etude} onChange={e => setForm({ ...form, niveau_etude: e.target.value })}>
                  <option value="sans">Sans diplome</option><option value="cepe">CEPE</option><option value="bepc">BEPC</option><option value="bac">BAC</option><option value="bts_licence">BTS / Licence+</option><option value="autre">Autre</option>
                </select>
              </div>
              <div><label style={S.label}>District</label>
                <select style={S.input} value={form.district} onChange={e => setForm({ ...form, district: e.target.value })}>
                  {['Abidjan','Bouake','Yamoussoukro','San-Pedro','Daloa','Korhogo','Bondoukou','Man','Divo','Gagnoa','Odienne','Abengourou','Autre'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <button onClick={inscrire} disabled={loading || !form.prenom || !form.nom || !form.telephone}
                style={{ padding: '12px', borderRadius: 10, background: '#1D9E75', color: '#fff', fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer', marginTop: 8, opacity: (!form.prenom || !form.nom || !form.telephone) ? 0.6 : 1 }}>
                {loading ? 'Inscription en cours...' : 'Creer mon compte YIRA'}
              </button>
            </div>
          </div>
        )}

        {/* CODE YIRA APRES INSCRIPTION */}
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
            <button onClick={() => { setCodeRecherche(codeYira); setTab('evaluation'); setEtapeEval('filtre'); }}
              style={{ width: '100%', padding: '12px', borderRadius: 10, background: '#1D9E75', color: '#fff', fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer' }}>
              Demarrer mon evaluation
            </button>
          </div>
        )}

        {/* EVALUATION */}
        {tab === 'evaluation' && (
          <div>
            {/* ETAPE 1 — Saisie du code YIRA */}
            {etapeEval === 'code' && (
              <div style={{ ...S.card, maxWidth: 500, margin: '0 auto', padding: '40px 32px' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Brain size={28} color="#185FA5" />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F2419', marginBottom: 8, textAlign: 'center' }}>Evaluation SigmundTest</h2>
                <p style={{ fontSize: 14, color: '#6B8F7A', marginBottom: 24, textAlign: 'center' }}>Entrez votre code YIRA pour commencer</p>
                <input style={{ ...S.input, textAlign: 'center', fontFamily: 'monospace', fontSize: 16, marginBottom: 12, letterSpacing: 1 }}
                  placeholder="Y-CI-ABJ-2026-XXXXXX" value={codeRecherche} onChange={e => setCodeRecherche(e.target.value)} />
                {message && <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 12, background: '#FCECEA', color: '#C0392B', fontSize: 13 }}>{message}</div>}
                <button onClick={validerCode} disabled={!codeRecherche.trim()}
                  style={{ width: '100%', padding: '12px', borderRadius: 10, background: '#185FA5', color: '#fff', fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer', opacity: !codeRecherche.trim() ? 0.6 : 1 }}>
                  Valider mon code
                </button>
                <p style={{ fontSize: 12, color: '#9DB5AB', marginTop: 16, textAlign: 'center' }}>
                  Pas de code ? <button onClick={() => setTab('inscription')} style={{ color: '#1D9E75', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Inscrivez-vous d'abord</button>
                </p>
              </div>
            )}

            {/* ETAPE 2 — Question filtre */}
            {etapeEval === 'filtre' && (
              <div style={{ maxWidth: 560, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <button onClick={() => setEtapeEval('code')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B8F7A', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                    <ArrowLeft size={14} /> Retour
                  </button>
                  <div style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: '#E8F8F2', color: '#1D9E75', fontFamily: 'monospace', fontWeight: 600 }}>{codeRecherche}</div>
                </div>

                <div style={{ ...S.card, padding: '32px' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#1D9E75', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Question importante</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F2419', marginBottom: 8, lineHeight: 1.4 }}>
                    As-tu deja termine tes etudes ou cherches-tu encore ta voie a l'ecole ?
                  </h3>
                  <p style={{ fontSize: 13, color: '#6B8F7A', marginBottom: 28 }}>
                    Ta reponse determine les recommandations que tu recevras apres le test.
                  </p>
                  {message && <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 16, background: '#FCECEA', color: '#C0392B', fontSize: 13 }}>{message}</div>}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <button onClick={() => lancerTest('scolaire')} disabled={loading}
                      style={{ padding: '20px 24px', borderRadius: 12, border: '2px solid #E5EDE9', background: '#fff', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 16, opacity: loading ? 0.6 : 1 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: '#F0EAF8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <School size={24} color="#6B3FA0" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0F2419', fontSize: 15, marginBottom: 4 }}>Je cherche ma voie d'etudes</div>
                        <div style={{ fontSize: 13, color: '#6B8F7A' }}>Je suis en 3eme, Terminale, ou je veux choisir une filiere</div>
                      </div>
                      <ArrowRight size={18} color="#6B3FA0" style={{ marginLeft: 'auto' }} />
                    </button>

                    <button onClick={() => lancerTest('professionnel')} disabled={loading}
                      style={{ padding: '20px 24px', borderRadius: 12, border: '2px solid #E5EDE9', background: '#fff', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 16, opacity: loading ? 0.6 : 1 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: '#FEF3E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Briefcase size={24} color="#E07B00" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0F2419', fontSize: 15, marginBottom: 4 }}>Je cherche a entrer dans la vie active</div>
                        <div style={{ fontSize: 13, color: '#6B8F7A' }}>J'ai un diplome et je cherche un emploi</div>
                      </div>
                      <ArrowRight size={18} color="#E07B00" style={{ marginLeft: 'auto' }} />
                    </button>
                  </div>
                  {loading && <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#6B8F7A' }}>Chargement des questions...</div>}
                </div>
              </div>
            )}

            {/* ETAPE 3 — Test question par question */}
            {etapeEval === 'test' && questions.length > 0 && (
              <div style={{ maxWidth: 600, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: parcours === 'scolaire' ? '#F0EAF8' : '#FEF3E2', color: parcours === 'scolaire' ? '#6B3FA0' : '#E07B00', fontWeight: 600 }}>
                    {parcours === 'scolaire' ? 'Orientation Scolaire' : 'Insertion Professionnelle'}
                  </div>
                  <div style={{ fontSize: 12, color: '#6B8F7A' }}>Question {qIndex + 1} / {questions.length}</div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: '#6B8F7A' }}>Progression</span>
                    <span style={{ fontSize: 12, color: '#1D9E75', fontWeight: 600 }}>{Math.round((qIndex / questions.length) * 100)}%</span>
                  </div>
                  <div style={{ height: 6, background: '#E5EDE9', borderRadius: 3 }}>
                    <div style={{ height: '100%', background: '#1D9E75', borderRadius: 3, width: `${(qIndex / questions.length) * 100}%`, transition: 'width 0.3s' }} />
                  </div>
                </div>

                <div style={{ ...S.card, padding: '32px' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#185FA5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
                    {questions[qIndex]?.label_question?.split(']')[0]?.replace('[', '') || 'QUESTION'}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0F2419', marginBottom: 28, lineHeight: 1.6 }}>
                    {questions[qIndex]?.label_question?.split('] ')[1] || questions[qIndex]?.label_question}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { val: 4, label: 'Tout a fait d\'accord', color: '#1D9E75', bg: '#E8F8F2' },
                      { val: 3, label: 'Plutot d\'accord', color: '#185FA5', bg: '#E6F1FB' },
                      { val: 2, label: 'Plutot pas d\'accord', color: '#E07B00', bg: '#FEF3E2' },
                      { val: 1, label: 'Pas du tout d\'accord', color: '#C0392B', bg: '#FCECEA' },
                    ].map(opt => (
                      <button key={opt.val} onClick={() => repondre(opt.val)}
                        style={{ padding: '14px 20px', borderRadius: 10, border: `1px solid ${opt.bg}`, background: '#fff', cursor: 'pointer', textAlign: 'left', fontSize: 14, color: '#0F2419', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: opt.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: opt.color, flexShrink: 0 }}>{opt.val}</div>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ETAPE 4 — Resultats */}
            {etapeEval === 'resultat' && profilDominant && (
              <div style={{ maxWidth: 640, margin: '0 auto' }}>
                <div style={{ ...S.card, textAlign: 'center', padding: '32px', marginBottom: 20, background: 'linear-gradient(135deg, #0F2419, #1D9E75)' }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 8, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Profil RIASEC identifie</div>
                  <div style={{ fontSize: 48, fontWeight: 900, color: '#fff', marginBottom: 8 }}>{profilDominant}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: 20 }}>
                    {profilDominant === 'R' ? 'Realiste' : profilDominant === 'I' ? 'Investigateur' : profilDominant === 'A' ? 'Artistique' : profilDominant === 'S' ? 'Social' : profilDominant === 'E' ? 'Entrepreneur' : 'Conventionnel'}
                  </div>
                </div>

                {parcours === 'scolaire' && METIERS_SCOLAIRES[profilDominant] && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ ...S.card, borderLeft: '4px solid #6B3FA0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <School size={20} color="#6B3FA0" />
                        <div style={{ fontWeight: 700, color: '#0F2419', fontSize: 16 }}>Orientation Scolaire</div>
                      </div>
                      <p style={{ fontSize: 13, color: '#6B8F7A', marginBottom: 16 }}>{METIERS_SCOLAIRES[profilDominant].description}</p>
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#6B3FA0', marginBottom: 8, textTransform: 'uppercase' }}>Filieres recommandees</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {METIERS_SCOLAIRES[profilDominant].filieres.map(f => (
                            <span key={f} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, background: '#F0EAF8', color: '#6B3FA0', fontWeight: 500 }}>{f}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#6B3FA0', marginBottom: 8, textTransform: 'uppercase' }}>Etablissements partenaires YIRA</div>
                        {METIERS_SCOLAIRES[profilDominant].etablissements.map((e, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < 2 ? '1px solid #F0F4F2' : 'none' }}>
                            <BookOpen size={14} color="#6B3FA0" />
                            <span style={{ fontSize: 13, color: '#0F2419', fontWeight: 500 }}>{e}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {parcours === 'professionnel' && METIERS_PRO[profilDominant] && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ ...S.card, background: FILIERES_INSERTION[METIERS_PRO[profilDominant].filiere].bg, border: `2px solid ${FILIERES_INSERTION[METIERS_PRO[profilDominant].filiere].color}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <CheckCircle size={20} color={FILIERES_INSERTION[METIERS_PRO[profilDominant].filiere].color} />
                        <div style={{ fontWeight: 700, color: '#0F2419' }}>{FILIERES_INSERTION[METIERS_PRO[profilDominant].filiere].label}</div>
                      </div>
                    </div>
                    <div style={{ ...S.card, borderLeft: '4px solid #E07B00' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <Briefcase size={20} color="#E07B00" />
                        <div style={{ fontWeight: 700, color: '#0F2419', fontSize: 16 }}>Insertion Professionnelle</div>
                      </div>
                      <p style={{ fontSize: 13, color: '#6B8F7A', marginBottom: 16 }}>{METIERS_PRO[profilDominant].description}</p>
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#E07B00', marginBottom: 8, textTransform: 'uppercase' }}>Metiers cibles</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {METIERS_PRO[profilDominant].metiers.map(m => (
                            <span key={m} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, background: '#FEF3E2', color: '#E07B00', fontWeight: 500 }}>{m}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* PARCOURS */}
        {tab === 'parcours' && (
          <div style={{ ...S.card, maxWidth: 480, margin: '0 auto' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F2419', marginBottom: 24 }}>Mon Parcours YIRA</h2>
            {[
              { etape: 'Inscription', statut: 'done' },
              { etape: 'Evaluation SigmundTest RIASEC', statut: profilDominant ? 'done' : 'active' },
              { etape: 'Restitution conseiller', statut: 'pending' },
              { etape: 'Formation CQP', statut: 'pending' },
              { etape: 'Certification METFPA', statut: 'pending' },
              { etape: 'Insertion emploi', statut: 'pending' },
              { etape: 'Suivi 12 mois', statut: 'pending' },
            ].map((e, i, arr) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: i < arr.length - 1 ? '1px solid #F0F4F2' : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0, background: e.statut === 'done' ? '#E8F8F2' : e.statut === 'active' ? '#E6F1FB' : '#F0F4F2', color: e.statut === 'done' ? '#1D9E75' : e.statut === 'active' ? '#185FA5' : '#9DB5AB' }}>
                  {e.statut === 'done' ? <CheckCircle size={18} /> : i + 1}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: e.statut === 'pending' ? 400 : 600, color: e.statut === 'pending' ? '#9DB5AB' : '#0F2419' }}>{e.etape}</div>
                  <div style={{ fontSize: 12, color: e.statut === 'done' ? '#1D9E75' : e.statut === 'active' ? '#185FA5' : '#C8D8D0' }}>{e.statut === 'done' ? 'Termine' : e.statut === 'active' ? 'En cours' : 'A venir'}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CARTE */}
        {tab === 'carte' && (
          <div style={{ maxWidth: 360, margin: '0 auto' }}>
            <div style={{ borderRadius: 20, padding: '28px 24px', background: 'linear-gradient(135deg, #0F2419 0%, #1D9E75 60%, #E07B00 100%)', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>YIRA Africa</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Carte de Competences</div>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>Y</span>
                </div>
              </div>
              {profilDominant && (
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Profil RIASEC</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#E07B00' }}>{profilDominant}</div>
                </div>
              )}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Code YIRA</div>
                <div style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>{codeYira || codeRecherche || 'Y-CI-ABJ-2026-XXXXXX'}</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}