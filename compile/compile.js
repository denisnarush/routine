/*
 v1.1.0;
*/

/*global require, console, process*/
var fs = require('fs');
var beautify = require('js-beautify').html;
var html = '';
var blocks = {};

var FgRed = "\x1b[31m ";
var FgGreen = "\x1b[32m ";

function LOG() {
    'use strict';

    //    console.log.apply(this, arguments);
}

console.log(new Date());

function isFileExist(filePath) {
    'use strict';

    try {
        fs.lstatSync(filePath).isFile();
        return true;
    } catch (error) {
        return false;
    }

}
function readAsJSON(filePath) {
    'use strict';

    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        LOG('no such file or directory, open \'' + filePath + '\'');
    }

}

function checkTagParam(tag) {
    'use strict';

    if (tag === undefined) {
        return 'div';
    }

    if (tag === false) {
        return false;
    }

    if (typeof tag === 'string' && !!tag) {
        return tag;
    }
}

function readContent(content, block) {
    'use strict';

    if (!content) {
        return;
    }

    html += '\n';

    content.forEach(function (index) {
        var tag = checkTagParam(index.tag);

        if (tag) {


            // feeel block paths
            if (index.block) {
                blocks[index.block] = blocks[index.block] || {
                    css: index.block + '/' + index.block + '.less',
                    js: index.block + '/' + index.block + '.js'
                };
            }

            if (block && index.elem) {
                blocks[block + '__' + index.elem] = blocks[block + '__' + index.elem] || {
                    css: block + '/' + '__' + index.elem + '/' + block + '__' + index.elem + '.less',
                    js: block + '/' + '__' + index.elem + '/' + block + '__' + index.elem + '.js'
                };
            }

            if (index.mods !== undefined) {
                Object.keys(index.mods).forEach(function (i) {
                    blocks[(index.block || (block ? block + '__' + index.elem : false)) + '_' + i + (typeof index.mods[i] === 'string' ? '_' + index.mods[i] : '')] = blocks[(index.block || (block ? block + '__' + index.elem : false)) + '_' + i + (typeof index.mods[i] === 'string' ? '_' + index.mods[i] : '')] || {
                        css:  (index.block || block) + '/' + (index.elem ? '__' + index.elem + '/' : '') + '_' + i + '/' + (index.block || (block ? block + '__' + index.elem : false)) + '_' + i + (typeof index.mods[i] === 'string' ? '_' + index.mods[i] : '') + '.less',
                        js:  (index.block || block) + '/' + (index.elem ? '__' + index.elem + '/' : '') + '_' + i + '/' + (index.block || (block ? block + '__' + index.elem : false)) + '_' + i + (typeof index.mods[i] === 'string' ? '_' + index.mods[i] : '') + '.js'
                    };
                });
            }
            // -feeel block paths

            // class
            html += '<' + tag + ' class="' + (index.block || (block ? block + '__' + index.elem : false));

            // mods
            if (index.mods !== undefined) {
                Object.keys(index.mods).forEach(function (i) {
                    html += ' ' + (index.block || (block ? block + '__' + index.elem : false)) + '_' + i + (typeof index.mods[i] === 'string' ? '_' + index.mods[i] : '');
                });
            }

            // close class attr
            html +=  '"';

            // attrs
            if (index.attrs !== undefined) {
                Object.keys(index.attrs).forEach(function (i) {
                    html += ' ' + i + '="' + index.attrs[i] + '"';
                });
            }

            html += '>';
        }

        html += (index.html || index.text || '');

        readContent(index.content, index.block);

        // close tag
        if (tag) {
            html += '</' + tag + '>\n';
        }
    });
}

process.argv.forEach(function (index) {
    'use strict';

    if (index.indexOf('.json') === index.length - 5) {
        var pageJSON = readAsJSON('./' + index);

        blocks = {};

        html = '<!doctype html>\n';
        html += '<html lang="en">\n';
        html += '    <head>\n';
        html += '        <title>' + pageJSON.title + '</title>\n';
        pageJSON.head.forEach(function (index) {
            if (index.elem === 'css') {
                html += "<link href='" + index.url + "' rel='stylesheet' type='text/css'>\n";
            }
        });
        html += '    </head>\n';
        html += '    <body>\n';
        readContent(pageJSON.content);
        html += '    </body>\n';
        html += '</html>';

        LOG(beautify(html, {}));
        fs.writeFileSync('./' + index.substring(0, index.length - 4) + 'html', beautify(html, {}), 'utf-8');
        
        var less = '';

        blocks.page = {
            'css': 'page/page.less',
            'js': 'page/page.js'
        };

        // check files
        Object.keys(blocks).forEach(function (index) {
            
            if (isFileExist('./blocks/' + blocks[index].css)) {
                less += '@import "./blocks/' + blocks[index].css + '";\n';
                console.log(FgGreen, blocks[index].css);
            } else {
                console.log(FgRed, blocks[index].css);
            }

            if (isFileExist('./blocks/' + blocks[index].js)) {
                console.log(FgGreen, blocks[index].js);
            } else {
                console.log(FgRed, blocks[index].js);
            }
        });
        
        if (less) {
            fs.writeFileSync('./' + index.substring(0, index.length - 4) + 'less', less, 'utf-8');
        }

        console.log('\x1b[0m');
    }
});
