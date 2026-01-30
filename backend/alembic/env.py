from logging.config import fileConfig
from sqlalchemy import create_engine, pool
from alembic import context

from config import settings  # your Settings class
from models.base_model import Base
from models.user_model import User
from models.favorite_pattern_model import FavoritePatterns
from models.favorite_yarn_model import FavoriteYarns

print("Alembic connecting to:", settings.database_url)

# Alembic Config object
config = context.config

# Logging setup
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

config.set_main_option("sqlalchemy.url", settings.database_url)

# Target metadata for 'autogenerate'
target_metadata = Base.metadata

# --- Offline migrations ---
def run_migrations_offline() -> None:
    url = settings.database_url
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


# --- Online migrations ---
def run_migrations_online() -> None:
    # Build engine directly from settings
    connectable = create_engine(
        settings.database_url,
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


# Run
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

