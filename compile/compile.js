/*jshint esnext: true*/
/*global require, console, process*/

(function () {
    'use strict';

    const fs = require('fs');
    const beautify = require('js-beautify').html;
    const FgRed = "\x1b[31m ";
    const FgGreen = "\x1b[32m ";


    function Compiler () {
        this.HTML = "";
        this.BLOCKS = {};
    }

    /**
     * Checks whether a file exists by specified path
     * @param   {string} path Path to file
     * @returns {boolean}  Result
     */
    Compiler.prototype.isFileExist = function (path) {
        try {
            fs.lstatSync(path).isFile();
            return true;
        } catch (error) {
            return false;
        }
    };


    /**
     * Reads file and return JSON representation of it
     * @param   {string}   path Path to file
     * @returns {object} JSON representation
     */
    Compiler.prototype.readAsJSON = function (path) {
        try {
            return JSON.parse(fs.readFileSync(path, "utf8"));
        } catch (error) {
            return null;
        }
    };

    /**
     * Reads `tag` parametr and return string representation of it 
     * @param   {string|boolean} tag = "div" Tag parametr
     * @returns {string} String representation
     */
    Compiler.prototype.checkTagParametr = function () {
        var tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "div";

        return (typeof tag === "string" || typeof tag === "boolean" ? tag : false);
    };

    /**
     * Checks if tag is self-closing
     * @param   {string} tag Tag parametr
     * @returns {boolean} Result
     */
    Compiler.prototype.isTagSelfClosing = function (tag) {
        switch (tag) {
            case 'input':
            case 'img':
            case 'hr':
            case 'br':
                return true;
            default:
                return false;
        }
    };










let html = "";
let blocks = {};

function LOG() {
//        console.log.apply(this, arguments);
}

console.log(new Date());

function isFileExist(filePath) {


    try {
        fs.lstatSync(filePath).isFile();
        return true;
    } catch (error) {
        return false;
    }

}

function readAsJSON(filePath) {


    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        LOG('no such file or directory, open \'' + filePath + '\'');
    }

}

function checkTagParam(tag) {
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

function isPairOfTag(tag) {
    if (tag === 'img' ||
            tag === 'input' ||
            tag === 'hr' ||
            tag === 'br') {
        return false;
    } else {
        return true;
    }
}

function readContent(content, block) {


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
            if (isPairOfTag(tag)) {
                html += '</' + tag + '>\n';
            }
        }
    });
}

process.argv.forEach(function (index) {


    if (index.indexOf('.json') === index.length - 5) {
        var pageJSON = readAsJSON('./' + index);

        blocks = {};

        html = '<!doctype html>\n';
        html += '<html lang="en">\n';
        html += '    <head>\n';
        html += '        <title>' + pageJSON.title + '</title>\n';

        pageJSON.head.forEach(function (index) {
            switch (index.elem) {
            case 'css':
                html += "<link href='" + index.url + "' rel='stylesheet' type='text/css'>\n";
                break;
            case 'js':
                html += "<script src='" + index.url + "' type='text/javascript'></script>\n";
                break;
            default:
                break;
            }
        });

        html += '    </head>\n';
        html += '    <body>\n';
        readContent(pageJSON.content);


        
        var less = '';
        var js = '';

        blocks.page = {
            'css': index.replace('.json', '')+'.css',
            'js': index.replace('.json', '')+'.js'
        };

        // check files
        Object.keys(blocks).forEach(function (index) {
            if (index == 'page') {
                return;
            }
            
            if (isFileExist('./' + blocks[index].css)) {
                less += '@import "./' + blocks[index].css + '";\n';
                console.log(FgGreen, './' + blocks[index].css);
            } else {
                console.log(FgRed, './' + blocks[index].css);
            }

            if (isFileExist('./' + blocks[index].js)) {
                js += '<script src="../' + blocks[index].js + '"></script>';
                console.log(FgGreen, './' + blocks[index].js);
            } else {
                console.log(FgRed, './' + blocks[index].js);
            }

            if (isFileExist('./blocks/' + blocks[index].css)) {
                less += '@import "./blocks/' + blocks[index].css + '";\n';
                console.log(FgGreen, './blocks/' + blocks[index].css);
            } else {
                console.log(FgRed, './blocks/' + blocks[index].css);
            }

            if (isFileExist('./blocks/' + blocks[index].js)) {
                js += '<script src="../blocks/' + blocks[index].js + '"></script>';
                console.log(FgGreen, './blocks/' + blocks[index].js);
            } else {
                console.log(FgRed, './blocks/' + blocks[index].js);
            }

            if (isFileExist('./blocks.theme/' + blocks[index].css)) {
                less += '@import "./blocks.theme/' + blocks[index].css + '";\n';
                LOG(FgGreen, './blocks.theme/' + blocks[index].css);
            } else {
                LOG(FgRed, './blocks.theme/' + blocks[index].css);
            }
        });
        
        if (less) {
            fs.writeFileSync('./' + index.substring(0, index.length - 4) + 'less', less, 'utf-8');
        }

        if (js) {
            html += js;
        }

        html += '    </body>\n';
        html += '</html>';
        fs.writeFileSync('./' + index.substring(0, index.length - 4) + 'html', beautify(html, {}), 'utf-8');

        console.log('\x1b[0m');

        LOG(beautify(html, {}));
    }
});

}());
