# Quill Inline Comment
Module extension for [Quill.js](https://github.com/quilljs/quill) that handles inline comment like medium.

#### This module is still in active development

## Usage
### Webpack/ES6

```javascript
const toolbarOptions = {
                        container: [
                            ['bold', 'italic', 'underline', 'strike'],
                            ['comment'],   
                        ],
                        handlers: {'comment': function() {}}
                        }
const quill = new Quill(editor, {
    // ...
    modules: {
        // ...
        toolbar: toolbarOptions,
        inline_comment: true
    }
});
```

## Contributing

Please check out our [contributing guidelines](CONTRIBUTING.md).
