import { Utils } from 'sequelize/types';
import { sequelize} from '../model/model';
import * as utils from '../utils/utils';

/** 
*query postgres utili in controller.ts, il loro utilizzo è lì esplicato 
*
*
**/


export async function getToken(email: string): Promise<any> {
    let result = sequelize.query("SELECT token FROM users WHERE email = '" + email + "'",
        {
            raw: true
        });
    return result
}


export async function getModelCost(id: number, email: string): Promise<any> {
    
    if(id != -1){
        let result = sequelize.query("SELECT cost FROM models WHERE id = '" + id + "' AND user_email = '" + email + "'",
            {
                raw: true
            });
        return result
    }else{
        let result = sequelize.query("SELECT cost FROM models WHERE user_email = '" + email + "' ORDER BY id DESC LIMIT 1",
            {
                raw: true
            });
        return result
    }
}


export async function executeModelWithNoVersion(email: string): Promise<any> {
    let result = sequelize.query("SELECT description, id FROM models WHERE user_email = '" + email + "' ORDER BY id DESC LIMIT 1" ,
        {
            raw: true
        });
    return result
}


export async function getModelFromId(id: number, email: string): Promise<any> {
    if(id != -1){
        let result = sequelize.query("SELECT id, description FROM models WHERE id = '" + id + "' AND user_email = '" + email + "'",
            {
                raw: true
            });
        return result
    }else{
        let result = sequelize.query("SELECT id, description FROM models WHERE user_email = '" + email + "' ORDER BY id DESC LIMIT 1",
            {
                raw: true
            });
        return result
    }
}


export async function existId(id: number, email: string): Promise<any> {
    if(id != -1){
        let result = sequelize.query("SELECT * FROM models WHERE id = " + id + "AND user_email = '" + email +"'",
            {
                raw: true
            });
        return result
    }else{
        let result = sequelize.query("SELECT * FROM models WHERE user_email = '" + email +"'",
        {
            raw: true
        });
    return result
    }
}


export async function disableOrEnableRevision(email: string, revision_id:number): Promise<any> {
    let revisionExist = sequelize.query("SELECT r.model_id, r.date FROM revisions r JOIN models m ON r.model_id = m.id WHERE m.user_email = '" + email + "' and r.model_id = " + revision_id,{raw: true});
    return revisionExist
    
}


export async function showCancelledRevision(email: string): Promise<any> {
    let revisionExist = sequelize.query("SELECT * FROM revisions r JOIN models m ON r.model_id = m.id WHERE m.user_email = '" + email + "' and r.cancelled = 'yes'",
    {
        raw: true
    });
    return revisionExist
}


export async function showModels(email: string): Promise<any> {
    let modelList = sequelize.query(`SELECT id, description FROM models WHERE user_email = '${email}'`,
    {
        raw: true
    });
    return modelList
}


export async function showRevisions(email: string): Promise<any> {
    let modelList = sequelize.query("SELECT *, r.description as desc FROM revisions r JOIN models m ON r.model_id = m.id WHERE m.user_email = '" + email + "'",
    {
        raw: true
    });
    return modelList
}