const API = 'https://yira-api-production.up.railway.app/api/v1';

const FILIERES = [
  // SANTÉ
  { nom: "Sciences Infirmières", domaine: "Santé", niveau: "B", pays: "CI", duree: "3 ans", debouches: "Infirmier(e), Aide-soignant(e)" },
  { nom: "Sage-Femme / Maïeutique", domaine: "Santé", niveau: "B", pays: "CI", duree: "3 ans", debouches: "Sage-femme, Maïeuticien(ne)" },
  { nom: "Technicien de Laboratoire", domaine: "Santé", niveau: "B", pays: "CI", duree: "2 ans", debouches: "Technicien labo médical" },
  { nom: "Pharmacie Assistance", domaine: "Santé", niveau: "B", pays: "CI", duree: "2 ans", debouches: "Préparateur en pharmacie" },
  { nom: "Kinésithérapie", domaine: "Santé", niveau: "A", pays: "CI", duree: "4 ans", debouches: "Kinésithérapeute" },
  { nom: "Aide-Soignant", domaine: "Santé", niveau: "C", pays: "CI", duree: "1 an", debouches: "Aide-soignant hospitalier" },

  // TECHNOLOGIES
  { nom: "Génie Informatique", domaine: "Technologies", niveau: "A", pays: "CI", duree: "3 ans", debouches: "Développeur, Ingénieur logiciel" },
  { nom: "Réseaux & Télécommunications", domaine: "Technologies", niveau: "A", pays: "CI", duree: "3 ans", debouches: "Ingénieur réseau, Technicien télécom" },
  { nom: "Cybersécurité", domaine: "Technologies", niveau: "A", pays: "CI", duree: "2 ans", debouches: "Analyste sécurité, Pentesteur" },
  { nom: "Maintenance Informatique", domaine: "Technologies", niveau: "B", pays: "CI", duree: "2 ans", debouches: "Technicien maintenance IT" },
  { nom: "Développement Mobile", domaine: "Technologies", niveau: "B", pays: "CI", duree: "1 an", debouches: "Développeur Android/iOS" },
  { nom: "Intelligence Artificielle", domaine: "Technologies", niveau: "A", pays: "CI", duree: "2 ans", debouches: "Data Scientist, Ingénieur IA" },

  // BUSINESS & COMMERCE
  { nom: "Commerce & Gestion", domaine: "Business", niveau: "A", pays: "CI", duree: "3 ans", debouches: "Gestionnaire, Commercial" },
  { nom: "Marketing & Communication", domaine: "Business", niveau: "A", pays: "CI", duree: "3 ans", debouches: "Responsable marketing, Community manager" },
  { nom: "Comptabilité & Finance", domaine: "Business", niveau: "B", pays: "CI", duree: "2 ans", debouches: "Comptable, Gestionnaire financier" },
  { nom: "Banque & Assurance", domaine: "Business", niveau: "B", pays: "CI", duree: "2 ans", debouches: "Conseiller bancaire, Agent assurance" },
  { nom: "Entrepreneuriat & PME", domaine: "Business", niveau: "B", pays: "CI", duree: "2 ans", debouches: "Chef d'entreprise, Consultant PME" },
  { nom: "Logistique & Transport", domaine: "Business", niveau: "B", pays: "CI", duree: "2 ans", debouches: "Logisticien, Responsable supply chain" },

  // CONSTRUCTION & BTP
  { nom: "Architecture & BTP", domaine: "Construction", niveau: "A", pays: "CI", duree: "5 ans", debouches: "Architecte, Ingénieur BTP" },
  { nom: "Génie Civil", domaine: "Construction", niveau: "A", pays: "CI", duree: "3 ans", debouches: "Ingénieur génie civil, Conducteur travaux" },
  { nom: "Maçonnerie & Carrelage", domaine: "Construction", niveau: "C", pays: "CI", duree: "2 ans", debouches: "Maçon, Carreleur" },
  { nom: "Plomberie & Sanitaire", domaine: "Construction", niveau: "C", pays: "CI", duree: "1 an", debouches: "Plombier, Installateur sanitaire" },
  { nom: "Menuiserie Bois", domaine: "Construction", niveau: "C", pays: "CI", duree: "2 ans", debouches: "Menuisier, Ébéniste" },
  { nom: "Electricité Bâtiment", domaine: "Construction", niveau: "C", pays: "CI", duree: "2 ans", debouches: "Électricien bâtiment" },

  // ÉDUCATION
  { nom: "Enseignement Primaire", domaine: "Éducation", niveau: "B", pays: "CI", duree: "2 ans", debouches: "Instituteur(trice), Maître d'école" },
  { nom: "Enseignement Secondaire", domaine: "Éducation", niveau: "A", pays: "CI", duree: "3 ans", debouches: "Professeur collège/lycée" },
  { nom: "Éducation Préscolaire", domaine: "Éducation", niveau: "B", pays: "CI", duree: "2 ans", debouches: "Éducateur(trice) de jeunes enfants" },
  { nom: "Formation Professionnelle", domaine: "Éducation", niveau: "B", pays: "CI", duree: "2 ans", debouches: "Formateur professionnel, Coach" },

  // TECHNIQUE & INDUSTRIE
  { nom: "Électrotechnique", domaine: "Technique", niveau: "B", pays: "CI", duree: "2 ans", debouches: "Électrotechnicien, Maintenancier" },
  { nom: "Mécanique Automobile", domaine: "Technique", niveau: "C", pays: "CI", duree: "2 ans", debouches: "Mécanicien auto, Technicien garage" },
  { nom: "Climatisation & Froid", domaine: "Technique", niveau: "C", pays: "CI", duree: "1 an", debouches: "Technicien froid, Installateur clim" },
  { nom: "Soudure & Métallurgie", domaine: "Technique", niveau: "C", pays: "CI", duree: "1 an", debouches: "Soudeur, Chaudronnier" },
  { nom: "Électronique Industrielle", domaine: "Technique", niveau: "B", pays: "CI", duree: "2 ans", debouches: "Technicien électronique" },
  { nom: "Maintenance Industrielle", domaine: "Technique", niveau: "B", pays: "CI", duree: "2 ans", debouches: "Maintenancier industriel" },

  // AGRICULTURE
  { nom: "Agronomie & Agriculture", domaine: "Agriculture", niveau: "B", pays: "CI", duree: "3 ans", debouches: "Agronome, Technicien agricole" },
  { nom: "Élevage & Zootechnie", domaine: "Agriculture", niveau: "B", pays: "CI", duree: "2 ans", debouches: "Éleveur, Technicien zootechnicien" },
  { nom: "Agroalimentaire", domaine: "Agriculture", niveau: "B", pays: "CI", duree: "2 ans", debouches: "Technicien agroalimentaire" },
  { nom: "Cacao & Café (Filière CI)", domaine: "Agriculture", niveau: "C", pays: "CI", duree: "1 an", debouches: "Technicien cacaoculture" },
  { nom: "Pêche & Aquaculture", domaine: "Agriculture", niveau: "C", pays: "CI", duree: "1 an", debouches: "Pêcheur professionnel, Aquaculteur" },

  // DROIT & ADMINISTRATION
  { nom: "Droit & Sciences Juridiques", domaine: "Droit", niveau: "A", pays: "CI", duree: "4 ans", debouches: "Juriste, Avocat, Notaire" },
  { nom: "Administration Publique", domaine: "Droit", niveau: "A", pays: "CI", duree: "3 ans", debouches: "Administrateur civil, Fonctionnaire" },
  { nom: "Secrétariat de Direction", domaine: "Droit", niveau: "B", pays: "CI", duree: "2 ans", debouches: "Secrétaire de direction, Assistant(e)" },
  { nom: "Ressources Humaines", domaine: "Droit", niveau: "B", pays: "CI", duree: "2 ans", debouches: "RH, Gestionnaire paie" },

  // BEAUTÉ & BIEN-ÊTRE
  { nom: "Coiffure & Esthétique", domaine: "Beauté", niveau: "C", pays: "CI", duree: "1 an", debouches: "Coiffeur(euse), Esthéticien(ne)" },
  { nom: "Massage & Bien-être", domaine: "Beauté", niveau: "C", pays: "CI", duree: "1 an", debouches: "Masseur, Praticien bien-être" },
  { nom: "Couture & Mode", domaine: "Beauté", niveau: "C", pays: "CI", duree: "2 ans", debouches: "Couturier(ère), Styliste" },

  // TOURISME & HÔTELLERIE
  { nom: "Tourisme & Hôtellerie", domaine: "Tourisme", niveau: "B", pays: "CI", duree: "2 ans", debouches: "Réceptionniste, Guide touristique" },
  { nom: "Restauration & Cuisine", domaine: "Tourisme", niveau: "C", pays: "CI", duree: "1 an", debouches: "Cuisinier, Chef de partie" },
  { nom: "Gestion Hôtelière", domaine: "Tourisme", niveau: "B", pays: "CI", duree: "3 ans", debouches: "Directeur hôtel, Manager F&B" },

  // MÉDIAS & COMMUNICATION
  { nom: "Communication & Médias", domaine: "Médias", niveau: "A", pays: "CI", duree: "3 ans", debouches: "Journaliste, Attaché de presse" },
  { nom: "Audiovisuel & Cinéma", domaine: "Médias", niveau: "A", pays: "CI", duree: "3 ans", debouches: "Réalisateur, Cameraman" },
  { nom: "Design Graphique", domaine: "Médias", niveau: "B", pays: "CI", duree: "2 ans", debouches: "Graphiste, Directeur artistique" },
  { nom: "Photographie", domaine: "Médias", niveau: "C", pays: "CI", duree: "1 an", debouches: "Photographe professionnel" },

  // SOCIAL & HUMANITAIRE
  { nom: "Travail Social", domaine: "Social", niveau: "B", pays: "CI", duree: "2 ans", debouches: "Travailleur social, Éducateur spécialisé" },
  { nom: "Psychologie", domaine: "Social", niveau: "A", pays: "CI", duree: "5 ans", debouches: "Psychologue, Conseiller orientation" },
  { nom: "Développement Communautaire", domaine: "Social", niveau: "B", pays: "CI", duree: "2 ans", debouches: "Animateur communautaire, ONG" },

  // ÉNERGIE & ENVIRONNEMENT
  { nom: "Énergie Solaire & Renouvelable", domaine: "Énergie", niveau: "B", pays: "CI", duree: "2 ans", debouches: "Technicien solaire, Installateur PV" },
  { nom: "Environnement & Écologie", domaine: "Énergie", niveau: "A", pays: "CI", duree: "3 ans", debouches: "Ingénieur environnement, Expert éco" },
  { nom: "Gestion des Déchets", domaine: "Énergie", niveau: "B", pays: "CI", duree: "1 an", debouches: "Technicien traitement déchets" },

  // INFORMEL & ARTISANAT
  { nom: "Teinture & Batik", domaine: "Artisanat", niveau: "C", pays: "CI", duree: "6 mois", debouches: "Artisan teinturier, Créateur tissu" },
  { nom: "Bijouterie & Orfèvrerie", domaine: "Artisanat", niveau: "C", pays: "CI", duree: "1 an", debouches: "Bijoutier, Orfèvre" },
  { nom: "Poterie & Céramique", domaine: "Artisanat", niveau: "C", pays: "CI", duree: "6 mois", debouches: "Potier, Artisan céramiste" },
  { nom: "Peinture en Bâtiment", domaine: "Artisanat", niveau: "C", pays: "CI", duree: "6 mois", debouches: "Peintre en bâtiment" },

  // FINANCE & ASSURANCE
  { nom: "Microfinance & Épargne", domaine: "Finance", niveau: "B", pays: "CI", duree: "1 an", debouches: "Agent microfinance, Conseiller crédit" },
  { nom: "Audit & Contrôle de Gestion", domaine: "Finance", niveau: "A", pays: "CI", duree: "3 ans", debouches: "Auditeur, Contrôleur de gestion" },
  { nom: "Fiscalité & Douanes", domaine: "Finance", niveau: "B", pays: "CI", duree: "2 ans", debouches: "Inspecteur fiscal, Agent douanes" },

  // SPORT
  { nom: "Sport & Éducation Physique", domaine: "Sport", niveau: "B", pays: "CI", duree: "2 ans", debouches: "Coach sportif, Professeur EPS" },
  { nom: "Kinésithérapie Sportive", domaine: "Sport", niveau: "A", pays: "CI", duree: "3 ans", debouches: "Kiné sportif, Préparateur physique" },
];

async function seed() {
  console.log(`🌱 Démarrage du seed — ${FILIERES.length} filières CI\n`);

  // Tentative via endpoint bulk si disponible
  try {
    const res = await fetch(`${API}/filieres/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filieres: FILIERES, pays: 'CI' })
    });
    if (res.ok) {
      console.log('✅ Bulk insert réussi via /filieres/bulk');
      return;
    }
  } catch(e) {
    console.log('ℹ️  Bulk endpoint non disponible, insertion individuelle...\n');
  }

  // Insertion une par une
  let ok = 0, fail = 0;
  for (const f of FILIERES) {
    try {
      const res = await fetch(`${API}/filieres`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(f)
      });
      if (res.ok) {
        ok++;
        console.log(`✅ ${f.nom}`);
      } else {
        const err = await res.text();
        fail++;
        console.log(`❌ ${f.nom} — HTTP ${res.status}: ${err}`);
      }
    } catch(e) {
      fail++;
      console.log(`❌ ${f.nom} — ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 100)); // Évite le rate limiting
  }

  console.log(`\n📊 Résultat: ${ok} insérées, ${fail} échecs sur ${FILIERES.length} filières`);
}

seed();
