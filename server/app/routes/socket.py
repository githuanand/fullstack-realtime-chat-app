from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.websocket.manager import manager


router = APIRouter(
    tags=["WebSocket"]
)


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    user_id: int
):
    await manager.connect(
        user_id,
        websocket
    )

    try:
        while True:
            data = await websocket.receive_json()

            receiver_id = data.get("receiver_id")

            await manager.send_personal_message(
                receiver_id,
                data
            )

    except WebSocketDisconnect:
        manager.disconnect(user_id)