// Catalogue du prototype. Chaque information porte son statut :
// "verifie" (source citée), "hypothese" (à confirmer auprès d'un fournisseur).
// Les prix sont des prix de TEST, pas des prix de vente actifs.

export const UNIVERSES = {
  automobile: {
    id: 'automobile',
    name: 'Automobile',
    tagline: 'Une voiture rangée, des trajets plus sereins.',
    page: 'automobile.html',
  },
  equitation: {
    id: 'equitation',
    name: 'Équitation',
    tagline: 'Le matériel organisé, l’esprit libre pour monter.',
    page: 'equitation.html',
  },
};

// availability :
//  - "etude"        : produit physique étudié, non disponible, aucun fournisseur validé
//  - "preparation"  : produit numérique en cours de création
//  - "pret"         : produit numérique terminé ; vendu seulement si CONFIG.digitalCheckoutUrl est renseigné
export const PRODUCTS = [
  {
    id: 'auto-sac-cable-ve',
    universe: 'automobile',
    type: 'physique',
    availability: 'etude',
    name: 'Sac de rangement pour câble de recharge',
    shortName: 'Sac câble de recharge',
    need: 'Le câble de recharge d’une voiture électrique traîne souvent au fond du coffre, sale ou humide, et salit le reste des affaires.',
    benefits: [
      'Garde le câble enroulé et le coffre propre',
      'Se fixe pour éviter qu’il ne glisse pendant le trajet',
      'Se range facilement sous le plancher ou sur le côté du coffre',
    ],
    specs: [
      { label: 'Usage', value: 'Rangement d’un câble de recharge (Type 2 / Mode 2)', status: 'hypothese' },
      { label: 'Matière', value: 'Textile technique déperlant, à confirmer avec le fournisseur', status: 'hypothese' },
      { label: 'Fixation', value: 'Bande auto-agrippante au dos, à confirmer', status: 'hypothese' },
      { label: 'Dimensions', value: 'Non confirmées', status: 'hypothese' },
    ],
    testPrice: 24.9,
    delivery: 'Envisagée depuis un entrepôt européen d’un fournisseur. Aucun fournisseur n’est validé à ce jour.',
    accent: 'auto',
    icon: 'cable',
  },
  {
    id: 'auto-carnet-entretien',
    universe: 'automobile',
    type: 'numerique',
    availability: 'preparation',
    name: 'Carnet d’entretien & suivi des dépenses auto',
    shortName: 'Carnet d’entretien auto',
    need: 'Les factures, vidanges et pleins sont éparpillés : difficile de savoir ce que coûte vraiment la voiture et ce qui arrive à échéance.',
    benefits: [
      'Historique des entretiens et contrôles au même endroit',
      'Suivi des dépenses (carburant ou recharge, assurance, réparations)',
      'Checklist de préparation d’un long trajet',
    ],
    specs: [
      { label: 'Format envisagé', value: 'PDF imprimable A4 + version à remplir sur ordinateur', status: 'hypothese' },
      { label: 'Contenu prévu', value: 'Carnet d’entretien, tableau de dépenses, checklist trajet', status: 'hypothese' },
      { label: 'Disponibilité', value: 'En préparation, non disponible', status: 'verifie' },
    ],
    testPrice: 5.9,
    delivery: 'Téléchargement après achat, quand l’offre sera ouverte.',
    accent: 'auto',
    icon: 'notebook',
  },
  {
    id: 'equi-housse-selle',
    universe: 'equitation',
    type: 'physique',
    availability: 'etude',
    name: 'Housse de transport pour selle',
    shortName: 'Housse de selle',
    need: 'La selle prend la poussière à l’écurie et s’abîme pendant le transport vers les concours ou les stages.',
    benefits: [
      'Protège la selle de la poussière et des rayures',
      'Poignées pour la transporter jusqu’au van',
      'Poche pour ranger étrivières ou sangle',
    ],
    specs: [
      { label: 'Compatibilité', value: 'Selles mixtes et obstacle courantes, à confirmer', status: 'hypothese' },
      { label: 'Matière', value: 'Non confirmée', status: 'hypothese' },
      { label: 'Dimensions', value: 'Non confirmées', status: 'hypothese' },
    ],
    testPrice: 34.9,
    delivery: 'Aucun fournisseur livrant à l’unité n’est identifié à ce jour.',
    accent: 'equi',
    icon: 'saddle',
  },
  {
    id: 'equi-pack-concours',
    universe: 'equitation',
    type: 'numerique',
    availability: 'pret',
    name: 'Pack Concours Serein',
    shortName: 'Pack Concours Serein',
    need: 'La veille d’un concours, on a peur d’oublier un document, une pièce de matériel ou une étape — et on ne sait plus combien coûte vraiment la saison.',
    benefits: [
      'Rétroplanning de J-30 à J-1 pour ne rien oublier',
      'Checklists cheval, cavalier et van, à cocher',
      'Planning du jour J, budget concours et bilan après l’épreuve',
      'Inventaire du matériel avec état et remplacement à prévoir',
    ],
    specs: [
      { label: 'Format', value: 'PDF A4 imprimable, 10 pages, en français', status: 'verifie' },
      { label: 'Ce que vous recevez', value: 'Un fichier PDF à télécharger et à imprimer autant de fois que nécessaire, pour un usage personnel', status: 'verifie' },
      { label: 'Aperçu gratuit', value: 'Checklist du jour J (2 pages)', status: 'verifie' },
    ],
    testPrice: 6.9,
    delivery: 'Téléchargement immédiat après achat, quand la vente sera ouverte.',
    accent: 'equi',
    icon: 'checklist',
    previewUrl: 'downloads/apercu-pack-concours-serein.pdf',
    presentationPage: 'pack-concours.html',
  },
];

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id) || null;
export const productsByUniverse = (universe) => PRODUCTS.filter((p) => p.universe === universe);

export const formatPrice = (value) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);

export const AVAILABILITY_LABELS = {
  etude: 'Étude — non disponible',
  preparation: 'En préparation',
  pret: 'Prêt — vente bientôt ouverte',
};
