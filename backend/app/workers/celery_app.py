from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "umrah",
    broker=str(settings.REDIS_URL),
    backend=str(settings.REDIS_URL).replace("/0", "/1"),
    include=["app.workers.tasks"],
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    worker_prefetch_multiplier=1,
)
