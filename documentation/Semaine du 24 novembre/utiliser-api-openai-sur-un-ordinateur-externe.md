<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# J'aimerais utilisé l'API Openai. Hors le système fonctionnera de cette manière : l'ia tournera sur un ordinateur plus puissant que le mien et j'aimerais pouvoir y accéder depuis mon ordinateur personnel. Nous serons connectés au même wifi. Peux tu me trouver les docs relatives à cette installation ?

Pour utiliser l'API OpenAI sur un ordinateur puissant chez toi et y accéder depuis ton ordinateur personnel (sur le même réseau Wi-Fi), il te faut configurer le serveur pour accepter des connexions réseau locales et adapter le client pour pointer vers l'adresse IP LAN de la machine puissante.

## Documentation de configuration réseau

- Si l'API ou le serveur utilise le standard OpenAI (comme vLLM, LocalAI, ou une inference snap Ubuntu), il faut configurer le service pour écouter sur toutes les interfaces réseau (adresse 0.0.0.0) et non seulement sur 127.0.0.1. Par exemple :[^1][^2]

```
<inference-snap> set http.host=0.0.0.0
sudo snap restart <inference-snap>
```

- Ensuite, dans tes appels API, l'URL de base doit être l'adresse IP du PC serveur sur ton réseau. Ex : `http://192.168.1.20:8000/v1/...` au lieu de `localhost`.[^3][^1]


## Guide pour Python et l'API OpenAI

- Pour te connecter, tu peux utiliser le client officiel Python en changeant le paramètre `base_url` vers l'adresse du serveur sur le réseau  :[^3]

```python
from openai import OpenAI
client = OpenAI(base_url="http://192.168.1.20:8000/v1")
# ... tes requêtes ici
```


## Sécurité et pratiques recommandées

- Assure-toi que le pare-feu du serveur laisse passer les connexions entrantes sur le port que tu utilises.
- Change le mot de passe/API key et évite l’exposition sur Internet pour limiter les risques.
- Des outils comme Docker, vLLM, LocalAI, ou des snaps inference Ubuntu sont compatibles avec ce type de déploiement.[^2][^4][^1]


## Liens utiles

- Tutoriel complet pour configurer une API compatible OpenAI locale (documentation Ubuntu) : https://documentation.ubuntu.com/inference-snaps/how-to/use-openai-api/[^1]
- Guide pour modifier l’URL cible du client Python officiel : https://github.com/openai/openai-python[^3]

Cette approche te permettra d’utiliser toute la puissance de ton ordinateur serveur, tout en accédant à l’IA sur ton poste personnel via le réseau local.
<span style="display:none">[^10][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://documentation.ubuntu.com/inference-snaps/how-to/use-openai-api/

[^2]: https://docs.vllm.ai/en/latest/serving/openai_compatible_server.html

[^3]: https://github.com/openai/openai-python

[^4]: https://www.virtualizationhowto.com/2025/10/best-self-hosted-ai-tools-you-can-actually-run-in-your-home-lab/

[^5]: https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/on-your-data-configuration?view=foundry-classic

[^6]: https://www.youtube.com/watch?v=Wjrdr0NU4Sk

[^7]: https://docs.langchain.com/oss/python/integrations/chat/openai

[^8]: https://tailscale.com/blog/self-host-a-local-ai-stack

[^9]: https://developers.openai.com/codex/cloud/internet-access/

[^10]: https://platform.openai.com/docs/guides/realtime

