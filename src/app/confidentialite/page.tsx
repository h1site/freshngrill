import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de confidentialité | Menucochon',
  description: 'Politique de confidentialité et protection des données personnelles de Menucochon.',
  alternates: {
    canonical: '/confidentialite/',
    languages: {
      'fr-CA': '/confidentialite/',
      'en-CA': '/en/privacy/',
    },
  },
};

export default function ConfidentialitePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide mb-6">
              Politique de confidentialité
            </h1>
            <p className="text-neutral-400 text-lg">
              Dernière mise à jour : Décembre 2024
            </p>
            <div className="w-16 h-1 bg-[#F77313] mt-8" />
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg prose-neutral">
            <h2>Introduction</h2>
            <p>
              Bienvenue sur Menucochon. Nous prenons très au sérieux la protection de vos
              données personnelles. Cette politique de confidentialité explique comment nous
              collectons, utilisons et protégeons vos informations lorsque vous utilisez
              notre site web.
            </p>

            <h2>Collecte des données</h2>
            <p>Nous pouvons collecter les informations suivantes :</p>
            <ul>
              <li>
                <strong>Informations de contact</strong> : nom, adresse email lorsque vous
                nous contactez via notre formulaire ou vous inscrivez à notre infolettre.
              </li>
              <li>
                <strong>Données de navigation</strong> : informations sur votre appareil,
                navigateur, pages visitées et temps passé sur le site via des cookies.
              </li>
              <li>
                <strong>Préférences</strong> : vos recettes favorites et préférences de
                navigation sauvegardées localement.
              </li>
            </ul>

            <h2>Utilisation des données</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul>
              <li>Répondre à vos questions et demandes</li>
              <li>Vous envoyer notre infolettre si vous y êtes inscrit</li>
              <li>Améliorer notre site et nos services</li>
              <li>Analyser l&apos;utilisation du site via des outils d&apos;analyse</li>
            </ul>

            <h2>Cookies</h2>
            <p>
              Notre site utilise des cookies pour améliorer votre expérience. Les cookies
              sont de petits fichiers stockés sur votre appareil qui nous permettent de :
            </p>
            <ul>
              <li>Mémoriser vos préférences</li>
              <li>Analyser le trafic du site (Google Analytics)</li>
              <li>Afficher des publicités pertinentes (Google AdSense)</li>
            </ul>
            <p>
              Vous pouvez configurer votre navigateur pour refuser les cookies, mais
              certaines fonctionnalités du site pourraient ne pas fonctionner correctement.
            </p>

            <h2>Partage des données</h2>
            <p>
              Nous ne vendons pas vos données personnelles. Nous pouvons partager des
              informations avec :
            </p>
            <ul>
              <li>
                <strong>Google Analytics</strong> : pour analyser l&apos;utilisation du site
              </li>
              <li>
                <strong>Google AdSense</strong> : pour afficher des publicités
              </li>
              <li>
                <strong>Supabase</strong> : pour le stockage sécurisé des données
              </li>
            </ul>

            <h2>Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos
              données contre l&apos;accès non autorisé, la modification, la divulgation ou la
              destruction. Toutes les communications sont chiffrées via HTTPS.
            </p>

            <h2>Vos droits</h2>
            <p>Conformément aux lois applicables, vous avez le droit de :</p>
            <ul>
              <li>Accéder à vos données personnelles</li>
              <li>Rectifier vos données si elles sont inexactes</li>
              <li>Demander la suppression de vos données</li>
              <li>Vous opposer au traitement de vos données</li>
              <li>Retirer votre consentement à tout moment</li>
            </ul>

            <h2>Conservation des données</h2>
            <p>
              Nous conservons vos données personnelles aussi longtemps que nécessaire pour
              les finalités décrites dans cette politique, sauf si une période de
              conservation plus longue est requise par la loi.
            </p>

            <h2>Modifications</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de confidentialité à
              tout moment. Les modifications seront publiées sur cette page avec une date
              de mise à jour.
            </p>

            <h2>Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité ou vos
              données personnelles, veuillez nous contacter via notre{' '}
              <a href="/contact" className="text-[#F77313] hover:underline">
                formulaire de contact
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
