let Inline = Quill.import('blots/inline');

class CommentBlot extends Inline {
    static create(value) {
        let node = super.create();
        if (typeof(value) == 'string') {
            node.dataset.comment = value;
            node.classList.add("annotation");
        }
        return node;
      }

    static formats(node) {
        let format = {};
        if (node.hasAttribute('class')) {
          format.class = node.getAttribute('class');
        }
        return format;
    }

    static value(node) {
        return node;
    }

    format(name, value) {
        super.format(name, value);
    } 
}

CommentBlot.blotName = 'comment';
CommentBlot.tagName = 'SPAN';

Quill.register({
    'formats/comment': CommentBlot
});

class InlineComment {
    constructor(quill, props) {
        this.quill  = quill;
        this.toolbar = quill.getModule('toolbar');
        if (typeof this.toolbar != 'undefined')
            this.toolbar.addHandler('comment', this.showCommentBox);
        
        var commentBtns = document.getElementsByClassName('ql-comment');
        if (commentBtns) { 
            [].slice.call( commentBtns ).forEach(function ( commentBtn ) {
                commentBtn.innerHTML = 'Comment';
            });
        };
    }

    showCommentBox(){
        let range = quill.getSelection();
        let text = quill.getText(range.index, range.length);
        if (text.length < 1) {
            return;
        }

        const atSignBounds = quill.getBounds(range.index);
        let elementExists = document.getElementById("inline-comment");
        if (elementExists) {
            this.container = elementExists;
            this.container.style.display = "block";
            document.querySelector('.commentText').value = '';
        }
        else{
            this.container  = document.createElement('div');
            this.container.id =  'inline-comment';
            this.container.classList.add('inline-comment');
            this.quill.container.appendChild(this.container);
            this.container.style.position   = "absolute";
            this.container.innerHTML = '<textarea class="commentText" placeholder="Type your comment"></textarea><div class="inline-comment-bottom"><span class="inline-send">Send</span> <span class="inline-canecl">Cancel</span></div>';
        }

        this.container.style.left = (atSignBounds.left)+ "px";
        this.container.style.top = 10 + atSignBounds.top + atSignBounds.height + "px";
        document.querySelector('.commentText').focus();
        
        let inlineCancel = document.querySelector('.inline-canecl');
        let commentToolTip = document.querySelector('.inline-comment');

        inlineCancel.addEventListener('click',function(){ 
            commentToolTip.style.display    = "none";
        });

        let emojiFilter = document.querySelector('.inline-send');
        emojiFilter.addEventListener('click',function(){ 
            let commentText = document.querySelector('.commentText').value;
            commentToolTip.style.display    = "none";
            quill.deleteText(range.index, text.length, Quill.sources.USER);
            quill.insertText(range.index, text, "comment", commentText, Quill.sources.USER);
            quill.setSelection(range.index + text.length + 1, 0, Quill.sources.SILENT);
        });
    }
}
Quill.register('modules/inline_comment', InlineComment);











