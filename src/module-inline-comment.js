let Inline = Quill.import('blots/inline');

class CommentBlot extends Inline {
    static create(commentText) {
        const node = super.create();
        node.dataset.comment = commentText.comment;
        if (commentText.id) {
            node.dataset.id = commentText.id;
        }
        if (commentText.resolved) {
            node.dataset.resolved = commentText.resolved;
        }

        return node;
    }
    static formats(node) {
        return node.dataset;
    }
    format(name, value) {
        super.format(name, value);
    }
}

CommentBlot.blotName = "comment";
CommentBlot.tagName = "SPAN";
CommentBlot.className = "annotation";

Quill.register({
    'formats/comment': CommentBlot
});


class InlineComment {
    constructor(quill){
        this.quill = quill;
        this.toolbar = quill.getModule('toolbar');
        if (typeof this.toolbar != 'undefined')
            this.toolbar.addHandler('comment', this.commentEventHanlder);
        
        var commentBtns = document.getElementsByClassName('ql-comment');
        if (commentBtns) { 
            [].slice.call( commentBtns ).forEach(function ( commentBtn ) {
                commentBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16"><g fill="none" fill-rule="evenodd"><path fill="#444" fill-rule="nonzero" d="M9.92 11H13c1.66 0 3-1.36 3-3V5c0-1.66-1.34-3-3-3H5C3.34 2 2 3.34 2 5v3c0 1.64 1.34 3 3 3h1.44l.63 1.88 2.85-1.9zM5 0h8c2.76 0 5 2.24 5 5v3c0 2.75-2.24 5-5 5h-2.47L7.1 15.26c-.47.3-1.1.2-1.4-.27-.05-.1-.08-.18-.1-.26L5 13c-2.76 0-5-2.25-5-5V5c0-2.76 2.24-5 5-5z"/><path stroke="#444" stroke-width="2" d="M5.37 5H13M5.37 8H10" stroke-linecap="round" stroke-linejoin="round"/></g></svg>';
            });
        };
    }

    commentEventHanlder() {
        let quill = this.quill;
        checkDialogExist(quill);
    }  
}

function checkDialogExist(quill){
    let commentToolTip = document.getElementById("inline-comment");
    let commentMask = document.getElementById("inline-comment-mask");
    if (commentToolTip) {
        commentToolTip.remove();
        commentMask.remove();
    }
    else{
        createCommentDialog(quill);
    }
}

function createCommentDialog(quill) {
    let range = quill.getSelection();
    let text = quill.getText(range.index, range.length);
    if (text.length < 1) {
        return;
    }
    const atSignBounds = quill.getBounds(range.index);
    let containerMask = document.createElement('div');
    containerMask.id="inline-comment-mask";
    containerMask.style.width   = "100%";
    containerMask.style.height   = "100%";
    containerMask.style.top   = "0px";
    containerMask.style.position   = "fixed";
    containerMask.style.display   = "block";

    let container  = document.createElement('div');
    container.id =  'inline-comment';
    container.classList.add('inline-comment');
    quill.container.appendChild(container);
    quill.container.appendChild(containerMask);
    container.style.position   = "absolute";
    container.innerHTML = '<textarea class="commentText" placeholder="Type your comment"></textarea><div class="inline-comment-bottom"><span class="inline-cancel">Cancel</span> <span class="inline-send">Send</span> </div>';
    

    container.style.left = (atSignBounds.left - 150)+ "px";

    if (atSignBounds.left + 250 < quill.container.clientWidth) {
        container.style.left = (atSignBounds.left)+ "px";
    }

    container.style.top = 10 + atSignBounds.top + atSignBounds.height + "px";
    container.style.zIndex = 80;
    document.querySelector('.commentText').focus();

    let inlineCancel = document.querySelector('.inline-cancel');
    let commentToolTip = document.querySelector('.inline-comment');

    inlineCancel.addEventListener('click',function(){ 
        commentToolTip.style.display    = "none";
        containerMask.style.display     = "none";
    });

    let inlineSend = document.querySelector('.inline-send');

    inlineSend.addEventListener('click',function(){
        // var commentId = 1;
        // var commentStatus = 'resolved';
        const commentObj = {};
        let commentText = document.querySelector('.commentText').value;
        commentObj.comment = commentText;
        if (typeof(commentId) !== 'undefined') {
            commentObj.id= commentId;
        }
        if (typeof(commentStatus) !== 'undefined') {
            commentObj.resolved= commentStatus;
        }
        commentToolTip.remove();
        containerMask.remove();
        quill.format('comment', commentObj);
    });
    
}

Quill.register('modules/inline_comment', InlineComment);