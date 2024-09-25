import { defineAction } from 'astro:actions';
import { saveDataToSheet } from '../utils/googleDriveUtils.js';
import { z } from 'astro:schema';

export const server = {
  excelForm: defineAction({
    accept: 'form',
    input: z.object({
      fecha: z.string(),
      camioneta: z.string(),
      articulo: z.string(),
      cantidad: z.string(),
      motivo: z.string(),
      chofer: z.string(),
      otros: z.string(),
    }),
    async handler( data ) {
      try {
        console.log(data)
        await saveDataToSheet(data);
        return { success: true };
      } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        return { success: false, error: error.message };
      }
    },
  }),
};