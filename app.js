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

// Save goal to Firestore
async function addGoal() {
  const user = auth.currentUser;
  if (!user) return alert("Please sign in!");

  const goal = {
    text: document.getElementById('goalInput').value,
    dueDate: document.getElementById('dueDateInput').value,
    timeFrame: document.getElementById('timeFrame').value,
    userId: user.uid,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  // Add to Firestore
  await db.collection('goals').add(goal);
  loadGoals(); // Refresh the list
}

// Load goals from Firestore
async function loadGoals() {
  const user = auth.currentUser;
  if (!user) return;

  const query = await db.collection('goals')
    .where("userId", "==", user.uid)
    .orderBy("createdAt", "desc")
    .get();

  const goalsList = document.getElementById('goalsList');
  goalsList.innerHTML = "";

  query.forEach(doc => {
    const goal = doc.data();
    const goalDiv = document.createElement('div');
    goalDiv.className = 'goal-item';
    goalDiv.innerHTML = `
      <span>${goal.text}</span>
      <small>Due: ${new Date(goal.dueDate).toLocaleDateString()}</small>
      <small>Timeframe: ${goal.timeFrame}</small>
      <button onclick="deleteGoal('${doc.id}')">❌</button>
    `;
    goalsList.appendChild(goalDiv);
  });
}

// Delete goal
async function deleteGoal(docId) {
  await db.collection('goals').doc(docId).delete();
  loadGoals();
}
