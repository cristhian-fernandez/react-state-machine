import { createMachine } from "xstate";


export const fileMachine = createMachine({
  id: 'archivos',           // Maquina principal
  type: 'parallel',         // => indica al state que son maquina paralelas
  states: {
    upload: {
      initial: 'inicial',               // Estado inicial
      states: {                         // Estados internos
        inicial: {
          on: {
            INIT_UPLOAD: { target: 'cargando' }
          }
        },
        cargando: {
          on: {
            UPLOAD_COMPLETE: { target: 'terminado' }
          }
        },
        terminado: {}
      }
    },
    download: {                         
      initial: 'inicial',               // Estados inicial
      states: {                         // Estados internos
        inicial: {
          on: {
            INIT_DOWNLOAD: { target: 'cargando' }
          }
        },
        cargando: {
          on: {
            DOWNLOAD_COMPLETE: { target: 'terminado' }
          }
        },
        terminado: {} 
      }
    }
  }
})