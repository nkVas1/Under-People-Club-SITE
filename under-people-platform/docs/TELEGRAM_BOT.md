# Telegram Bot Setup Guide

## Prerequisites

- Telegram account
- BotFather access (`@BotFather` on Telegram)

## Creating a Bot

1. **Open BotFather**
   - Search for `@BotFather` in Telegram
   - Send `/newbot`

2. **Configure Bot**
   - Choose a name (e.g., "Under People Club")
   - Choose a username (e.g., `under_people_bot`)
   - Receive your API token (keep it secret!)

3. **Bot Settings**
   ```
   /setdescription
   /setshortdescription
   /setcommands
   /setdefaultcommands
   ```

## Setting Up Webhooks

For production, use webhooks instead of polling:

```bash
curl -X POST https://api.telegram.org/bot{BOT_TOKEN}/setWebhook \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://api.underpeople.club/bot/webhook",
    "secret_token": "your_secret_token",
    "max_connections": 100,
    "allowed_updates": ["message", "callback_query"]
  }'
```

## Integration with Website

### Telegram Login Widget

Add to your site:

```html
<script async src="https://telegram.org/js/telegram-widget.js?22"
  data-telegram-login="YOUR_BOT_NAME"
  data-size="large"
  data-radius="0"
  data-request-access="write"
  data-onauth="onTelegramAuth(user)"
></script>

<script>
  function onTelegramAuth(user) {
    console.log('Logged in as:', user);
    // Send user data to your backend
    fetch('/api/auth/login/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
  }
</script>
```

## Deep Linking for Payments

```
https://t.me/under_people_bot?start=pay_ORDER_ID
```

This opens the bot with a start parameter that your bot handler can process.

## Handler Examples

### Start Command
```python
@router.message(CommandStart())
async def cmd_start(message: types.Message):
    await message.answer("Welcome to Under People Club!")
```

### Payment Flow
```python
@router.message(CommandStart(deep_link_encoded=True))
async def handle_payment(message: types.Message, command: CommandObject):
    order_id = command.args.split('_')[1]
    # Process payment...
```

## Admin Commands

Add admin-only commands:

```python
@router.message(Command("admin"))
async def admin_panel(message: types.Message):
    if message.from_user.id not in ADMIN_IDS:
        return
    # Show admin interface
```

## Broadcasting Messages

Send notifications to all users:

```python
async def broadcast_message(text: str, user_ids: list):
    for user_id in user_ids:
        try:
            await bot.send_message(user_id, text)
        except:
            pass  # User blocked bot
```

## Testing

Use Telegram's test environment:

```
Test API Server: https://apitest.telegram.org
Test Bot Token: get from @BotFather in test server
```

---

For more: https://core.telegram.org/bots
