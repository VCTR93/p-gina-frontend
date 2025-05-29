// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }


    const cryptoContainer = document.getElementById('crypto-cards-container');
    const loadingMessage = document.getElementById('loading-message');
    const errorMessage = document.getElementById('error-message');

    async function fetchCryptoPrices() {
        if (!cryptoContainer || !loadingMessage || !errorMessage) return; // Asegurarse de que los elementos existen

        loadingMessage.classList.remove('d-none'); 
        errorMessage.classList.add('d-none');      
        cryptoContainer.innerHTML = '';          

        const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd';

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Filtrar o seleccionar las primeras 5 criptomonedas (o las que desees)
            const cryptoData = data.slice(0, 5);

            if (cryptoData.length === 0) {
                cryptoContainer.innerHTML = '<p class="text-center text-muted">No se encontraron datos de criptomonedas.</p>';
            } else {
                cryptoData.forEach(crypto => {
                    const change24h = crypto.price_change_percentage_24h;
                    const changeColorClass = change24h >= 0 ? 'text-success' : 'text-danger';

                    const cardHtml = `
                        <div class="col-12 col-md-6 col-lg-4">
                            <div class="card shadow-sm h-100 crypto-card">
                                <div class="card-body d-flex align-items-center justify-content-between">
                                    <div class="d-flex align-items-center">
                                        <img src="${crypto.image}" alt="${crypto.name} logo" class="me-3" style="width: 32px; height: 32px;">
                                        <div>
                                            <h5 class="card-title mb-0 fw-bold">${crypto.name}</h5>
                                            <p class="card-subtitle text-muted text-uppercase">${crypto.symbol}</p>
                                        </div>
                                    </div>
                                    <div class="text-end">
                                        <p class="card-text fs-5 fw-bold mb-0">$${crypto.current_price.toFixed(2)}</p>
                                        <p class="card-text ${changeColorClass} fs-6">
                                            ${change24h.toFixed(2)}% (24h)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    cryptoContainer.innerHTML += cardHtml;
                });
            }
            loadingMessage.classList.add('d-none'); 
        } catch (error) {
            console.error("Error fetching crypto prices:", error);
            loadingMessage.classList.add('d-none'); 
            errorMessage.classList.remove('d-none');
            errorMessage.textContent = `Error al cargar los datos: ${error.message}. Intenta de nuevo más tarde.`;
        }
    }

    fetchCryptoPrices();
    setInterval(fetchCryptoPrices, 60000);
});