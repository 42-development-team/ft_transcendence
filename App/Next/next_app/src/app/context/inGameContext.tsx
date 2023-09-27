import { createContext } from 'react';

const InGameContext = createContext({
  inGameContext: false,
  setInGameContext: (inGameContext: any) => {}
});


export default InGameContext;