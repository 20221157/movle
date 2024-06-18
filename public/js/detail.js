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

document.addEventListener('DOMContentLoaded', (event) => {

function fillStars(rating) {
        const stars = document.querySelectorAll('.rate input');

        stars.forEach((star, index) => {
            const starValue = parseInt(star.value);

            if (starValue <= rating) {
                star.checked = true;
                star.nextElementSibling.classList.add('filled-star');
            } else {
                star.checked = false;
                star.nextElementSibling.classList.remove('filled-star');
            }
        });
    }

    // 페이지 로드 시 초기 별점 채우기
    fillStars(averageRating);
// 별점을 서버로 전송하는 함수
  function sendPlaceRating(rating) {
	  const urlParams = new URL(window.location.href);
	      const id = parseInt(urlParams.pathname.split('/').pop(), 10);
    fetch(`/rate/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating: rating }),
    })
    .then(response => {
        if (!response.ok) {
	      throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
      console.log('별점 제출 성공:', data);
      // 선택 사항: 평균 별점을 업데이트하고 별을 다시 채울 수 있음
      alert('별점이 성공적으로 저장되었습니다.');
    })
    .catch((error) => {
      console.error('별점 제출 오류:', error);
      if (error.message.includes('Unauthorized')) {
	      alert('로그인이 필요합니다.');
      } else {
	      alert('별점 제출 중 오류가 발생했습니다.\n' + error.message);
      }


    });
  }

  // 별 클릭 이벤트 설정
  const stars = document.querySelectorAll('.rate input');
  stars.forEach((star) => {
    star.addEventListener('click', (event) => {
      sendPlaceRating(star.value);
    });
  });


    stars.forEach((star) => {
        star.addEventListener('click', (event) => {
            const clickedValue = parseInt(event.target.value); // 클릭한 별의 값

            // 모든 별 초기화
            stars.forEach((s) => {
                const starValue = parseInt(s.value);
                s.checked = false;
                s.nextElementSibling.classList.remove('filled-star'); // filled-star 클래스 제거
            });

            // 클릭한 별까지 색 채우기
            stars.forEach((s) => {
                const starValue = parseInt(s.value);
                if (starValue <= clickedValue) {
                    s.checked = true;
                    s.nextElementSibling.classList.add('filled-star'); // filled-star 클래스 추가
                }
            });

        });
    });


});

