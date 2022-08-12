/** 
*
*Utilizzo del design pattern "Factory" per la gestione efficiente degli errori
*
*
*Interfaccia utilizzata da tutte le classi sottostanti per definire il messaggio di errore
*
**/

interface Msg {
    getMsg():{status: number, msg: string};
}

class ErrTokenHeader implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 400,
            msg: "Error token header"
        }
    }
}

class ErrJWT implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 400,
            msg: "Missing token"
        }
    }
}

class ErrJSONPayload implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 400,
            msg: "Malformed payload"
        }
    }
}

class ErrPayloadHeader implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 400,
            msg: "Payload header error"
        }
    }
}

class ErrNotAdmin implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 401,
            msg: "User is not admin"
        }
    }
}


class ErrCheckAdmin implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 404,
            msg: "Admin not found"
        }
    }
}


class ErrUser implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 404,
            msg: "User not found"
        }
    }
}


class ErrInsufficientToken implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 401,
            msg: "Unauthorized"
        }
    }
}

class ErrRouteNotFound implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 404,
            msg: "Route not found"
        }
    }
}

class ErrServer implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 500,
            msg: "Server error"
        }
    }
}



export class Success implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 200,
            msg: "Successful operation"
        }
    }
}

export class ErrorGenreal implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 400,
            msg: "General Error, can't handle"
        }
    }
}

export class ErrRevision implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 404,
            msg: "Revision not exist"
        }
    }
}

export class RevisionsAlreadyExist implements Msg {
    getMsg(): { status: number; msg: string; } {
        return {
            status: 409,
            msg: "Revision already exist"
        }
    }
}


/*
*Enumerazione per identificare i diversi tipi di errore
*/
export enum ErrorEnum {
    ErrTokenHeader,
    RevisionsAlreadyExist,
    MissingToken,
    MalformedPayload,
    ErrPayloadHeader,
    ErrCheckAdmin,
    ErrNotAdmin,
    ErrUser,
    ErrInsufficientToken,
    ErrRouteNotFound,
    ErrServer,
    ErrUserNotOwner,
    ErrorGenreal,
    ErrRevision
}

/** 
*Funzione che permette di restituire un oggetto in base all'enum in input
**/
let val: Msg;
export function getError(type: ErrorEnum): Msg{
    switch (type)
    {
        case ErrorEnum.ErrTokenHeader:
            val = new ErrTokenHeader();
            break;
        case ErrorEnum.RevisionsAlreadyExist:
        val = new RevisionsAlreadyExist();
        break;
        case ErrorEnum.MissingToken:
            val = new ErrJWT();
            break;
        case ErrorEnum.MalformedPayload:
            val = new ErrJSONPayload();
            break;
        case ErrorEnum.ErrPayloadHeader:
            val = new ErrPayloadHeader();
            break;
        case ErrorEnum.ErrNotAdmin:
            val = new ErrNotAdmin();
            break;
        case ErrorEnum.ErrCheckAdmin:
            val = new ErrCheckAdmin();
            break;
        case ErrorEnum.ErrUser:
            val = new ErrUser();
            break;
        case ErrorEnum.ErrInsufficientToken:
            val = new ErrInsufficientToken();
            break;
        case ErrorEnum.ErrRouteNotFound:
            val = new ErrRouteNotFound();
            break;
        case ErrorEnum.ErrServer:
            val = new ErrServer();
            break;
        case ErrorEnum.ErrRevision:
            val = new ErrRevision();
            break;
        default: ErrorEnum.ErrorGenreal
            val = new ErrorGenreal();
    } return val;
}