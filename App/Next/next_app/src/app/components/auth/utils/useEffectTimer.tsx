
import { useEffect } from "react";

const useEffectTimer = (isVisible: boolean, delay: number, setIsVisible: React.Dispatch<React.SetStateAction<boolean>>) => {
	useEffect(() => {
		if (isVisible) {
			const timer = setTimeout(() => {
				setIsVisible(false);
			}, delay);
			return () => clearTimeout(timer);
		}
	}, [isVisible]);
}

export { useEffectTimer };