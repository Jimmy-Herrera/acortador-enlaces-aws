import uuid
from datetime import datetime, timezone

import boto3

from app.config import AWS_REGION, DYNAMODB_TABLE

dynamodb = boto3.resource("dynamodb", region_name=AWS_REGION)
table = dynamodb.Table(DYNAMODB_TABLE)


def create_link(original_url: str) -> dict:
    item = {
        "short_code": str(uuid.uuid4()),
        "original_url": original_url,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    table.put_item(Item=item)
    return item


def get_link(short_code: str) -> dict | None:
    response = table.get_item(Key={"short_code": short_code})
    return response.get("Item")