from aiogram import types, Router
from aiogram.filters import CommandStart

router = Router()

@router.message(CommandStart())
async def cmd_start(message: types.Message):
    """
    Стартовый обработчик команды /start
    """
    await message.answer(
        f"🎭 Welcome to Under People Club, {message.from_user.first_name}!\n\n"
        f"Откройте сайт для полного опыта:\n"
        f"🌐 https://underpeople.club\n\n"
        f"Здесь вы сможете:\n"
        f"• 🎮 Играть в коллекционную игру\n"
        f"• 💰 Трейдить карточки\n"
        f"• 👥 Найти друзей\n"
        f"• 🏆 Занять место в топе"
    )

@router.message()
async def echo_handler(message: types.Message):
    """
    Обработчик для всех других сообщений
    """
    await message.answer(
        "🤖 Неизвестная команда.\n\n"
        "Используйте /start для получения информации."
    )
