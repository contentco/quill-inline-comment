let Inline = Quill.import('blots/inline');

class CommentBlot extends Inline {
        static create(commentText) {
            const node = super.create();
            node.dataset.comment = commentText.comment;
            if (commentText.id) {
                node.dataset.id = commentText.id;
            }
            return node;
        }
        static formats(node) {
            //console.log('node',node.dataset);
            return node.dataset;
        }
        format(name, value) {
            if (name === "comment" && value) {
                this.domNode.dataset.label = value;
            } else {
                super.format(name, value);
            }
        }

        formats() {
            const formats = super.formats();
            formats['comment'] = CommentBlot.formats(this.domNode);
            return formats;
        }
    }

CommentBlot.blotName = "comment";
CommentBlot.tagName = "SPAN";
CommentBlot.className = "annotation";

Quill.register({
    'formats/comment': CommentBlot
});

class InlineComment {
    constructor(quill, props) {
        this.quill  = quill;
        this.toolbar = quill.getModule('toolbar');
        if (typeof this.toolbar != 'undefined')
            this.toolbar.addHandler('comment', this.showCommentBox);
        
        let commentBtns = document.getElementsByClassName('ql-comment');
        if (commentBtns) { 
            [].slice.call( commentBtns ).forEach(function ( commentBtn ) {
                commentBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="none" stroke="#6F6D70" stroke-width="4" stroke-miterlimit="10" d="M51.7 71.8c-8 0-11.7-4-16-2.3-4.2 2-12.3 2.2-10.3.2 2.4-2.4 5-5.3 5.3-8.6.4-3-1.5-7-1.5-11.4C29.2 37 39.2 27 51.7 27 64 27 74.2 37 74.2 49.3S64.2 72 51.7 72z"/></svg>';
            });
        };
    }

    showCommentBox(){
        let quill = this.quill;
        let range = this.quill.getSelection();
        let text = this.quill.getText(range.index, range.length);
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

        let inlineSend = document.querySelector('.inline-send');

        inlineSend.addEventListener("click", () => this.addComment);

        inlineSend.addEventListener('click',function(){ 
            //var commentId = Math.random().toString(36).slice(2);
            const commentObj = {};

            let commentText = document.querySelector('.commentText').value;
            commentObj.comment = commentText;
            if (typeof(commentId) !== 'undefined') {
                commentObj.id= commentId;
            }
            
            commentToolTip.style.display    = "none";
            quill.deleteText(range.index, text.length, Quill.sources.USER);
            quill.insertText(range.index, text, "comment", commentObj, Quill.sources.USER);
            quill.setSelection(range.index + text.length + 1, 0, Quill.sources.SILENT);
        });
    }
}
Quill.register('modules/inline_comment', InlineComment);











