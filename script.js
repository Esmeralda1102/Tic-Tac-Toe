
(function () {

    'use strict';

    const CLAVE_PUNTUACIONES = 'ttt_puntuaciones_jugadores';



    const LINEAS_GANADORAS = [

        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]

    ];

    let estado = {

        modo: null,

        nombreJugador1: 'Jugador 1',

        nombreJugador2: 'CPU',

        tablero: Array(9).fill(null),

        turno: 'X',

        marcaInicial: 'X',

        puntuacion: {

            jugador1: 0,
            jugador2: 0,
            empates: 0

        },

        juegoTerminado: false,

        lineaGanadora: null

    };

    const pantallas = {

        carga: document.getElementById('pantalla-carga'),

        menu: document.getElementById('pantalla-menu'),

        nombres: document.getElementById('pantalla-nombres'),

        juego: document.getElementById('pantalla-juego')

    };


    const rellenoProgreso =
        document.getElementById('relleno-progreso');

    const botonCpu =
        document.getElementById('boton-cpu');

    const botonJugadores =
        document.getElementById('boton-jugadores');

    const botonContinuar =
        document.getElementById('boton-continuar');



    const tituloNombres =
        document.getElementById('titulo-nombres');

    const nombreJugador1 =
        document.getElementById('nombre-jugador1');

    const nombreJugador2 =
        document.getElementById('nombre-jugador2');

    const botonIniciar =
        document.getElementById('boton-iniciar');


    const botonVolver =
        document.getElementById('boton-volver');

    const botonReiniciar =
        document.getElementById('boton-reiniciar');

    const tablero =
        document.getElementById('tablero');

    const casillas =
        Array.from(document.querySelectorAll('.casilla'));



    const nombreMostrarJugador1 =
        document.getElementById('nombre-mostrar-jugador1');

    const nombreMostrarJugador2 =
        document.getElementById('nombre-mostrar-jugador2');


    const marcaJugador1 =
        document.getElementById('marca-jugador1');

    const marcaJugador2 =
        document.getElementById('marca-jugador2');


    const avatarJugador2 =
        document.getElementById('avatar-jugador2');



    const etiquetaPuntosJugador1 =
        document.getElementById('etiqueta-puntos-jugador1');

    const etiquetaPuntosJugador2 =
        document.getElementById('etiqueta-puntos-jugador2');


    const puntosJugador1 =
        document.getElementById('puntos-jugador1');

    const puntosJugador2 =
        document.getElementById('puntos-jugador2');


    const puntosEmpates =
        document.getElementById('puntos-empates');



    const modalResultado =
        document.getElementById('modal-resultado');


    const iconoResultado =
        document.getElementById('icono-resultado');


    const tituloResultado =
        document.getElementById('titulo-resultado');


    const mensajeResultado =
        document.getElementById('mensaje-resultado');



    const modalEtiquetaJugador1 =
        document.getElementById('modal-etiqueta-jugador1');


    const modalEtiquetaJugador2 =
        document.getElementById('modal-etiqueta-jugador2');


    const modalPuntosJugador1 =
        document.getElementById('modal-puntos-jugador1');


    const modalPuntosJugador2 =
        document.getElementById('modal-puntos-jugador2');


    const modalPuntosEmpates =
        document.getElementById('modal-puntos-empates');



    const botonSalir =
        document.getElementById('boton-salir');


    const botonSiguiente =
        document.getElementById('boton-siguiente');


    const modalConfirmar =
        document.getElementById('modal-confirmar');


    const botonCancelarReinicio =
        document.getElementById('boton-cancelar-reinicio');


    const botonConfirmarReinicio =
        document.getElementById('boton-confirmar-reinicio');


    let contextoAudio = null;


    function sonido(frecuencia, duracion, tipo) {

        try {

            contextoAudio =
                contextoAudio ||
                new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();


            const oscilador =
                contextoAudio.createOscillator();


            const ganancia =
                contextoAudio.createGain();


            oscilador.type =
                tipo || 'sine';


            oscilador.frequency.value =
                frecuencia;


            ganancia.gain.setValueAtTime(
                0.08,
                contextoAudio.currentTime
            );


            ganancia.gain.exponentialRampToValueAtTime(
                0.0001,
                contextoAudio.currentTime + duracion
            );


            oscilador
                .connect(ganancia)
                .connect(contextoAudio.destination);


            oscilador.start();


            oscilador.stop(
                contextoAudio.currentTime + duracion
            );


        } catch (error) {


        }

    }


    const sonidos = {

        colocar: () =>
            sonido(420, 0.12, 'triangle'),


        ganar: () => {

            sonido(523, 0.15);

            setTimeout(
                () => sonido(659, 0.15),
                120
            );

            setTimeout(
                () => sonido(784, 0.25),
                240
            );

        },


        perder: () => {

            sonido(300, 0.2, 'sawtooth');

            setTimeout(
                () => sonido(220, 0.3, 'sawtooth'),
                150
            );

        },


        empate: () =>
            sonido(392, 0.3, 'square'),


        clic: () =>
            sonido(600, 0.06, 'square')

    };


          function guardarPuntuacion() {

    try {

        const puntuaciones =
            JSON.parse(
                localStorage.getItem(CLAVE_PUNTUACIONES)
            ) || {};

        const nombre =
            estado.nombreJugador1.trim();

        if (!nombre) {
            return;
        }

        puntuaciones[nombre] = {
            jugador1: estado.puntuacion.jugador1,
            jugador2: estado.puntuacion.jugador2,
            empates: estado.puntuacion.empates
        };

        localStorage.setItem(
            CLAVE_PUNTUACIONES,
            JSON.stringify(puntuaciones)
        );

        } catch (error) {



        }

    }

    function cargarPuntuacion(nombre) {

    try {

        const puntuaciones =
            JSON.parse(
                localStorage.getItem(CLAVE_PUNTUACIONES)
            ) || {};

        return puntuaciones[nombre] || {
            jugador1: 0,
            jugador2: 0,
            empates: 0
        };


       } catch (error) {

           return null;

        }

    }


    function borrarPartida() {

        try {

            localStorage.removeItem(CLAVE_GUARDADO);

        } catch (error) {


        }

    }


    function mostrarPantalla(nombre) {

        Object.values(pantallas).forEach(
            pantalla => {

                pantalla.classList.remove(
                    'pantalla-activa'
                );

            }
        );


        pantallas[nombre].classList.add(
            'pantalla-activa'
        );

    }



    function comprobarGanador(tableroJuego) {

        for (const linea of LINEAS_GANADORAS) {

            const [a, b, c] = linea;


            if (
                tableroJuego[a] &&
                tableroJuego[a] === tableroJuego[b] &&
                tableroJuego[a] === tableroJuego[c]
            ) {

                return {

                    marca: tableroJuego[a],

                    linea: linea

                };

            }

        }


        return null;

    }


    function tableroLleno(tableroJuego) {

        return tableroJuego.every(
            valor => valor !== null
        );

    }


    function buscarMovimientoGanador(
        tableroJuego,
        marca
    ) {

        for (const linea of LINEAS_GANADORAS) {

            const valores =
                linea.map(
                    posicion => tableroJuego[posicion]
                );


            const cantidadMarcas =
                valores.filter(
                    valor => valor === marca
                ).length;


            const espaciosVacios =
                linea.filter(
                    posicion =>
                        tableroJuego[posicion] === null
                );


            if (
                cantidadMarcas === 2 &&
                espaciosVacios.length === 1
            ) {

                return espaciosVacios[0];

            }

        }


        return -1;

    }


    function elegirMovimientoCpu(
        tableroJuego,
        marcaCpu,
        marcaJugador
    ) {


        let movimiento =
            buscarMovimientoGanador(
                tableroJuego,
                marcaCpu
            );


        if (movimiento !== -1) {

            return movimiento;

        }


        movimiento =
            buscarMovimientoGanador(
                tableroJuego,
                marcaJugador
            );


        if (movimiento !== -1) {

            return movimiento;

        }


        if (tableroJuego[4] === null) {

            return 4;

        }


        const esquinas = [
            0,
            2,
            6,
            8
        ];


        const esquinasOpuestas = {

            0: 8,
            2: 6,
            6: 2,
            8: 0

        };


        for (const esquina of esquinas) {

            if (
                tableroJuego[esquina] === marcaJugador &&
                tableroJuego[
                    esquinasOpuestas[esquina]
                ] === null
            ) {

                return esquinasOpuestas[esquina];

            }

        }


        const esquinasLibres =
            esquinas.filter(
                esquina =>
                    tableroJuego[esquina] === null
            );


        if (esquinasLibres.length) {

            return esquinasLibres[
                Math.floor(
                    Math.random() *
                    esquinasLibres.length
                )
            ];

        }


        const lados = [
            1,
            3,
            5,
            7
        ].filter(
            lado =>
                tableroJuego[lado] === null
        );


        if (lados.length) {

            return lados[
                Math.floor(
                    Math.random() *
                    lados.length
                )
            ];

        }


        return -1;

    }


    function mostrarJuego() {


        nombreMostrarJugador1.textContent =
            estado.nombreJugador1;


        nombreMostrarJugador2.textContent =
            estado.nombreJugador2;


        marcaJugador1.textContent = 'X';

        marcaJugador2.textContent = 'O';


        avatarJugador2.classList.toggle(
            'avatar-o',
            true
        );


        const etiquetaJugador1 =
            obtenerIniciales(
                estado.nombreJugador1
            );


        const etiquetaJugador2 =
            estado.modo === 'cpu'
                ? 'CPU'
                : obtenerIniciales(
                    estado.nombreJugador2
                );


        etiquetaPuntosJugador1.textContent =
            etiquetaJugador1;


        etiquetaPuntosJugador2.textContent =
            etiquetaJugador2;


        puntosJugador1.textContent =
            `${estado.puntuacion.jugador1} GANADAS`;


        puntosJugador2.textContent =
            `${estado.puntuacion.jugador2} GANADAS`;


        puntosEmpates.textContent =
            `${estado.puntuacion.empates} EMPATES`;


        casillas.forEach(
            (casilla, posicion) => {

                const valor =
                    estado.tablero[posicion];


                casilla.textContent =
                    valor || '';


                casilla.classList.toggle(
                    'marca-o',
                    valor === 'O'
                );


                casilla.classList.remove(
                    'casilla-ganadora'
                );


                casilla.disabled =
                    !!valor ||
                    estado.juegoTerminado;

            }
        );


        if (estado.lineaGanadora) {

            estado.lineaGanadora.forEach(
                posicion => {

                    casillas[posicion]
                        .classList.add(
                            'casilla-ganadora'
                        );

                }
            );

        }


        botonReiniciar.disabled = false;

    }


    function obtenerIniciales(nombre) {

        return (
            nombre || ''
        )
            .trim()
            .slice(0, 3)
            .toUpperCase()
            || 'P';

    }



    function colocarMarca(posicion) {

        if (
            estado.juegoTerminado ||
            estado.tablero[posicion]
        ) {

            return;

        }


        estado.tablero[posicion] =
            estado.turno;


        sonidos.colocar();


        const casilla =
            casillas[posicion];


        casilla.classList.add(
            'aparecer'
        );


        setTimeout(
            () => {

                casilla.classList.remove(
                    'aparecer'
                );

            },
            200
        );


        const ganador =
            comprobarGanador(
                estado.tablero
            );


        if (ganador) {

            terminarRonda(ganador.marca, ganador.linea);

            return;

        }


        if (
            tableroLleno(
                estado.tablero
            )
        ) {

            terminarRonda(
                null,
                null
            );

            return;

        }


        estado.turno =
            estado.turno === 'X'
                ? 'O'
                : 'X';


        mostrarJuego();
        guardarPuntuacion();

        //guardarPartida();



        if (
            estado.modo === 'cpu' &&
            estado.turno === 'O' &&
            !estado.juegoTerminado
        ) {

            tablero.style.pointerEvents =
                'none';


            setTimeout(
                jugarCpu,
                450
            );

        }

    }



    function jugarCpu() {

        const movimiento =
            elegirMovimientoCpu(
                estado.tablero,
                'O',
                'X'
            );


        tablero.style.pointerEvents =
            'auto';


        if (movimiento === -1) {

            return;

        }


        colocarMarca(movimiento);

    }




    function terminarRonda(
        marcaGanadora,
        linea
    ) {

        estado.juegoTerminado =
            true;


        estado.lineaGanadora =
            linea;


        if (marcaGanadora === 'X') {

            estado.puntuacion.jugador1++;

        }

        else if (
            marcaGanadora === 'O'
        ) {

            estado.puntuacion.jugador2++;

        }

        else {

            estado.puntuacion.empates++;

        }


        mostrarJuego();
        guardarPuntuacion();



        setTimeout(
            () => {

                abrirModalResultado(
                    marcaGanadora
                );

            },
            350
        );

    }



    function abrirModalResultado(
        marcaGanadora
    ) {


        modalEtiquetaJugador1.textContent =
            etiquetaPuntosJugador1.textContent;


        modalEtiquetaJugador2.textContent =
            etiquetaPuntosJugador2.textContent;


        modalPuntosJugador1.textContent =
            puntosJugador1.textContent;


        modalPuntosJugador2.textContent =
            puntosJugador2.textContent;


        modalPuntosEmpates.textContent =
            puntosEmpates.textContent;



        if (marcaGanadora === null) {

            iconoResultado.innerHTML =
                '<img src="assets/empate.svg" alt="Empate">';


            tituloResultado.textContent =
                'EMPATE';


            mensajeResultado.textContent =
                '¡Nadie completó una línea!';


            sonidos.empate();

        }


        else if (
            marcaGanadora === 'X'
        ) {

            iconoResultado.innerHTML =
                '<img src="assets/ganador.svg" alt="Ganador">';


            tituloResultado.textContent =
                'VICTORIA';


            mensajeResultado.textContent =
                estado.nombreJugador1;


            sonidos.ganar();

        }



        else {


            if (
                estado.modo === 'cpu'
            ) {

                iconoResultado.innerHTML =
                    '<img src="assets/perdedor.svg" alt="Perdedor">';


                tituloResultado.textContent =
                    'PERDISTE';


                mensajeResultado.textContent =
                    estado.nombreJugador1;


                sonidos.perder();

            }



            else {

                iconoResultado.textContent =
                    '🏆';


                tituloResultado.textContent =
                    'VICTORIA';


                mensajeResultado.textContent =
                    estado.nombreJugador2;


                sonidos.ganar();

            }

        }


        modalResultado.classList.remove(
            'oculto'
        );

    }




    function siguienteRonda() {

        modalResultado.classList.add(
            'oculto'
        );


        estado.marcaInicial =
            estado.marcaInicial === 'X'
                ? 'O'
                : 'X';


        estado.turno =
            estado.marcaInicial;


        estado.tablero =
            Array(9).fill(null);


        estado.juegoTerminado =
            false;


        estado.lineaGanadora =
            null;


        mostrarJuego();
        guardarPuntuacion();

        //guardarPartida();


        if (
            estado.modo === 'cpu' &&
            estado.turno === 'O'
        ) {

            tablero.style.pointerEvents =
                'none';


            setTimeout(
                jugarCpu,
                450
            );

        }

    }



    function salirAlMenu() {

        modalResultado.classList.add(
            'oculto'
        );

        guardarPuntuacion();



        mostrarPantalla('menu');

    }



    function reiniciarEstado() {

        estado = {

            modo: null,

            nombreJugador1:
                'Jugador 1',

            nombreJugador2:
                'CPU',

            tablero:
                Array(9).fill(null),

            turno:
                'X',

            marcaInicial:
                'X',

            puntuacion: {

                jugador1: 0,

                jugador2: 0,

                empates: 0

            },

            juegoTerminado:
                false,

            lineaGanadora:
                null

        };

    }



    function reiniciarPartida() {


        estado.puntuacion = {

            jugador1: 0,

            jugador2: 0,

            empates: 0

        };


        estado.tablero =
            Array(9).fill(null);


        estado.turno =
            'X';


        estado.marcaInicial =
            'X';


        estado.juegoTerminado =
            false;


        estado.lineaGanadora =
            null;


        mostrarJuego();

        guardarPuntuacion();



        modalConfirmar.classList.add(
            'oculto'
        );


        if (
            estado.modo === 'cpu' &&
            estado.turno === 'O'
        ) {

            tablero.style.pointerEvents =
                'none';


            setTimeout(
                jugarCpu,
                450
            );

        }

    }



    casillas.forEach(
        casilla => {

            casilla.addEventListener(
                'click',
                () => {


                    if (
                        estado.modo === 'cpu' &&
                        estado.turno === 'O'
                    ) {

                        return;

                    }


                    colocarMarca(
                        Number(
                            casilla.dataset.indice
                        )
                    );

                }
            );

        }
    );


    botonCpu.addEventListener(
        'click',
        () => {

            sonidos.clic();


            estado.modo =
                'cpu';


            tituloNombres.textContent =
                'NOMBRAR JUGADOR';


            nombreJugador2.classList.add(
                'oculto'
            );


            nombreJugador1.value =
                '';


            mostrarPantalla(
                'nombres'
            );

        }
    );



    botonJugadores.addEventListener(
        'click',
        () => {

            sonidos.clic();
            
            estado.modo =
                'pvp';


            tituloNombres.textContent =
                'NOMBRAR JUGADORES';


            nombreJugador2.classList.remove(
                'oculto'
            );


            nombreJugador1.value =
                '';


            nombreJugador2.value =
                '';


            mostrarPantalla(
                'nombres'
            );

        }
    );


    botonContinuar.addEventListener(
        'click',
        () => {

            sonidos.clic();


            const partidaGuardada =
                cargarPartida();


            if (partidaGuardada) {

                estado =
                    partidaGuardada;


                mostrarJuego();


                mostrarPantalla(
                    'juego'
                );


                if (
                    estado.modo === 'cpu' &&
                    estado.turno === 'O' &&
                    !estado.juegoTerminado
                ) {

                    tablero.style.pointerEvents =
                        'none';


                    setTimeout(
                        jugarCpu,
                        450
                    );

                }

            }

        }
    );

    botonIniciar.addEventListener(
        'click',
        () => {

            sonidos.clic();


            estado.nombreJugador1 =
                nombreJugador1.value.trim()
                || 'Jugador 1';

            estado.puntuacion =
                cargarPuntuacion(
                   estado.nombreJugador1
                 );


            estado.nombreJugador2 =
                estado.modo === 'cpu'
                    ? 'CPU'
                    : (
                        nombreJugador2.value.trim()
                        || 'Jugador 2'
                    );


            estado.tablero =
                Array(9).fill(null);


            estado.turno =
                'X';


            estado.marcaInicial =
                'X';


            estado.juegoTerminado =
                false;


            estado.lineaGanadora =
                null;


            mostrarJuego();

            guardarPuntuacion();



            mostrarPantalla(
                'juego'
            );

        }
    );

    botonVolver.addEventListener(
        'click',
        () => {

            sonidos.clic();

            mostrarPantalla(
                'menu'
            );

        }
    );

    botonReiniciar.addEventListener(
        'click',
        () => {

            sonidos.clic();


            modalConfirmar.classList.remove(
                'oculto'
            );

        }
    );

    botonCancelarReinicio.addEventListener(
        'click',
        () => {

            sonidos.clic();


            modalConfirmar.classList.add(
                'oculto'
            );

        }
    );

    botonConfirmarReinicio.addEventListener(
        'click',
        reiniciarPartida
    );

    botonSalir.addEventListener(
        'click',
        salirAlMenu
    );

    botonSiguiente.addEventListener(
        'click',
        () => {

            sonidos.clic();

            siguienteRonda();

        }
    );

    [
        nombreJugador1,
        nombreJugador2

    ].forEach(
        campo => {

            campo.addEventListener(
                'keydown',
                evento => {

                    if (
                        evento.key === 'Enter'
                    ) {

                        botonIniciar.click();

                    }

                }
            );

        }
    );



    function mostrarBotonContinuar() {

        const partidaGuardada =
            cargarPartida();


        if (
            partidaGuardada &&
            partidaGuardada.modo &&
            !tableroLleno(
                partidaGuardada.tablero
            ) &&
            !
            partidaGuardada.tablero.some(
                valor => valor !== null
            )
        ) {

            botonContinuar.classList.remove(
                'oculto'
            );

        }

        else {

            botonContinuar.classList.add(
                'oculto'
            );

        }

    }



    function iniciarCarga() {

        let progreso = 0;


        const temporizador =
            setInterval(
                () => {

                    progreso +=
                        4 +
                        Math.random() * 8;


                    if (
                        progreso >= 100
                    ) {

                        progreso = 100;


                        clearInterval(
                            temporizador
                        );


                        setTimeout(
                            () => {


                                botonContinuar.classList.add('oculto');


                                mostrarPantalla(
                                    'menu'
                                );

                            },
                            200
                        );

                    }


                    rellenoProgreso.style.width =
                        progreso + '%';


                },
                90
            );

    }


    iniciarCarga();


})();