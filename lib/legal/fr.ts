import type { LegalDocs } from "./types";

const legal: LegalDocs = {
  terms: {
    title: "Conditions d'utilisation",
    desc: "Conditions régissant l'accès au service Sector1 et son utilisation.",
    updated: "Mai 2026",
    blocks: [
      { kind: "h2", text: "1. Qui nous sommes" },
      {
        kind: "p",
        spans: [
          "Sector1 est une communauté de recherche sur les paris sportifs exploitée sous le nom commercial Sector1. En accédant au site web, en rejoignant nos canaux Telegram ou en démarrant un essai, vous acceptez ces conditions.",
        ],
      },
      { kind: "h2", text: "2. Conditions d'éligibilité" },
      {
        kind: "p",
        spans: [
          "Vous devez avoir 18 ans ou plus (21+ là où la loi locale l'exige) et résider dans une juridiction où parier sur des événements sportifs est légal. Il vous incombe de confirmer la légalité des paris dans votre pays.",
        ],
      },
      { kind: "h2", text: "3. Le service" },
      {
        kind: "p",
        spans: [
          "Sector1 fournit des recherches, des analyses et des sélections sur certains marchés de football, transmises via des canaux Telegram privés. Nous n'acceptons pas de mises, n'exploitons pas de bookmaker et ne détenons pas de fonds des clients. Tous les paris sont placés par vous auprès d'opérateurs tiers indépendants.",
        ],
      },
      { kind: "h2", text: "4. Adhésion et accès gratuit" },
      {
        kind: "p",
        spans: [
          "Rejoindre Sector1 et nos canaux Telegram est gratuit. La seule condition d'adhésion est que vous vous inscriviez et placiez vos paris auprès de notre bookmaker recommandé via notre lien partenaire. Vous restez toujours libre de choisir où et combien vous pariez, mais l'accès gratuit est offert sur la base de l'utilisation de notre bookmaker recommandé.",
        ],
      },
      { kind: "h2", text: "5. Aucune garantie" },
      {
        kind: "p",
        spans: [
          "Les résultats sportifs sont par nature incertains. Les performances passées, le ROI ou tout historique publié par Sector1 ne garantissent pas les résultats futurs. Les sélections sont des opinions fondées sur la recherche et doivent être traitées comme telles.",
        ],
      },
      /*
      { kind: "h2", text: "6. Essai & abonnement" },
      {
        kind: "p",
        spans: [
          "Les nouveaux membres bénéficient d'un essai gratuit de 30 jours. Si vous continuez au-delà du 30e jour, l'abonnement est de 100 €/mois. Vous pouvez annuler à tout moment dans Telegram en vous retirant des canaux, sans préavis.",
        ],
      },
      */
      { kind: "h2", text: "6. Utilisation acceptable" },
      {
        kind: "p",
        spans: [
          "Vous vous engagez à ne pas redistribuer, capturer pour revente ni partager publiquement le contenu de nos canaux privés. L'accès est personnel et non transférable. Toute violation entraîne une résiliation immédiate sans remboursement.",
        ],
      },
      { kind: "h2", text: "7. Responsabilité" },
      {
        kind: "p",
        spans: [
          "Dans la mesure maximale permise par la loi, Sector1 n'est pas responsable des pertes, directes ou indirectes, résultant de l'utilisation de notre contenu, y compris, mais sans s'y limiter, les pertes liées aux paris. Vous pariez à vos propres risques.",
        ],
      },
      { kind: "h2", text: "8. Modifications" },
      {
        kind: "p",
        spans: [
          "Nous pouvons mettre à jour ces conditions de temps à autre. La poursuite de l'utilisation du service après une mise à jour vaut acceptation des conditions révisées.",
        ],
      },
      { kind: "h2", text: "9. Contact" },
      {
        kind: "p",
        spans: [
          "Questions concernant ces conditions : ",
          { t: "hello@sector1.bet", href: "mailto:hello@sector1.bet" },
          ".",
        ],
      },
    ],
  },
  privacy: {
    title: "Politique de confidentialité",
    desc: "Comment Sector1 collecte, utilise et protège vos données personnelles.",
    updated: "Juillet 2026",
    blocks: [
      { kind: "h2", text: "1. Résumé" },
      {
        kind: "p",
        spans: [
          "Nous collectons le minimum de données nécessaires pour fournir le service et mesurer les performances du site et des campagnes. Nous ne vendons pas de données personnelles. Nous partageons des données d'utilisation limitées et des identifiants hachés avec des prestataires d'analyse et de publicité, dont Meta et TikTok, à des fins de mesure et d'attribution.",
        ],
      },
      { kind: "h2", text: "2. Ce que nous collectons" },
      {
        kind: "ul",
        items: [
          ["Données d'inscription : prénom et nom, adresse e-mail, numéro de téléphone facultatif, pays, montant et devise du dépôt déclarés par l'utilisateur."],
          ["Données d'utilisation et de campagne : pages vues, temps passé, référent, adresse IP, informations sur le navigateur ou l'appareil, identifiants de clic ou de cookie et identifiants hachés avant la mesure publicitaire."],
        ],
      },
      { kind: "h2", text: "3. Base légale (RGPD)" },
      {
        kind: "p",
        spans: [
          "Nous traitons les données sur la base (a) de l'exécution du contrat : fournir le service auquel vous avez souscrit ; (b) de l'intérêt légitime : statistiques et sécurité du site ; et (c) du consentement : lorsque cela est requis pour les cookies non essentiels.",
        ],
      },
      { kind: "h2", text: "4. Conservation des données" },
      {
        kind: "p",
        spans: [
          "Nous conservons les données du compte tant que vous restez membre et jusqu'à 24 mois après la résiliation, après quoi elles sont supprimées ou anonymisées. Les prestataires d'analyse et de publicité conservent les données d'événement ou pseudonymes selon leurs propres politiques de conservation.",
        ],
      },
      { kind: "h2", text: "5. Vos droits" },
      {
        kind: "p",
        spans: [
          "Vous pouvez demander à tout moment l'accès, la rectification, l'export ou la suppression de vos données personnelles. Écrivez à ",
          { t: "privacy@sector1.bet", href: "mailto:privacy@sector1.bet" },
          " et nous répondrons dans un délai de 30 jours.",
        ],
      },
      { kind: "h2", text: "6. Cookies" },
      {
        kind: "p",
        spans: [
          "Nous utilisons des cookies internes pour les fonctions essentielles (session, préférences), des outils statistiques et des technologies de mesure publicitaire de Meta et TikTok afin de mesurer les performances des campagnes et les conversions. Ces fournisseurs peuvent déposer ou lire des cookies tiers et des identifiants similaires.",
        ],
      },
      { kind: "h2", text: "7. Sécurité" },
      {
        kind: "p",
        spans: [
          "Les données sont stockées sur des serveurs exploités par des fournisseurs réputés de l'UE/des États-Unis, sous des contrôles de sécurité standard (TLS en transit, chiffrement au repos le cas échéant). Aucun système n'est parfaitement sûr, veuillez utiliser un mot de passe unique.",
        ],
      },
      { kind: "h2", text: "8. Modifications" },
      {
        kind: "p",
        spans: [
          "Les changements importants apportés à cette politique seront communiqués par e-mail ou par bannière avant leur entrée en vigueur.",
        ],
      },
    ],
  },
  responsible: {
    title: "Jeu responsable",
    desc: "Outils, limites et lignes d'assistance pour que les paris restent amusants, sûrs et maîtrisés.",
    updated: "Mai 2026",
    blocks: [
      {
        kind: "lede",
        spans: [
          "Parier doit rester un divertissement, jamais un moyen de gagner de l'argent que vous ne pouvez pas vous permettre de perdre, jamais une échappatoire au stress, et jamais quelque chose que vous cachez à vos proches. Sector1 vend de la recherche et de la structure, pas des certitudes. Si parier cesse d'être amusant, arrêtez.",
        ],
      },
      { kind: "h2", text: "Fixez d'abord vos limites" },
      {
        kind: "ul",
        items: [
          ["Définissez un budget mensuel avant de placer le moindre pari. Traitez-le comme un budget loisir."],
          ["Utilisez un plan de mise fixe (1 à 2 % du budget par sélection). Ne cherchez jamais à récupérer vos pertes en doublant."],
          ["Gardez un compte ou un portefeuille électronique séparé pour les fonds de paris. Ne les mélangez pas avec votre épargne."],
          ["Faites des pauses régulières. Un week-end de repos remet les choses en perspective plus vite que n'importe quel autre pari."],
        ],
      },
      { kind: "h2", text: "Signes d'alerte" },
      {
        kind: "ul",
        items: [
          ["Parier plus que ce que vous pouvez confortablement vous permettre de perdre."],
          ["Emprunter de l'argent pour parier, ou vendre des biens pour financer des paris."],
          ["Mentir à votre famille ou à vos amis sur le montant que vous pariez."],
          ["Vous sentir agité, irritable ou abattu lorsque vous essayez de réduire."],
          ["Utiliser les paris pour échapper aux problèmes ou anesthésier vos émotions."],
        ],
      },
      { kind: "h2", text: "Les outils proposés par votre bookmaker" },
      {
        kind: "p",
        spans: [
          "Tout opérateur réglementé dans l'UE est tenu de proposer des limites de dépôt, des limites de pertes, des rappels de session, des temps de pause et l'auto-exclusion. Utilisez-les. Définir une limite prend 30 secondes et évite des années de regrets.",
        ],
      },
      { kind: "h2", text: "Aide gratuite et confidentielle" },
      {
        kind: "ul",
        items: [
          [
            { t: "BeGambleAware", b: true },
            " (Royaume-Uni & international) : ",
            { t: "begambleaware.org", href: "https://www.begambleaware.org", ext: true },
          ],
          [
            { t: "Gamblers Anonymous", b: true },
            ", réunions dans le monde entier, ",
            { t: "gamblersanonymous.org", href: "https://www.gamblersanonymous.org", ext: true },
          ],
          [
            { t: "Stödlinjen", b: true },
            " (Suède) : 020-81 91 00, ",
            { t: "stodlinjen.se", href: "https://www.stodlinjen.se", ext: true },
          ],
          [
            { t: "Spillemyndigheden", b: true },
            " (Danemark) : ",
            { t: "spillemyndigheden.dk", href: "https://www.spillemyndigheden.dk", ext: true },
          ],
        ],
      },
      { kind: "h2", text: "Si vous devez arrêter" },
      {
        kind: "p",
        spans: [
          "Annulez votre accès Sector1 dans Telegram en une seule touche, puis auto-excluez-vous auprès de votre/vos bookmaker(s). Si vous souhaitez que nous supprimions vos données, écrivez à ",
          { t: "privacy@sector1.bet", href: "mailto:privacy@sector1.bet" },
          ". Nous ne contactons pas les membres qui se sont auto-exclus.",
        ],
      },
      {
        kind: "foot",
        spans: [
          "18+ · Pariez de manière responsable · Ne pariez jamais plus que ce que vous pouvez vous permettre de perdre.",
        ],
      },
    ],
  },
};

export default legal;
