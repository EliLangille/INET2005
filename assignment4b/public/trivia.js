// Get references to necessary DOM elements
const questionDiv = document.getElementById('question');
const answerInput = document.getElementById('answer');
const submitButton = document.getElementById('submit');
const newQuestionButton = document.getElementById('new-question');
const feedbackDiv = document.getElementById('feedback');
const scoreDiv = document.getElementById('score');

// Set initial score
let score = 0;

// Function to prompt the OpenAI API and return the response text
async function promptAPI(prompt) {
    try {
        const response = await fetch('/api/trivia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the response from the server
        const data = await response.text();

        return data;
    } catch (error) {
        console.error('Error fetching API response:', error);
        return 'Error fetching question. Please refresh the page.';
    }
}

// Function to generate a trivia category from an array of categories
function selectTriviaCategory() {
    const categories = ['animals', 'architecture', 'astronomy', 'art', 'business', 'celebrity',
        'comics', 'fashion', 'food and drink', 'fun', 'funny', 'general knowledge', 'geography', 
        'health and medicine', 'history', 'languages', 'literature', 'movies', 'music', 'mythology', 
        'nature', 'philosophy', 'politics', 'programming', 'quotes', 'random', 'scary', 'science', 
        'space', 'sports', 'technology', 'television', 'travel', 'video games', 'weather', 'weird'];

    // Return one of the above categories at random
    return categories[Math.floor(Math.random() * categories.length)];
}

// Function to generate a new trivia question from a random category
async function fetchQuestion() {
    const category = selectTriviaCategory();
    const question = await promptAPI(`Give me a ${category} trivia question`);
    questionDiv.textContent = question.trim();
    feedbackDiv.textContent = '';
    submitButton.disabled = false; // Re-enable the submit button
}

// Submit and check the user's answer when the submit button is clicked
submitButton.addEventListener('click', async (event) => {
    event.preventDefault();

    // Get the user's answer from the input field
    const userAnswer = answerInput.value;
    const question = questionDiv.textContent;

    // Prompt the API with the user's answer
    const response = await promptAPI(`Question: ${question}\nIs the answer "${userAnswer}" correct?`);

    // Display feedback
    feedbackDiv.textContent = response.trim();

    // Check answer and update score
    if (response.toLowerCase().includes('yes')) {
        score++;
    }
    scoreDiv.textContent = `Score: ${score}`;

    // Clear the input field and disable the submit button until next question
    answerInput.value = '';
    submitButton.disabled = true;
});

// Fetch a new trivia question when the new question button is clicked
newQuestionButton.addEventListener('click', async (event) => {
    event.preventDefault();
    fetchQuestion();
});

// Fetch the initial trivia question when the page loads
fetchQuestion();