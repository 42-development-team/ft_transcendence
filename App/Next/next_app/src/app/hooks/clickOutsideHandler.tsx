import { useEffect, RefObject } from 'react';

type ClickOutsideHandlerProps = {
    ref: RefObject<HTMLDivElement>;
    handler: () => void;
  };

function clickOutsideHandler({ref , handler}: ClickOutsideHandlerProps) {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref && ref.current && !ref.current.contains(event.target as Node)) {
                handler();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }  
    }, [ref, handler]);
}

export { clickOutsideHandler };