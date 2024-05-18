document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'AIzaSyDabnk42qeN4vD36fwWYWdvX1oYLwWMay8';
    const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';
    
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const videoList = document.getElementById('video-list');
    
    searchButton.addEventListener('click', () => {
        const query = searchInput.value;
        fetchVideos(query);
    });
    
    async function fetchVideos(query) {
        const response = await fetch(`${YOUTUBE_API_URL}/search?part=snippet&type=video&maxResults=20&q=${query}&key=${API_KEY}`);
        const data = await response.json();
        renderVideos(data.items);
    }
    
    function renderVideos(videos) {
        videoList.innerHTML = '';
        videos.forEach(video => {
            const videoElement = document.createElement('div');
            videoElement.className = 'video-item';
            videoElement.innerHTML = `
                <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
                <h3>${video.snippet.title}</h3>
                <p>${video.snippet.channelTitle}</p>
            `;
            videoElement.addEventListener('click', () => {
                localStorage.setItem('videoId', video.id.videoId);
                window.location.href = 'videoDetails.html';
            });
            videoList.appendChild(videoElement);
        });
    }
    
    // Fetch initial videos with empty search string
    fetchVideos('');
});

document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'AIzaSyDabnk42qeN4vD36fwWYWdvX1oYLwWMay8';
    const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';
    
    const videoDetails = document.getElementById('video-details');
    const commentsSection = document.getElementById('comments-section');
    
    const videoId = localStorage.getItem('videoId');
    
    if (videoId) {
        fetchVideoDetails(videoId);
        fetchVideoComments(videoId);
    }
    
    async function fetchVideoDetails(videoId) {
        const response = await fetch(`${YOUTUBE_API_URL}/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`);
        const data = await response.json();
        renderVideoDetails(data.items[0]);
    }
    
    function renderVideoDetails(video) {
        videoDetails.innerHTML = `
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${video.id}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <h1>${video.snippet.title}</h1>
            <p>${video.snippet.description}</p>
            <p>Views: ${video.statistics.viewCount}</p>
            <p>Likes: ${video.statistics.likeCount}</p>
            <p>Dislikes: ${video.statistics.dislikeCount}</p>
            <p>Channel: ${video.snippet.channelTitle}</p>
        `;
    }
    
    async function fetchVideoComments(videoId) {
        const response = await fetch(`${YOUTUBE_API_URL}/commentThreads?part=snippet,replies&videoId=${videoId}&key=${API_KEY}`);
        const data = await response.json();
        renderComments(data.items);
    }
    
    function renderComments(comments) {
        commentsSection.innerHTML = '';
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <p><strong>${comment.snippet.topLevelComment.snippet.authorDisplayName}</strong></p>
                <p>${comment.snippet.topLevelComment.snippet.textDisplay}</p>
                <button class="show-replies">Show Replies</button>
                <div class="replies"></div>
            `;
            commentsSection.appendChild(commentElement);
            
            const showRepliesButton = commentElement.querySelector('.show-replies');
            const repliesContainer = commentElement.querySelector('.replies');
            showRepliesButton.addEventListener('click', () => {
                fetchReplies(comment.id, repliesContainer);
            });
        });
    }
    
    async function fetchReplies(commentId, container) {
        const response = await fetch(`${YOUTUBE_API_URL}/comments?part=snippet&parentId=${commentId}&key=${API_KEY}`);
        const data = await response.json();
        renderReplies(data.items, container);
    }
    
    function renderReplies(replies, container) {
        container.innerHTML = '';
        replies.forEach(reply => {
            const replyElement = document.createElement('div');
            replyElement.className = 'reply';
            replyElement.innerHTML = `
                <p><strong>${reply.snippet.authorDisplayName}</strong></p>
                <p>${reply.snippet.textDisplay}</p>
            `;
            container.appendChild(replyElement);
        });
    }
});
