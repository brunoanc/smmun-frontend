import { privacidad } from '$lib/data/privacidad';

// Keep the address out of shared browser modules and other page loads.
export const load = () => ({
    title: 'Aviso de privacidad integral | SMMUN',
    description: 'Aviso de privacidad integral de los registros de SMMUN y ValladolidMUN.',
    privacidad: {
        ...privacidad,
        domicilio: 'Calle 15 266A, Colonia Montecristo, CP 97133, Mérida, Yucatán'
    }
});
