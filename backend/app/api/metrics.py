from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin, get_db
from app.schemas.metrics_schema import AdminMetricsResponse
from app.services.metrics_service import MetricsService

router = APIRouter(prefix="/api/metrics", tags=["metrics"])


def get_metrics_service(db: Session = Depends(get_db)) -> MetricsService:
    return MetricsService(db)


@router.get("/admin", response_model=AdminMetricsResponse)
def get_admin_metrics(
    service: MetricsService = Depends(get_metrics_service),
    admin=Depends(get_current_admin),
):
    return service.get_admin_metrics()
