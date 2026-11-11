import React, { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { COMPANY, type NotificationItem } from '../data/mock';

type NotificationFilter = 'all' | 'unread' | 'urgent';

interface NotificationsScreenProps {
  notifications: NotificationItem[];
  onBack: () => void;
  onSelectNotification: (item: NotificationItem) => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  notifications,
  onBack,
  onSelectNotification,
}) => {
  const [filter, setFilter] = useState<NotificationFilter>('all');

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications],
  );

  const urgentCount = useMemo(
    () => notifications.filter((item) => Boolean(item.urgent)).length,
    [notifications],
  );

  const filteredItems = useMemo(() => {
    if (filter === 'unread') {
      return notifications.filter((item) => !item.read);
    }
    if (filter === 'urgent') {
      return notifications.filter((item) => Boolean(item.urgent));
    }
    return notifications;
  }, [filter, notifications]);

  const todayItems = useMemo(
    () => filteredItems.filter((item) => item.section === 'today'),
    [filteredItems],
  );

  const earlierItems = useMemo(
    () => filteredItems.filter((item) => item.section === 'earlier'),
    [filteredItems],
  );

  const renderSection = (
    heading: string,
    items: NotificationItem[],
    hasPrecedingSection: boolean,
  ) => {
    if (items.length === 0) return null;

    return (
      <section className={hasPrecedingSection ? 'mt-[20px]' : ''}>
        <h2 className="text-[14px] font-medium text-[#5F5E5A] mb-[10px]">
          {heading}
        </h2>
        <div className="flex flex-col gap-[12px]">
          {items.map((item) => {
            const isUrgent = Boolean(item.urgent);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectNotification(item)}
                className={`w-full text-left rounded-[16px] py-[14px] px-[16px] border-0 shadow-none pressable cursor-pointer transition-colors ${
                  isUrgent
                    ? 'bg-[#FDE9E9] hover:bg-[#FCE0E0]'
                    : 'bg-[#F3F5FA] hover:bg-[#EAEFF7]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`text-[15px] font-medium leading-[1.3] line-clamp-2 ${
                      isUrgent ? 'text-[#B91C1C]' : 'text-[#0F2A3F]'
                    }`}
                  >
                    {item.title}
                  </span>
                  <span className="inline-flex items-center gap-[6px] shrink-0 pt-[2px]">
                    {!item.read && (
                      <span
                        className="w-2 h-2 rounded-full bg-[#0B6B5A] shrink-0"
                        aria-label="Unread"
                      />
                    )}
                    <span className="text-[12px] text-[#64748B] whitespace-nowrap">
                      {item.time}
                    </span>
                  </span>
                </div>
                <p className="mt-[6px] text-[14px] text-[#444441] leading-[1.45]">
                  {item.body}
                </p>
              </button>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full min-w-0 bg-white">
      {/* Header */}
      <header className="safe-top bg-white shrink-0">
        <div className="pl-[6px] pr-4 pt-[10px] pb-[8px] flex items-center gap-1.5">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="w-11 h-11 rounded-full flex items-center justify-center text-[#0F2A3F] hover:bg-[#F3F5FA] pressable cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </button>
          <div className="min-w-0">
            <h1 className="text-[20px] font-medium text-[#0F2A3F] leading-[1.2] tracking-[-0.01em] truncate">
              Notifications
            </h1>
            <p className="text-[14px] text-[#64748B] leading-[1.3] truncate mt-[2px]">
              {COMPANY.name}
            </p>
          </div>
        </div>
      </header>

      {/* Filter Chips */}
      <div
        role="group"
        aria-label="Filter notifications"
        className="pt-[4px] pl-[16px] pr-[8px] pb-[14px] flex items-center gap-[8px] w-full min-w-0 overflow-x-auto no-scrollbar shrink-0 bg-white"
      >
        <button
          type="button"
          aria-pressed={filter === 'all'}
          onClick={() => setFilter('all')}
          style={{
            border: filter === 'all' ? '0.5px solid #0F2A3F' : '0.5px solid #D3D1C7',
          }}
          className={`relative before:content-[''] before:absolute before:-inset-y-[2px] before:inset-x-0 h-[40px] rounded-full text-[14px] whitespace-nowrap shrink-0 inline-flex items-center justify-center cursor-pointer transition-colors pressable ${
            filter === 'all'
              ? 'bg-[#0F2A3F] text-white font-medium px-[20px]'
              : 'bg-white text-[#444441] font-normal px-[14px]'
          }`}
        >
          All
        </button>

        <button
          type="button"
          aria-pressed={filter === 'unread'}
          onClick={() => setFilter('unread')}
          style={{
            border: filter === 'unread' ? '0.5px solid #0F2A3F' : '0.5px solid #D3D1C7',
          }}
          className={`relative before:content-[''] before:absolute before:-inset-y-[2px] before:inset-x-0 h-[40px] rounded-full text-[14px] whitespace-nowrap shrink-0 inline-flex items-center gap-2 cursor-pointer transition-colors pressable ${
            filter === 'unread'
              ? 'bg-[#0F2A3F] text-white font-medium px-[20px]'
              : 'bg-white text-[#444441] font-normal px-[14px]'
          }`}
        >
          <span>Unread</span>
          <span className="w-5 h-5 rounded-full bg-[#0B6B5A] text-white text-[12px] font-medium inline-flex items-center justify-center leading-none">
            {unreadCount}
          </span>
        </button>

        <button
          type="button"
          aria-pressed={filter === 'urgent'}
          onClick={() => setFilter('urgent')}
          style={{
            border: filter === 'urgent' ? '0.5px solid #0F2A3F' : '0.5px solid #D3D1C7',
          }}
          className={`relative before:content-[''] before:absolute before:-inset-y-[2px] before:inset-x-0 h-[40px] rounded-full text-[14px] whitespace-nowrap shrink-0 inline-flex items-center gap-2 cursor-pointer transition-colors pressable ${
            filter === 'urgent'
              ? 'bg-[#0F2A3F] text-white font-medium px-[20px]'
              : 'bg-white text-[#444441] font-normal px-[14px]'
          }`}
        >
          <span>Action needed</span>
          {urgentCount > 0 && (
            <span
              className="w-2 h-2 rounded-full bg-[#DC2626] shrink-0"
              aria-hidden="true"
            />
          )}
        </button>
        <span aria-hidden="true" className="w-[8px] shrink-0" />
      </div>

      {/* Scrollable Notifications List */}
      <div className="flex-1 min-h-0 scroll-area bg-white px-4 pb-6">
        {filteredItems.length === 0 ? (
          <p className="py-12 text-center text-[14px] text-[#64748B]">
            Nothing here
          </p>
        ) : (
          <>
            {renderSection('Today', todayItems, false)}
            {renderSection('Earlier', earlierItems, todayItems.length > 0)}
          </>
        )}
      </div>
    </div>
  );
};
