document.getElementById('search-box').addEventListener('click', getPlayerList);

const productContainer = document.getElementById('product-container');
const cartContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const modal = document.getElementById('player-modal');
const closeModal = document.getElementById('close-modal');
const modalBody = document.getElementById('modal-body');

let cart = [];

const loadAllPlayer = () => {
    fetch('https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p')
        .then((res) => res.json())
        .then((data) => {
            console.log(data.player);
            showPlayer(data.player);
        });
};

const showPlayer = (players) => {
    const productContainer = document.getElementById("product-container");
    productContainer.innerHTML = ''; 
    players.slice(0,10).forEach(player => {
        console.log(player);
        const div = document.createElement("div");
        div.innerHTML = `
            <div class="product-item" data-id="${player.idPlayer}">
                <div class="player-img">
                    <img src="${player.strThumb || 'https://www.thesportsdb.com/images/media/player/thumb/c3g89l1706382159.jpg'}" alt="player">
                </div>
                <div class="player-name">
                    <h3>${player.strPlayer}</h3>
                    <p>Nationality: ${player.strNationality}</p>
                    <p>Gender: ${player.strGender}</p>
                    <p>ID: ${player.idPlayer}</p>
                    <div class="social-icons">
                        <a href="${player.strFacebook}" target="_blank"><i class="fab fa-facebook"></i></a>
                        <a href="${player.strInstagram}" target="_blank"><i class="fab fa-instagram"></i></a>
                    </div>
                    <button class="details-btn" onclick="showDetails('${player.idPlayer}')">Details</button>
                    <button class="cart-btn" onclick="addToCart('${player.idPlayer}', '${player.strPlayer}')">Add to Cart</button>
                </div>
            </div>`;
        productContainer.appendChild(div);
    });
}
loadAllPlayer();

// new
function getPlayerList() {
    let searchInputTxt = document.getElementById('input-box').value.trim();
    fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${searchInputTxt}`)
        .then(response => response.json())
        .then(data => {
            displayPlayers(data.player);
        });
}

function displayPlayers(players) {
    let html = '';
    if (players) {
        players.forEach(player => {
            html += `
                <div class="product-item" data-id="${player.idPlayer }">
                    <div class="player-img">
                        <img src="${player.strThumb ||  'https://www.thesportsdb.com/images/media/player/cutout/jkpfin1694103786.png'}" alt="player">
                    </div>
                    <div class="player-name">
                        <h3>${player.strPlayer}</h3>
                        <p>Nationality: ${player.strNationality}</p>
                        <p>Gender: ${player.strGender}</p>
                        <p>ID: ${player.idPlayer || '34174477'}</p>
                        <div class="social-icons">
                            <a href="${player.strFacebook}" target="_blank"><i class="fab fa-facebook"></i></a>
                            <a href="${player.strInstagram}" target="_blank"><i class="fab fa-instagram"></i></a>
                        </div>
                        <button class="details-btn" onclick="showDetails('${player.idPlayer}')">Details</button>
                        <button class="cart-btn" onclick="addToCart('${player.idPlayer}', '${player.strPlayer}')">Add to Cart</button>
                    </div>
                </div>`;
        });
    } else {
        html = 'Sorry, no players found!';
    }
    productContainer.innerHTML = html;
}

function addToCart(playerId, playerName) {
    if (cart.length >= 11) {
        alert('Cannot add more players to the cart. Maximum limit reached.');
        return;
    }

    if (!cart.includes(playerId)) {
        cart.push(playerId);
        const cartItem = document.createElement('li');
        cartItem.textContent = playerName;
        cartContainer.appendChild(cartItem);
        cartCount.textContent = `(${cart.length})`;
    }
}

function showDetails(playerId) {
   
    fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${playerId}`)
        .then(response => response.json())
        .then(data => {
            const player = data.players[0];
            modalBody.innerHTML = `
                <h2 class="player-title">${player.strPlayer}</h2>
                <p class="player-category">Nationality: ${player.strNationality}</p>
                <p class="player-category">Gender: ${player.strGender}</p>
                <p class="player-id">ID: ${player.idPlayer}</p>
                <p class="player-id">Dath of birth: ${player.dateBorn}</p>
                <p class="player-id">Stry Playing: ${player.strPlayer}</p>
                
                <p class="player-description">${player.strDescriptionEN.slice(0,250) || 'No description available.'}</p>
            `;
            modal.style.display = 'block';
        });
}

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});
