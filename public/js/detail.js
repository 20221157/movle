    /*
    document.getElementById("movie-like-button").addEventListener("click",function() {
        const userId = "사용자id";
        const itemId = "좋아요id";
        const data = {userId: userId, itemId: itemId };
        fetch('/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(response => response.text())
        .then(data => {
        console.log(data);
        // 서버로부터의 응답을 처리합니다.
    })
        .catch((error) => {
        console.error('에러 발생:', error);
    });

    });
    */
function toggleLike() {
    var heart = document.querySelector('.heart-icon');
    heart.classList.toggle('clicked');
    }
        function toggleBookmark() {
    var bookmark = document.querySelector('.bookmark-icon');
    bookmark.classList.toggle('clicked');
    }
    function toggleComment() {
    var comment = document.querySelector('.comment-icon');
    comment.classList.toggle('clicked');
    }

    function showCommentForm() {
    var commentForm = document.querySelector('.comment-form');
    commentForm.style.display = 'block';
}
    function submitComment(event){
        event.preventDefault();
        // 코멘트 전송 후에 코멘트 폼 숨기기
        hideCommentForm();
    }
    function hideCommentForm() {
    var commentForm = document.querySelector('.comment-form');
    commentForm.style.display = 'none';
}
