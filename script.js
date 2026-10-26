let tarotData = [];

async function fetchTarotData() {
    try {
        const response = await fetch('https://tarotapi.dev/api/v1/cards');
        const data = await response.json();
        tarotData = data.cards;
        console.log("Tarot cards loaded successfully:", tarotData.length);
        renderArchive();
    } catch (error) {
        console.error("Error fetching tarot data:", error);
    }
}

function renderArchive() {
    const archiveContainer = document.getElementById('archive-container');
    archiveContainer.innerHTML = '';

    tarotData.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.innerHTML = `<h3>${card.name}</h3><p>${card.meaning_up}</p>`;
        archiveContainer.appendChild(cardDiv);
    });
}

document.getElementById('spread-btn').addEventListener('click', () => {
    document.getElementById('spread-section').style.display = 'block';
    document.getElementById('archive-section').style.display = 'none';
});

fetchTarotData();