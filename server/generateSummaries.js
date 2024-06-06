const axios = require('axios');

axios.get('http://localhost:5000/api/posts/summary')
    .then(response => {
        const summaries = response.data;
        console.log(summaries);
    })
    .catch(error => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Server responded with an error:', error.response.status);
            console.error('Error message:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received from the server:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error setting up the request:', error.message);
        }
    });
