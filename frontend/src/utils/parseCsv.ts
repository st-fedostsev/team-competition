// utils/csvParser.ts

export interface PreviewUser {
  id: string;
  last_name: string;
  first_name: string;
  patronymic: string;
  student_id: number;
  personal_rating: number;
}

export const parseCSV = (text: string): PreviewUser[] => {
  // Нормализуем переносы строк
  const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalizedText.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    alert('Файл пуст');
    return [];
  }
  
  // Получаем заголовки и нормализуем их (удаляем пробелы, кавычки)
  const headers = lines[0].split(',').map(h => h.trim().replace(/['"]/g, ''));
  
  const expectedHeaders = ['last_name', 'first_name', 'patronymic', 'student_id', 'personal_rating'];
  
  // Проверяем, что все ожидаемые заголовки присутствуют
  const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
  
  if (missingHeaders.length > 0) {
    alert(`Неверный формат CSV. Отсутствуют колонки: ${missingHeaders.join(', ')}\nНайдены колонки: ${headers.join(', ')}`);
    return [];
  }
  
  return lines.slice(1).filter(line => line.trim()).map((line, index) => {
    const values = line.split(',').map(v => v.trim());
    return {
      id: `temp_${index}`,
      last_name: values[0] || '',
      first_name: values[1] || '',
      patronymic: values[2] || '',
      student_id: Number(values[3]) || 0,
      personal_rating: Number(values[4]) || 0,
    };
  });
};

export const generateCSV = (users: PreviewUser[]): string => {
  const headers = ['last_name', 'first_name', 'patronymic', 'student_id', 'personal_rating'];
  const rows = users.map(user => [
    user.last_name,
    user.first_name,
    user.patronymic,
    user.student_id,
    user.personal_rating
  ].join(','));
  
  return [headers.join(','), ...rows].join('\n');
};