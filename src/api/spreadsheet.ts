import { Ingredient } from '../types/Ingredient';

export const fetchIngredientsFromSpreadsheet = async () => {
  const url = import.meta.env.VITE_GAS_API_URL;
  
  // URLに ?type=ingredients を付与して、doGet側で分岐させる
  const fetchUrl = `${url}?type=ingredients`;

  try {
    const response = await fetch(fetchUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch ingredients from Spreadsheet');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    throw error;
  }
};

export const syncIngredientsToSpreadsheet = async (ingredients: Ingredient[]): Promise<void> => {
  const url = import.meta.env.VITE_GAS_API_URL;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors', // または省略
      redirect: 'follow', // GASのリダイレクトを追跡する      
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(ingredients),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to sync ingredients: ${response.status} - ${errorText}`);
    }
    const resData = await response.json();
console.log('resData->'+resData);
  // ライブラリの TransactionManager が返す status をチェック
    if (resData.status === 'error') {
      throw new Error(resData.message || 'スプレッドシートの更新に失敗しました');
    }
    console.log('同期成功:', resData.data);
  } catch (error) {
    console.error('Error syncing ingredients to Google Spreadsheet:', error);
    throw error;
  }
};
