# Cammino minimo Dijkstra (Progetto Pa)
Progetto per del corso di Programmazione Avanzata tenuto dal prof. Mancini

## Obiettivo del progetto
Il progetto consiste in un sistema che consenta di gestire la creazione e valutazione di modelli di ottimizzazione su grafo; l'algoritmo utilizzato per calcolare il cammino minimo è quello di **Dijkstra**.  
Al fine di sviluppare il progetto, abbiamo utilizzato come grafo d'esempio la mappa dell'Italia che collega alcuni capoluoghi di regione:
![italy_map_route](https://raw.githubusercontent.com/tonazzo/progettoDijkstra-PA-Mancini/main/italy_map_route.png)  
Il sistema deve prevedere la possibilità di gestire eventuali revisioni dei modelli e di eseguire delle simulazioni.
In particolare il sistema deve avere le seguenti funzionalità:

* [x]  Creare un nuovo modello specificando i pesi degli archi
* [x] Eseguire il modello, specificando start e goal
* [x] Creare una revisione di un modello esistente, cambiando pesi e/o aggiungendo/rimuovendo nodi
* [x] Restituire l’elenco delle revisioni di un dato modello
* [x] Restituire l’elenco dei modelli
* [x] Cancellare una revisione di un modello
* [x] Elencare le revisioni che sono state cancellate
* [x] Ripristinare una revisione che è stata cancellata
* [x] Effettuare una simulazione 
* [x] Ricaricare il credito di un cliente



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

Le chiamate vengono gestite tramite richieste HTTP (**GET** o **POST**) ed è sempre richiesta l'autenticazione tramite **JWT**.

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

### /create-model
Tramite questa richiesta è possibile creare un nuovo modello specificando il grafo con i relativi pesi, per ogni modello valido deve essere addebitato un numero di token predefinito per ogni arco e per ogni nodo.  
Da effettuare tramite token **JWT** che deve contenere un payload JSON con la seguente struttura:
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

### /execute-model
Tramite questa richiesta è possibile eseguire il modello specificando l’eventuale versione altrimenti di default si considererà l’ultima.  
Da effettuare tramite token **JWT** che deve contenere un payload JSON con la seguente struttura:
* Specificando la versione
```json
{
    "model_id": "32",
    "start": "Milano",
    "goal": "Bari"
}
```
* Default
```json
{
    "model_id": "-1",
    "start": "Milano",
    "goal": "Catanzaro"
}
```

### /create-revision
Tramite questa richiesta è possibile creare una revisione di un modello esistente: aggiungendo uno o più nodi, rimuovendo uno o più nodi oppure cambiando lo Start o il Goal.  
Da effettuare tramite token **JWT** che deve contenere un payload JSON con la seguente struttura:
* Aggiunta di un singolo nodo
```json
{
    "model_id": 32,
    "start": "Ancona",
    "goal": "Catanzaro",
    "add_node": [["Ancona"]],
    "add_arch": [{"Bari":450, "Napoli": 418, "Roma": 297}],
    "remove_node": null
}
```
* Aggiunta di multipli nodi
```json
{
    "model_id": 32,
    "start": "Ancona",
    "goal": "Catanzaro",
    "add_node": [["Ancona"], ["Ancona"]],
    "add_arch": [{"Bari":450, "Napoli": 418, "Roma": 297}, {"Bari":150, "Napoli": 418, "Roma": 297}],
    "remove_node": null
}
```
* Cancellazione di un singolo nodo
```json
{
    "model_id": 32,
    "start": "Ancona",
    "goal": "Catanzaro",
    "add_node": "",
    "add_arch": null,
    "remove_node": [["Bari"],["Roma"]]
}
```
* Cancellazione di multipli nodi
```json
{
    "model_id": 32,
    "start": "Ancona",
    "goal": "Catanzaro",
    "add_node": "",
    "add_arch": null,
    "remove_node": ["Bari"]
}
```
* Cambio Start o Goal
```json
{
    "model_id": 32,
    "start": "Ancona",
    "goal": "Roma",
    "add_node": "",
    "add_arch": null,
    "remove_node": null
}
```

### /show-revisions
Tramite questa richiesta è possibile ottenere l’elenco dele revisioni di un dato modello filtrando per data della modifica e/o per numero di variabili.  
Da effettuare tramite token **JWT** che deve contenere un payload JSON con la seguente struttura:
* Senza filtri
```json
{
    "n_variables": null,
    "date": null
}
```
* Filtro data modifica
```json
{
    "n_variables": 30,
    "date": 1660043320819
}
```
* Filtro n° variabili
```json
{
    "n_variables": 30,
    "date": null
}
```
* Entrambi i filtri
```json
{
    "n_variables": null,
    "date": 1660043320819
}
```

### /show-models
Tramite questa richiesta è possibile ottenere l’elenco dei modelli filtrando per numero di nodi e/o numero di archi.  
Da effettuare tramite token **JWT** che deve contenere un payload JSON con la seguente struttura:
* Senza filtri
```json
{
    "n_node": null,
    "n_arch": null
}
```
* Filtro n° nodi
```json
{
    "n_node": 10,
    "n_arch": null
}
```
* Filtro n° archi
```json
{
    "n_node": null,
    "n_arch": 20
}
```
* Entrambi i filtri
```json
{
    "n_node": 10,
    "n_arch": 20
}
```

### /disable-revision
Tramite questa richiesta è possibile cancellare una revisione di un modello.  
Da effettuare tramite token **JWT** che deve contenere un payload JSON con la seguente struttura:
```json
{
    "revision_id": 32,
    "date": 1660043789043
}
```

### /show-cancelled-revision
Tramite questa richiesta è possibile ottenere l’elenco delle revisioni che sono state cancellate.  
Da effettuare tramite token JWT.


### /enable-revision
Tramite questa richiesta è possibile ripristinare una revisione che è stata cancellata.  
Da effettuare tramite token JWT che deve contenere un payload JSON con la seguente struttura:
```json
{
    "revision_id": 32,
    "date": 1660043789043
}
```

### /simulate-model
Tramite questa richiesta è possibile effettuare una simulazione che consenta di variare: 
* peso di un arco specificando valore iniziale, finale e il passo di incremento;
* peso di più archi specificando valore iniziale, finale e passo di incremento;
Da effettuare tramite token **JWT** che deve contenere un payload JSON con la seguente struttura:

* Variando singolo arco
```json
{
    "model_id": 32,
    "start": "Ancona",
    "goal": "Catanzaro",
    "arch_to_change": [["Ancona", "Bari"]],
    "other_arch": [{"Napoli": 418, "Roma": 297}],
    "start_stop_step": [[450, 550, 50]]
}
```
* Variando multipli archi
```json
{
    "model_id": 32,
    "start": "Ancona",
    "goal": "Catanzaro",
    "arch_to_change": [["Ancona", "Bari"], ["Ancona", "Napoli"]],
    "other_arch": [{"Napoli": 418, "Roma": 297}, {"Roma": 297}],
    "start_stop_step": [[450, 550, 50], [100, 150, 50]]
}
```

### /refill 
Tramite questa richiesta è possibile ricaricare il credito di un utente; può essere richiamata solo dagli utenti autenticati con ruolo di admin.  
Da effettuare tramite token **JWT** che deve contenere un payload JSON con la seguente struttura:
```json
{
    "email": "rich@dj.it",
    "token": 600
}

```

# PROGETTAZIONE – UML

## Use Case Diagram

![UseCase](https://raw.githubusercontent.com/GiovanniBaldascino/progettoDijkstra-PA-Mancini/main/UseCase.png)

## Interaction Overview Diagram

![InteractionOverview](https://raw.githubusercontent.com/GiovanniBaldascino/progettoDijkstra-PA-Mancini/main/InteractionOverview.jpg)

## Sequence Diagram

### Creare modello
![1SD](https://raw.githubusercontent.com/GiovanniBaldascino/progettoDijkstra-PA-Mancini/main/1SD.png)
### Eseguire modello
![2SD](https://raw.githubusercontent.com/GiovanniBaldascino/progettoDijkstra-PA-Mancini/main/2SD.png)
### Creare revisione
![3SD](https://raw.githubusercontent.com/GiovanniBaldascino/progettoDijkstra-PA-Mancini/main/3SD.png)
### Elenco revisioni
![8SD](https://raw.githubusercontent.com/GiovanniBaldascino/progettoDijkstra-PA-Mancini/main/8SD.png)
### Elenco modelli
![7SD](https://raw.githubusercontent.com/GiovanniBaldascino/progettoDijkstra-PA-Mancini/main/7SD.png)
### Cancellare revisione
![4SD](https://raw.githubusercontent.com/GiovanniBaldascino/progettoDijkstra-PA-Mancini/main/4SD.png)
### Elenco revisioni cancellate
![6SD](https://raw.githubusercontent.com/GiovanniBaldascino/progettoDijkstra-PA-Mancini/main/6SD.png)
### Ripristinare revisione
![5SD](https://raw.githubusercontent.com/GiovanniBaldascino/progettoDijkstra-PA-Mancini/main/5SD.png)
### Effettuare simulazione
![9SD](https://raw.githubusercontent.com/GiovanniBaldascino/progettoDijkstra-PA-Mancini/main/9SD.png)
### Ricaricare credito
![10SD](https://raw.githubusercontent.com/GiovanniBaldascino/progettoDijkstra-PA-Mancini/main/10SD.png)

# PATTERN UTILIZZATI

## Factory Method
Il **factory method** è un pattern di progettazione creazionale che fornisce un’interfaccia per la creazione di oggetti in una superclasse, ma consente alle sottoclassi di modificare il tipo di oggetti che verranno creati.  
Nel nostro progetto utilizziamo questo pattern per la creazione dei messaggi relativi allo stato dell'operazione che si vuole compiere, se questa va a buon fine verrà segnalato un successo, altrimenti un errore.

## Singleton
Il **singleton** è un design pattern creazionale che ha lo scopo di garantire che di una determinata classe venga creata una e una sola istanza, e di fornire un punto di accesso globale a tale istanza.  
Nel nostro progetto lo utilizziamo per effettuare la connesione al database, in maniera tale che di essa vi sia una sola istanza così da non consumare inutilmente risorse computazionali.

## Chain Of Responsability & Middleware
La **catena di responsabilità** è un pattern comportamentale che consente di passare le richieste lungo una catena di gestori. Alla ricezione di una richiesta, ciascun handler decide di elaborare la richiesta o di passarla al successivo handler della catena.  
È molto simile ad un decoratore ma a differenza di quest’ultimo, la catena di responsabilità può essere interrotta.  
La Catena di Responsabilità è formata da degli handler (funzioni o metodi), che hanno lo scopo di verificare se quello che gli viene passato soddisfa o meno dei criteri. Se il criterio è soddisfatto, non si ritorna, come avveniva nel Proxy, ma si va avanti passando il controllo all’handler successivo.  
Le funzioni **middleware** sono funzioni che hanno accesso all'oggetto richiesta (req), all'oggetto risposta (res) e alla successiva funzione **middleware** nel ciclo richiesta-risposta dell'applicazione. La funzione **middleware** successiva è comunemente indicata da una variabile denominata next.  
Nel progetto utilizziamo la **catena di responsabilità** insieme al **middleware** per verificare che per ciascuna delle operazioni che si vogliono compiere siano rispettati tutti i requisiti, se così non fosse il **middleware** che non viene rispettato segnalerà l'errore opportuno.

# Come avviare il progetto
Per poter eseguire il progetto è necessario aver installato **Docker**.

Gli step sono i seguenti:
1. Clonare repository,
2. Attivare docker,
3. All'interno della cartella, aprire il terminale e digitare: *docker compose build* (Attendere che l'esecuzione sia completata),
4. Digitare: *docker compose up* (Attendere che l'esecuzione sia completata),
5. Il programma è in esecuzione.



