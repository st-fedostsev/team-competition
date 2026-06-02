import { ChangeEvent, useRef, useState } from 'react';
import { HeaderTechAdmin } from '../../../components/Header/HeaderTechAdmin';
import { Import } from '../../../components/Buttons';
import '../../../styles/TechAdminIntegrationsPage.css';

type ImportType = 'api' | 'file' | 'bot';

const IMPORT_OPTIONS: { label: string; value: ImportType }[] = [
  // {
  //   label: 'API',
  //   value: 'api',
  // },
  {
    label: 'Загрузка файла',
    value: 'file',
  },
  // {
  //   label: 'Бот',
  //   value: 'bot',
  // },
];

export function IntegrationsPage() {
  const [importType, setImportType] = useState<ImportType>('api');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImport = () => {
    if (importType === 'file') {
      fileInputRef.current?.click();
      return;
    }

    console.log('Импорт через:', importType);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    console.log('Выбран файл:', file);
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
            accept=".csv,.xlsx,.xls,.json"
            onChange={handleFileChange}
          />

          <div className='tech-integrations-button'>
            <Import
                onClick={handleImport}
            />
          </div>

        </section>
      </main>
    </div>
  );
}