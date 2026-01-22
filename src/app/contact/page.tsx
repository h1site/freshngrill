'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, Building2, User, MessageSquare, Send, CheckCircle, AlertCircle, ShieldCheck, Megaphone } from 'lucide-react';

// Generate a simple math captcha
function generateCaptcha() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  return { num1, num2, answer: num1 + num2 };
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState(false);

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCaptchaError(false);

    // Validate captcha
    if (parseInt(captchaInput) !== captcha.answer) {
      setCaptchaError(true);
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          company: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
        setCaptchaInput('');
        setCaptcha(generateCaptcha());
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Une erreur est survenue');
      }
    } catch {
      setSubmitStatus('error');
      setErrorMessage('Erreur de connexion au serveur');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide mb-6">
              Contactez-nous
            </h1>
            <p className="text-neutral-400 text-lg md:text-xl leading-relaxed">
              Vous avez des questions sur l&apos;une de nos recettes ? Vous souhaitez voir un article
              publié sur notre blog ? N&apos;hésitez pas à nous contacter !
            </p>
            <div className="w-16 h-1 bg-[#F77313] mt-8" />
          </div>
        </div>
      </section>

      {/* Formulaire */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Intro */}
            <div className="text-center mb-12">
              <p className="text-neutral-600 text-lg">
                Que ce soit pour une question, une suggestion de recette, une collaboration
                ou un partenariat, nous serons ravis de vous lire.
              </p>
            </div>

            {/* Success Message */}
            {submitStatus === 'success' && (
              <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-800 mb-1">Message envoyé !</h3>
                  <p className="text-green-700">
                    Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {submitStatus === 'error' && (
              <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">Erreur d&apos;envoi</h3>
                  <p className="text-red-700">
                    {errorMessage || 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement par email.'}
                  </p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                  Nom complet *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F77313] focus:border-transparent transition-all"
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              {/* Entreprise */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-neutral-700 mb-2">
                  Entreprise (optionnel)
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F77313] focus:border-transparent transition-all"
                    placeholder="Votre entreprise"
                  />
                </div>
              </div>

              {/* Email et Téléphone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F77313] focus:border-transparent transition-all"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                    Téléphone (optionnel)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F77313] focus:border-transparent transition-all"
                      placeholder="(514) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Sujet */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-2">
                  Sujet *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F77313] focus:border-transparent transition-all bg-white"
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="question">Question sur une recette</option>
                  <option value="suggestion">Suggestion de recette</option>
                  <option value="collaboration">Collaboration / Partenariat</option>
                  <option value="bug">Signaler un problème</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                  Message *
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-neutral-400" />
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F77313] focus:border-transparent transition-all resize-none"
                    placeholder="Votre message..."
                  />
                </div>
              </div>

              {/* Captcha */}
              <div>
                <label htmlFor="captcha" className="block text-sm font-medium text-neutral-700 mb-2">
                  Vérification anti-robot *
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-neutral-100 px-4 py-3 rounded-xl">
                    <ShieldCheck className="w-5 h-5 text-[#F77313]" />
                    <span className="font-medium text-neutral-800">
                      {captcha.num1} + {captcha.num2} = ?
                    </span>
                  </div>
                  <input
                    type="number"
                    id="captcha"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    required
                    className={`w-24 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F77313] focus:border-transparent transition-all ${
                      captchaError ? 'border-red-500 bg-red-50' : 'border-neutral-300'
                    }`}
                    placeholder="?"
                  />
                </div>
                {captchaError && (
                  <p className="mt-2 text-sm text-red-600">
                    Réponse incorrecte. Veuillez réessayer.
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#F77313] text-white font-semibold py-4 px-6 rounded-xl hover:bg-[#e56610] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Envoyer le message
                  </>
                )}
              </button>
            </form>

            {/* Info supplémentaire */}
            <div className="mt-12 pt-12 border-t border-neutral-200 text-center">
              <p className="text-neutral-500 text-sm">
                Nous répondons généralement dans un délai de 24 à 48 heures.
              </p>
            </div>

            {/* Advertising CTA */}
            <div className="mt-12 bg-neutral-900 text-white p-6 md:p-8 rounded-2xl">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-[#F77313] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Megaphone className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-display text-xl mb-2">Vous souhaitez annoncer sur Menucochon?</h3>
                  <p className="text-neutral-400 text-sm mb-4">
                    Bannières publicitaires dès 100$/mois ou articles sponsorisés avec lien dofollow permanent à 150$.
                  </p>
                  <Link
                    href="/publicite"
                    className="inline-flex items-center gap-2 bg-[#F77313] text-white px-5 py-2 font-medium hover:bg-[#e56610] transition-colors rounded-lg text-sm"
                  >
                    Voir nos offres publicitaires
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
