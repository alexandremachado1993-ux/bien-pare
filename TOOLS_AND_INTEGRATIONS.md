# Outils, connecteurs, skills et MCP

État vérifié le 26/10/2026 dans l'environnement cloud Claude Code.

| Outil | État | Usage | Coût | Permissions |
|---|---|---|---|---|
| Node 22, npm, Git, Playwright + Chromium | Disponibles | Développement, tests navigateur, PDF | 0 € | Locales |
| Connecteur Supabase (claude.ai) | Connecté ; projet **`bien-pare`** (isyukotihbribamfshtc, Paris) créé le 26/10 ; `ac-sat-campagne` non touché | Stockage des événements et avis | 0 € (offre gratuite, 2 projets actifs sur 2 utilisés ; pause après 7 jours sans activité) | Visiteurs : insertion seule (RLS) ; aucune alerte de sécurité Supabase |
| Connecteur Google Drive | Connecté | Copie de sauvegarde du produit privé (option) | 0 € | Non utilisé sans accord |
| GitHub | Dépôts `bien-pare` (public) et `bien-pare-produits` (privé) créés par l'utilisateur. `bien-pare` : lecture OK, **envoi refusé (403)**. `bien-pare-produits` : **inaccessible** | Sauvegarde et hébergement Pages | 0 € | **Installer l'application GitHub « Claude » sur ces deux dépôts** |
| Recherche web | Fonctionne (résumés de pages) | Études | 0 € | — |
| Accès direct aux sites (Amazon, eBay, Alibaba, CJ, gouv.fr, *.supabase.co…) | **Bloqué** par le réseau de l'environnement | Relevés de prix de première main | — | À autoriser dans les paramètres réseau de l'environnement |
| Shopify AI Toolkit / Dev MCP | Non installé (shopify.dev bloqué) | Inutile avant une vraie boutique | 0 € | — |
| Serveurs MCP de plugins (GitHub, Figma, Amplitude, Ahrefs…) | Échec de connexion (proxy 403) | Non nécessaires | — | — |

Skills utilisés ou disponibles : revue de code, sécurité, tests, accessibilité, plan de suivi produit. Aucun plugin ni MCP n'a été installé. Le fichier `.mcp.json` n'a pas été modifié.
