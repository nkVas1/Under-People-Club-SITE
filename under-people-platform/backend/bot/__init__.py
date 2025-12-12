from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart
from aiogram.types import Message
import logging

logging.basicConfig(level=logging.INFO)

# Будет инициализировано в main.py
bot: Bot | None = None
dp: Dispatcher | None = None
