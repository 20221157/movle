$(document).ready(function() {
    $('#searchForm').submit(function(event) {
        event.preventDefault(); // 폼 제출 기본 동작 방지
        var currentUrl = window.location.href;
        var newUrl;
        
        // 현재 URL이 '/movie'인 경우
        if (currentUrl.includes('/movie')) {
            newUrl = '/movie/search'; // '/movie/search'로 설정
        } 
        // 현재 URL이 '/place'인 경우
        else if (currentUrl.includes('/place')) {
            newUrl = '/place/search'; // '/place/search'로 설정
        } 
	else if (currentUrl.includes('/community')){
	    newUrl = '/community/search';
	}
	else if (currentUrl.includes('/map')){
	    newUrl = '/map/search';
	}
        // 그 외의 경우
        else {
            // 기본적으로 '/search'로 설정
            newUrl = '/search';
        }
        
        // 폼의 action 속성을 동적으로 설정
        $(this).attr('action', newUrl);
        
        // 폼 제출
        this.submit();
    });
});

