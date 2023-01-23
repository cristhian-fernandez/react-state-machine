import React from 'react'
import {useMachine} from '@xstate/react';
import { StepsLayout } from './StepsLayout';
import { Nav } from '../Components/Nav';
import bookingMachine from '../Machines/bookingMachine';
import './BaseLayout.css';

export const BaseLayout = () => {
  const [state, send] = useMachine(bookingMachine);
  // state : brinda informacion de la maquina en ese momento
  // send  : premite generar/enviar transiciones

  console.log('Nuestra máquina State:::', state.value);
  console.log('Nuestra máquina Context:::', state.context);
  // console.log('Transición máquina', send);
  // console.log('-------------------------------');
  // console.log('matches(inicial)', state.matches('inicial'));      // true
  // console.log('matches(tickets)', state.matches('tickets'));      // false   
  // console.log('can(START_ON)', state.can('START_ON'));            // true
  // console.log('can(FINISH)', state.can('FINISH'));                // false

  return (
    <div className='BaseLayout'>
      <Nav state={state} send={send} />
      <StepsLayout state={state} send={send}/>
    </div>
  )
}
