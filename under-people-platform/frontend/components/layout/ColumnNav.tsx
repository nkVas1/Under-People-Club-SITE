'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

// Конфигурация разделов с ЛОР-описанием
const SECTIONS = [
  { 
    id: 1, 
    title: 'УБЕЖИЩЕ', 
    subtitle: 'IDENTIFICATION & PROFILE',
    description: 'Личный терминал члена клуба. Статус, активы, доступ.',
    color: 'bg-[#0f0f0f]', 
    hoverColor: 'bg-[#1a1a1a]',
    img: '/img/bunker_bg.jpg',
    href: '/shelter' 
  },
  { 
    id: 2, 
    title: 'АРСЕНАЛ', 
    subtitle: 'EQUIPMENT & SUPPLY',
    description: 'Склад снаряжения. Билеты, мерч, артефакты.',
    color: 'bg-[#140505]', 
    hoverColor: 'bg-[#2a0a0a]',
    img: '/img/arsenal_bg.jpg',
    href: '/arsenal' 
  },
  { 
    id: 3, 
    title: 'ХРОНИКИ', 
    subtitle: 'ARCHIVE_DATA',
    description: 'Логи прошедших событий. Фотоотчеты и таймлайн.',
    color: 'bg-[#0a0a0a]', 
    hoverColor: 'bg-[#111]',
    img: '/img/chronicles_bg.jpg',
    href: '/chronicles' 
  },
  { 
    id: 4, 
    title: 'РЕЙД', 
    subtitle: 'BATTLEGROUND',
    description: 'Зона конфликта. Карточные игры и маркетплейс.',
    color: 'bg-[#1a0000]', 
    hoverColor: 'bg-[#3d0000]',
    img: '/img/raid_bg.jpg',
    href: '/raid' 
  },
  { 
    id: 5, 
    title: 'СВЯЗЬ', 
    subtitle: 'NEURAL_NET',
    description: 'Сеть выживших. Поиск соратников и кланы.',
    color: 'bg-[#050505]', 
    hoverColor: 'bg-[#0f0f0f]',
    img: '/img/network_bg.jpg',
    href: '/network' 
  },
  { 
    id: 6, 
    title: 'OVERSEER', 
    subtitle: 'ADMIN_CONTROL',
    description: 'Терминал управления. Только для организаторов.',
    color: 'bg-[#100000]', 
    hoverColor: 'bg-[#200000]',
    img: '/img/overseer_bg.jpg',
    href: '/overseer' 
  },
];

export default function ColumnNav({ show }: { show: boolean }) {
  const columnsRef = useRef<(HTMLDivElement | null)[]>([]);
  const router = useRouter();

  // Анимация входа (Intro)
  useEffect(() => {
    if (show) {
      const tl = gsap.timeline();
      tl.fromTo(columnsRef.current, 
        { y: '100%', opacity: 0 },
        {
          duration: 1.2,
          y: '0%',
          opacity: 1,
          stagger: 0.1,
          ease: 'expo.out',
        }
      );
    }
  }, [show]);

  const handleNavigate = (href: string, index: number) => {
    const selectedColumn = columnsRef.current[index];
    const otherColumns = columnsRef.current.filter((_, i) => i !== index);

    const tl = gsap.timeline({
      onComplete: () => router.push(href)
    });

    // Убираем соседей
    tl.to(otherColumns, {
      duration: 0.4,
      scaleY: 0,
      opacity: 0,
      ease: 'power2.in'
    }, 0);

    // Раскрываем выбранную (как портал)
    tl.to(selectedColumn, {
      duration: 0.8,
      width: '100vw',
      position: 'absolute' as any,
      zIndex: 50,
      left: 0,
      top: 0,
      ease: 'power4.inOut'
    }, 0);
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-black relative">
      {SECTIONS.map((section, index) => (
        <div
          key={section.id}
          ref={el => { columnsRef.current[index] = el }}
          onClick={() => handleNavigate(section.href, index)}
          className={`relative flex-1 h-full border-r border-[#222] ${section.color} 
            transition-all duration-700 ease-out hover:flex-[3] group cursor-pointer overflow-hidden`}
        >
          {/* Фоновое изображение (Появляется при ховере) */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700 bg-cover bg-center grayscale group-hover:grayscale-0"
            style={{ backgroundImage: `url(${section.img})` }} 
          />
          
          {/* Оверлей градиента для читаемости текста */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />

          {/* Контент колонки */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            
            {/* Вертикальный заголовок (по умолчанию) */}
            <div className="transform -rotate-90 group-hover:rotate-0 transition-transform duration-500 origin-center absolute group-hover:relative group-hover:mb-4">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-[#333] group-hover:text-white transition-colors uppercase whitespace-nowrap">
                {section.title}
              </h2>
            </div>

            {/* Скрытый контент (Появляется при ховере) */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 flex flex-col items-center text-center translate-y-10 group-hover:translate-y-0 transform">
              <p className="text-[#8A0303] text-xs font-mono tracking-[0.3em] mb-2 uppercase border-b border-[#8A0303] pb-1">
                [{section.subtitle}]
              </p>
              <p className="text-zinc-400 text-sm max-w-[200px] font-light leading-relaxed">
                {section.description}
              </p>
              
              {/* Декоративная кнопка "ENTER" */}
              <div className="mt-6 px-4 py-2 border border-zinc-700 text-xs text-white uppercase tracking-widest hover:bg-[#8A0303] hover:border-[#8A0303] transition-all">
                Access_
              </div>
            </div>
          </div>

          {/* Эффект полосы загрузки снизу */}
          <div className="absolute bottom-0 left-0 h-1 bg-[#8A0303] w-0 group-hover:w-full transition-all duration-1000 ease-in-out" />
        </div>
      ))}
    </div>
  );
}
