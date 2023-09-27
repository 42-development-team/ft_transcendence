    import { createContext } from 'react';

    const LoadingContext = createContext({
      gameLoading: false, /* replace by get room by socket/sessionStorage */
      setGameLoading: (gameLoading: any) => {}
    });


    export default LoadingContext;