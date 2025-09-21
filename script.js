
// Read value from the input, validate it's a YouTube URL, and set the iframe src
function checkURL(url) {
    if (!url || typeof url !== 'string') {
        alert('Please enter a URL.');
        return false;
    }

    // Basic YouTube URL checks
    var isYouTube = url.includes('youtube.com') || url.includes('youtu.be') || url.includes('youtube-nocookie.com');
    if (!isYouTube) {
        alert('Please enter a valid YouTube URL.');
        return false;
    }
    
    // Try to parse and normalize the URL into an embeddable YouTube URL
    try {
        var embedUrl = url;
        var u = new URL(url, window.location.href);

        // Handle youtu.be short links first: youtu.be/VIDEO
        if (u.hostname === 'youtu.be') {
            var id = u.pathname.slice(1);
            if (id) {
                embedUrl = 'https://www.youtube.com/embed/' + id;
            } else {
                alert('Please enter a YouTube video URL (e.g. https://youtu.be/VIDEO).');
                return false;
            }
        }

        // Handle regular youtube.com links
        else if (u.hostname.includes('youtube.com')) {
            // If already an embed URL, accept it
            if (u.pathname.startsWith('/embed/')) {
                embedUrl = u.href;
            }

            // watch?v=VIDEO
            else if (u.searchParams.has('v')) {
                var vid = u.searchParams.get('v');
                if (vid) {
                    embedUrl = 'https://www.youtube.com/embed/' + vid;
                } else {
                    alert('Please enter a YouTube video URL that includes a video id (v=...).');
                    return false;
                }
            }

            // shorts/VIDEO
            else if (u.pathname.startsWith('/shorts/')) {
                var parts = u.pathname.split('/');
                var id = parts[2] || '';
                if (id) {
                    embedUrl = 'https://www.youtube.com/embed/' + id;
                } else {
                    alert('Please enter a YouTube shorts URL with a video id.');
                    return false;
                }
            }

            // No recognizable video id found (e.g. youtube.com/ or /channel/ etc.)
            else {
                alert('Please enter a YouTube video URL (examples: https://www.youtube.com/watch?v=ID or https://youtu.be/ID).');
                return false;
            }
        }

        // At this point we have an embedUrl we can set
        var iframe = document.getElementById('urlVideo');
        iframe.src = embedUrl;
        return true;
    } catch (e) {
        console.log('URL parse error', e);
        alert('The URL entered is not valid. Please enter a full YouTube video URL.');
        return false;
    }
}

// Attach click handler to the button to read the input value and call checkURL
document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('urlButton');
    var input = document.getElementById('urlInput');
    if (btn && input) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            checkURL(input.value.trim());
        });
    }
});

