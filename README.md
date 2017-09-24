# What'Sup

Le projet What'Sup a été réalisé par le laboratoire de sécurité informatique de l'école SUPINFO Lyon. Il consiste en la réalisation d'un chat entièrement sécurisé, de bout en bout.

L'équipe est composée de :

- Mathieu CALEMARD DU GARDIN
- Joris REBOULLAT
- Axel DURHÔNE
- Brahim SLITI
- Maxime SELIN
- Frédéric MALPHAT

## Le principe

Pour assurer l'intégrité des message en cas d'attaque Man In The Middle c'est à dire en cas d'interception du messages par un pirates, nous avons choisi d'exploiter la méthode End To End. Cette mécanique permet de conserver un chiffrement durant le transfert. L'expéditeur chiffrera sont message juste avant l'envoi et seul le destinataire lui même sera en mesure de déchiffrer le message.


## Chiffrement RSA

Le principe consiste à générer une paire de clé. Une est publique, elle sera donc distribuée et accessible. La seconde clé privée sera comme son nom l'indique réservée à l'utilisateur et tenue confidentielle. Voici un exemple définissant l'utilisation du RSA:
L'utilisateur A veut que les messages qui lui sont envoyés soit confidentiels, il rend donc sa clé publique accessible (elle est stockée sur le serveur). Grâce à cette clé, l'utilisateur B peut chiffrer ses messages avant de les signer puis de les envoyer. Lors de la réception, l'utilisateur A utilise sa clé privée pour déchiffrer et vérifier l'intégrité du message à l'aide de la signature de l'expéditeur.


Ici les clés générées ont une taille de 2048 bits et une passphrase aléatoire de 250 caractéres.


Voici un schéma illustrant le mécanisme de la signature :

![Signature](https://github.com/Dramelac/What-s-Sup/blob/master/WhatsSupApp/static/img/signature.png)

Voici un schéma illustrant le cycle de vie d'un message :

![RSA](https://github.com/Dramelac/What-s-Sup/blob/master/WhatsSupApp/static/img/RSA.png)
