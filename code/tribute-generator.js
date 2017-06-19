/**
 * This function searches through the DOM tree for text nodes, checks if the text node is a placeholder,
 * and replaces the placeholder with elements generated by the content JSON object when found.
 *
 * @param selector {string} - CSS querySelector for the template element ("#wrap" by default).
 * @param content {Object} - JSON object holding site content. See data/empty.js for overall structure.
 */
function fillTemplate(selector, content) {
    /**
     * Searches the DOM tree.
     *
     * @param node {Element} - Node to be searched.
     */
    function search(node) {
        // If the node is an element node, search all of its children.
        if(node.nodeType == document.ELEMENT_NODE) {
            for(var i = 0; i < node.childNodes.length; i++) {
                search(node.childNodes[i]);
            }
        // If the node is a text node, call replace to evaluate placeholder replacement.
        } else if(node.nodeType == document.TEXT_NODE) {
            replace(node);
        }
    }

    /**
     * Replaces placeholder text when found.
     *
     * @param node {Element} - Node to be evaluated for placeholder replacement.
     */
    function replace(node) {
        // Check if the nodeValue matches placeholder format: {{field-name}}.
        var match = /\{\{(\w+)\}\}/g.exec(node.nodeValue);

        if(match) {
            match = match[1]; // Store the field name (corresponds to content).
            var parent = node.parentNode; // Store the parent node.
            parent.textContent = ""; // Clear content.

            // If the field name is timeline, generate specially formatted timeline elements.
            if (match == 'timeline') {
                if(!Array.isArray(content[match])) {
                    throw new TypeError('timeline property of content object must an Array');
                }

                content[match].forEach(function(item) {
                    parent.appendChild(createTimelineItem(item));
                });
            // If the content property type for the field name is a string or object, create a new element.
            } else if (typeof content[match] == 'string' || typeof content[match] == 'object') {
                parent.appendChild(createElement(content[match]));
            // If the content property type for the field name is an array, format the property so that the
            // create element function is able to create all elements in the array.
            } else if (Array.isArray(content[match])) {
                parent.appendChild(createElement({type: 'span', children: content[match]}));
            }
        }
    }

    // Find the element using the query selector and start the search on the root node.
    var template = document.querySelector(selector);
    search(template);
    template.setAttribute('style', ''); // Display the element when finished
}

/**
 * Create an element from an attributes argument. If the attributes object has a 'children' property, create elements
 * and append them to the newly created node as children.
 *
 * @param attributes {string || Object} - If the attributes argument is a string, a simple text node is returned.
 *  If the attributes argument is an object then the object will be evaluated to create a DOM Element. The 'type'
 *  property defines the type of DOM Element which will be created (i.e. <img>, <a>, etc.). All other properties
 *  besides the 'children' property are evaluated as attribute-value pairs to be set on the DOM Element.
 * @returns {Element || Text} - The DOM Element to be added to the page.
 */
function createElement(attributes) {
    // Check if the attributes argument is the correct type.
    if(typeof attributes == 'string') {
        return document.createTextNode(attributes); // Return a text node if type is string.
    } else if(typeof attributes == 'object') {
        if(!attributes.hasOwnProperty('type')) {
            throw new TypeError('attribute argument must have "type" property when attribute is object');
        }

        var node = document.createElement(attributes.type); // Create a DOM Element of type 'attributes.type'
        var keys = Object.keys(attributes); // Get all of the keys in the attributes object

        // For each key that is not type or children, set the attribute on the DOM Element
        keys.forEach(function(key) {
            if(key != 'type' && key != 'children') {
                node[key] = attributes[key];
            }
        });

        // If the children property exists, append all child elements recursively.
        if(attributes.children) {
            if(!Array.isArray(attributes.children)) {
                throw new TypeError('attribute.children property must an Array');
            }

            attributes.children.forEach(function(child) {
                node.appendChild(createElement(child));
            });
        }

        return node;
    } else {
        throw new TypeError('attribute argument must be of type "string" or "object"');
    }
}

/**
 * Creates specially formatted timeline items. Format is: <li><b>{item.year}</b> - {item.string}</li>. Used as a helper
 * function to reduce nesting required in content JSON object.
 *
 * @param item {Object} - Object with year and string properties to be added to timeline.
 * @returns {Element|Text} - <li> element to be displayed on timeline.
 */
function createTimelineItem(item) {
    // Check that needed properties exist.
    if(!item.year) {
        throw new TypeError('Timeline item object must have year property');
    } else if(!item.string) {
        throw new TypeError('Timeline item object must have string property');
    }

    // Format the item properties so that the createElement function can generate the desired output.
    return createElement({
        type: 'li',
        children: [
            {
                type: 'b',
                children: [String(item.year)]
            },
            " - ",
            String(item.string)
        ]
    });
}