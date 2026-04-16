interface TabsProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
}

export default function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <nav className="mt-4 overflow-x-auto border-b border-slate-200">
      <div className="flex min-w-max items-center gap-6">
        {tabs.map((tab) => {
          const active = tab === activeTab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => onChange(tab)}
              className={`border-b-2 pb-3 text-sm font-medium transition ${
                active
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
