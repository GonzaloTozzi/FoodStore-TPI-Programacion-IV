
from types import TracebackType
from typing import Self

from sqlmodel import Session

from app.core.database import engine


class UnitOfWork:
    def __init__(self) -> None:
        self.session: Session | None = None

    def __enter__(self) -> Self:
        self.session = Session(engine)
        return self

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc_value: BaseException | None,
        traceback: TracebackType | None,
    ) -> bool:
        if self.session is None:
            return False

        try:
            if exc_type is None:
                self.session.commit()
            else:
                self.session.rollback()
        except Exception:
            self.session.rollback()
            raise
        finally:
            self.session.close()
            self.session = None

        return False
