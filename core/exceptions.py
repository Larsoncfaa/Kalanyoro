from rest_framework.views import exception_handler as drf_exception_handler
from rest_framework.response import Response


def custom_exception_handler(exc, context):
    """Wrap DRF exceptions into a consistent JSON structure.

    Returns: {"success": False, "errors": <original data>}
    """
    response = drf_exception_handler(exc, context)

    if response is None:
        return Response({"success": False, "errors": "Server error"}, status=500)

    data = response.data

    return Response({"success": False, "errors": data}, status=response.status_code)
