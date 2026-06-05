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
  const [pageInput, setPageInput] = useState('');
  
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

  

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const pageNumber = parseInt(pageInput);
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
        setPageInput('');
      } else {
        alert(`Введите число от 1 до ${totalPages}`);
      }
    }
  };
  

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
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
                          <svg 
                            className="remove-file-icon"
                            viewBox="0 0 448 512" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill="#191919"
                              d="M432,32H312l-9.4-18.7C298.5,5.1,290.2,0,281.1,0H166.8c-9.1,0-17.4,5.1-21.4,13.3L136,32H16
                              C7.2,32,0,39.2,0,48v32c0,8.8,7.2,16,16,16h416c8.8,0,16-7.2,16-16V48C448,39.2,440.8,32,432,32z M53.2,467
                              c1.6,25.3,22.6,45,47.9,45h245.8c25.3,0,46.3-19.7,47.9-45L416,128H32L53.2,467z"
                            />
                          </svg>
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
                  ‹
                </button>
                <div className="pagination-page-input-wrapper">
                  <input
                    type="number"
                    className="pagination-page-input"
                    value={pageInput}
                    onChange={handlePageInputChange}
                    onKeyDown={handlePageInputKeyDown}
                    placeholder={`${currentPage}`}
                    min={1}
                    max={totalPages}
                  />
                  <span className="pagination-total"> / {totalPages}</span>
                </div>
                <button
                  className="pagination-btn"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  ›
                </button>
              </div>
            )}
            
            <div className="preview-footer">
              <button className="button button-small drop-shadow button-close" onClick={handleCancelImport}>
                <p className='button-text button-text-small'>
                  Отмена
                </p>
              </button>
              <button 
                className="button button-small drop-shadow" 
                onClick={handleConfirmImport}
                disabled={isPending}
              >
                <p className='button-text button-text-small'>
                  {isPending ? 'Импорт...' : `Импортировать (${previewData.length})`}
                </p>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}