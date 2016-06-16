var fs = require('fs');
var beautify = require('js-beautify').html;

var beautifyOptions = {};
var uiComponents = {};

fs.readFile('../pages/index.tpl.json', 'utf8', function (err, data) {
    if (err) {
        throw err;
        return false;
    }

    var config = JSON.parse(data);

    var html = '';
    var less = '';

    getTemplates(config);
    html = makeHTML(config);
    less = makeLESS(uiComponents);
    html = '<!DOCTYPE html><html>' + html + '</html>';
    html = beautify(html, beautifyOptions);

    fs.writeFileSync('../pages/index.html', html , 'utf8');
    fs.writeFileSync('../pages/index.less', less , 'utf8');
});

function getTemplates(source) {
    if (!Array.isArray(source) && !source.length) {
        return
    }

    var o = {};
    var key = 'string';

    for (c in source) {
        o = source[c];
        key = Object.keys(o)[0];

        if (!uiComponents[key]) {
            uiComponents[key] = ' ';
            try {
                uiComponents[key] = fs.readFileSync('../ui-components/' + key + '/' + key + '.tpl', 'utf8');
            } catch (e) {

                console.log('\x1b[33m%s\x1b[0m: ', key+ ' don\'t have template file (ui-components/' + key + '/' + key + '.tpl)');
            }
        }

        getTemplates(o[key]);
    }
}
function makeHTML(source, cls) {

    if (!Array.isArray(source) && !source.length) {
        return
    }

    var o = {};
    var key = '';
    var str = '';
    
    
    var className = '';
    var attributes = '';
    
    
    cls = cls || '';

    for (c in source) {
        o = source[c];
        key = Object.keys(o)[0];

        cls = (cls === 'body' ? '': cls);
        cls = (cls === 'head' ? '': cls);
    
        if (cls && cls.substr(cls.length - 1) !== '-') {
            cls = cls + '-';
        }
        
        className = ' class="b-'+ key + ' ' + (o.mod ? 'b-' + key + '__' + o.mod + ' ' : '') + cls + key +'"';
        attributes = ' ';
        for (index in o.attr) {
            attributes += ' ' + index + '="' + o.attr[index] + '"';
        }

        str += '<' + (o.tag || 'div') + className + attributes + '>' + (o.text || '');
        str += uiComponents[key].trim();

        str += makeHTML(o[key], cls + key);
        str += '</' + (o.tag || 'div') + '>';
    }
    return str
}
function makeLESS(componets) {

    var str = '';

    str += '@import "../less/palette.less";\n';
    str += '@import "../less/layout.less";\n';

    for (key in componets){

        try {
            fs.accessSync('../ui-components/' + key + '/' + key + '.less', fs.F_OK);
            str += '@import "../ui-components/' + key + '/' + key + '";\n';
        } catch (e) {
            // It isn't accessible
            console.log('\x1b[36m%s\x1b[0m', key+ ' don\'t have less file (ui-components/' + key + '/' + key + '.less)');
        }
        
    }
    
    return str;
}