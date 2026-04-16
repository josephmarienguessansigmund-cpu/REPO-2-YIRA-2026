const { Client } = require('pg');

const DB_URL = "postgresql://postgres:X2xtU6S%2FnF%23BX%2A@db.tghdpjbhfmgvufbfahef.supabase.co:5432/postgres";

const FILIERES = [
  { nom: "Sciences Infirmières", domaine: "Santé", niveau: "B", pays_code: "CI", duree: "3 ans", debouches: "Infirmier(e), Aide-soignant(e)" },
  { nom: "Sage-Femme", domaine: "Santé", niveau: "B", pays_code: "CI", duree: "3 ans", debouches: "Sage-femme" },
  { nom: "Technicien de Laboratoire", domaine: "Santé", niveau: "B", pays_code: "CI", duree: "2 ans", debouches: "Technicien labo médical" },
  { nom: "Pharmacie Assistance", domaine: "Santé", niveau: "B", pays_code: "CI", duree: "2 ans", debouches: "Préparateur en pharmacie" },
  { nom: "Kinésithérapie", domaine: "Santé", niveau: "A", pays_code: "CI", duree: "4 ans", debouches: "Kinésithérapeute" },
  { nom: "Aide-Soignant", domaine: "Santé", niveau: "C", pays_code: "CI", duree: "1 an", debouches: "Aide-soignant hospitalier" },
  { nom: "Génie Informatique", domaine: "Technologies", niveau: "A", pays_code: "CI", duree: "3 ans", debouches: "Développeur, Ingénieur logiciel" },
  { nom: "Réseaux & Télécommunications", domaine: "Technologies", niveau: "A", pays_code: "CI", duree: "3 ans", debouches: "Ingénieur réseau" },
  { nom: "Cybersécurité", domaine: "Technologies", niveau: "A", pays_code: "CI", duree: "2 ans", debouches: "Analyste sécurité" },
  { nom: "Maintenance Informatique", domaine: "Technologies", niveau: "B", pays_code: "CI", duree: "2 ans", debouches: "Technicien maintenance IT" },
  { nom: "Développement Mobile", domaine: "Technologies", niveau: "B", pays_code: "CI", duree: "1 an", debouches: "Développeur Android/iOS" },
  { nom: "Intelligence Artificielle", domaine: "Technologies", niveau: "A", pays_code: "CI", duree: "2 ans", debouches: "Data Scientist, Ingénieur IA" },
  { nom: "Commerce & Gestion", domaine: "Business", niveau: "A", pays_code: "CI", duree: "3 ans", debouches: "Gestionnaire, Commercial" },
  { nom: "Marketing & Communication", domaine: "Business", niveau: "A", pays_code: "CI", duree: "3 ans", debouches: "Responsable marketing" },
  { nom: "Comptabilité & Finance", domaine: "Business", niveau: "B", pays_code: "CI", duree: "2 ans", debouches: "Comptable, Gestionnaire financier" },
  { nom: "Banque & Assurance", domaine: "Business", niveau: "B", pays_code: "CI", duree: "2 ans", debouches: "Conseiller bancaire" },
  { nom: "Entrepreneuriat & PME", domaine: "Business", niveau: "B", pays_code: "CI", duree: "2 ans", debouches: "Chef d'entreprise" },
  { nom: "Logistique & Transport", domaine: "Business", niveau: "B", pays_code: "CI", duree: "2 ans", debouches: "Logisticien" },
  { nom: "Architecture & BTP", domaine: "Construction", niveau: "A", pays_code: "CI", duree: "5 ans", debouches: "Architecte, Ingénieur BTP" },
  { nom: "Génie Civil", domaine: "Construction", niveau: "A", pays_code: "CI", duree: "3 ans", debouches: "Ingénieur génie civil" },
  { nom: "Maçonnerie & Carrelage", domaine: "Construction", niveau: "C", pays_code: "CI", duree: "2 ans", debouches: "Maçon, Carreleur" },
  { nom: "Plomberie & Sanitaire", domaine: "Construction", niveau: "C", pays_code: "CI", duree: "1 an", debouches: "Plombier" },
  { nom: "Menuiserie Bois", domaine: "Construction", niveau: "C", pays_code: "CI", duree: "2 ans", debouches: "Menuisier, Ébéniste" },
  { nom: "Electricité Bâtiment", domaine: "Construction", niveau: "C", pays_code: "CI", duree: "2 ans", debouches: "Électricien bâtiment" },
  { nom: "Enseignement Primaire", domaine: "Éducation", niveau: "B", pays_code: "CI", duree: "2 ans", debouches: "Instituteur(trice)" },
  { nom: "Enseignement Secondaire", domaine: "Éducation", niveau: "A", pays_code: "CI", duree: "3 ans", debouches: "Professeur collège/lycée" },
  { nom: "Éducation Préscolaire", domaine: "Éducation", niveau: "B", pays_code: "CI", duree: "2 ans", debouches: "Éducateur(trice) jeunes enfants" },
  { nom: "Formation Professionnelle", domaine: "Éducation", niveau: "B", pays_code: "CI", duree: "2 ans", debouches: "Formateur professionnel" },
  { nom: "Électrotechnique", domaine: "Technique", niveau: "B", pays_code: "CI", duree: "2 ans", debouches: "Électrotechnicien" },
  { nom: "Mécanique Automobile", domaine: "Technique", niveau: "C", pays_code: "CI", duree: "2 ans", debouches: "Mécanicien auto" },
  { nom: "Climatisation & Froid", domaine: "Technique", niveau: "C", pays_code: "CI", duree: "1 an", debouches: "Technicien froid" },
  { nom: "Soudure & Métallurgie", domaine: "Technique", niveau: "C", pays_code: "CI", duree: "1 an", debouches: "Soudeur, Chaudronnier" },
  { nom: "Électronique Industrielle", domaine: "Technique", niveau: "B", pays_code: "CI", duree: "2 ans", debouches: "Technicien électronique" },
  { nom: "Maintenance Industrielle", domaine: "Technique", niveau: "B", pays_code: "CI", duree: "2 ans", debouches: "Maintenancier industriel" },
  { nom: "Agronomie & Agriculture", domaine: "Agriculture", niveau: "B", pays_code: "CI", duree: "3 ans", debouches: "Agronome, Technicien agricole" },
  { nom: "Élevage & Zootechnie", domaine: "Agriculture", niveau: "B", pays_code: "CI", duree: "2 ans", debouches: "Éleveur, Zootechnicien" },
  { nom: "Agroalimentaire", domaine: "Agriculture", niveau: "B", pays_code: "CI", duree: "2 ans", debouches: "Technicien agroalimentaire" },
  { nom: "Cacao & Café", domaine: "Agriculture", niveau: "C", pays_code: "CI", duree: "1 an", debouches: "Technicien cacaoculture" },
  { nom: "Pêche & Aquaculture", domaine: "Agriculture", niveau: "C", pays_code: "CI", duree: "1 an", debouches: "Pêcheur professionnel" },
  { nom: "Droit & Sciences Juridiques", domaine: "Droit", niveau: "A", pays_code: "CI", duree: "4 ans", debouches: "Juriste, Avocat" },
  { nom: "Administration Publique", domaine: "Droit", niveau: "A", pays_code: "CI", duree: "3 ans", debouches: "Administrateur civil" },
  { nom: "Secrétariat de Direction", domaine: "Droit", niveau: "B", pays_code: "CI", duree: "2 ans", debouches: "Secrétaire de direction" },
  { nom: "Ressources Humaines", domaine: "Droit", niveau: "B", pays_code: "CI", duree: "2 ans", debouches: "RH, Gestionnaire paie" },
  { nom: "Coiffure & Esthétique", domaine: "Beauté", niveau: "C", pays_code: "CI", duree: "1 an", debouches: "Coiffeur(euse), Esthéticien(ne)" },
  { nom: "Massage & Bien-être", domaine: "Beauté", niveau: "C", pays_code: "CI", duree: "1 an", debouches: "Masseur, Praticien bien-être" },
  { nom: "Couture & Mode", domaine: "Beauté", niveau: "C", pays_code: "CI", duree: "2 ans", debouches: "Couturier(ère), Styliste" },
  { nom: "Tourisme & Hôtellerie", domaine: "Tourisme", niveau: "B", pays_code: "CI", duree: "2 ans", debouches: "Réceptionniste, Guide touristique" },
  { nom: "Restauration & Cuisine", domaine: "Tourisme", niveau: "C", pays_code: "CI", duree: "1 an", debouches: "Cuisinier, Chef de partie" },
  { nom: "Gestion Hôtelière", domaine: "Tourisme", niveau: "B", pays_code: "CI", duree: "3 ans", debouches: "Directeur hôtel" },
  { nom: "Communication & Médias", domaine: "Médias", niveau: "A", pays_code: "CI", duree: "3 ans", debouches: "Journaliste, Attaché de presse" },
  { nom: "Audiovisuel & Cinéma", domaine: "Médias", niveau: "A", pays_code: "CI", duree: "3 ans", debouches: "Réalisateur, Cameraman" },
  { nom: "Design Graphique", domaine: "Médias", niveau: "B", pays_code: "CI", duree: "2 ans", debouches: "Graphiste, Directeur artistique" },
  { nom: "Photographie", domaine: "Médias", niveau: "C", pays_code: "CI", duree: "1 an", debouches: "Photographe professionnel" },
  { nom: "Travail Social", domaine: "Social", niveau: "B", pays_code: "CI", duree: "2 ans", debouches: "Travailleur social" },
  { nom: "Psychologie", domaine: "Social", niveau: "A", pays_code: "CI", duree: "5 ans", debouches: "Psychologue, Conseiller orientation" },
  { nom: "Développement Communautaire", domaine: "Social", niveau: "B", pays_code: "CI", duree: "2 ans", debouches: "Animateur communautaire" },
  { nom: "Énergie Solaire & Renouvelable", domaine: "Énergie", niveau: "B", pays_code: "CI", duree: "2 ans", debouches: "Technicien solaire" },
  { nom: "Environnement & Écologie", domaine: "Énergie", niveau: "A", pays_code: "CI", duree: "3 ans", debouches: "Ingénieur environnement" },
  { nom: "Gestion des Déchets", domaine: "Énergie", niveau: "B", pays_code: "CI", duree: "1 an", debouches: "Technicien traitement déchets" },
  { nom: "Teinture & Batik", domaine: "Artisanat", niveau: "C", pays_code: "CI", duree: "6 mois", debouches: "Artisan teinturier" },
  { nom: "Bijouterie & Orfèvrerie", domaine: "Artisanat", niveau: "C", pays_code: "CI", duree: "1 an", debouches: "Bijoutier, Orfèvre" },
  { nom: "Poterie & Céramique", domaine: "Artisanat", niveau: "C", pays_code: "CI", duree: "6 mois", debouches: "Potier, Artisan céramiste" },
  { nom: "Peinture en Bâtiment", domaine: "Artisanat", niveau: "C", pays_code: "CI", duree: "6 mois", debouches: "Peintre en bâtiment" },
  { nom: "Microfinance & Épargne", domaine: "Finance", niveau: "B", pays_code: "CI", duree: "1 an", debouches: "Agent microfinance" },
  { nom: "Audit & Contrôle de Gestion", domaine: "Finance", niveau: "A", pays_code: "CI", duree: "3 ans", debouches: "Auditeur, Contrôleur de gestion" },
  { nom: "Fiscalité & Douanes", domaine: "Finance", niveau: "B", pays_code: "CI", duree: "2 ans", debouches: "Inspecteur fiscal" },
  { nom: "Sport & Éducation Physique", domaine: "Sport", niveau: "B", pays_code: "CI", duree: "2 ans", debouches: "Coach sportif, Professeur EPS" },
  { nom: "Kinésithérapie Sportive", domaine: "Sport", niveau: "A", pays_code: "CI", duree: "3 ans", debouches: "Kiné sportif" },
];

async function seed() {
  const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
  
  try {
    await client.connect();
    console.log('✅ Connecté à Supabase\n');

    // Vérifie les tables disponibles
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' ORDER BY table_name
    `);
    console.log('📋 Tables:', tables.rows.map(r => r.table_name).join(', '), '\n');

    // Cherche la table filieres
    const tableNames = tables.rows.map(r => r.table_name);
    const filieresTable = tableNames.find(t => t.includes('filiere') || t.includes('formation'));
    
    if (!filieresTable) {
      console.log('⚠️  Table filieres introuvable. Création...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS filieres (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          nom VARCHAR(255) NOT NULL,
          domaine VARCHAR(100),
          niveau VARCHAR(10),
          pays_code VARCHAR(5) DEFAULT 'CI',
          duree VARCHAR(50),
          debouches TEXT,
          actif BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log('✅ Table filieres créée\n');
    }

    const table = filieresTable || 'filieres';
    console.log(`📥 Insertion dans la table: ${table}\n`);

    let ok = 0, fail = 0;
    for (const f of FILIERES) {
      try {
        await client.query(
          `INSERT INTO ${table} (nom, domaine, niveau, pays_code, duree, debouches) 
           VALUES ($1, $2, $3, $4, $5, $6) 
           ON CONFLICT (nom) DO NOTHING`,
          [f.nom, f.domaine, f.niveau, f.pays_code, f.duree, f.debouches]
        );
        ok++;
        console.log(`✅ ${f.nom}`);
      } catch(e) {
        // Essai sans ON CONFLICT
        try {
          await client.query(
            `INSERT INTO ${table} (nom, domaine, niveau, pays_code, duree, debouches) VALUES ($1, $2, $3, $4, $5, $6)`,
            [f.nom, f.domaine, f.niveau, f.pays_code, f.duree, f.debouches]
          );
          ok++;
          console.log(`✅ ${f.nom}`);
        } catch(e2) {
          fail++;
          console.log(`❌ ${f.nom} — ${e2.message}`);
        }
      }
    }

    console.log(`\n📊 Résultat: ${ok} insérées, ${fail} échecs sur ${FILIERES.length} filières`);

  } catch(e) {
    console.error('❌ Erreur connexion:', e.message);
  } finally {
    await client.end();
  }
}

seed();
