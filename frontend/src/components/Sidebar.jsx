import React from 'react';

const Sidebar = ({ menuItems = [], activeTab, setActiveTab, title }) => {
  return (
    <aside className="w-full md:w-64 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-5 h-fit">
      {title && (
        <div className="px-2 pb-2 border-b border-slate-800">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">{title}</h2>
        </div>
      )}

      <nav className="flex flex-col gap-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition cursor-pointer text-left ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {Icon && <Icon className={isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-white'} size={15} />}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
