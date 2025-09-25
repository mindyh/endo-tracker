export const TabNavigation = ({ activeTab, setActiveTab }) => (
  <div className="tab-nav">
    <button 
      className={`tab-btn ${activeTab === 'log' ? 'active' : ''}`}
      onClick={() => setActiveTab('log')}
    >
      📝 Log Event
    </button>
    <button 
      className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
      onClick={() => setActiveTab('settings')}
    >
      ⚙️ Settings
    </button>
  </div>
);