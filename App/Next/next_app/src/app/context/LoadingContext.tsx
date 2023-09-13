    'use client';
    import { createContext } from 'react';

    const LoadingContext = createContext({
      gameLoading: typeof window !== undefined ? true : true, /* replace by get room by socket/sessionStorage */
      setGameLoading: (gameLoading: Boolean) => {}
    });


    export default LoadingContext;