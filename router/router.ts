import * as express from 'express';
import * as Controller from '../controller/controller';
import * as Middleware_CoR from '../middleware/middleware_CoR';
import * as Middleware from '../middleware/middleware';

const app = express();
app.use(express.json());
app.get('/', function (req:any, res:any){
    res.send("Homepage")
})


/*
*Rotta che consente di ricaricare i token di un utente data la sua mail
*/
app.post('/refill', Middleware_CoR.authentication, Middleware_CoR.refill, Middleware_CoR.catchError, function (req: any, res: any) {
    Controller.refill(req.body.email, req.body.token, res)
});


/*
*Rotta che consente ad un utente autenitcato user di creare un modello
*/
app.post('/create-model', Middleware_CoR.authentication, Middleware_CoR.createModel, Middleware_CoR.catchError, (req: any, res: any)=> {
    Controller.create_model(req.bearer.email, req.body, res)
});


/*
*Rotta che consente ad un utente autenitcato user di eseguire un modello
*questo una volta eseguito diventerà una revisione
*/
app.post('/execute-model', Middleware_CoR.authentication, Middleware_CoR.executeModel, Middleware_CoR.catchError, (req: any, res: any)=> {
    Controller.execute_model(req.body.model_id, req.bearer.email, req.body.start, req.body.goal, res)
});


/*
*Rotta che consente ad un utente auteniticato user di modificare un modello
*(es. cambiando pesi e/o aggiungendo/rimuovendo nodi)
*il quale diventerà una revisione
*/
app.post('/create-revision', Middleware_CoR.authentication, Middleware_CoR.createRevision, Middleware_CoR.catchError, (req: any, res: any)=> {
    Controller.create_revision(req.body.model_id, req.body.model_id, req.bearer.email, req.body.start, req.body.goal, req.body.add_node, req.body.add_arch, req.body.remove_node, res)
});


/*
*Rotta che permette la cancellazione logica di una revisione
*/
app.post('/disable-revision', Middleware_CoR.authentication, Middleware_CoR.disableRevision, Middleware_CoR.catchError, (req: any, res: any)=> {
    Controller.disable_revision(req.body.revision_id, req.body.date, req.bearer.email, res)
});


/*
*Rotta che permette la riattivazione logica di una revisione
*/
app.post('/enable-revision', Middleware_CoR.authentication, Middleware_CoR.enableRevision, Middleware_CoR.catchError, (req: any, res: any)=> {
    Controller.enable_revision(req.body.revision_id, req.body.date, req.bearer.email, res)
});


/*
*Rotta che permette di elencare le revisioni cancellate
*/
app.get('/show-cancelled-revision', Middleware_CoR.authentication, Middleware_CoR.showCancelledRevision, Middleware_CoR.catchError, (req: any, res: any)=> {
    Controller.show_cancelled_revision(req.bearer.email, res)
});


/*
*Rotta che permette di elencare i modelli eventualmente filtrando per nodi e/o archi
*/
app.get('/show-models', Middleware_CoR.authentication, Middleware_CoR.showModels, Middleware_CoR.catchError, (req: any, res: any)=> {
    Controller.show_models(req.bearer.email, req.body.n_node, req.body.n_arch, res)
});


/*
*Rotta che permette di elencare le revisioni eventualmente filtrando per numero di variabili e/o data
*/
app.get('/show-revisions', Middleware_CoR.authentication, Middleware_CoR.showRevisions, Middleware_CoR.catchError, (req: any, res: any)=> {
    Controller.show_revisions(req.bearer.email, req.body.n_variables, req.body.date, res)
});


/*
*Rotta che permette di effettuare una simulazione che consenta di variare 
*Peso relativo ad un arco o più specificando il valore di inizio, fine e il passo di incremento
*/
app.get('/simulate-model', Middleware_CoR.authentication, Middleware_CoR.showModels, Middleware_CoR.catchError, (req: any, res: any)=> {
    Controller.simulate_model(req.bearer.email, req.body.model_id, req.body.start, req.body.goal, req.body.arch_to_change, req.body.other_arch, req.body.start_stop_step, res)
});


/*
Rotte non esistenti
*/
app.get('*', Middleware.routeNotFound, Middleware_CoR.catchError);
app.post('*', Middleware.routeNotFound, Middleware_CoR.catchError);

//app in ascolto sulla porta 3000
app.listen(3000, () => {
  console.log('The application is running on localhost:3000!');
});