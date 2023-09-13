    import { createContext } from 'react';

    const LoadingContext = createContext({
      gameLoading: typeof window === undefined ? false : sessionStorage.getItem("isQueued") || false, /* replace by get room by socket/sessionStorage */
      setGameLoading: (gameLoading: any) => {}
    });


    export default LoadingContext;