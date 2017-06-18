## Development Notes

### HTML Template

``` HTML
<div id="wrap" class="container-fluid" style="display: none">
    <div class="jumbotron">
        <h1 class="text-center">{{subject}}</h1>
        <h2 class="text-center"><i>{{subheader}}</i></h2>
        <div class="panel panel-default">
            <div class="panel-body">
                <span>{{img}}</span>
                <div class="text-center">{{caption}}</div>
            </div>
        </div>
        <div id="content" class="center-block">
            <h3>Timeline</h3>
            <ul>
                {{timeline}}
            </ul>
            <blockquote>
                <p>"<span>{{quote}}</span>"</p>
                <footer>{{source}}</footer>
            </blockquote>
            <h3>Read more at this link: <span>{{link}}</span></h3>
        </div>
    </div>
</div>
```

Javascript routine will parse through the template and replace placeholder fields indicated by double curly brace notation `{{field_name}}` with information in a JSON object. **Note:** The placeholder must be the only child of its immediate parent node. If it must be placed in a specific location or in a parent node with other content, then wrap the placeholder in `<span>` tags.

### JSON Object Structure

``` JavaScript
var content = {
    "subject": "",
    "subheader": "",
    "img": {
        "type": "img",
        "className": "img-responsive center-block",
        "alt": "",
        "src": ""
    },
    "caption": "",
    "timeline": [
        {"year": "", "string": ""}
    ],
    "quote": "",
    "source": "",
    "link": {
        "type": "a",
        "href": "",
        "children": [
            ""
        ]
    }
};
```

The type of data associated with the JSON object property will determine the type of node to be created.

1. **String** - Create a text node.
2. **Object** - Create an element node with the type contained in its `type` property; By convention, the `children` property (which must be an array) is checked to see if an object has child nodes that can be generated recursively.
3. **Array** - Create a node for each array member according to rules 1 & 2.
4. **`timeline`** - The timeline property is handled as a special case due to the large number of items that can be stored in the timeline and high level of nesting that would result from following the preceding rules. Each object in the timeline array is a name & string pair which generates one element with the following structure:
``` HTML
<li><b>{{year}}</b> - {{string}}</li>
```

### Program Steps

1. Get a handle for the template.
2. Index through the template nodes and check for text nodes that match the placeholder notation.
3. When a placeholder is found replace the placeholder text with a new element created from the data related to that placeholder in the JSON object.