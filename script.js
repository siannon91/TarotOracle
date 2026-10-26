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

document.getElementById('archive-btn').addEventListener('click', () => {
    document.getElementById('spread-section').style.display = 'block';
    document.getElementById('archive-section').style.display = 'none';
});

fetchTarotData();

function getTarotImage (card) {
    if (card.type === 'major') {
        const num = String(card.value_int).padStart(2, '0');
    //il server da cui preleviamo le immagini richiede nomi a due cifre, con .padStart
    //intercettiamo il numero della carta e aggiungiamo lo 0 per i numeri inferiori a 10
        return `https://sacred-texts.com/tarot/pkt/img/ar${num}.jpg`;
    } else { //usa la sigla per costruire l'indirizzo internet corretto per l'immagine
        let suitCode = '';
        if (card.suit === 'wands') suitCode = 'wa';
        if (card.suit === 'cups') suitCode = 'cu';
        if (card.suit === 'swords') suitCode = 'sw';
        if (card.suit === 'pentacles') suitCode = 'pe';

        const num = String(card,caøue_int).padStart(2, '0');
        return `https://sacred-texts.com/tarot/pkt/img/${suitCode}${num}.jpg`;
    }
}