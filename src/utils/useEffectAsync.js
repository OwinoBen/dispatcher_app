import { useEffect } from 'react';


export default function useEffectAsync(effect, inputs) {
    useEffect(() => {
        effect();
    }, inputs);
}



//HOW TO USE IT

// useEffectAsync(async () => {
//     const items = await fetchSomeItems();
//     console.log(items);
// }, []);
