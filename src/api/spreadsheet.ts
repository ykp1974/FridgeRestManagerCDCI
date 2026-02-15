import { Ingredient } from '../types/Ingredient';

const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyT7zXjkfDNm0ch8ej72otlHxrxhH3odwqudqBbZisuKqmC4cVyOSWBwdQkU6M5M0s/exec';

export const syncIngredientsToSpreadsheet = async (ingredients: Ingredient[]): Promise<void> => {
  try {
    const response = await fetch(GAS_WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ingredients),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to sync ingredients: ${response.status} - ${errorText}`);
    }

    console.log('Ingredients successfully synced to Google Spreadsheet.');
  } catch (error) {
    console.error('Error syncing ingredients to Google Spreadsheet:', error);
    throw error;
  }
};
