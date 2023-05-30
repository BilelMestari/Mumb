const express = require('express')
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');


const app = express()
const port = 3000
//const jsonParser = bodyParser.json();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'bibibg93',
  database: 'projet_web'
});

const authMiddleware = (req, res, next) => {
    // Recuperez le JWT du header Authorization
    const authHeader = req.headers.authorization;
    if (authHeader) {
      // Extrait le JWT de l'en-tête
      const token = authHeader.split(' ')[1];
      // Verifiez et decodez le JWT
      jwt.verify(token, secretKey, (err, decodedToken) => {
        if (err) {
          // Le JWT est invalide ou expire
          return res.status(401).json({ message: 'JWT invalide ou expire' });
        } else {
          // Le JWT est valide
          // Vous pouvez acceder aux informations d'identification decodees, par exemple : decodedToken.id
          // Executez les actions d'authentification necessaires, par exemple, stockez les informations d'identification dans req.user pour une utilisation ulterieure
          req.user = decodedToken;
          next(); // Passez au middleware suivant
        }
      });
    } else {
      // Aucun JWT n'est fourni
      return res.status(401).json({ message: 'JWT manquant' });
    }
  };
  

  app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    const query = 'SELECT * FROM utilisateur WHERE email = ? AND password = ?';
    connection.query(query, [username, password], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
        return;
      }
      if (results.length > 0) {
        // Les informations d'identification sont correctes
        const payload = { id: 'votre_id_utilisateur' };
        const secretKey = 'votre_cle_secrète';

        const token = jwt.sign(payload, secretKey);

        res.json({ token: token });
    
        } else {
        // Les informations d'identification sont incorrectes
        res.status(401).send('Nom d\'utilisateur ou mot de passe incorrect');
      }
    });
});

app.post('/materiel', (req, res) => {
  const code = req.body.code ?? null;
  const type = req.body.type ?? null;
  if (code!=null){
    if(type!=null){
      var query = 'SELECT * FROM stock JOIN objet ON stock.objet = objet.id WHERE stock.code=? AND objet.id_cate=?';
      connection.query(query, [code,type], (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).send('Erreur du serveur');
          return;
        }
          res.json(results);

      });
    }
    else{
      var query = 'SELECT * FROM stock JOIN objet ON stock.objet = objet.id WHERE stock.code=?';
      connection.query(query, [code], (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).send('Erreur du serveur');
          return;
        }
          res.json(results);

      });
    }
  }
  else if(type!=null){
    var query = 'SELECT * FROM stock JOIN objet ON stock.objet = objet.id WHERE objet.id_cate=?'
      connection.query(query, [type], (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).send('Erreur du serveur');
          return;
        }
          res.json(results);

      });
  }
  else{
    var query = 'SELECT * FROM stock';
    connection.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
        return;
      }
        res.json(results);

    });
  }
});
app.post('/materiel/emprunt', (req, res) => {
  const code = req.body.code ?? null;
  const type = req.body.type ?? null;
  if (code!=null){
    if(type!=null){
      var query = 'SELECT * FROM stock JOIN objet ON stock.objet = objet.id LEFT JOIN emprunt ON emprunt.objet_stock = stock.objet WHERE stock.code=? AND objet.id_cate=? AND emprunt.encours_emprunt IS NOT NULL';
      connection.query(query, [code,type], (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).send('Erreur du serveur');
          return;
        }
          res.json(results);
        
      });
    }
    else{
      var query = 'SELECT * FROM stock JOIN objet ON stock.objet = objet.id LEFT JOIN emprunt ON emprunt.objet_stock = stock.objet WHERE stock.code=? AND emprunt.encours_emprunt IS NOT NULL';
      connection.query(query, [code], (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).send('Erreur du serveur');
          return;
        }
          res.json(results);
        
      });
    }
  }
  else if(type!=null){
    var query = 'SELECT * FROM stock JOIN objet ON stock.objet = objet.id LEFT JOIN emprunt ON emprunt.objet_stock = stock.objet WHERE objet.id_cate=? AND emprunt.encours_emprunt IS NOT NULL';
    connection.query(query, [type], (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).send('Erreur du serveur');
          return;
        }
          res.json(results);
        
      });
  }
  else{
    var query = 'SELECT * FROM stock JOIN objet ON stock.objet = objet.id LEFT JOIN emprunt ON emprunt.objet_stock = stock.objet WHERE emprunt.encours_emprunt IS NOT NULL';
    connection.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
        return;
      }
        res.json(results);
      
    });
  }
});

app.post('/materiel/dispo', (req, res) => {
  const code = req.body.code ?? null;
  const type = req.body.type ?? null;
  if (code!=null){
    if(type!=null){
      var query = 'SELECT * FROM stock JOIN objet ON stock.objet = objet.id LEFT JOIN emprunt ON emprunt.objet_stock = stock.objet WHERE stock.code=? AND objet.id_cate=? AND emprunt.encours_emprunt IS NULL';
      connection.query(query, [code,type], (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).send('Erreur du serveur');
          return;
        }
          res.json(results);
        
      });
    }
    else{
      var query = 'SELECT * FROM stock JOIN objet ON stock.objet = objet.id LEFT JOIN emprunt ON emprunt.objet_stock = stock.objet WHERE stock.code=? AND emprunt.encours_emprunt IS NULL';
      connection.query(query, [code], (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).send('Erreur du serveur');
          return;
        }
          res.json(results);
        
      });
    }
  }
  else if(type!=null){
    var query = 'SELECT * FROM stock JOIN objet ON stock.objet = objet.id LEFT JOIN emprunt ON emprunt.objet_stock = stock.objet WHERE objet.id_cate=? AND emprunt.encours_emprunt IS NULL';
    connection.query(query, [type], (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).send('Erreur du serveur');
          return;
        }
          res.json(results);
        
      });
  }
  else{
    var query = 'SELECT * FROM stock JOIN objet ON stock.objet = objet.id LEFT JOIN emprunt ON emprunt.objet_stock = stock.objet WHERE emprunt.encours_emprunt IS NULL';
    connection.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
        return;
      }
        res.json(results);
      
    });
  }
});

app.post('/materiel/all', (req, res) => {

  const query = 'SELECT * FROM stock';
  connection.query(query,  (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Erreur du serveur');
      return;
    }
      res.json(results);

  });
});

app.post('/materiel/add', authMiddleware, (req, res) => {
  const code = req.body.code;
  const objet = req.body.objet;
  const etat = req.body.etat;
  const prix = req.body.prix;
  const date_achat = req.body.date_achat;
  const fournisseur = req.body.fournisseur;

  const query = "INSERT INTO `stock`(`code`, `objet`, `etat`, `prix`, `date_achat`, `fournisseur`, `date_creation`, `date_modif`) VALUES (?,?,?,?,?,?,?,?)";
  connection.query(query, [code,objet,etat,prix,date_achat,fournisseur], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Erreur du serveur');
      return;
    }
      res.json(results);
    
  });
});

app.post('/materiel/update', authMiddleware, (req, res) => {
    const code = req.body.code;
    const objet = req.body.objet;
    const etat = req.body.etat;
    const prix = req.body.prix;
    const date_achat = req.body.date_achat;
    const fournisseur = req.body.fournisseur;

    const query = "UPDATE `stock` SET `code`=?,`objet`=?,`etat`?,`prix`=?,`date_achat`=?,`fournisseur`=?,`date_creation`=?,`date_modif`=? WHERE code=?";
    connection.query(query, [code,objet,etat,prix,date_achat,fournisseur,code], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
        return;
      }
        res.json(results);
      
    });
});

app.post('/materiel/delete', authMiddleware, (req, res) => {
    const code = req.body.code;


    const query = "DELETE FROM `stock` WHERE code=?";
    connection.query(query, [code], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
        return;
      }
        res.json(results);+
        .
      
    });
});




  app.post('/emprunt', authMiddleware, (req, res) => {
    const etudiant = req.body.etudiant;
    const query = 'SELECT * FROM emprunt where etudiant= ?';
    connection.query(query, [etudiant], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
        return;
      }
        res.json(results);
      
    });
  });

  app.post('/emprunt/add', (req, res) => {
    const code = req.body.code;
    const etudiant = req.body.etudiant;
    const date_emprunt = req.body.date_emprunt;
    const date_retour = req.body.date_retour;
    console.log(code,etudiant)
    const query = "INSERT INTO `emprunt`(`objet_stock`, `etudiant`, `date_emprunt`, `date_retour`, `date_retour_effectue`) VALUES (?,?,?,?,NULL)";
    connection.query(query, [code,etudiant,date_emprunt,date_retour], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
        return;
      }
      console.log(code,etudiant)
        res.json(results);
      
    });
});

app.post('/emprunt/update', authMiddleware, (req, res) => {
    const code = req.body.code;
    const etudiant = req.body.etudiant;
    const date_retour_effectue = req.body.date_retour_effectue;

    const query = "UPDATE `emprunt` SET `date_retour_effectue`=? where `objet_stock`=? AND `etudiant`=?";
    connection.query(query, [date_retour_effectue,code,etudiant], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
        return;
      }
        res.json(results);
      
    });
});

app.post('/emprunt/delete', authMiddleware, (req, res) => {
    const code = req.body.code;
    const etudiant = req.body.etudiant;


    const query = "DELETE FROM `emprunt` WHERE `objet_stock`=? AND `etudiant`=?";
    connection.query(query, [code,etudiant], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
        return;
      }
        res.json(results);
      
    });
});


app.post('/objet', (req, res) => {
    const id_objet = req.body.id_objet;
    const id_objetcat = req.body.id_objetcat;

    const query = 'SELECT * FROM `objet`';
    connection.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
        return;
      }
        res.json(results);
      
    });
  });

  app.post('/objet/add', authMiddleware, (req, res) => {
    const id_objetcat = req.body.id_objetcat;
    const libelle = req.body.libelle;
    const description = req.body.description;
 
    const query = "INSERT INTO `objet`(`id_cate`, `libelle`, `description`) VALUES (?,?,?)";
    connection.query(query, [id_objetcat,libelle,description], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
        return;
      }
        res.json(results);
      
    });
});

app.post('/objet/update', authMiddleware, (req, res) => {
    const id_objet = req.body.id_objet;
    const id_objetcat = req.body.id_objetcat;
    const libelle = req.body.libelle;
    const description = req.body.description;

    const query = "UPDATE `objet` SET `id_cate`=?, `libelle`=?,`description` =? where `id`=?";
    connection.query(query, [id_objetcat,libelle,description,id_objet], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
        return;
      }
        res.json(results);
      
    });
});

app.post('/objet/delete', authMiddleware, (req, res) => {
    const id_objet = req.body.id_objet;


    const query = "DELETE FROM `objet` WHERE `id`=?";
    connection.query(query, [id_objet], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
        return;
      }
        res.json(results);
      
    });
});

app.post('/etudiant', (req, res) => {
  const id_etudiant = req.body.id_etudiant ?? null;

  if(id_etudiant!=null){
  var query = 'SELECT * FROM étudiant WHERE id= ?';
  connection.query(query, [id_etudiant], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Erreur du serveur');
      return;
    }
      res.json(results);

  });
  }
  else {
  var query = 'SELECT * FROM étudiant';
  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Erreur du serveur');
      return;
    }
      res.json(results);

  });
  }

});

  app.post('/etudiant/add', authMiddleware, (req, res) => {
    const nom_etudiant = req.body.nom_etudiant;
    const prenom_etudiant = req.body.prenom_etudiant;
    const mail_etudiant = req.body.mail_etudiant;
    const tel_etudiant = req.body.tel_etudiant;
 
    const query = "INSERT INTO `etudiant`(`nom`, `prenom`, `mail`, `tel`) VALUES (,?,?,?,?)";
    connection.query(query, [nom_etudiant,prenom_etudiant,mail_etudiant,tel_etudiant], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
        return;
      }
        res.json(results);
      
    });
});

app.post('/etudiant/update', authMiddleware, (req, res) => {
    const id_etudiant = req.body.id_etudiant;
    const nom_etudiant = req.body.nom_etudiant;
    const prenom_etudiant = req.body.prenom_etudiant;
    const mail_etudiant = req.body.mail_etudiant;
    const tel_etudiant = req.body.tel_etudiant;

    const query = "UPDATE `etudiant` SET `nom`=?,`prenom`=?,`mail`=?,`tel`=? WHERE `id`=?";
    connection.query(query, [nom_etudiant,prenom_etudiant,mail_etudiant,tel_etudiant,id_etudiant], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
        return;
      }
        res.json(results);
      
    });
});

app.post('/etudiant/delete', authMiddleware, (req, res) => {
    const id_etudiant = req.body.id_etudiant;

    const query = "DELETE FROM `etudiant` WHERE `id`=?";
    connection.query(query, [id_etudiant], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
        return;
      }
        res.json(results);
      
    });
});


app.post('/user', (req, res) => {
  const id_user = req.body.id_user;

  if (id_user!=null){
  const query = 'SELECT * FROM utilisateur WHERE id= ?';
  connection.query(query, [id_user], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Erreur du serveur');
      return;
    }
      res.json(results);

  });
  }
  else{
    const query = 'SELECT * FROM utilisateur';
    connection.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
        return;
      }
        res.json(results);

    });
  }

});

  app.post('/user/add', authMiddleware, (req, res) => {
    const nom_user = req.body.nom_user;
    const prenom_user = req.body.prenom_user;
    const mail_user = req.body.mail_user;
    const mdp_user = req.body.mdp_user;
    const adress_user = req.body.adress_user;
    const tel_user = req.body.tel_user;
 
    const query = "INSERT INTO `utilisateur`(`nom`, `prenom`, `email`, `password`, `adresse`, `tel`) VALUES (?,?,?,?,?,?,?)";
    connection.query(query, [nom_user,prenom_user,mail_user,mdp_user,adress_user,tel_user], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
        return;
      }
        res.json(results);
      
    });
});

app.post('/user/update', authMiddleware, (req, res) => {
    const id_user = req.body.id_user;
    const nom_user = req.body.nom_user;
    const prenom_user = req.body.prenom_user;
    const mail_user = req.body.mail_user;
    const mdp_user = req.body.mdp_user;
    const adress_user = req.body.adress_user;
    const tel_user = req.body.tel_user;

    const query = "UPDATE `utilisateur` SET `nom`=?, `prenom`=?, `email`=?, `password`=?, `adresse`=?, `tel`=? WHERE `id`=?";
    connection.query(query, [nom_user,prenom_user,mail_user,mdp_user,adress_user,tel_user,id_user], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
        return;
      }
        res.json(results);
      
    });
});

app.post('/user/delete', authMiddleware, (req, res) => {
    const id_user = req.body.id_user;

    const query = "DELETE FROM `utilisateur` WHERE `id`=?";
    connection.query(query, [id_user], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
        return;
      }
        res.json(results);
      
    });
});

app.post('/etudiant/stats/all', authMiddleware, (req, res) => {
    const id_etudiant = req.body.id_etudiant;

    const query = "SELECT COUNT(*) FROM `emprunt` WHERE `etudiant`=?";
    connection.query(query, [id_etudiant], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
        return;
      }
        res.json(results);
      
    });
});

app.post('/etudiant/stats/nr', authMiddleware, (req, res) => {
    const id_etudiant = req.body.id_etudiant;

    const query = "SELECT COUNT(*) FROM `emprunt` WHERE `etudiant`=? and `date_retour_effectue`=NULL";
    connection.query(query, [id_etudiant], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
        return;
      }
        res.json(results);
      
    });
});

  app.post('/accueil', (req, res) => {
    const query = 'SELECT * FROM stock JOIN objet ON stock.objet = objet.id';
    connection.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
        return;
      }
        res.json(results);
      
    });
});

app.post('/categorie', (req, res) => {
  const code_type = req.body.code_type ?? null;

  if(code_type!=null){
  const query = 'SELECT * FROM categorie WHERE id=?';
  connection.query(query, [code_type], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Erreur du serveur');
      return;
    }
    res.json(results);
  });
}
else{
  const query = 'SELECT * FROM categorie';
  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Erreur du serveur');
      return;
    }
    res.json(results);
  });
}
});

app.post('/categorie/all', (req, res) => {
  const query = 'SELECT * FROM categorie';
  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Erreur du serveur');
      return;
    }
    res.json(results);
  });
});

app.get('/', (req, res) => {
  res.json('Hello Worldeeee!')
})

app.get('/test', (req, res) => {
    res.json('YOUHOU')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})