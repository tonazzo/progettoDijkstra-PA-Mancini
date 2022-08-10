# Cammino minimo Dijkstra (Progetto Pa)
Progetto per del corso di Programmazione Avanzata tenuto dal prof. Mancini

## Obiettivo del progetto
Il progetto consiste in un sistema che consenta di gestire la creazione e valutazione di modelli di ottimizzazione su grafo;l'algoritmo utilizzato per calcolare il cammino minimo è quello di Dijkstra.
il sistema deve prevedere la possibilità di gestire eventuali revisioni dei modelli e di eseguire delle simulazioni.
In particolare il sistema deve avere le seguenti funzionalità:

*Creare un nuovo modello specificando i pesi degli archi
*Eseguire il modello, specificando start e goal
*Creare una revisione di un modello esistente, cambiando pesi e/o aggiungendo/rimuovendo nodi
*Restituire l’elenco delle revisioni di un dato modello
*Restituire l’elenco dei modelli
*Cancellare una revisione di un modello
*Elencare le revisioni che sono state cancellate
*Ripristinare una revisione che è stata cancellata
*Effettuare una simulazione 
*Ricaricare il credito di un cliente



# Funzioni del sistema

| Funzioni | Ruolo |
| ------------- | ------------- |
| Creare nuovo modello  | User  |
| Eseguire il modello  | User  |
| Creare una revisione | User |
| Restituire elenco revisioni per modello  | User  |
| Restituire l’elenco dei modelli  | User  |
| Cancellare una revisione | User  |
| Elencare revisioni cancellate  | User |
| Ripristinare una revisione  | User  |
| Effettuare una simulazione  | User  |
| Ricaricare credito di un utente  | Admin |

Le chiamate vengono gestite tramite richieste HTTP (GET o POST) ed è sempre richiesta l'autenticazione tramite JWT.

# Rotte
| Tipo | Rotte |
| ------------- | ------------- |
| POST | /create-model |
| POST | /execute-model |
| POST | /create-revision |
| GET | /show-revisions |
| GET | /show-models |
| POST | /disable-revision |
| GET | /show-cancelled-revision |
| POST | /enable-revision |
| GET | /simulate-model |
| POST | /refill |

###create-model
Tramite questa richiesta è possibile creare un nuovo modello specificando il grafo con i relativi pesi, per ogni modello valido deve essere addebitato un numero di token predefinito per ogni arco e per ogni nodo.
Da effettuare tramite token JWT che deve contenere un payload JSON con la seguente struttura:
```json
{
    "description":
    {
        "Milano":{
            "Torino": 176,
            "Firenze": 303,
            "Bologna": 214,
            "Venezia": 283
        },
        "Torino":{
            "Milano": 176,
            "Bologna": 332,
            "Firenze": 422
        },
        "Venezia":{
            "Milano": 283,
            "Bologna": 154
        },
        "Bologna":{
            "Milano": 214,
            "Torino": 332,
            "Venezia": 154,
            "Firenze": 107,
            "Ancona": 230,
            "Roma": 376
        },
        "Firenze":{
            "Milano": 303,
            "Torino": 422,
            "Bologna": 107,
            "Ancona": 294,
            "Roma": 274
        },
        "Ancona":{
            "Bologna": 230,
            "Firenze": 294,
            "Roma": 297,
            "Napoli": 418,
            "Bari": 466
        },
        "Roma":{
            "Bologna": 376,
            "Firenze": 274,
            "Ancona": 297,
            "Napoli": 226,
            "Bari": 432
        },
        "Napoli":{
            "Ancona": 418,
            "Roma": 226,
            "Bari": 266,
            "Catanzaro": 403
        },
        "Bari":{
            "Ancona": 466,
            "Roma": 432,
            "Napoli": 266,
            "Catanzaro": 354
        },
        "Catanzaro":{
            "Napoli": 403,
            "Bari": 354
        }
    }
}
```
