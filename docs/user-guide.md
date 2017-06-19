## User Guide

### HTML Template Example

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

#### Requirements

- Placeholder tag must comply with following notation: `{{field-name}}`. 
- The field name should be present in the content object. **NOTE:** If the placeholder tag is not present in the content object then the placeholder's parent element will be removed from the document.
- Placeholder tag must be the only child of its immediate parent. If the tag is in an element with other content then wrap it with `<span>` tags.

#### Description

Javascript routine will parse through the template and replace placeholder fields indicated by double curly brace notation `{{field_name}}` with information in a JSON object.

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