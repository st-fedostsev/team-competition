import '../../styles/NewsContentManagerPage.css';

interface ContentManagerTabItem {
  label: string;
  value: string;
}

interface NavContentManagerFeedProps {
  tabs: ContentManagerTabItem[];
  activeTab: string;
  onChange: (tab: string) => void;
}

interface NavContentManagerModerationProps {
  tabs: ContentManagerTabItem[];
  activeTab: string;
  onChange: (tab: string) => void;
}

export function NavContentManagerFeed({
  tabs,
  activeTab,
  onChange,
}: NavContentManagerFeedProps) {
  return (
    <div className="cm-feed-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`cm-feed-tab ${activeTab === tab.value ? 'active' : ''}`}
          type="button"
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function NavContentManagerModeration({
  tabs,
  activeTab,
  onChange,
}: NavContentManagerModerationProps) {
  return (
    <div className="cm-feed-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`cm-feed-tab ${activeTab === tab.value ? 'active' : ''}`}
          type="button"
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}