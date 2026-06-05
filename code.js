// Look for 'countdowns' in localStorage. 
// If it exists, turn the string back into an array using JSON.parse().
// If it doesn't exist, default to an empty array [].
let countdowns = JSON.parse(localStorage.getItem('countdowns')) || [];

const addCountdownBtn = document.getElementById('add-countdown-btn');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const addCountdownForm = document.getElementById('add-countdown-form');
const countdownWrapper = document.getElementById('countdown-wrapper');
const countdownTitleInput = document.getElementById('countdown-title-input');
const countdownDateInput = document.getElementById('countdown-date-input');
const createModalBtn = document.getElementById('create-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');

function openModal() {
    modal.classList.remove('hidden');
    modalContent.classList.remove('hidden');
    modal.classList.add("modal");
    modalContent.classList.add("modal-content");
}

function closeModal() {
    modal.classList.add('hidden');
    modalContent.classList.add('hidden');
    modal.classList.remove("modal");
    modalContent.classList.remove("modal-content");
}

function renderCountdowns() {
    if (countdowns.length === 0) {
        countdownWrapper.innerHTML = `
            <div class="countdown-item-new" id="countdown-add" onclick="openModal()">
                <span class="material-icons">add</span>
            </div>

        `;

    } else {
        countdownWrapper.innerHTML = '';
        
        countdowns.forEach(countdown => {
            if (countdown.isCompleted) {
                countdownWrapper.innerHTML += `
                    <div class="countdown-item-completed" id="countdown-${countdown.id}">
                        <h2>${countdown.title}</h2>
                        <p>Timeout: ${formatTargetDate(countdown.date)}</p>
                        <p class="countdown-completed-p">Completed!</p>
                        <div class="countdown-actions">
                            <button class="card-action-btn-delete-btn" onclick="deleteCountdown(${countdown.id})">
                                <span class="material-icons">cancel</span>
                            </button>
                        </div>
                    </div>
                `;
            } else {
                countdownWrapper.innerHTML += `
                    <div class="countdown-item" id="countdown-${countdown.id}">
                        <h2>${countdown.title}</h2>
                        <p>Timeout: ${formatTargetDate(countdown.date)}</p>
                        <p>Time Left: ${calculateTimeLeft(countdown.date, countdown.id)}</p>
                        <div class="countdown-actions">
                            <button class="card-action-btn-done-btn" onclick="markAsDone(${countdown.id})">
                                <span class="material-icons">check_circle</span>
                            </button>

                            <button class="card-action-btn-delete-btn" onclick="deleteCountdown(${countdown.id})">
                                <span class="material-icons">cancel</span>
                            </button>
                        </div>
                    </div>
                `;
            }
        });
    }
}


function deleteCountdown(idToDelete) { // idToDelete is the id of the card, meaning the date when it was created
    countdowns = countdowns.filter(countdown => countdown.id !== idToDelete); // the filter function will look through the countdowns array and check what  elements match the id. the element with the matching id gets filtered out
    localStorage.setItem('countdowns', JSON.stringify(countdowns)); //this line completely refreshes the array and saves only the countdowns with other ids, then the data turns into string
    renderCountdowns(); // updates countdown cards
}

function markAsDone(idToMark) {
    countdowns = countdowns.map(countdown => countdown.id === idToMark ? { ...countdown, isCompleted: true } : countdown); // map alters data. so in this instance it checks for the card to be modified. ? : is a compact if/else statement, so the correct card get assigned isCompleted: true, and the others will pass right through.
    localStorage.setItem('countdowns', JSON.stringify(countdowns));
    renderCountdowns();
}
function deleteAllCountdowns() {
    countdowns = [];
    localStorage.setItem('countdowns', JSON.stringify(countdowns));
    renderCountdowns();
}

function deleteAllCompletedCountdowns() {
    countdowns = countdowns.filter(countdown => countdown.isCompleted === false); // the filter function will look through the countdowns array and check what  elements are marked as complete
    localStorage.setItem('countdowns', JSON.stringify(countdowns)); //this line completely refreshes the array and saves only the countdowns that have not yet been completed, then the data turns into string
    renderCountdowns(); // updates countdown cards
}

function calculateTimeLeft(date, countdown){
    const dateNow = new Date().getTime() // .getTime() ensures the time is in miliseconds, exactly what computers read
    const targetDate = new Date(date).getTime() // the parameter date is wrapped inside the function to first convert it into miliseconds
    const difference = targetDate - dateNow
    
    if (difference <= 0){
        markAsDone(countdown)
        return "Completed!"
    } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
}

function formatTargetDate(dateString) {
    if (!dateString) return '';
    
    const dateObj = new Date(dateString);
    
    // Configures exactly how the text will display
    return dateObj.toLocaleString('en-UK', {
        day: 'numeric', 
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

addCountdownForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const Title = countdownTitleInput.value;
    const targetDate = countdownDateInput.value;
    const newCountdown = {
        title: Title,
        date: targetDate,
        id: Date.now(),
        isCompleted: false
    };

    countdowns.push(newCountdown);
    countdownTitleInput.value = '';
    countdownDateInput.value = '';
    localStorage.setItem('countdowns', JSON.stringify(countdowns));
    renderCountdowns();
    closeModal();
});

renderCountdowns();

setInterval(renderCountdowns, 1000)

