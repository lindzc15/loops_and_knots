from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_env: str
    ravelry_username: str
    ravelry_password: str
    secret_key: str
    algorithm: str
    database_user: str
    database_password: str
    database_host: str
    database_port: int = 5434
    database_name: str

    @property
    def database_url(self) -> str:
        return f"postgresql+psycopg://{self.database_user}:{self.database_password}@{self.database_host}:{self.database_port}/{self.database_name}"

    class Config:
        env_file = ".env"


settings = Settings()