import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { LandingScreen } from './components/common/LandingScreen';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { AddExpenseModal } from './components/expense/AddExpenseModal';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { CalendarView } from './components/calendar/CalendarView';
import { ActivityView } from './components/activity/ActivityView';
import { InsightsView } from './components/insights/InsightsView';
import { SettingsView } from './components/settings/SettingsView';
import { RecurringView } from './components/recurring/RecurringView';
import { GoalsView } from './components/goals/GoalsView';
import { LendBorrowView } from './components/lendborrow/LendBorrowView';

export const MainAppContent: React.FC = () => {
  const { profile, activeTab, isLoading, hasEnteredLanding } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-theme-bg paper-texture flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 bg-butter-200 border-2 border-butter-400 rounded-3xl flex items-center justify-center animate-bounce shadow-butter">
          <span className="text-3xl">👛</span>
        </div>
        <p className="text-sm font-bold text-theme-text font-sans">Opening MM Journal...</p>
      </div>
    );
  }

  // Interactive Coin Landing Screen first
  if (!hasEnteredLanding) {
    return <LandingScreen />;
  }

  // First time onboarding check
  if (!profile.onboardingCompleted) {
    return <OnboardingWizard />;
  }

  return (
    <div className="min-h-screen bg-theme-bg paper-texture text-theme-text flex flex-col lg:flex-row">
      {/* Navigation (Sidebar on Desktop, Bottom Bar on Mobile) */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full transition-all">
        {activeTab === 'home' && <HomeDashboard />}
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'activity' && <ActivityView />}
        {activeTab === 'insights' && <InsightsView />}
        {activeTab === 'settings' && <SettingsView />}
        {activeTab === 'recurring' && <RecurringView />}
        {activeTab === 'goals' && <GoalsView />}
        {activeTab === 'lend_borrow' && <LendBorrowView />}
      </main>

      {/* Global Add / Edit Expense Bottom Sheet Modal */}
      <AddExpenseModal />
    </div>
  );
};

export const App: React.FC = () => {
  return <MainAppContent />;
};

export default App;
