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
    const filterValue = document.getElementById('archive-filter').value;
    archiveContainer.innerHTML = '';

    let filteredCards = tarotData;

    if (filterValue === 'major') {
        filteredCards = tarotData.filter(card => card.type === 'major');
    } else if (filterValue !== 'all') {
        filteredCards = tarotData.filter(card => card.suit === filterValue);
    }
    
    const weightMap = {
        'ace': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
        '10': 10, 'page': 11, 'knight': 12, 'queen': 13, 'king': 14
    };

    filteredCards.sort((a, b) => {
        let weightA = weightMap[a.value.toLowerCase()] || a.value_int || 0;
        let weightB = weightMap[b.value.toLowerCase()] || b.value_int || 0;
        return weightA - weightB;
    });

    filteredCards.forEach(card => {
        const imageUrl = getTarotImage(card);
        const cardDiv = document.createElement('div');

        cardDiv.innerHTML = `
        <img src="${imageUrl}" alt="${card.name}" width="150px" style="border-radius: 6px; border: 1px solid gold; margin-bottom: 5px;">
        <h3>${card.name}</h3>
        <details name= "tarot-archive-group">
            <summary style="outline: none;">Show meaning</summary>
            <p>${card.meaning_up}</p>
        </details>
        `;
        archiveContainer.appendChild(cardDiv);
    });
}

document.getElementById('archive-filter').addEventListener('change', renderArchive);

document.getElementById('spread-btn').addEventListener('click', () => {
    document.getElementById('spread-section').style.display = 'block';
    document.getElementById('archive-section').style.display = 'none';
});

document.getElementById('archive-btn').addEventListener('click', () => {
    document.getElementById('spread-section').style.display = 'none';
    document.getElementById('archive-section').style.display = 'block';
    resetSpreadToDefault();
});


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

        let identifier = '';
        const valLower = card.value.toLowerCase();


        if (valLower === 'ace' || valLower === '1') {
            identifier = 'ac';
        } else if (valLower === 'page') {
            identifier = 'pa';
        } else if (valLower === 'knight') {
            identifier = 'kn';
        } else if (valLower === 'queen') {
            identifier = 'qu';
        } else if (valLower === 'king') {
            identifier = 'ki';
        } else {
            identifier = String(card.value_int).padStart(2, '0');
        }
        
        return `https://sacred-texts.com/tarot/pkt/img/${suitCode}${identifier}.jpg`;
    }
}

async function handleDrawSpread() {
    const drawBtn = document.getElementById('draw-btn');
    const deckChoice = document.getElementById('deck-select').value;
    
    
    try {
        let cardsToDisplay = [];
        
        if (deckChoice === 'major') {
            const majorArcana = tarotData.filter(card => card.type === 'major');
            const shuffled = [...majorArcana].sort(() => 0.5 - Math.random());
            cardsToDisplay = shuffled.slice(0, 3);
        } else {
            const response = await fetch('https://tarotapi.dev/api/v1/cards/random?n=3');
            const data = await response.json();
            cardsToDisplay = data.cards;
        }
        
        const slots = document.querySelectorAll('.spread-card-slot');

        cardsToDisplay.forEach((card, index) => {
            const imageUrl = getTarotImage (card);
            const slot = slots[index];

            if (slot) {
                const imgElement = slot.querySelector('.card-flip-container img');
                const titleElement = slot.querySelector('.card-name');
                const pElement = slot.querySelector('.card-meaning');
                const startDelay = index * 600;

                setTimeout(() => {
                    imgElement.classList.remove('card-reveal-anim');
                    void imgElement.offsetWidth; // forza il reflow del browser affinche' parti una nuova animazione al click del bottone
                    imgElement.classList.add('card-reveal-anim');

                    setTimeout(() => {
                        imgElement.src = imageUrl;
                        imgElement.alt = card.name;
                    }, 400);

                    setTimeout(() => {
                        if (titleElement) titleElement.textContent = card.name;
                        if (pElement) pElement.textContent = card.meaning_up;
                    }, 450);
                }, startDelay);
            }
            
        });

        drawBtn.textContent = "New Spread";

    } catch (error) {
        console.error("Error drawing spread:", error);
    }
}

function resetSpreadToDefault() {
    const slots = document.querySelectorAll('.spread-card-slot');
    const drawBtn = document.getElementById('draw-btn');

    slots.forEach(slot => {
        const imgElement = slot.querySelector('.card-flip-container img');
        const titleElement = slot.querySelector('.card-name');
        const pElement = slot.querySelector('.card-meaning');

        if (imgElement) {
            imgElement.classList.remove('card-reveal-anim');
            imgElement.src = "img/retro.jpg";
            imgElement.alt = "Card back";
        }

        if (titleElement) titleElement.textContent = ""; 
        if (pElement) pElement.textContent = "";
    });

    if (drawBtn) {
        drawBtn.textContent = "Draw Spread";
    }
}


document.getElementById('draw-btn').addEventListener('click', handleDrawSpread);

fetchTarotData();