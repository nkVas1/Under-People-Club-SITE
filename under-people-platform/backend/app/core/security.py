import hashlib
import hmac
import os
from typing import Dict

def verify_telegram_auth(data: Dict[str, str]) -> bool:
    """
    Проверяет подлинность данных авторизации от Telegram.
    """
    from app.core.config import settings
    
    bot_token = settings.TELEGRAM_BOT_TOKEN
    if not bot_token:
        return False

    check_hash = data.pop('hash', None)
    if not check_hash:
        return False

    # Сортируем параметры по алфавиту
    data_check_string = '\n'.join([f"{k}={v}" for k, v in sorted(data.items())])
    
    # Создаем секретный ключ из токена бота
    secret_key = hashlib.sha256(bot_token.encode()).digest()
    
    # Хешируем строку данных секретным ключом
    hash_result = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

    return hash_result == check_hash
