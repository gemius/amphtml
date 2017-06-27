import {writeScript, validateData} from '../3p/3p';

const EMITTER_DOMAIN = '.adocean.pl';
const ADO_JS_PATH = '/files/js/ado.js';

function getBoolFromString(str) {
    return str === 'true';
}

function setAdoConfig(global, data) {
    if (global.ado) {
        global.ado.config({
            mode: data.mode,
            xml: getBoolFromString(data.xml),
            characterEncoding: getBoolFromString(data.characterEncoding)
        });
    }
}

function appendPlacement(global, data) {
    let placement = global.document.createElement('div');
    placement.id = data.id;

    let dom = global.document.getElementById('c');
    dom.appendChild(placement);

    if (global.ado) {
        global.ado.placement({
            id: data.id,
            server: data.emitter + EMITTER_DOMAIN
        });
    }
}

/**
 * @param {!Window} global
 * @param {!Object} data
 */
export function adocean(global, data) {
    validateData(data, [
        'mode',
        'xml',
        'characterEncoding',
        'emitter',
        'type',
        'id'
    ]);

    const emitter = data.emitter;
    
    let adoUrl = 'https://' + emitter + EMITTER_DOMAIN + ADO_JS_PATH;

    writeScript(global, adoUrl, () => {
        setAdoConfig(global, data);

        if (data.type === 'placement') {
            appendPlacement(global, data);
        } else {
            appendMasterSlave(global, data);
        }
    });
}