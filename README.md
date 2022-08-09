# Cammino minimo Dijkstra (Progetto Pa)
Progetto per del corso di Programmazione Avanzata tenuto dal prof. Mancini

## Obiettivo del progetto
Il progetto consiste in un sistema che consenta di gestire la creazione e valutazione di modelli di ottimizzazione su grafo; il sistema deve prevedere la possibilità di gestire eventuali revisioni dei modelli e di eseguire delle simulazioni.
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

