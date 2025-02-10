// Load saved goals on startup
document.addEventListener('DOMContentLoaded', loadGoals);

function addGoal() {
    const input = document.getElementById('goalInput');
    if (input.value.trim() === '') return;

    // Create goal element
    const goalDiv = document.createElement('div');
    goalDiv.className = 'goal-item';
    goalDiv.innerHTML = `
        <span>${input.value}</span>
        <button onclick="deleteGoal(this)">❌</button>
    `;

    document.getElementById('goalsList').appendChild(goalDiv);
    saveGoal(input.value);
    input.value = '';
}

function deleteGoal(button) {
    const goalText = button.parentElement.querySelector('span').innerText;
    button.parentElement.remove();
    removeGoalFromStorage(goalText);
}

// Save to localStorage
function saveGoal(goal) {
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    goals.push(goal);
    localStorage.setItem('goals', JSON.stringify(goals));
}

// Load from localStorage
function loadGoals() {
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    goals.forEach(goal => {
        const goalDiv = document.createElement('div');
        goalDiv.className = 'goal-item';
        goalDiv.innerHTML = `
            <span>${goal}</span>
            <button onclick="deleteGoal(this)">❌</button>
        `;
        document.getElementById('goalsList').appendChild(goalDiv);
    });
}

function removeGoalFromStorage(goalText) {
    let goals = JSON.parse(localStorage.getItem('goals'));
    goals = goals.filter(goal => goal !== goalText);
    localStorage.setItem('goals', JSON.stringify(goals));
}