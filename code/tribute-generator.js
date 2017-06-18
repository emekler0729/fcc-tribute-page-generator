function fillTemplate(selector, data) {
    function search(node) {
        if(node.nodeType == document.ELEMENT_NODE) {
            for(var i = 0; i < node.childNodes.length; i++) {
                search(node.childNodes[i]);
            }
        } else if(node.nodeType == document.TEXT_NODE) {
            replace(node);
        }
    }

    function replace(node) {
        var match = /\{\{(\w+)\}\}/g.exec(node.nodeValue);
        var parent = node.parentNode;

        if(match) {
            match = match[1];
            if (match == 'timeline') {
                data[match].forEach(function(object) {

                })
            } else if (typeof data[match] == 'string') {
                parent.textContent = data[match];
            } else if (typeof data[match] == 'object') {
                parent.innerHTML = "";
                parent.appendChild(createElement(data[match]));
            } else if (Array.isArray(data[match])) {

            }
        }
    }

    var template = document.querySelector(selector);
    search(template);
}

function createElement(attributes) {
    var node = document.createElement(attributes.type);
    var keys = Object.keys(attributes);

    console.log(keys);

    keys.forEach(function(key) {
        if(key != 'type') {
            node[key] = attributes[key];
        }
    });

    return node;
}

document.querySelector('#wrap').setAttribute('style', '');