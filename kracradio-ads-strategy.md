# Stratégie Publicitaire KracRadio.com

## Vue d'ensemble

KracRadio est une plateforme multimédia offrant du contenu varié : radio en streaming, podcasts, vidéos, blogs et fiches artistes. Cette stratégie vise à maximiser les revenus publicitaires tout en préservant l'expérience utilisateur.

---

## Types de Publicités

### 1. Google AdSense (Display Ads)

Publicités visuelles intégrées dans le contenu de la plateforme.

### 2. Publicités Audio (Audio Ads)

Publicités sonores diffusées pendant l'écoute de la radio ou des podcasts.

---

## Placement des Publicités par Section

### Radio / Streaming

| Type | Placement | Fréquence |
|------|-----------|-----------|
| Audio Ads | Entre les chansons | Toutes les 15-20 min |
| Audio Ads | Au lancement du stream | 1x au démarrage |
| Display | Bannière sous le player | Permanent |
| Display | Sidebar (desktop) | Permanent |

**Recommandations :**
- Pré-roll audio de 15-30 sec au lancement
- Mid-roll audio toutes les 4-5 chansons
- Éviter d'interrompre une chanson en cours

---

### Podcasts

| Type | Placement | Fréquence |
|------|-----------|-----------|
| Audio Ads | Pré-roll (avant l'épisode) | 1x par épisode |
| Audio Ads | Mid-roll (milieu de l'épisode) | 1-2x selon durée |
| Audio Ads | Post-roll (fin de l'épisode) | 1x par épisode |
| Display | Page de l'épisode | 2 emplacements |
| Display | Liste des épisodes | 1 in-feed |

**Recommandations :**
- Pré-roll : 15-30 sec (skipable après 5 sec)
- Mid-roll : 30-60 sec (podcasts 30+ min)
- Post-roll : 15 sec max
- Intégrer les sponsors naturellement dans le contenu quand possible

---

### Blogs / Articles

| Type | Placement | Format |
|------|-----------|--------|
| Display | Après l'introduction (2-3 paragraphes) | In-article responsive |
| Display | Milieu de l'article | In-article responsive |
| Display | Fin de l'article | Rectangle 336x280 |
| Display | Sidebar (desktop) | Skyscraper 300x600 |
| Display | Entre les articles (liste) | In-feed native |

**Recommandations :**
- Maximum 3 display ads par article
- Ratio contenu/pub : minimum 70% contenu
- Ads responsives pour mobile
- Éviter les popups intrusifs

---

### Vidéos

| Type | Placement | Durée |
|------|-----------|-------|
| Video Ads | Pré-roll | 15-30 sec (skip après 5 sec) |
| Video Ads | Mid-roll (vidéos 8+ min) | 15-30 sec |
| Display | Sous le player | Leaderboard 728x90 |
| Display | Sidebar suggestions | Rectangle 300x250 |

**Recommandations :**
- Mid-roll seulement pour vidéos de 8+ minutes
- Pas plus d'1 mid-roll par vidéo
- Overlay ads discrets (coins inférieurs)

---

### Fiches Artistes

| Type | Placement | Format |
|------|-----------|--------|
| Display | Bannière header | Leaderboard 728x90 |
| Display | Sidebar | Rectangle 300x250 |
| Display | Entre les sections | In-article |

**Recommandations :**
- Publicités contextuelles (musique, concerts, merch)
- Sponsoring possible par labels/promoteurs
- Espace pour promotion d'événements liés à l'artiste

---

## Formats Display Recommandés

| Format | Dimensions | Usage |
|--------|------------|-------|
| Leaderboard | 728x90 | Header, sous navigation |
| Rectangle moyen | 300x250 | Sidebar, in-content |
| Grand rectangle | 336x280 | In-article |
| Skyscraper | 300x600 | Sidebar sticky |
| Mobile banner | 320x50 | Header mobile |
| Responsive | Auto | Partout (recommandé) |

---

## Stratégie Audio Ads

### Sources de Revenus Audio

1. **Réseaux programmatiques**
   - Triton Digital
   - AdsWizz
   - Spotify Ad Studio (si applicable)

2. **Ventes directes**
   - Sponsors locaux
   - Labels musicaux
   - Promoteurs d'événements

### Format des Audio Ads

| Type | Durée | CPM estimé |
|------|-------|------------|
| Pré-roll | 15 sec | 15-25$ |
| Pré-roll | 30 sec | 20-35$ |
| Mid-roll | 30 sec | 25-40$ |
| Mid-roll | 60 sec | 35-50$ |

### Règles Audio

- Volume normalisé (même niveau que le contenu)
- Pas plus de 4 minutes de pub par heure de streaming
- Transition fluide avec jingles de la station
- Option premium sans pub pour abonnés (si applicable)

---

## Placement Stratégique par Page

### Page d'accueil

```
┌─────────────────────────────────────────────┐
│ Header Navigation                           │
├─────────────────────────────────────────────┤
│ Hero Section (Player Radio)                 │
├─────────────────────────────────────────────┤
│ [AD #1 - Leaderboard 728x90]               │
├─────────────────────────────────────────────┤
│ Podcasts Populaires                         │
├─────────────────────────────────────────────┤
│ [AD #2 - In-feed Native]                   │
├─────────────────────────────────────────────┤
│ Dernières Vidéos                           │
├─────────────────────────────────────────────┤
│ [AD #3 - In-feed Native]                   │
├─────────────────────────────────────────────┤
│ Articles Récents                           │
├─────────────────────────────────────────────┤
│ Footer                                      │
└─────────────────────────────────────────────┘
```

### Page Article/Blog

```
┌─────────────────────────────────┬───────────┐
│ Header Navigation               │           │
├─────────────────────────────────┤           │
│ Titre Article                   │  Sidebar  │
│ Introduction...                 │           │
│                                 │ [AD]      │
│ [AD #1 - In-article]           │ 300x250   │
│                                 │           │
│ Contenu...                      │           │
│                                 │ [AD]      │
│ [AD #2 - In-article]           │ 300x600   │
│                                 │ Sticky    │
│ Contenu...                      │           │
│                                 │           │
│ [AD #3 - Fin d'article]        │           │
├─────────────────────────────────┴───────────┤
│ Footer                                      │
└─────────────────────────────────────────────┘
```

---

## Considérations UX

### À faire ✅

- Ads responsives pour tous les appareils
- Chargement asynchrone (lazy loading)
- Contraste suffisant avec le contenu
- Étiquettes "Publicité" ou "Sponsorisé" claires
- Option de feedback sur les pubs inappropriées

### À éviter ❌

- Popups intrusifs
- Auto-play video avec son
- Ads qui bloquent le contenu
- Trop d'ads sur mobile
- Ads qui ressemblent au contenu éditorial

---

## Métriques à Suivre

| Métrique | Cible |
|----------|-------|
| RPM (Revenue per 1000) | 5-15$ |
| CTR Display | 0.5-2% |
| Taux d'écoute Audio Ads | 85%+ |
| Viewability | 70%+ |
| Taux de rebond | < 40% |

---

## Implémentation Technique

### Google AdSense

#### Script global (dans `<head>`)

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8781698761921917" crossorigin="anonymous"></script>
```

#### Display Ad (Responsive)

```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-8781698761921917"
     data-ad-slot="XXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

#### In-Article Ad

```html
<ins class="adsbygoogle"
     style="display:block; text-align:center;"
     data-ad-layout="in-article"
     data-ad-format="fluid"
     data-ad-client="ca-pub-8781698761921917"
     data-ad-slot="XXXXXXXX"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

#### In-Feed Ad (pour listes d'articles/podcasts)

```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-format="fluid"
     data-ad-layout-key="-fb+5w+4e-db+86"
     data-ad-client="ca-pub-8781698761921917"
     data-ad-slot="XXXXXXXX"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

> **Note:** Remplacer `XXXXXXXX` par les ad-slot IDs créés dans AdSense pour chaque emplacement.

### Audio Ads (Triton/AdsWizz)

- Intégration SDK dans le player audio
- Configuration des ad breaks
- Fallback si aucune pub disponible

---

## Résumé Exécutif

| Section | Display Ads | Audio Ads |
|---------|-------------|-----------|
| Radio | 2 | Pré-roll + Mid-roll |
| Podcasts | 2-3 | Pré + Mid + Post |
| Vidéos | 2 | Pré-roll + Mid-roll |
| Blogs | 3-4 | N/A |
| Fiches Artistes | 2-3 | N/A |
| Accueil | 3 | N/A |

**Revenus estimés** (selon trafic) :
- Display : 60-70% des revenus
- Audio : 30-40% des revenus

---

## Prochaines Étapes

1. [ ] Créer compte AdSense pour kracradio.com
2. [ ] Configurer ads.txt
3. [ ] Intégrer partenaire Audio Ads (Triton/AdsWizz)
4. [ ] Implémenter les emplacements display
5. [ ] Configurer les ad breaks audio dans le player
6. [ ] Tester sur tous les appareils
7. [ ] Monitorer les performances pendant 30 jours
8. [ ] Optimiser selon les données
