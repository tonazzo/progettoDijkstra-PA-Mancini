//libreria che contiene alcune funzioni di supporto

import { FLOAT } from "sequelize/types"
import { Json } from "sequelize/types/utils"

/** 
*questa funzione permette il calcolo in token del costo derivante dalla creazione di un modello
**/
export function calculateGraphCost(description: JSON){
    //numero di nodi
    let cost_node = Object.keys(description).length
    //per calcolare gli archi conto le occorrenze di ":" e le sottraggo al numero di nodi
    //e le divido per 2 dato che un arco è contato 2 volte (es. da A a B e da B ad A)
    let str = JSON.stringify(description)
    let arch_counter = str.split(":").length - 1
    let cost_arch = (arch_counter - cost_node) / 2 

    return (cost_arch * 0.01) + (cost_node * 0.25)
}


/** 
*questa funzione permette il calcolo dei nodi di un modello
**/
export function calculateNode(description: JSON){
    //numero di nodi
    let cost_node = Object.keys(description).length
    return cost_node
}


/** 
*questa funzione permette il calcolo degli archi di un modello
**/
export function calculateArch(description: JSON){
    
    let cost_node = Object.keys(description).length
    let str = JSON.stringify(description)
    let arch_counter = str.split(":").length - 1
    let cost_arch = (arch_counter - cost_node) / 2 
    return cost_arch
}


/** 
*questa funzione permette il calcolo del numero di variabili
**/
export function calculateVariable(description: JSON){
    //numero di nodi
    let cost_node = Object.keys(description).length
    //per calcolare gli archi conto le occorrenze di ":" e le sottraggo al numero di nodi
    //e le divido per 2 dato che un arco è contato 2 volte (es. da A a B e da B ad A)
    let str = JSON.stringify(description)
    let arch_counter = str.split(":").length - 1
    let cost_arch = (arch_counter - cost_node) / 2 

    return cost_arch + cost_node
}