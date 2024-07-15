# Contexte

On considère un ensemble de clients envoyant à intervalle régulier de la télémétrie à un serveur. Ces clients peuvent
être simulés avec le script Python après avoir installé les dépendances avec `pip install -r requirements.txt`.

Pour que 3000 clients soient simulés et communiquent en UDP leur télémétrie à `localhost:5555`, il faut runner le script
suivant:

```
python clients.py localhost 5555 3000
```

Chaque client simulé envoie sa télémétrie sous forme de JSON. Chaque télémétrie reçue contient toujours au moins le
champ `name` qui identifie de manière unique le client et le champ `position` (un array de 3 floats). En complément,
toutes les 10s environ, chaque client envoie de la télémétrie complémentaire (des dictionnaires nommés `versions` et
`config`).

_Le script python `server.py` est aussi fourni à titre d'exemple pour tester le bon fonctionnement `clients.py` vers
`server.py`._

# Exercice

L'objectif est de proposer une implémentation Node.js de la partie serveur permettant d'agréger la télémétrie et
d'exposer le résultat de cette agrégation sous forme d'un endpoint HTTP. Une requête GET sur cet endpoint renvoie la
liste des clients ayant envoyé de la télémétrie récemment (dernière télémétrie reçue il y a moins de 60s par exemple).
Cet endpoint doit proposer un filtrage basique sur le champ `name` des clients.

Cette implémentation Node.js devra pouvoir être exécuté sous forme de container `docker`.

# Solution

La solution apportée est un serveur UDP permettant l'aggrégation des données accompagné d'un serveur UDP permettant de
servir les données aggrégées.

Cette solution, bien que fonctionnelle, n'apporte aucune persistance dans le temps (sous forme de base de données) et ne
convient que pour un nombre de client non-excessif.

Afin d'améliorer les performances, il pourrait être envisageable de décorréler la partie aggrégation et la partie API.  
Créer un microservice de télémétrie dédié et aggréger dans une base dédiée permettrait de créer plusieurs points de
récupération distincts sans dupliquer le serveur API.

Le endpoint `/telemetry` permet de récupérer les informations envoyées par les clients lors des dernières 60s
(par défaut).  
Ce endpoint dispose d'un **queryParam** `name` permettant de rechercher les informations correspondant uniquement à un
client donné.  
Lorsque le paramètre est fourni, si aucun résultat n'est trouvé, l'API renverra une erreur 404.

## Execution

### Environnement

Le fichier `.env` permet de paramétrer certains aspects de l'application dont les ports et le comportement de rétention.

| Variable                      | Description                                                      | Défaut  |
|-------------------------------|------------------------------------------------------------------|---------|
| API_HOST                      | L'hôte du serveur express servant l'API.                         | 0.0.0.0 |
| API_PORT                      | Le port du serveur express servant l'API.                        | 3000    |
| LOG_LEVEL                     | Le niveau d'affichage des logs.                                  | ERROR   |
| MAX_INFO_RETENTION_PER_CLIENT | Le nombre de résultats maximum à conserver pour chaque client.   | 200     |
| MAX_TIMESTAMP_DELTA           | Le temps en ms à partir duquel les infos ne sont plus renvoyées. | 60000   |
| TELEMETRY_HOST                | L'hôte du serveur de télémétrie.                                 | 0.0.0.0 |
| TELEMETRY_POST                | Le port du serveur de télémtrie.                                 | 5555    |

### Docker

L'application dispose d'un `Dockerfile` permettant un build et déploiement.  
Pour build le docker, lancez la commande suivante :

```bash
docker build -t telemetry .
```

Une fois le build terminé, vous pourrez lancer l'application avec la commande suivante :

```bash
docker run -d -p 3000:3000 -p 5555:5555 telemetry
```
