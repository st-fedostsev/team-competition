import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { HeaderTechAdmin } from '../../../components/Header/HeaderTechAdmin';
import { Import } from '../../../components/Buttons';
import { Modal } from '../../../components/ModalWindowComponent';
import { useImportUsers } from '../../../hooks/useTechAdmin';
import { parseCSV, generateCSV, type PreviewUser } from '../../../utils/parseCsv';
import '../../../styles/TechAdminIntegrationsPage.css';
import type { ApiError } from '../../../types/error.types';

type ImportType = 'api' | 'file' | 'bot';

const IMPORT_OPTIONS: { label: string; value: ImportType }[] = [
  {
    label: 'Загрузка файла',
    value: 'file',
  },
];

const ITEMS_PER_PAGE = 10;

export function IntegrationsPage() {
  const [importType, setImportType] = useState<ImportType>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<PreviewUser[]>([]);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const { mutate: importUsers, isPending } = useImportUsers();

  const totalPages = Math.ceil(previewData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsers = previewData.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleImport = () => {
    if (importType === 'file') {
      fileInputRef.current?.click();
      return;
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      alert('Пожалуйста, выберите CSV файл');
      return;
    }

    setSelectedFile(file);
    setCurrentPage(1);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.length > 0) {
        setPreviewData(parsed);
        setIsPreviewModalOpen(true);
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleUpdateUser = (id: string, field: keyof PreviewUser, value: string | number) => {
    setPreviewData(prev => prev.map(user => 
      user.id === id ? { ...user, [field]: value } : user
    ));
  };

  const handleDeleteUser = (id: string) => {
    setPreviewData(prev => prev.filter(user => user.id !== id));
    // Если после удаления страница становится пустой, переходим на предыдущую
    const newTotalPages = Math.ceil((previewData.length - 1) / ITEMS_PER_PAGE);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const handleConfirmImport = () => {
    if (!selectedFile) return;
    
    const newCSV = generateCSV(previewData);
    const newFile = new File([newCSV], selectedFile.name, { type: 'text/csv' });
    
    importUsers(newFile, {
      onSuccess: () => {
        const importedCount = previewData.length;
        alert(`Импортировано пользователей: ${importedCount}`);
        setIsPreviewModalOpen(false);
        setSelectedFile(null);
        setPreviewData([]);
        setCurrentPage(1);

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
      }
      },
      onError: (error: ApiError) => {
        alert(error.response?.data?.msg || 'Ошибка импорта');
      },
    });
  };

  const handleCancelImport = () => {
    setIsPreviewModalOpen(false);
    setSelectedFile(null);
    setPreviewData([]);
    setCurrentPage(1);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
  }
  };

  return (
    <div className="tech-integrations-page">
      <HeaderTechAdmin />

      <main className="tech-integrations-main">
        <section className="tech-integrations-card">
          <h1 className="tech-integrations-title">
            Импорт данных об учебной успеваемости
          </h1>

          <div className="tech-integrations-options">
            {IMPORT_OPTIONS.map((option) => (
              <label className="tech-integrations-option" key={option.value}>
                <input
                  checked={importType === option.value}
                  name="importType"
                  type="radio"
                  value={option.value}
                  onChange={() => setImportType(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>

          <input
            ref={fileInputRef}
            className="tech-integrations-file-input"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />

          <div className='tech-integrations-button'>
            <Import onClick={handleImport} />
          </div>
        </section>
      </main>

      {/* Модальное окно предпросмотра */}
      {isPreviewModalOpen && (
        <Modal closeModal={handleCancelImport}>
          <div className="import-preview-modal">
            <h3 className="preview-title">
              Предпросмотр пользователей 
              <span className="preview-count"> (всего: {previewData.length})</span>
            </h3>
            
            <div className="preview-scroll">
              <table className="preview-table">
                <thead>
                  <tr>
                    <th>ФИО</th>
                    <th>Студенческий билет</th>
                    <th>Рейтинг</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <input
                          className="preview-input"
                          value={`${user.last_name} ${user.first_name} ${user.patronymic}`}
                          onChange={(e) => {
                            const parts = e.target.value.trim().split(' ');
                            handleUpdateUser(user.id, 'last_name', parts[0] || '');
                            handleUpdateUser(user.id, 'first_name', parts[1] || '');
                            handleUpdateUser(user.id, 'patronymic', parts[2] || '');
                          }}
                        />
                      </td>
                      <td>
                        <input
                          className="preview-input"
                          type="number"
                          value={user.student_id}
                          onChange={(e) => handleUpdateUser(user.id, 'student_id', Number(e.target.value))}
                        />
                      </td>
                      <td>
                        <input
                          className="preview-input"
                          type="number"
                          value={user.personal_rating}
                          onChange={(e) => handleUpdateUser(user.id, 'personal_rating', Number(e.target.value))}
                        />
                      </td>
                      <td>
                        <button
                          className="preview-delete-btn"
                          onClick={() => handleDeleteUser(user.id)}
                          aria-label="Удалить"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="preview-pagination">
                <button
                  className="pagination-btn"
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                >
                  ← Назад
                </button>
                <span className="pagination-info">
                  Страница {currentPage} из {totalPages}
                </span>
                <button
                  className="pagination-btn"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Вперед →
                </button>
              </div>
            )}
            
            <div className="preview-footer">
              <button className="preview-cancel-btn" onClick={handleCancelImport}>
                Отмена
              </button>
              <button 
                className="preview-confirm-btn" 
                onClick={handleConfirmImport}
                disabled={isPending}
              >
                {isPending ? 'Импорт...' : `Импортировать (${previewData.length})`}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}