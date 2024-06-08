const postsPerPage = 4;
let currentPage = 1;
let posts = [];

document.getElementById('postImages').addEventListener('change', function() {
    const fileCount = this.files.length;
    document.getElementById('fileCount').textContent = fileCount + ' file(s) selected';
});

function createPost() {
    const text = document.getElementById('postText').value;
    const images = document.getElementById('postImages').files;

    if (!text && images.length === 0) {
        alert('Please enter some text or select images');
        return;
    }

    const postContainer = document.createElement('div');
    postContainer.className = 'post';

    const textElement = document.createElement('p');
    textElement.textContent = text;
    postContainer.appendChild(textElement);

    if (images.length > 0) {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';
        
        if (images.length === 1) {
            imageContainer.classList.add('one');
        } else if (images.length === 2) {
            imageContainer.classList.add('two');
        } else if (images.length === 3) {
            imageContainer.classList.add('three');
        } else if (images.length === 4) {
            imageContainer.classList.add('four');
        }

        for (let i = 0; i < Math.min(images.length, 4); i++) {
            const imgElement = document.createElement('img');
            imgElement.src = URL.createObjectURL(images[i]);
            imageContainer.appendChild(imgElement);
        }

        postContainer.appendChild(imageContainer);
    }

    // Create Edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'edit';
    editButton.onclick = function() {
        editPost(postContainer);
    };
    postContainer.appendChild(editButton);

    // Create Delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function() {
        deletePost(postContainer);
    };
    postContainer.appendChild(deleteButton);

    // Add timestamp
    const timestamp = document.createElement('p');
    const date = new Date().toLocaleString();
    timestamp.textContent = `Created: ${date}`;
    postContainer.appendChild(timestamp);

    // Add new post at the beginning of the array
    posts.unshift(postContainer);
    displayPosts();

    document.getElementById('postText').value = '';
    document.getElementById('postImages').value = '';
    document.getElementById('fileCount').textContent = '';
}

function deletePost(postElement) {
    if (confirm('Are you sure you want to delete this post?')) {
        posts = posts.filter(post => post !== postElement);
        displayPosts();
    }
}

function editPost(postElement) {
    const textElement = postElement.querySelector('p');
    const text = prompt('Edit your post:', textElement.textContent);
    if (text !== null) {
        textElement.textContent = text;
        // Update timestamp
        const timestamp = postElement.querySelector('p.timestamp');
        const date = new Date().toLocaleString();
        timestamp.textContent = `Last modified: ${date}`;
    }
}

function displayPosts() {
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = '';

    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    const paginatedPosts = posts.slice(start, end);

    paginatedPosts.forEach(post => {
        postsContainer.appendChild(post);
    });

    displayPagination();
}

function displayPagination() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(posts.length / postsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = currentPage === i ? 'active' : '';
        button.onclick = function() {
            currentPage = i;
            displayPosts();
        };
        paginationContainer.appendChild(button);
    }
}

// Initial display
displayPosts();
