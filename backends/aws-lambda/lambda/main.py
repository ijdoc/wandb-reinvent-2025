import json


def handler(event, context):
    return {
        "statusCode": 200,
        "body": json.dumps({"message": "Cheers from AWS Lambda!!", "event": event}),
    }
