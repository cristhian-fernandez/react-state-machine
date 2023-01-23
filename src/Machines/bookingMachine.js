// import { createMachine } from 'xstate';

// const bookingMachine = createMachine({
//   id: "buy plane tickets",
//   initial : "initial",
//   states : {
//     initial: {
//       on: {
//         START : {
//             target: "search",
//             actions: 'imprimirInicio'
//         }
//       }
//     },
//     search: {
//       entry: 'imprimirEntrada',         // Ejecuta actions de entrada cuando se hace transicion a search
//       exit: 'imprimirSalida',           // Ejecuta actions a la salida del estado
//       on:{
//         CONTINUE: 'passengers',
//         CANCEL: 'initial'
//       }
//     },
//     passengers:{
//       on:{
//         CONTINUE: 'tickets',
//         CANCEL: 'initial'
//       }
//     },
//     tickets: {
//       on: {
//         FINISH: 'initial'
//       }
//     }
//   }
// },
// {
//     actions: {
//         imprimirInicio: () => console.log('Imprimir inicio'),// Se imprime en la transcion de initial a search
//         imprimirEntrada: () => console.log('Imprimir entrada a search'),
//         imprimirSalida: () => console.log('Imprimir salida del search'),
//     }
// }
// );

// export default bookingMachine;

import { createMachine, assign } from "xstate";
import { fetchCountries } from "../Utils/api";

const fillCountries = {       // llenar paises (maquina hija)
  initial: "loading",
  states: {
    loading: {
      invoke: {               // Manera que se utiliza para invocar un servicio.
        id: 'getCountries',   // Agregar id
        src: () => fetchCountries,                              // funcion que se va a llamar en ese invoke a traves de la api
        onDone: {                                               // Request o funcion que se llama s
          target: 'success',
          actions: assign({                                       
            countries: (context, event) => event.data,
          })
        },
        onError: {
          target: 'failure',
          actions: assign({
            error: 'Fallo el request',
          })
        }
      }
    },
    success: {},
    failure: {
      on: {
        RETRY: { target: "loading" },
      },
    },
  },
};

const bookingMachine = createMachine(
  {
    id: "buy plane tickets",
    initial: "initial",
    context: {                  // Contexto
      passengers: [],           // Array de pasajeros donde se guardaran los nombres
      selectedCountry: "",      // Guardar pais seleccionado de la busqueda
      countries: [],
      error: '',
    },
    states: {
      initial: {
        on: {
          START: {
            target: "search",
          },
        },
      },
      search: {
        on: {
          CONTINUE: {
            target: "passengers",         // Estado siguiente 
            actions: assign({             // assing permite cambiar el valor del contexto
              selectedCountry: (context, event) => event.selectedCountry,     // va a cambiar valor de selectdCountry y para ello utilizara el valor de event.selectedCountry
              // SE AGREGA DIRECTO A LA VARIABLE DE CONTEXTO selectedCountry
            }),
          },
          CANCEL: "initial",
        },
        ...fillCountries,   // maquina hija dentro del estado de search
      },
      tickets: {
        after: {            // Transiciones que pueden esperar un tiempo para ejecutarse. 
          5000: {           // Transcion con dialet
            target: 'initial',
            actions: 'cleanContext',
          }
        },
        on: {
          FINISH: "initial",
        },
      },
      passengers: {
        on: {
          DONE: {
            target: "tickets",
            cond: "moreThanOnePassenger"
          },
          CANCEL: {
            target: "initial",
            actions: "cleanContext",
          },
          ADD: {                                                // Evento
            target: "passengers",                               // Movemos al mismo estado de pasajeros
            actions: assign((context, event) =>
              context.passengers.push(event.newPassenger) // SE ESPECIFICA A QUE VARIABLE DE CONTEXTO SE VA MODIFICAR.
            ),
          },
        },
      },
    },
  },
  {
    actions: {
      cleanContext: assign({
        selectedCountry: "",
        passengers: [],
      }),
    },
    guards: {                                                    // Entrada
      moreThanOnePassenger: (context) => {
        return context.passengers.length > 0;                     // devuelve true o false para permitir hacer la transicion
      }                                                           // Para no pasas a ver mi ticket automaticamente sino agregar pasajero
    },
  }
);

export default bookingMachine;