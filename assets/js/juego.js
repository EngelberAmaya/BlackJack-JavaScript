const miModulo = (() => {
    'use strict'

    /*
        2C =  Two of Clubs 
        2D  = Two of Diamonds 
        2H =  Two of Hearts 
        2S = Two of Spades 
    */
    
    let deck = [];
    const tipos = ['C', 'D', 'H', 'S'],
          especiales = ['A', 'J', 'Q', 'K'];

    let puntosJugadores = [];
    
    // Referencias del HTML
    const btnPedir = document.querySelector('#btnPedir'),
          btnDetener = document.querySelector('#btnDetener');
    
    const divCartasJugadores = document.querySelectorAll('.divCartas'),
          puntosHTML =  document.querySelectorAll('small');

    const inicializarJuego = ( numJugadores = 2 ) => {

        deck = crearDeck();
        puntosJugadores = [];

        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0)
        }

        puntosHTML.forEach( elem => elem.innerText = 0);
        divCartasJugadores.forEach( elem => elem.innerHTML = '');
    
        btnPedir.disabled = false;
        btnDetener.disabled = false;
    }
    
    const crearDeck = () => {

        deck = [];
    
        for (let i = 2; i <= 10; i++) {
    
            for (let tipo of tipos) {
                
                deck.push(i + tipo);     
            }
        }
    
        for (let tipo of tipos) {
    
            for (let esp of especiales) {
                deck.push(esp + tipo); 
            }
        }
    
        return _.shuffle(deck);
    }
    
    
    const pedirCarta = () => {
    
        if (deck.length === 0) {
            throw 'No hay cartas en el deck';
        }
    
        return deck.pop();
    }
    
    
    const valorCarta = (carta) => {
    
        const valor = carta.substring(0, carta.length - 1);
        
        return (isNaN(valor)) ?
                (valor === 'A') ? 11 : 10
                : valor * 1;
    
    }

    const acumularPuntos = (carta, turno) => {

        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);    
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `./assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append(imgCarta)
    }

    const determinarGanador = () => {

        const [ puntosMinimos, puntosComputadora ] = puntosJugadores;

        setTimeout(() => {
            
            if (puntosComputadora === puntosMinimos) {
                Swal.fire('Nadie Gana');           
            } else if (puntosMinimos > 21) {
                Swal.fire('Computadora Gana');
            } else if (puntosComputadora > 21) {
                Swal.fire('Jugador Gana');
            } else {
                Swal.fire('Computadora Gana');
            }
    
        }, 100);
    }
    
    const turnoComputadora = (puntosMinimos) => {

        let puntosComputadora = 0;
    
        do {
    
            const carta = pedirCarta();
    
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
    
            crearCarta(carta, puntosJugadores.length - 1);

        } while ((puntosComputadora < puntosMinimos) && puntosMinimos <= 21);
    
        determinarGanador();
    
    }
    
    
    // Eventos
    
    btnPedir.addEventListener('click', () => {
    
        const carta = pedirCarta();
    
        const puntosJugador = acumularPuntos(carta, 0);
    
        crearCarta(carta, 0);
    
        if (puntosJugador > 21) {
    
            console.warn('Lo siento mucho, perdiste');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
    
        } else if (puntosJugador === 21) {
    
            console.warn('21, genial');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador)
        }
       
    });
    
    btnDetener.addEventListener('click', () => {
    
        btnPedir.disabled = true;
        btnDetener.disabled = true;
    
        turnoComputadora(puntosJugadores[0]);
    });
    
    /*btnNuevo.addEventListener('click', () => {
        
        inicializarJuego();
    
    });*/

    return {
        nuevoJuego: inicializarJuego
    };

})();