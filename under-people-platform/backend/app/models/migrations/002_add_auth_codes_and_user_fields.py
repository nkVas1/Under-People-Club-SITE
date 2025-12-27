"""
Migration: Add AuthCode table and enhance User model

This migration:
1. Adds 'is_verified' BOOLEAN field to users table
2. Adds 'updated_at' TIMESTAMP field to users table
3. Alters 'telegram_id' to BIGINT (supports larger Telegram IDs)
4. Creates 'auth_codes' table for one-time use auth codes
5. Adds indexes for performance

Version: 002
Date: 2024
"""

from sqlalchemy import text
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import logging

logger = logging.getLogger(__name__)


def upgrade(session: Session):
    """Upgrade: Add auth_codes table and user fields"""
    
    try:
        # 1. Add columns to users table if they don't exist
        logger.info("🔄 Adding is_verified column to users table...")
        try:
            session.execute(text("""
                ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
            """))
            logger.info("✅ Added is_verified column")
        except Exception as e:
            if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
                logger.info("✓ is_verified column already exists")
            else:
                raise

        logger.info("🔄 Adding updated_at column to users table...")
        try:
            session.execute(text("""
                ALTER TABLE users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
            """))
            logger.info("✅ Added updated_at column")
        except Exception as e:
            if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
                logger.info("✓ updated_at column already exists")
            else:
                raise

        # 2. Alter telegram_id to BIGINT
        logger.info("🔄 Altering telegram_id type to BIGINT...")
        try:
            session.execute(text("""
                ALTER TABLE users ALTER COLUMN telegram_id TYPE BIGINT;
            """))
            logger.info("✅ Altered telegram_id to BIGINT")
        except Exception as e:
            logger.warning(f"⚠️ Could not alter telegram_id type: {e}")

        # 3. Create auth_codes table
        logger.info("🔄 Creating auth_codes table...")
        try:
            session.execute(text("""
                CREATE TABLE IF NOT EXISTS auth_codes (
                    id SERIAL PRIMARY KEY,
                    code VARCHAR(255) UNIQUE NOT NULL,
                    telegram_id BIGINT NOT NULL,
                    user_id INTEGER,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                    used BOOLEAN DEFAULT FALSE,
                    used_at TIMESTAMP WITH TIME ZONE,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
                );
            """))
            logger.info("✅ Created auth_codes table")
        except Exception as e:
            if "already exists" in str(e).lower():
                logger.info("✓ auth_codes table already exists")
            else:
                raise

        # 4. Create indexes for performance
        logger.info("🔄 Creating indexes...")
        
        try:
            session.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_auth_codes_code ON auth_codes(code);
            """))
            logger.info("✅ Created index on auth_codes.code")
        except Exception as e:
            logger.warning(f"⚠️ Could not create index on code: {e}")

        try:
            session.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_auth_codes_telegram_id ON auth_codes(telegram_id);
            """))
            logger.info("✅ Created index on auth_codes.telegram_id")
        except Exception as e:
            logger.warning(f"⚠️ Could not create index on telegram_id: {e}")

        try:
            session.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_auth_codes_user_id ON auth_codes(user_id);
            """))
            logger.info("✅ Created index on auth_codes.user_id")
        except Exception as e:
            logger.warning(f"⚠️ Could not create index on user_id: {e}")

        try:
            session.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_auth_codes_expires_at ON auth_codes(expires_at);
            """))
            logger.info("✅ Created index on auth_codes.expires_at")
        except Exception as e:
            logger.warning(f"⚠️ Could not create index on expires_at: {e}")

        session.commit()
        logger.info("✅ Migration completed successfully!")

    except Exception as e:
        session.rollback()
        logger.error(f"❌ Migration failed: {e}")
        raise


def downgrade(session: Session):
    """Downgrade: Revert migration (optional)"""
    
    try:
        logger.info("🔄 Reverting migration...")
        
        # Drop table and columns
        session.execute(text("DROP TABLE IF EXISTS auth_codes CASCADE;"))
        logger.info("✅ Dropped auth_codes table")
        
        try:
            session.execute(text("ALTER TABLE users DROP COLUMN IF EXISTS is_verified;"))
            logger.info("✅ Dropped is_verified column")
        except:
            pass
        
        try:
            session.execute(text("ALTER TABLE users DROP COLUMN IF EXISTS updated_at;"))
            logger.info("✅ Dropped updated_at column")
        except:
            pass
        
        session.commit()
        logger.info("✅ Downgrade completed!")
        
    except Exception as e:
        session.rollback()
        logger.error(f"❌ Downgrade failed: {e}")
        raise
