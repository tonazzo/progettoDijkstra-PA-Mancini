import { FLOAT, json, NOW, Op, STRING, TIME } from 'sequelize';
import {Users, sequelize, Models, Revisions} from '../model/model';
import { ErrorEnum, getError, Success } from '../factory/factory';
import * as sequelizeQueries from './sequelizeQueries';
import * as utils from '../utils/utils';
import { Json } from 'sequelize/types/utils';
//import { stat } from 'fs';
//import { timeStamp } from 'console';

//importo l'api node-dijkstra
const Graph = require('node-dijkstra')

/**
*Funzione che permette di verificare che l'utente esista data la sua email
*
*@param email -> email dell'utente
*@param res -> risposta da parte del server
*@returns true se esiste, false se non esiste
*
**/
export async function checkUser(email: string, res: any): Promise<boolean> {
    let result: any;
    try {
        result = await Users.findByPk(email, { raw: true });
    } catch (error) {
        controllerErrors(ErrorEnum.ErrServer, error, res);
    }
    return result;
}


/** 
*Funzione che restituisce il ruolo dell'utente data la sua email
*
*@param email -> email dell'utente
*@param res -> risposta da parte del server
*@returns ruolo utente (admin/user)
*
**/
export async function getRole(email: string, res: any): Promise<string> {
    let result: any;
    try {
        result = await Users.findByPk(email, { raw: true });
    } catch (error) {
        controllerErrors(ErrorEnum.ErrServer, error, res);
    }
    return result.role;
}


/** 
*Funzione che restituisce i token rimanenti dell'utente data la sua email
*
*@param email -> email utente
*@param res -> risposta da parte del server
*@returns token utente
*
**/
export async function getToken(email: string, res: any): Promise<number> {
    let result: any;
    try {
        result = await Users.findByPk(email, { raw: true });
    } catch (error) {
        controllerErrors(ErrorEnum.ErrServer, error, res);
    };
    return result.token;
}


/** 
*Funzione che permette di ricaricare il credito dell'utente
*
*@param email -> email utente
*@param token -> nuovo credito da inserire
*@param res -> risposta da parte del server
*
**/
export function refill(email: string, token: number, res: any): void {
    Users.update({ token: token }, { where: { email: email } })
        .then(() => {
            const new_res = new Success().getMsg();
            res.status(new_res.status).json({ status: new_res.status, message: new_res.msg });
        })
        .catch((error) => {
            controllerErrors(ErrorEnum.ErrServer, error, res);
        })
}


/** 
*Funzione che permette all'utente di creare un modello in models con il relativo costo in termini di token
*
*@param user_email -> mail dello user autenticato
*@param model -> oggetto contenente gli attributi necessari per la creazione del modello
*@param res -> risposta da parte del server
*
**/
export async function create_model(user_email: string, model: any, res: any): Promise<any> {
    
    let n_token = await sequelizeQueries.getToken(user_email) //token dell'utente
    let tokenCost = utils.calculateGraphCost(model.description) //calcolo il costo del modello secondo le specifiche di progetto
    
    if(n_token[0][0].token > tokenCost) //se ho abbastanza token per "pagare" il modello da creare
    {
        Users.update({token: n_token[0][0].token - tokenCost}, {where: {email: user_email}}) //detraggo il costo del modello dai token dello user autenticato
        Models.create({user_email: user_email, description: model.description, cost: model.cost = utils.calculateGraphCost(model.description)}) //inserisco il modello nel DB
        .then(() => {
            const new_res = new Success().getMsg();
            res.status(new_res.status).json({ status: new_res.status, message: new_res.msg });
        })
        .catch((error) => {
            controllerErrors(ErrorEnum.ErrServer, error, res);
        })
    }else{
        res.json({
            status: 401,
            msg: "Unauthorized"
        })
    }

}


/** 
*Funzione che permette all'utente di creare una revisione partendo da un modello e pagando
*la metà del costo del modello
*
*@param model_id_f -> id del modello in formato float
*@param model_id -> id del modello che mi servirà in formato string
*@param email -> email dello user autenticato
*@param start -> nodo da cui partire per valutare il modello
*@param goal -> nodo di arrivo del modello
*@param add_node -> nodo/i da aggiungere al modello
*@param add_arch -> arco/i dei relativi nodi aggiunti
*@param remove_node -> nodo da rimuovere
*@param res -> risposta da parte del server
*
**/
export async function create_revision(model_id_f: number, model_id: any, email: string, start: string, goal: string, add_node: string, add_arch: object, remove_node: Array<any>, res: any): Promise<any> {
try {
        let model = await sequelizeQueries.getModelFromId(model_id_f, email) //recupero il grafo nel db 
        const route = new Graph(JSON.parse(model[0][0].description)) //il modello prima di essere modificato
        let modelResult = route.path(start, goal, {cost: true}) //risultato dell'algoritmo di dijkstra
        let tokenCost = await sequelizeQueries.getModelCost(model_id, email) //recupero il costo del modello per poi detrarlo dai token dello user
        let user_token = await sequelizeQueries.getToken(email) //recupero i token dello user per capire se ne ha abbastanza
        let description: string //descrizione che varierà in base a se vengono aggiunti o rimossi nodi, e poi inserita nelle info della revisione nel db

        if(add_node != null && add_arch != null && remove_node == null){ //controllo se devo aggiungere o rimuovere nodi

            description = `it's been added node\s and arch\s: `

            let n_arch_to_change = add_node.length
            for(let j = 0; j < n_arch_to_change; j++){ //attraverso un ciclo riesco ad aggiungere o rimuovere anche più nodi
                let arch_to_add = add_arch[j]
                let arch = JSON.parse(`${JSON.stringify(arch_to_add)}`)
                route.addNode(String(add_node[j][0]), arch)
                description += `[${String(add_node[j][0])} - ${JSON.stringify(arch_to_add)}] `
            }

            let modelResult = route.path(start, goal, {cost: true})
            if(modelResult.path == null){ //se l'esecuzione del modello mi dà risultato null vuol dire che non sono stati recepiti bene gli input
                res.json({
                    status: 401,
                    response: "invalid node"
                })
            }else{ //altrimenti creo la revisione
                Revisions.create({model_id: Number(model[0][0].id), start: start, goal: goal, cost: modelResult.cost, description: description, cancelled: "no", path: String(modelResult.path), date: Date.now(), token_cost: tokenCost[0][0].cost * 0.5})
                    .then(()=>{
                        Users.update({token: user_token[0][0].token - (tokenCost[0][0].cost * 0.5)}, {where: {email: email}}) //detraggo allo user il costo della revisione
                        res.send(route.path(start, goal, {cost: true}))
                    })
                    .catch((error)=>{
                        controllerErrors(ErrorEnum.RevisionsAlreadyExist, error, res);
                    });
                }
        }else if(remove_node != null){
            
            description = `it's been removed node/s: `

            //ciclo per rimuovere (se occorre) più nodi
            for(let j = 0; j < remove_node.length; j++){
                route.removeNode(remove_node[j])
                description = description + " -" + String(remove_node[j])
            }
            let modelResult = route.path(start, goal, {cost: true})
            if(modelResult.path == null){
                res.json({
                    status: 401,
                    response: "invalid node"
                })
            }else{
            Revisions.create({model_id: Number(model[0][0].id), start: start, goal: goal, cost: modelResult.cost, description: description, cancelled: "no", path: String(modelResult.path), date: Date.now(), token_cost: tokenCost[0][0].cost * 0.5})
                .then(()=>{
                    Users.update({token: user_token[0][0].token - (tokenCost[0][0].cost * 0.5)}, {where: {email: email}})
                    res.send(route.path(start, goal, {cost: true}))
                })
                .catch((error)=>{
                    controllerErrors(ErrorEnum.RevisionsAlreadyExist, error, res);
                });
            }
        }else{ // in questo caso non aggiungo o rimuovo nodi ma evidentemente sto modificando lo start node o il goal node
            description = `start or goal node changed`
            if(modelResult.path == null){
                res.json({
                    status: 401,
                    response: "invalid node"
                })
            }else{
            Revisions.create({model_id: Number(model[0][0].id), start: start, goal: goal, cost: modelResult.cost, description: description, cancelled: "no", path: String(modelResult.path), date: Date.now(), token_cost: tokenCost[0][0].cost * 0.5})
                .then(()=>{
                    Users.update({token: user_token[0][0].token - (tokenCost[0][0].cost * 0.5)}, {where: {email: email}})
                    res.send(route.path(start, goal, {cost: true}))
                })
                .catch((error)=>{
                    controllerErrors(ErrorEnum.RevisionsAlreadyExist, error, res);
                });
            }
        }
    } catch (error) {   
        res.json({
            status: 400,
            msg: "no existing revision"
        })
    }
}


    /** 
    *Funzione che permette all'utente di eseguire un modello di sua propietà 
    *pagando in termini di token lo stesso costo per la sua creazione
    *
    *@param model_id -> oggetto contenente l'id del modello
    *@param email -> stringa contenente la mail dello user autenticato
    *@param start -> stringa che indica il nodo iniziale del modello
    *@param goal -> stringa che indica il nodo finale del modello
    *@param res -> risposta da parte del server
    *
    **/
    export async function execute_model(model_id: any, email: string, start: string, goal: string, res: any): Promise<any> {
        
        let n_token = await sequelizeQueries.getToken(email) //token che ha l'utente
        let existId = await sequelizeQueries.existId(model_id, email) //controllo che il modello esista e appartenga all'utente
        let description: any //grafo in json
        let desc: any //la uso per conserva l'id nel caso sia dovuto alla richiesta dell'id di default
        let tokenCost: any //costo in termini di token da sottrarre allo user
        let i_time: number //usati per calcolare il tempo di esecuzione
        let f_time: number //
        

    
        if(existId[0].length != 0){ //se ho fornito l'id del modello eseguo quello, altrimenti eseguo l'ultimo creato
            if(model_id == -1){
                description = await sequelizeQueries.executeModelWithNoVersion(email)
                desc =  await sequelizeQueries.executeModelWithNoVersion(email)
                description = description[0][0].description
                tokenCost = await sequelizeQueries.getModelCost(model_id, email)
            }else{
                description = await Models.findOne({where: {id: model_id}, raw: true})
                desc =  await sequelizeQueries.executeModelWithNoVersion(email)
                description = description.description
                tokenCost = await sequelizeQueries.getModelCost(model_id, email)
            }
            
            const route = new Graph(JSON.parse(description))
            i_time = performance.now()
            let modelResult = route.path(start, goal, {cost: true}) //eseguo il modello
            f_time = performance.now()
            let calc_time = f_time - i_time //calcolo il tempo di esecuzione in millisecondi

            if(n_token[0][0].token >= tokenCost[0][0].cost){ //se l'utente se lo può permettere...
                if(modelResult.path == null){
                    res.json({
                        status: 401,
                        response: "invalid node"
                    })
                }else{
                    Users.update({token: n_token[0][0].token - tokenCost[0][0].cost}, {where: {email: email}})
                    //ogni volta che eseguo un modello creo una revisione a patto che non esista una revisione identica
                    console.log("\n\n\n\n\n"+ desc[0][0].id +"\n\n\n\n")
                    Revisions.create({model_id: desc[0][0].id, start: start, goal: goal, cost: modelResult.cost, description: 'basic model execution', cancelled: "no", path: String(modelResult.path), date: Date.now(), token_cost: tokenCost[0][0].cost * 0.5})
                    .then(()=>{
                        res.json({
                            modelResult,
                            exec_time : calc_time
                        })
                    })
                    .catch((error)=>{
                        controllerErrors(ErrorEnum.RevisionsAlreadyExist, error, res);
                    });
                    
                }
            }else{
                res.json({
                    status: 401,
                    msg: "Unauthorized"
                })
            }
        }else{
            res.json({
                status: 400,
                msg: "no existing Id"
            })
        }
    }


/** 
*Funzione che permette di cancellare logicamente una revisione
*
*@param  id -> id della revisione da disabilitare
*@param  date -> necessito della data poiché mi permette di instaurare una chiave nel db insieme all'id
*@param  email -> email dello user autenticato
*
**/
export async function disable_revision(id: number, date: number, email:string, res: any): Promise<any> {
    let revision_to_disable: any
    revision_to_disable = await sequelizeQueries.disableOrEnableRevision(email, id) //query che ritorna l'elenco delle revisione associate allo user autenticato
    let cancelled = "yes" //se nel db cancelled = yes vuol dire che quella revisione è logicamente disabilitata

    let contains = false 
    for(let i = 0; i < revision_to_disable[0].length; i++){ //ciclo per vedere se esiste una revisione con tale data
        if (revision_to_disable[0][i].date == date){
            contains = true
        }
    }

    if(revision_to_disable[0] != "" && contains){
        console.log(revision_to_disable[0][1])
        Revisions.update({cancelled: cancelled}, {where: {date: date, model_id: revision_to_disable[0][0].model_id}})
            .then(() => {
                const new_res = new Success().getMsg();
                res.status(new_res.status).json({ status: new_res.status, message: new_res.msg });
            })
            .catch((error) => {
                controllerErrors(ErrorEnum.ErrRevision, error, res);
            })
    }else{
        res.json({
            status: 401,
            msg: "revision does not exist"
        })
    }
}



/** 
*Funzione che permette di abilitare logicamente una revisione, la logica è duale alla disable_revisions di cui sopra
*
*@param  id -> id della revisione da disabilitare
*@param  date -> necessito della data poiché mi permette di instaurare una chiave nel db insieme all'id
*@param  email -> email dello user autenticato
*
**/
export async function enable_revision(id: number, date: number, email:string, res: any): Promise<any> {
    let revision_to_enable: any
    revision_to_enable = await sequelizeQueries.disableOrEnableRevision(email, id)
    let cancelled = "no"

    let contains = false 
    for(let i = 0; i < revision_to_enable[0].length; i++){ //ciclo per vedere se esiste una revisione con tale data
        if (revision_to_enable[0][i].date == date){
            contains = true
        }
    }

    if(revision_to_enable[0] != "" && contains){
        Revisions.update({cancelled: cancelled}, {where: {model_id: revision_to_enable[0][0].model_id, date: date}})
            .then(() => {
                const new_res = new Success().getMsg();
                res.status(new_res.status).json({ status: new_res.status, message: new_res.msg });
            })
            .catch((error) => {
                controllerErrors(ErrorEnum.ErrRevision, error, res);
            })
    }else{
        res.json({
            status: 401,
            msg: "revision does not exist"
        })
    }
}


/** 
*Funzione che permette di mostrare le revisioni logicamente cancellate
*
*@param email -> email dello user autenticato (può vedere solo le proprie revisioni)
*
**/
export async function show_cancelled_revision(email:string, res: any): Promise<any> {

    let cancelledRevisions = await sequelizeQueries.showCancelledRevision(email) //recupero le mail con colonna cancelled = "yes"
    let aJson: any[] = []; //array nel quale inserire le revisioni da mostrare

    for (let element of cancelledRevisions[0]) {
        aJson.push({
            id: element.model_id,
            date: element.date
        })
    }
    res.send(aJson)
}

/** 
*Funzione che permette di mostrare i modelli dello user autenticato
*eventualmente filtrando per numero di nodi e/o archi
*
*@param email -> email dello user autenticato (può vedere solo le proprie revisioni)
*@param node -> filtro numero di nodi
*@param arch -> filtro numero di archi
*
**/
export async function show_models(email:string, node:any, arch:any, res: any): Promise<any> {

    let modelList = await sequelizeQueries.showModels(email)  //lista dei modelli dello user autenticato

    let aJson: any[] = []; //array composto dai modelli dello user eventualmente filtrati
    for (let element of modelList[0]) {

        let n_node = utils.calculateNode(JSON.parse(element.description)) //calcolo il numero di nodi del modello che sto valutando
        let n_arch = utils.calculateArch(JSON.parse(element.description)) //lo stesso per gli archi

        if(node != null && arch != null){ //in questa serie di if vedo se applicare il filtro ai nodi agli archi o a entrambi e nel mentre popolo l'array
            if (n_node == node && n_arch == arch){
                aJson.push({
                    id: element.id,
                    node: n_node,
                    arch: n_arch
                })
            }
        }else if(node != null && arch == null){
            if (n_node == node){
                aJson.push({
                    id: element.id,
                    node: n_node,
                    arch: n_arch
                })
            }
        }else if(node == null && arch != null){
            if (n_arch == arch){
                aJson.push({
                    id: element.id,
                    node: n_node,
                    arch: n_arch
                })
            }
        }else{
            aJson.push({
                id: element.id,
                node: n_node,
                arch: n_arch
            })
        }
    }
    if (aJson.length != 0){
        res.send(aJson)
    }else{
        res.json({
            status: 200,
            msg: "no result"
        })
    }
}


/** 
*Funzione che permette di mostrare le revisioni eventualmente filtrando
*per numero di variabili e/o data di creazione (in timestamp)
*la logica è duale allo show_models di cui sopra
*
*@param email -> email dello user autenticato
*@param n_variables -> numero di variabili inteso come la somma di archi e nodi
*@param date -> data di creazione della revisione in timestamp
*
**/
export async function show_revisions(email:string, n_variables:any, date:any, res: any): Promise<any> {

    let revisionList = await sequelizeQueries.showRevisions(email)  

    let aJson: any[] = [];
    for (let element of revisionList[0]) {

        let calcVariable = utils.calculateVariable(JSON.parse(element.description))
        let dates = element.date

        if(n_variables != null && date != null){
            if (n_variables == calcVariable && dates == date){
                aJson.push({
                    id: element.id,
                    description: String(element.desc),
                    n_variables: calcVariable,
                    date: dates
                })
            }
        }else if(n_variables != null && date == null){
            if (n_variables == calcVariable){
                aJson.push({
                    id: element.id,
                    description: String(element.desc),
                    n_variables: calcVariable,
                    date: dates
                })
            }
        }else if(n_variables == null && date != null){
            if (dates == date){
                aJson.push({
                    id: element.id,
                    description: String(element.desc),
                    n_variables: calcVariable,
                    date: dates
                })
            }
        }else{aJson.push({
                id: element.id,
                description: String(element.desc),
                n_variables: calcVariable,
                date: dates
            })
        }
    }
    if (aJson.length != 0){
        res.send(aJson)
    }else{
        res.json({
            status: 200,
            msg: "no result"
        })
    }
    
}


/** 
*Funzione che permette di effettuare una simulazione che consenta di variare (possono essere combinate):
*Peso relativo ad un arco specificando il valore di inizio, fine ed il passo di incremento
*Peso relativo a più archi specificando per ogni arco il valore di inizio, fine ed il passo di incremento
*ritorna l’elenco di tutti i risultati
*ritorna il best result con la relativa configurazione dei pesi che sono stati usati
*
*@param email -> email dello user autenticato
*@param model_id -> id del modello
*@param start -> nodo di inizio percorso
*@param goal -> nodo di fine percorso
*@param arch_to_change -> arco o lista di archi di cui far variare il peso
*@param other_arch -> l'api quando aggiunge un arco rimuove tutta l'informazione che conteneva prima quel nodo, quindi c'è necessità di riaggiungere tutti gli altri archi
*@param start_stop_step -> variabilità del peso dell'arco, da start a stop con passo step (es start 0, stop 1, step 0.1 ->avrò: [0 - 0.1 - 0.2 - etc... fino a 1])
*
**/
export async function simulate_model(email: string, model_id: any, start: string, goal: string, arch_to_change:Array<any>, other_arch:object, start_stop_step:Array<number>, res: any): Promise<any> {
      
    //controlli di validazione sui pesi poiché lo start non può essere più grande dello stop e lo step vogliamo sia un multiplo di entrambi i valori e che sia più piccolo
    let stopMajorThenStart: boolean = false
    let multiple: boolean = false
    let stepMinor: boolean = false
    for(let k = 0; k < start_stop_step.length; k++){
        stopMajorThenStart = start_stop_step[k][0] < start_stop_step[k][1]
        multiple = (start_stop_step[k][0]%start_stop_step[k][2] == 0 && start_stop_step[k][1]%start_stop_step[k][2] == 0)
        stepMinor = start_stop_step[k][2] < start_stop_step[k][1] && start_stop_step[k][2] < start_stop_step[k][0]
    }


    let aJson: any[] = []
    let best_result: number = Infinity //miglior risultato in termini di costo di cammino minimo, parte da infinito e se trova un numero più piccolo diventa quest'ultimo
    let best_config: string = "" //miglior configurazione di pesi, si aggiorna insime al best_result
    let n_arch_to_change = arch_to_change.length //numero degli archi che devo cambiare

    for(let j = 0; j < n_arch_to_change; j++){

        if(stopMajorThenStart && multiple && stepMinor){
            let existId = await sequelizeQueries.existId(model_id, email) //controllo se esiste il modello che voglio simulare
            let description: any

            
            if(existId[0] != 0){
                if(model_id == ""){
                    res.json({
                        status: 200,
                        msg: "insert id"
                    })
                }else{
                    description = await Models.findOne({where: {id: model_id}, raw: true})
                    description = description.description
                } 

                for(let i = start_stop_step[j][0]; i <= start_stop_step[j][1]; i = i + start_stop_step[j][2]) //ciclo che parte da start arriva a stop con passo step, sono i pesi variabili dell'arco
                {
                    const route = new Graph(JSON.parse(description))

                    let new_arch = String(arch_to_change[j][1])
                    let new_node = i                                                                                           //mi creo le condizioni favorevoli ad aggiungere degli archi con i nuovi pesi
                    let otherArch = other_arch[j] 

                    let arch = JSON.parse(`{"${new_arch}":${new_node}, ${JSON.stringify(otherArch).substring(1)}`)
                    
                    route.addNode(String(arch_to_change[j][0]), arch) // aggiungo l'arco con nuovo peso più gli archi che erano già presenti

                    let modelResult = route.path(start, goal, {cost: true})

                    if (modelResult.cost < best_result){ //aggiorno, se migliore, il best_result e la best_config
                        best_result = modelResult.cost
                        best_config = best_config + ` [${arch_to_change[j][0]}-${new_arch}-${new_node}] `
                    }

                    aJson.push({
                        nodo_arco_costo: `${arch_to_change[j][0]} - ${new_arch} - ${new_node}`,
                        path: modelResult.path,
                        cost: modelResult.cost
                    })
                }
            }else{
                res.json({
                    status: 400,
                    msg: "no existing Id"
                })
            }
        }else{
            res.json({
                status: 200,
                msg: "incorrect weights"
            })
        }
    }
    aJson.push({ //aggingo alla lista l'info sulle scelte migliori da effettuare
        best_result : best_result,
        best_config : best_config
    })
    res.json(aJson)
}


/**
 * Funzione che viene richiamata dalle altre funzioni del Controller in caso di errori. 
 * 
 *@param enum_error -> enum che identifica il tipo di errore
 *@param err -> errore che si presenta
 *@param res -> risposta da parte del server
 *
 **/
function controllerErrors(enum_error: ErrorEnum, err: Error, res: any): void {
    const new_err = getError(enum_error).getMsg();
    console.log(err);
    res.status(new_err.status).json({ error: new_err.status, message: new_err.msg });
}





