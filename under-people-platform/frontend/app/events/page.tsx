'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  price: number;
  image_url?: string;
  capacity: number;
  is_active: boolean;
}

interface PaginationParams {
  limit: number;
  offset: number;
}

export default function EventsPage() {
  const { isAuthenticated } = useAuthStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationParams>({
    limit: 10,
    offset: 0,
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          setError('API URL не настроена');
          return;
        }

        const token = localStorage.getItem('auth_token');
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(
          `${apiUrl}/api/v1/events/upcoming?limit=${pagination.limit}&offset=${pagination.offset}`,
          {
            method: 'GET',
            headers,
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status}`);
        }

        const data = await response.json();
        setEvents(data.events || data);
      } catch (err) {
        console.error('❌ [EVENTS] Error fetching events:', err);
        setError(err instanceof Error ? err.message : 'Ошибка загрузки событий');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [pagination]);

  const handlePreviousPage = () => {
    setPagination((prev) => ({
      ...prev,
      offset: Math.max(0, prev.offset - prev.limit),
    }));
  };

  const handleNextPage = () => {
    setPagination((prev) => ({
      ...prev,
      offset: prev.offset + prev.limit,
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-red-500 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">⛔ ДОСТУП ЗАПРЕЩЕН</h1>
          <p className="mb-4">Требуется аутентификация для просмотра событий</p>
          <Link href="/auth" className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded">
            Войти
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-red-500 mb-2">🎪 СОБЫТИЯ УБЕЖИЩА</h1>
          <p className="text-gray-400">Предстоящие события и сборища</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse">
              <p className="text-gray-400">⏳ Загружаю события...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded p-4 mb-6">
            <p className="text-red-400">❌ {error}</p>
          </div>
        )}

        {/* Events Grid */}
        {!loading && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-gray-900 border border-red-500/30 rounded-lg overflow-hidden hover:border-red-500 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
              >
                {/* Event Image */}
                {event.image_url && (
                  <div className="aspect-video bg-gray-800 overflow-hidden">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Event Content */}
                <div className="p-4">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-red-500 mb-2">{event.title}</h3>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">{event.description}</p>

                  {/* Details */}
                  <div className="space-y-2 mb-4 text-sm">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-gray-400">
                      <span>📅</span>
                      <span>
                        {new Date(event.start_date).toLocaleDateString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-2 text-gray-400">
                      <span>⏰</span>
                      <span>
                        {new Date(event.start_date).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-400">
                      <span>📍</span>
                      <span>{event.location}</span>
                    </div>

                    {/* Capacity */}
                    <div className="flex items-center gap-2 text-gray-400">
                      <span>👥</span>
                      <span>Мест: {event.capacity}</span>
                    </div>

                    {/* Price */}
                    {event.price > 0 && (
                      <div className="flex items-center gap-2 text-yellow-500 font-bold">
                        <span>💰</span>
                        <span>{event.price} UP</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">
                    Подробнее
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Events */}
        {!loading && events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">📭 События не найдены</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && events.length > 0 && (
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handlePreviousPage}
              disabled={pagination.offset === 0}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded transition-colors"
            >
              ← Назад
            </button>
            <span className="flex items-center text-gray-400">
              Страница {Math.floor(pagination.offset / pagination.limit) + 1}
            </span>
            <button
              onClick={handleNextPage}
              disabled={events.length < pagination.limit}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded transition-colors"
            >
              Далее →
            </button>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link href="/shelter" className="text-red-400 hover:text-red-300">
            ← Вернуться в Убежище
          </Link>
        </div>
      </div>
    </div>
  );
}
