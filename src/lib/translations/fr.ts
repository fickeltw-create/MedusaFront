export interface StatItem {
  title: string;
  value: string;
  desc: string;
}

export interface StatsCard {
  title: string;
  description: string;
}

export interface StatsSection {
  badge: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  paragraph4: string;
  cards: StatsCard[];
  exploreModels: string;
  requestQuote: string;
}

export interface StatsNumbers {
    houses: string;
    countries: string;
    savings: string;
    satisfaction: string;
  }

export interface Translations {
  statsSection: StatsSection;
  statsNumbers: StatsNumbers;
  nav: {
    home: string;
    catalogue: string;
    configurateur: string;
    financement: string;
    energie: string;
    distributeurs: string;
    faq: string;
    contact: string;
    devis: string;
    promotion: string;
    langFr: string;
    langNl: string;
    langEn: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    subtitle: string;
    cta1: string;
    cta2: string;
    badge: string;
  };
  why: {
    title: string;
    subtitle: string;
    items: Array<{ title: string; desc: string }>;
  };
  stats: {
    badge: string;
    title: string;
    paragraphs: string[];
    cards: Array<{ title: string; desc: string }>;
    cta1: string;
    cta2: string;
  };
  catalog: {
    catalogTitle: string;
    catalogSubtitle: string;
    catalogCta: string;
    ctaTitle: string;
    ctaSubtitle: string;
    configure: string;
    exploreModels: string;
    viewAll: string;
    from: string;
    perMonth: string;
    size: string;
    models: string;
    previewBadge: string;
    previewTitle: string;
    boutiqueTitle: string;
    boutiqueSubtitle: string;
    visitShop: string;
    discover: string;
    marketPrice: string;
    ourPrice: string;
    financing: string;
    months: string;
    reserve: string;
    download: string;
    features: string;
    specs: string;
    delivery: string;
    stockDelivery: string;
    factoryDelivery: string;
    discount: string;
    marketPriceLabel: string;
    ourPriceLabel: string;
    financingLabel: string;
    newLabel: string;
    gallery: string;
    floorPlan: string;
    video: string;
    techSpecs: string;
  };
  models: any;
  configurator: any;
  financing: any;
  energy: {
    title: string;
    subtitle: string;
    addToHouse: string;
    learnMore: string;
    stats: StatItem[];
    products: any;
  };
  faq: {
    title: string;
    subtitle: string;
    search: string;
    filters: {
      all: string;
      technical: string;
      delivery: string;
      financing: string;
      warranty: string;
      legal: string;
    };
    noAnswer: string;
    contactTeam: string;
    contactUs: string;
    items: Array<{ q: string; a: string }>;
  };
  testimonials: {
    title: string;
    items: Array<{
      name: string;
      role: string;
      text: string;
      rating: number;
    }>;
  };
  distributeurs: any;
  promotions: {
    exclusiveOffers: string;
    heroDescription: string;
    discoverOffer: string;
    needMoreInfo: string;
    ctaDescription: string;
    home: string;
    promotions: string;
    promotionStudentHousing: string;
    heroHeadline: string;
    heroDescriptionDetail: string;
    viewFinancing: string;
    seeTheHouse: string;
    size: string;
    price: string;
    delivery: string;
    floorPlanTopView: string;
    livingSurface: string;
    structure: string;
    structureValue: string;
    certification: string;
    certificationValue: string;
    deliveryLabel: string;
    squareMeters: string;
    oneWeek: string;
    weeks: string;
    houseDescription: string;
    process: string;
    howItWorks: string;
    processDescription: string;
    reserve: string;
    reserveDesc: string;
    prepare: string;
    prepareDesc: string;
    deliver: string;
    deliverDesc: string;
    enjoy: string;
    enjoyDesc: string;
    limitedOffer: string;
    discount: string;
    fastDelivery: string;
    deliveryWeeks: string;
    warranty: string;
    warrantyYears: string;
    premiumQuality: string;
    durableMaterials: string;
    turnkey: string;
    readyToLive: string;
    bookNow: string;
    requestQuote: string;
    depositToReserve: string;
    financing: string;
    accessibleMonthlyPayments: string;
    financingDescription: string;
    formula: string;
    monthlyPayment: string;
    duration: string;
    classic: string;
    extended: string;
    longterm: string;
    months: string;
    readyToStart: string;
    contactUs: string;
    securePayment: string;
    fullyRefundableDeposit: string;
    warranty10Years: string;
    frenchBuilder: string;
    fastDeliveryShort: string;
    weeksOnly: string;
  };
  contact: {
    title: string;
    subtitle: string;
    generalContact: string;
    generalContactDesc: string;
    requestQuote: string;
    requestQuoteDesc: string;
    becomeDistributor: string;
    becomeDistributorDesc: string;
    becomeInstaller: string;
    becomeInstallerDesc: string;
    formTypes: {
      contact: { label: string; desc: string };
      quote: { label: string; desc: string };
      distributor: { label: string; desc: string };
      installer: { label: string; desc: string };
    };
    form: any;
    info: any;
  };
  cta: {
    title: string;
    subtitle: string;
    reserve: string;
    quote: string;
  };
  footer: {
    slogan: string;
    quickLinks: string;
    links: {
      company: string;
      about: string;
      careers: string;
      press: string;
      products: string;
      catalog: string;
      configurator: string;
      energy: string;
      services: string;
      financing: string;
      installation: string;
      distributor: string;
      legal: string;
      privacy: string;
      terms: string;
    };
    rights: string;
    belgium: string;
  };
  forms: any;
};

const fr: Translations = {
  nav: {
    home: 'Accueil',
    catalogue: 'Catalogue',
    configurateur: 'Configurateur',
    financement: 'Financement',
    energie: 'Éco+',
    distributeurs: 'Distributeurs',
    faq: 'FAQ',
    contact: 'Contact',
    devis: 'Demander un devis',
    promotion: 'Promotions',
    langFr: 'Français',
    langNl: 'Nederlands',
    langEn: 'English',
  },
  hero: {
    headline: 'Votre maison modulaire en quelques semaines',
    subheadline: 'Design moderne, livraison rapide, prix transparents.',
    subtitle: 'Maison à ossature métallique • design moderne • livraison rapide',
    cta1: 'Découvrir les modèles',
    cta2: 'Demander un devis',
    badge: 'Livraison 8–12 semaines',
  },
  stats: {
    badge: 'À propos de Modura',
    title: 'Constructeur de maisons à ossature métallique : une expertise premium au service de votre projet',
    paragraphs: [
      'Modura conçoit et fabrique des maisons modulaires à ossature métallique pour des projets résidentiels modernes, durables et parfaitement intégrés à leur environnement.',
      'Notre équipe réunit architectes, ingénieurs et professionnels de la construction autour d’une vision claire : créer des maisons performantes, esthétiques et livrées avec une qualité de fabrication élevée.',
      'Nous accompagnons chaque projet depuis la conception jusqu’à la livraison, avec un fort accent sur la personnalisation, la rapidité de mise en œuvre et la conformité technique.',
      'Chez Modura, chaque maison est pensée comme une solution de construction modulaire certifiée, et non comme un container maritime réhabilité.'
    ],
    cards: [
      {
        title: 'Architectes et designers',
        desc: 'Des maisons à ossature métallique modernes, élégantes et pensées pour un confort optimal au quotidien.'
      },
      {
        title: 'Ingénieurs et planning',
        desc: 'Une organisation précise pour garantir une construction modulaire performante, rapide et maîtrisée.'
      },
      {
        title: 'Équipe de chantier',
        desc: 'Des professionnels expérimentés pour une mise en œuvre fiable, propre et conforme aux standards de qualité.'
      },
      {
        title: 'Maisons certifiées',
        desc: 'Modura développe des maisons modulaires certifiées à ossature métallique, conçues pour durer et répondre aux attentes du marché.'
      }
    ],
    cta1: 'Explorer les modèles',
    cta2: 'Demander un devis'
  },
  why: {
    title: 'Pourquoi choisir MODURA ?',
    subtitle: 'Une nouvelle façon de devenir propriétaire, simple et accessible.',
    items: [
      { title: 'Livraison Rapide', desc: 'Stock disponible en 1 semaine, fabrication sur commande en 8–12 semaines.' },
      { title: 'Prix Accessibles', desc: 'Jusqu\'à 50% moins cher que le marché traditionnel. Financement disponible.' },
      { title: 'Écologique', desc: 'Construction durable, matériaux responsables, options solaires intégrées.' },
      { title: 'Fabrication Moderne', desc: 'Conçu en usine avec précision, livré prêt à installer sur votre terrain.' },
      { title: 'Garantie Constructeur', desc: 'Garantie complète sur toutes nos maisons. Service après-vente dédié.' },
      { title: 'Personnalisable', desc: 'Configurez votre maison : couleurs, toit, énergie, selon vos besoins.' },
    ],
  },
  statsNumbers: {
    houses: 'Maisons livrées',
    countries: 'Pays couverts',
    savings: 'D\'économies vs marché',
    satisfaction: 'Satisfaction client',
  },
  catalog: {
    catalogTitle: 'Le Catalogue Modura',
    catalogSubtitle: 'Parcourez la collection officielle de modèles Modura — des modèles pensés et fabriqués pour la qualité et la durabilité.',
    catalogCta: 'Explorer les modèles',
    ctaTitle: 'Créez votre maison sur mesure',
    ctaSubtitle: 'Configurez chaque détail et visualisez en temps réel.',
    configure: 'Configurer',
    exploreModels: 'Explorer les modèles',
    previewBadge: 'Modèles premium',
    previewTitle: 'Les modèles Modura',
    visitShop: 'Visiter notre boutique',
    boutiqueTitle: 'Complétez votre projet avec la Boutique Modura',
    boutiqueSubtitle: 'Retrouvez les accessoires, options et services pour finaliser votre modèle directement dans la Boutique Modura.',
    viewAll: 'Voir tout le catalogue',
    from: 'À partir de',
    perMonth: '/mois',
    size: 'Surface',
    models: 'modèle(s)',
    discover: 'Découvrir',
    marketPrice: 'Prix du marché',
    ourPrice: 'Notre prix',
    financing: 'Financement',
    months: 'mois',
    reserve: 'Réserver maintenant',
    download: 'Télécharger la brochure',
    features: 'Caractéristiques',
    specs: 'Spécifications',
    delivery: 'Livraison',
    stockDelivery: '1 semaine (stock)',
    factoryDelivery: '8–12 semaines (sur commande)',
    discount: 'de remise',
    marketPriceLabel: 'Prix du marché',
    ourPriceLabel: 'Notre prix',
    financingLabel: 'Financement',
    newLabel: 'Nouveau',
    gallery: 'Galerie photos',
    floorPlan: 'Plan d\'étage',
    video: 'Vidéo de présentation',
    techSpecs: 'Fiche technique',
  },
  models: {
    student: {
      name: 'Maison Étudiante',
      tagline: 'Idéale pour étudiants et location Airbnb',
      features: ['Studio', 'Salle de bain', 'Kitchenette', 'Logement étudiant', 'Usage Airbnb'],
      description: 'La solution parfaite pour les étudiants cherchant leur indépendance ou les investisseurs souhaitant générer des revenus locatifs. Compacte, moderne et entièrement équipée.',
    },
    tiny: {
      name: 'Tiny House',
      tagline: 'Propriétaire pour moins que votre loyer',
      features: ['1 chambre', 'Salle de bain', 'Séjour', 'Cuisine'],
      description: 'Compacte, intelligente et prête à vivre. Cette maison modulaire de 40 m² allie design moderne et espace de vie fonctionnel. Que vous soyez étudiant cherchant votre premier logement indépendant, jeune professionnel voulant arrêter de payer un loyer ou investisseur à la recherche d\'un bien locatif à haut rendement, cette maison vous apporte valeur, qualité et rapidité. Construction à ossature acier durable, certifiée CE, et livrée sur votre terrain en quelques semaines.',
    },
    apartment: {
      name: 'Maison Appartement',
      tagline: 'Le parfait équilibre entre espace et budget',
      features: ['2 chambres', 'Salle de bain', 'Séjour', 'Salle à manger'],
      description: "Le parfait équilibre entre espace et budget. Cette maison appartement de 60 m² offre deux chambres spacieuses, une cuisine fonctionnelle et une agencement intelligent qui optimise chaque mètre carré. Que vous soyez une jeune famille à la recherche de sa première maison, un professionnel souhaitant investir dans l'immobilier, ou simplement quelqu'un qui veut plus d'espace sans payer le prix fort — cette maison est la solution idéale. Structure en acier durable, certifiée CE et livrée en quelques semaines.",
    },
    family: {
      name: 'Maison Familiale',
      tagline: 'L\'espace que votre famille mérite',
      features: ['4 chambres', '2 salles de bain', 'Grande cuisine', 'Espaces de vie généreux'],
      description: 'L\'espace que votre famille mérite. Cette maison familiale de 120 m² offre quatre chambres spacieuses, deux salles de bain modernes et de généreux espaces de vie conçus pour des moments de qualité en famille. Que vous soyez une famille nombreuse ayant besoin de place pour tout le monde, ou que vous refusiez simplement de faire des compromis sur le confort et la qualité — cette maison est faite pour vous. Construite avec une structure en acier durable, certifiée CE et finie aux normes les plus élevées. Plus de location. Plus d\'attente. L\'avenir de votre famille commence ici.',
    },
    capsule: {
      name: 'Capsule Spatiale',
      tagline: 'Un habitat non conventionnel pour les audacieux',
      features: ['40 m²', '1 chambre', 'Structure en acier', 'Design futuriste', 'Idéal pour nomades', 'Vie minimaliste'],
      description: 'Un habitat non conventionnel pour les audacieux. La Space Capsule n\'est pas qu\'une maison — c\'est une déclaration. Conçue pour ceux qui pensent différemment, cet espace de vie modulaire de 40 m² allie une esthétique futuriste à une fonctionnalité pratique. Parfait pour les nomades digitaux, les minimalistes, ou comme investissement Airbnb unique. Construite avec une structure en acier durable, certifiée CE et finie aux normes les plus élevées. Sortez du lot. Vivez autrement.',
    },
  },
  configurator: {
    title: 'Configurez Votre Maison',
    subtitle: 'Personnalisez chaque détail et obtenez votre prix en temps réel.',
    open3D: 'Ouvrir le configurateur 3D',
    selectModel: 'Choisissez votre modèle',
    ourModels: 'Nos modèles :',
    edit: 'Modifier',
    summary: 'Récapitulatif',
    base: 'Base',
    exterior: 'Revêtement extérieur',
    roof: 'Type de toit',
    energy: 'Solutions énergétiques',
    climate: 'Climatisation',
    basePrice: 'Prix de base',
    options: 'Options sélectionnées',
    total: 'Prix total',
    getQuote: 'Obtenir mon devis',
    sizeFilters: {
      all: 'Tous',
      compact: 'Compact (≤20 m²)',
      medium: 'Moyen (20–60 m²)',
      large: 'Grand (>60 m²)',
    },
    months: 'mois',
    perMonth: '/mois',
    included: 'Inclus',
    exteriorOptions: {
      'blanc-mat': 'Blanc Mat',
      'anthracite': 'Anthracite',
      'bois-brule': 'Bois Brûlé',
      'chene-naturel': 'Chêne Naturel',
    },
    roofOptions: {
      flat: 'Toit plat',
      pitched: 'Pente moderne',
      metal: 'Métal premium',
    },
    energyOptions: {
      solar5: 'Kit solaire 5kW',
      solar10: 'Kit solaire 10kW',
      battery: 'Batteries',
      rainwater: 'Récupération eau pluie',
    },
    climateOptions: {
      ventilation: 'Ventilation',
      heating: 'Chauffage',
      cooling: 'Climatisation',
    },
    steps: {
      model: 'Modèle',
      exterior: 'Extérieur',
      energy: 'Énergie',
      quote: 'Devis',
    },
  },
  financing: {
    title: 'Calculateur de Financement',
    subtitle: 'Calculez vos mensualités en temps réel et trouvez la formule adaptée.',
    annualRate: 'Taux annuel',
    aprNote: 'Taux annuel effectif global indicatif',
    maxDuration: 'Durée maximum',
    maxPayments: '420 mensualités maximum',
    minDeposit: 'Acompte minimum',
    reserveText: 'Pour réserver votre maison',
    rate: '3,9%',
    maxYears: '35 ans',
    minDepositAmount: '1.000€',
    selectHouse: 'Choisissez votre maison',
    deposit: 'Apport personnel',
    duration: 'Durée du financement',
    monthlyPayment: 'Mensualité estimée',
    totalCost: 'Coût total',
    totalInterest: 'Intérêts totaux',
    requestFinancing: 'Demander un financement',
    monthly: '/mois',
    years: 'ans',
    months: 'mois',
    monthlyByDuration: 'Mensualité selon la durée',
    summaryHouse: 'Maison',
    summaryPrice: 'Prix',
    summaryDeposit: 'Apport',
    summaryMonthly: 'Mensualité',
  },
  energy: {
    title: 'Solutions Énergétiques',
    subtitle: 'Rendez votre maison modulaire encore plus écologique et économique.',
    addToHouse: 'Ajouter à ma maison',
    learnMore: 'En savoir plus',
    stats: [
      { title: 'Économies annuelles', value: 'jusqu\'à 2.400€', desc: 'Avec un kit solaire 10kW' },
      { title: 'Retour sur investissement', value: '4–7 ans', desc: 'Selon consommation et ensoleillement' },
      { title: 'Garantie panneaux', value: '25 ans', desc: 'Performance garantie à 80%' },
    ],
    products: {
      solar5: {
        name: 'Kit Solaire 5kW',
        desc: 'Production d\'énergie solaire pour couvrir vos besoins quotidiens. Idéal pour les petites et moyennes maisons.',
      },
      solar10: {
        name: 'Kit Solaire 10kW',
        desc: 'Puissance maximale pour une autonomie énergétique complète. Adapté aux grandes maisons.',
      },
      heating: {
        name: 'Système Chauffage & Climatisation',
        desc: 'Pompe à chaleur air/air ultra-efficace. Chauffez en hiver, rafraîchissez en été.',
      },
      ventilation: {
        name: 'Système de Ventilation',
        desc: 'VMC double flux avec récupération de chaleur. Air sain et économies d\'énergie.',
      },
      rainwater: {
        name: 'Récupération Eau de Pluie',
        desc: 'Système de récupération et filtration de l\'eau de pluie pour usage domestique.',
      },
    },
  },
  statsSection: {
    badge: 'À propos de Modura',
    title: 'Constructeur de maisons à ossature métallique : une expertise premium au service de votre projet',
    paragraph1: 'Modura conçoit et fabrique des maisons modulaires à ossature métallique pour des projets résidentiels modernes, durables et parfaitement intégrés à leur environnement.',
    paragraph2: 'Notre équipe réunit architectes, ingénieurs et professionnels de la construction autour d’une vision claire : créer des maisons performantes, esthétiques et livrées avec une qualité de fabrication élevée.',
    paragraph3: 'Nous accompagnons chaque projet depuis la conception jusqu’à la livraison, avec un fort accent sur la personnalisation, la rapidité de mise en œuvre et la conformité technique.',
    paragraph4: 'Chez Modura, chaque maison est pensée comme une solution de construction modulaire certifiée, et non comme un container maritime réhabilité.',
    cards: [
      {
        title: 'Architectes et designers',
        description: 'Des maisons à ossature métallique modernes, élégantes et pensées pour un confort optimal au quotidien.'
      },
      {
        title: 'Ingénieurs et planning',
        description: 'Une organisation précise pour garantir une construction modulaire performante, rapide et maîtrisée.'
      },
      {
        title: 'Équipe de chantier',
        description: 'Des professionnels expérimentés pour une mise en œuvre fiable, propre et conforme aux standards de qualité.'
      },
      {
        title: 'Maisons certifiées',
        description: 'Modura développe des maisons modulaires certifiées à ossature métallique, conçues pour durer et répondre aux attentes du marché.'
      }
    ],
    exploreModels: 'Explorer les modèles',
    requestQuote: 'Demander un devis'
  },
  testimonials: {
    title: 'Ce que disent nos clients',
    items: [
      {
        name: 'Sophie Lecomte',
        role: 'Étudiante, Bruxelles',
        text: 'J\'ai acheté la maison étudiante pour mes études et c\'est la meilleure décision de ma vie. Payer 300€/mois au lieu d\'un loyer, c\'est révolutionnaire !',
        rating: 5,
      },
      {
        name: 'Marc Dubois',
        role: 'Investisseur, Liège',
        text: 'J\'ai commandé 3 tiny houses pour de la location saisonnière. La qualité est impeccable et les délais ont été respectés. ROI excellent.',
        rating: 5,
      },
      {
        name: 'Familie Van den Berg',
        role: 'Familie, Gent',
        text: 'We waren sceptisch maar de kwaliteit van de Family House overtrof al onze verwachtingen. Binnen 10 weken hadden we ons droomhuis!',
        rating: 5,
      },
      {
        name: 'Pierre Martin',
        role: 'Entrepreneur, Namur',
        text: 'La Space Capsule est incroyable. Mes clients adorent séjourner dans cette maison futuriste. C\'est un investissement très rentable pour l\'Airbnb premium.',
        rating: 5,
      },
    ],
  },
  faq: {
    title: 'Questions Fréquentes',
    subtitle: 'Tout ce que vous devez savoir sur les maisons modulaires MODURA.',
    search: 'Rechercher une question...',
    filters: {
      all: 'Tous',
      technical: 'Technique',
      delivery: 'Livraison',
      financing: 'Financement',
      warranty: 'Garantie',
      legal: 'Légal',
    },
    noAnswer: "Vous n'avez pas trouvé votre réponse ?",
    contactTeam: 'Notre équipe répond à toutes vos questions sous 24h.',
    contactUs: 'Nous contacter',
    items: [
      {
        q: 'Qu\'est-ce qu\'une maison modulaire ?',
        a: 'Une maison modulaire est fabriquée en usine en sections (modules), puis transportée et assemblée sur votre terrain. Cette méthode offre une qualité supérieure, des délais plus courts et des coûts réduits par rapport à la construction traditionnelle.',
      },
      {
        q: 'Quels sont les délais de livraison ?',
        a: 'Pour les modèles en stock, la livraison est possible sous 1 semaine. Pour les commandes sur mesure, comptez 8 à 12 semaines à partir de la confirmation de commande.',
      },
      {
        q: 'Ai-je besoin d\'un permis de construire ?',
        a: 'Oui, dans la plupart des cas un permis de construire est nécessaire. Nous vous accompagnons dans les démarches administratives et pouvons vous mettre en contact avec des experts locaux.',
      },
      {
        q: 'Quelle est la durabilité d\'une maison MODURA ?',
        a: 'Nos maisons sont conçues pour durer plus de 50 ans avec un entretien minimal. Elles résistent aux conditions climatiques belges et sont conformes aux normes de construction européennes.',
      },
      {
        q: 'Puis-je personnaliser ma maison ?',
        a: 'Absolument ! Utilisez notre configurateur en ligne pour choisir le revêtement extérieur, le type de toit, les solutions énergétiques et bien plus encore. Nous pouvons également créer des configurations sur mesure.',
      },
      {
        q: 'Comment fonctionne le financement ?',
        a: 'Nous proposons des solutions de financement flexibles sur 120 ou 420 mois selon le modèle. Le taux d\'intérêt annuel est de 3,9%. Un acompte de 1.000€ est requis pour réserver votre maison.',
      },
      {
        q: 'Que comprend la garantie ?',
        a: 'Toutes nos maisons bénéficient d\'une garantie constructeur de 10 ans sur la structure et de 2 ans sur les équipements. Notre service après-vente est disponible 7j/7.',
      },
      {
        q: 'Peut-on installer une maison MODURA partout en Belgique ?',
        a: 'Oui, nous livrons et installons dans toute la Belgique, la France et les Pays-Bas. Notre réseau d\'installateurs certifiés garantit une installation professionnelle sur l\'ensemble du territoire.',
      },
    ],
  },
  contact: {
    title: 'Contactez-nous',
    subtitle: 'Notre équipe est disponible pour répondre à toutes vos questions.',
    generalContact: 'Contact général',
    generalContactDesc: 'Une question, un renseignement',
    requestQuote: 'Demander un devis',
    requestQuoteDesc: 'Recevoir un devis personnalisé',
    becomeDistributor: 'Devenir distributeur',
    becomeDistributorDesc: 'Rejoindre notre réseau',
    becomeInstaller: 'Devenir installateur',
    becomeInstallerDesc: 'Proposer vos services',
    formTypes: {
      contact: { label: 'Contact général', desc: 'Une question, un renseignement' },
      quote: { label: 'Demander un devis', desc: 'Recevoir un devis personnalisé' },
      distributor: { label: 'Devenir distributeur', desc: 'Rejoindre notre réseau' },
      installer: { label: 'Devenir installateur', desc: 'Proposer vos services' },
    },
    form: {
      name: 'Nom complet',
      email: 'Email',
      phone: 'Téléphone',
      subject: 'Sujet',
      message: 'Message',
      send: 'Envoyer le message',
      newMessage: 'Nouveau message',
      successTitle: 'Message envoyé !',
      success: 'Votre message a bien été envoyé. Nous vous répondons dans les 24h.',
      error: 'Une erreur est survenue. Veuillez réessayer.',
    },
    info: {
      addressLabel: 'Adresse',
      address: 'Belgique',
      phoneLabel: 'Téléphone',
      phone: '+32 (0) 472 72 34 76',
      emailLabel: 'Email',
      email: 'info@modura.be',
      hoursLabel: 'Horaires',
      hours: 'Lun–Ven: 9h–18h',
    },
  },
  distributeurs: {
    title: 'Devenir Distributeur',
    subtitle: 'Rejoignez notre réseau de distributeurs et installez des maisons MODURA.',
    howItWorks: 'Comment ça marche',
    partners: 'Nos Partenaires',
    steps: [
      {
        number: '01',
        title: 'Candidature',
        desc: 'Remplissez le formulaire de candidature en ligne',
      },
      {
        number: '02',
        title: 'Formation',
        desc: 'Formation de 2 jours sur nos produits et process',
      },
      {
        number: '03',
        title: 'Certification',
        desc: 'Obtenez votre certificat partenaire officiel',
      },
      {
        number: '04',
        title: 'Ventes',
        desc: 'Commencez à vendre et générez des revenus',
      },
   ],
    benefits: ['33% de remise sur tous les modèles', 'Formation et support dédiés', 'Accès au portail distributeur', 'Leads qualifiés dans votre région', 'Matériaux marketing exclusifs'],
    form: {
      company: 'Société',
      name: 'Nom complet',
      email: 'Email professionnel',
      phone: 'Téléphone',
      region: 'Région',
      type: 'Type de partenariat',
      typeOptions: ['Distributeur', 'Installateur', 'Apporteur d\'affaires'],
      message: 'Présentez votre projet',
      submit: 'Soumettre ma candidature',
    },
    portal: {
      title: 'Portail Distributeur',
      welcome: 'Bienvenue',
      dashboard: 'Tableau de bord',
      leads: 'Mes Leads',
      commissions: 'Commissions',
      downloads: 'Téléchargements',
      marketing: 'Marketing',
      login: 'Se connecter',
      email: 'Email',
      password: 'Mot de passe',
    },
  },
  cta: {
    title: 'Prêt à devenir propriétaire ?',
    subtitle: 'Réservez votre maison dès aujourd\'hui avec un acompte de 1.000€.',
    reserve: 'Réserver pour 1.000€',
    quote: 'Demander un devis gratuit',
  },
  footer: {
    slogan: 'Des maisons modulaires modernes accessibles à tous.',
    quickLinks: 'Liens rapides',
    links: {
      company: 'Société',
      about: 'À propos',
      careers: 'Carrières',
      press: 'Presse',
      products: 'Produits',
      catalog: 'Catalogue',
      configurator: 'Configurateur',
      energy: 'Énergie',
      services: 'Services',
      financing: 'Financement',
      installation: 'Installation',
      distributor: 'Devenir distributeur',
      legal: 'Mentions légales',
      privacy: 'Confidentialité',
      terms: 'CGV',
    },
    rights: 'Tous droits réservés.',
    belgium: 'Belgique',
  },
  forms: {
    quote: {
      title: 'Demander un devis',
      subtitle: 'Recevez votre devis personnalisé sous 24h.',
      name: 'Nom complet',
      email: 'Email',
      phone: 'Téléphone',
      model: 'Modèle souhaité',
      budget: 'Budget',
      message: 'Informations complémentaires',
      submit: 'Demander mon devis',
      success: 'Votre demande a été envoyée. Vous recevrez votre devis sous 24h.',
    },
    reservation: {
      title: 'Réserver votre maison',
      subtitle: 'Réservez votre maison avec un acompte de 1.000€.',
      secure: 'Paiement sécurisé via Stripe',
      deposit: 'Acompte de réservation',
      amount: '1.000 €',
      pay: 'Payer l\'acompte',
    },
  },
  promotions: {
    exclusiveOffers: 'Offres exclusives',
    heroDescription: 'Découvrez nos offres promotionnelles sur nos maisons modulaires. Des prix exceptionnels pour une durée limitée.',
    discoverOffer: 'Découvrir l\'offre',
    needMoreInfo: 'Besoin d\'informations complémentaires?',
    ctaDescription: 'Nos conseillers sont disponibles pour répondre à toutes vos questions et vous accompagner dans votre projet.',
    home: 'Accueil',
    promotions: 'Promotions',
    promotionStudentHousing: 'Promotion — Logement étudiant',
    heroHeadline: 'Possédez-la pour moins cher que votre loyer.',
    heroDescriptionDetail: 'Une maison certifiée de 15 m² à structure métallique pour les étudiants, les primo-accédants et les hôtes Airbnb. Livraison en 8 à 12 semaines.',
    viewFinancing: 'Voir le financement',
    seeTheHouse: 'Découvrir la maison',
    size: 'Taille',
    price: 'Prix',
    delivery: 'Livraison',
    floorPlanTopView: 'Plan / Vue du dessus',
    livingSurface: 'Surface habitable',
    structure: 'Structure',
    structureValue: 'Structure en acier',
    certification: 'Certification',
    certificationValue: 'Certifié CE',
    deliveryLabel: 'Livraison',
    houseDescription: 'Une maison étudiante compacte et moderne, conçue pour optimiser chaque mètre carré. Idéale pour les étudiants ou comme investissement locatif. Construction durable et livraison rapide.',
    process: 'Processus',
    howItWorks: 'Comment ça marche',
    processDescription: 'Un processus simplifié pour rendre votre projet accessible et sans stress.',
    reserve: 'Réservez',
    reserveDesc: 'Versement de l\'acompte de 1.000€ pour sécuriser votre maison.',
    prepare: 'Préparez',
    prepareDesc: 'Mise en place de votre terrain et des connexions nécessaires.',
    deliver: 'Livraison',
    deliverDesc: 'Transport et installation sur votre terrain.',
    enjoy: 'Profitez',
    enjoyDesc: 'Votre maison est prête à être habitée immédiatement.',
    limitedOffer: 'Offre limitée',
    discount: 'REMISE',
    fastDelivery: 'Livraison rapide',
    deliveryWeeks: '8-12 semaines',
    warranty: 'Garantie',
    warrantyYears: '10 ans',
    premiumQuality: 'Qualité premium',
    durableMaterials: 'Matériaux durables',
    turnkey: 'Clé en main',
    readyToLive: 'Prête à habiter',
    bookNow: 'Réserver maintenant',
    requestQuote: 'Demander un devis',
    depositToReserve: 'Acompte de 1.000€ pour réserver',
    financing: 'Financement',
    accessibleMonthlyPayments: 'Des mensualités accessibles',
    financingDescription: 'Financez votre maison avec des conditions adaptées à votre budget.',
    formula: 'Formule',
    monthlyPayment: 'Mensualité',
    duration: 'Durée',
    classic: 'Classique',
    extended: 'Étendue',
    longterm: 'Longue durée',
    months: 'mois',
    readyToStart: 'Prêt à commencer votre projet? Contactez nos conseillers.',
    contactUs: 'Nous contacter',
    securePayment: 'Paiement sécurisé',
    fullyRefundableDeposit: 'Acompte 100% remboursable',
    warranty10Years: 'Garantie 10 ans',
    frenchBuilder: 'Constructeur français',
    fastDeliveryShort: 'Livraison rapide',
    weeksOnly: 'semaines seulement',
    squareMeters: 'm²',
    oneWeek: '1 semaine',
    weeks: 'semaines',
  },
};

export default fr;