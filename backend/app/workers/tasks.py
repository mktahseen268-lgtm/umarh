from app.workers.celery_app import celery_app
import structlog

log = structlog.get_logger()


@celery_app.task(name="tasks.ping")
def ping() -> str:
    return "pong"


@celery_app.task(name="tasks.send_booking_confirmation")
def send_booking_confirmation(booking_id: str) -> None:
    log.info("send_booking_confirmation", booking_id=booking_id)
    # TODO: fetch booking, render email template, send via SendGrid


@celery_app.task(name="tasks.send_email_verification")
def send_email_verification(user_id: str, token: str) -> None:
    log.info("send_email_verification", user_id=user_id)
    # TODO: render verification email, send via SendGrid


@celery_app.task(name="tasks.send_agency_approval_email")
def send_agency_approval_email(agency_id: str, approved: bool) -> None:
    log.info("send_agency_approval_email", agency_id=agency_id, approved=approved)
    # TODO: send approval/rejection email to agency owner
