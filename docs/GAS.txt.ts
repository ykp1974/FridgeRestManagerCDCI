function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createResponse({ 'result': 'error', 'message': 'No data received' });
    }

    var data = JSON.parse(e.postData.contents);
    if (!Array.isArray(data)) { data = [data]; }

    var spreadsheetId = '1BRlJ0LTTDbL-YZ2J_a0g3RfLx9J6xPD7vC23yLbHr-4'; 
    var ss = SpreadsheetApp.openById(spreadsheetId);
    
    // シートの準備
    var sheet = ss.getSheetByName('Ingredients');
    var bkupSheet = ss.getSheetByName('bkup') || ss.insertSheet('bkup');

    // --- ① 別シート（bkup）のクリア ---
    bkupSheet.clear();

    // --- ② Ingredientsシートのデータをbkupシートへコピー ---
    // データが存在する場合のみコピーを実行
    if (sheet && sheet.getLastRow() > 0) {
      var lastRow = sheet.getLastRow();
      var lastCol = sheet.getLastColumn();
      var range = sheet.getRange(1, 1, lastRow, lastCol);
      range.copyTo(bkupSheet.getRange(1, 1));
    }

    // --- ③ Ingredientsシートのデータをクリア（またはシートがなければ作成） ---
    if (sheet) {
      sheet.clear();
    } else {
      sheet = ss.insertSheet('Ingredients');
    }

    // --- ④ Ingredientsシートにヘッダーと新データを書き込み ---
    // ヘッダーの作成
    sheet.appendRow(['ID', 'Name', 'Expiry Date', 'Created At', 'Category']);

    // データの書き込み
    data.forEach(function(ingredient) {
      sheet.appendRow([
        ingredient.id || '',
        ingredient.name || '',
        ingredient.expiryDate || '',
        ingredient.createdAt || '',
        ingredient.category || ''
      ]);
    });

    return createResponse({ 'result': 'success', 'rowsAdded': data.length });

  } catch (error) {
    return createResponse({ 'result': 'error', 'message': error.toString() });
  }
}

function createResponse(payload) {
  // CORS回避のため、createTextOutput を使用
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function getCategories() {

  // ===== ① どのシートを使うか =====
  // 読み込み対象のシート名
  const sheetName = 'Category';

  // ===== ② スプレッドシートを開く =====
  // openById を使って、指定したスプレッドシートを取得
  const ss = SpreadsheetApp.openById(
    '1BRlJ0LTTDbL-YZ2J_a0g3RfLx9J6xPD7vC23yLbHr-4'
  );

  // 指定した名前のシートを取得
  const sheet = ss.getSheetByName(sheetName);
  // ===== ③ シートの全データを取得 =====
  // getValues() は「2次元配列」を返す
  // 例：
  // [ ['id', 'name'],   ← 1行目（ヘッダ）
  //   [1, '食材'],
  //   [2, '調味料']]
  const values = sheet.getDataRange().getValues();

  // ===== ④ 1行目（ヘッダ行）を取り出す =====
  // shift() は「配列の先頭を取り出して削除」する
  // headers には ['id', 'name'] が入る
  const headers = values.shift();

  // ===== ⑤ データ行をオブジェクトに変換 =====
  // values には 2行目以降のデータだけが残っている
  const data = values
    // 空行（すべて空の行）を除外
    .filter(row => row.some(cell => cell !== ''))
    // 各行をオブジェクトに変換
    .map(row => {
      const obj = {};
      // ヘッダと列番号を対応させて
      // { id: 1, name: '食材' } の形にする
      headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      return obj;
    });

  // ===== ⑥ 変換結果を返す =====
  // 例：
  // [
  //   { id: 1, name: '食材' },
  //   { id: 2, name: '調味料' }
  // ]
  return data;
}

function doGet(e) {
  try {
    // パラメータ type を取得
    const type = (e && e.parameter && e.parameter.type) || 'category';

    if (type === 'ingredients') {
      return createResponse(getIngredientsData());
    } else {
      // カテゴリ取得（既存の関数名が getCategories の場合）
      return createResponse(getCategories());
    }
  } catch (err) {
    // エラー時は空配列を返す（mapエラーを防ぐ）
    return createResponse([]);
  }
}

function getIngredientsData() {
  const spreadsheetId = '1BRlJ0LTTDbL-YZ2J_a0g3RfLx9J6xPD7vC23yLbHr-4';
  const sheetName = 'Ingredients';
  const ss = SpreadsheetApp.openById(spreadsheetId);
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) return [];

  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];

  const headers = values[0];
  
  return values.slice(1).map(row => {
    return {
      // React側の型（Ingredient）のプロパティ名に完全に合わせる
      id: String(row[0]),
      name: String(row[1]),
      expiryDate: row[2] instanceof Date ? row[2].toISOString().split('T')[0] : String(row[2]),
      createdAt: row[3] instanceof Date ? row[3].toISOString() : String(row[3]),
      category: String(row[4])
    };
  });
}

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}



