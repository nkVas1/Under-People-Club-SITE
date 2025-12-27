#!/usr/bin/env python3
"""
Migration Runner - Execute database migrations

Usage:
    python run_migrations.py              # Run all pending migrations
    python run_migrations.py --downgrade  # Revert last migration
"""

import os
import sys
from pathlib import Path

# Add project root to path
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from sqlalchemy.orm import Session
from app.models.db_pool import get_session
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def get_migration_files():
    """Get list of migration files in order"""
    migrations_dir = Path(__file__).parent / "app" / "models" / "migrations"
    
    if not migrations_dir.exists():
        logger.error(f"❌ Migrations directory not found: {migrations_dir}")
        return []
    
    migration_files = sorted([
        f for f in migrations_dir.glob("*.py") 
        if f.name.startswith(("00", "01", "02", "03", "04", "05", "06", "07", "08", "09"))
        and not f.name.startswith("__")
    ])
    
    return migration_files


def run_migrations(downgrade: bool = False):
    """Run all pending migrations"""
    
    session = next(get_session())
    
    try:
        migration_files = get_migration_files()
        
        if not migration_files:
            logger.warning("⚠️ No migration files found")
            return
        
        logger.info(f"Found {len(migration_files)} migration file(s)")
        
        for migration_file in migration_files:
            logger.info(f"\n{'='*60}")
            logger.info(f"Processing: {migration_file.name}")
            logger.info(f"{'='*60}")
            
            try:
                # Import migration module
                import importlib.util
                spec = importlib.util.spec_from_file_location("migration", migration_file)
                migration = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(migration)
                
                # Run migration
                if downgrade:
                    if hasattr(migration, 'downgrade'):
                        logger.info(f"⬇️  Running downgrade for {migration_file.name}...")
                        migration.downgrade(session)
                    else:
                        logger.warning(f"⚠️ No downgrade function in {migration_file.name}")
                else:
                    if hasattr(migration, 'upgrade'):
                        logger.info(f"⬆️  Running upgrade for {migration_file.name}...")
                        migration.upgrade(session)
                    else:
                        logger.warning(f"⚠️ No upgrade function in {migration_file.name}")
                        
            except Exception as e:
                logger.error(f"❌ Error in migration {migration_file.name}: {e}")
                raise
        
        logger.info(f"\n{'='*60}")
        logger.info("✅ All migrations completed successfully!")
        logger.info(f"{'='*60}\n")
        
    except Exception as e:
        logger.error(f"❌ Migration failed: {e}", exc_info=True)
        sys.exit(1)
    finally:
        session.close()


if __name__ == "__main__":
    downgrade = "--downgrade" in sys.argv or "--down" in sys.argv
    
    if downgrade:
        logger.warning("⬇️  DOWNGRADING DATABASE...")
        run_migrations(downgrade=True)
    else:
        logger.info("⬆️  UPGRADING DATABASE...")
        run_migrations(downgrade=False)
