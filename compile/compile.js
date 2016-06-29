/*global require, console*/
var fs = require('fs');
var beautify = require('js-beautify').html;

var beautifyOptions = {};
var uiComponents = {};



function getTemplates(source) {
    'use strict';

    if (!Array.isArray(source) && !source.length) {
        return false;
    }

    var o = {};
    var key = 'string';
    var c;

    for (c in source) {
        o = source[c];
        key = Object.keys(o)[0];

        if (!uiComponents[key]) {
            uiComponents[key] = ' ';
            try {
                uiComponents[key] = fs.readFileSync('../ui-components/' + key + '/' + key + '.tpl', 'utf8');
                uiComponents[key] = uiComponents[key].trim();
            } catch (e) {

                console.log('tpl: ' + key + ' don\'t have template file (ui-components/' + key + '/' + key + '.tpl)');
            }
        }

        getTemplates(o[key]);
    }
}
function makeHTML(source, cls) {
    'use strict';

    if (!Array.isArray(source) && !source.length) {
        return false;
    }

    var o = {};
    var a;
    var c;
    var key = '';
    var str = '';


    var className = '';
    var attributes = '';
    var index;


    cls = cls || '';

    for (c in source) {
        o = source[c];
        key = Object.keys(o)[0];

        cls = (cls === 'body' ? '' : cls);
        cls = (cls === 'head' ? '' : cls);

        if (cls && cls.substr(cls.length - 1) !== '-') {
            cls = cls + '-';
        }

        className = ' class="b-' + key + ' ' + (o.mod ? 'b-' + key + '__' + o.mod + ' ' : '') + cls + key + '"';
        attributes = ' ';

        for (index in o.attr) {
            attributes += ' ' + index + '="' + o.attr[index] + '"';
        }

        str += '<' + (o.tag || 'div') + className + attributes + '>';


        o.text = (o.text || '').trim();
        if (o.before === true) {
            str += makeHTML(o[key], cls + key);
        }

        if (uiComponents[key].match(new RegExp('{{text}}'))) {
            str += uiComponents[key].replace('{{text}}', o.text.trim());
        } else {
            str += (o.text + uiComponents[key]).trim();
        }

        if (o.before !== true) {
            str += makeHTML(o[key], cls + key);
        }

        if (o.tag === 'body') {
            for (a in uiComponents) {
                try {
                    fs.accessSync('../ui-components/' + a + '/' + a + '.js', fs.F_OK);
                    str += '<script type="text/javascript" src="../ui-components/' + a + '/' + a + '.js"></script>';
                } catch (e) {
                    // It isn't accessible
                    console.log('js: ' + a + ' don\'t have js file (ui-components/' + a + '/' + a + '.js)');
                }
            }
        }

        str += '</' + (o.tag || 'div') + '>';
    }
    return str;
}
function makeLESS(componets) {
    'use strict';

    var str = '';
    var key;

    for (key in componets) {

        try {
            fs.accessSync('../ui-components/' + key + '/' + key + '.less', fs.F_OK);
            str += '@import "../ui-components/' + key + '/' + key + '";\n';
        } catch (e) {
            // It isn't accessible
            console.log('less: ' + key + ' don\'t have less file (ui-components/' + key + '/' + key + '.less)');
        }

    }
    
    str += '@import "../less/layout.less";\n';

    return str;
}





fs.readFile('../pages/index.tpl.json', 'utf8', function (err, data) {
    'use strict';

    if (err) {
        throw err;
    }

    var config = JSON.parse(data);

    var html = '';
    var less = '';

    getTemplates(config);
    html = makeHTML(config);
    less = makeLESS(uiComponents);
    html = '<!DOCTYPE html><html>' + html + '</html>';
    html = beautify(html, beautifyOptions);

    fs.writeFileSync('../pages/index.html', html, 'utf8');
    fs.writeFileSync('../pages/index.less', less, 'utf8');
});
