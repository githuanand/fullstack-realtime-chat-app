import asyncio
import websockets
import json


async def test():
    uri = "ws://127.0.0.1:8000/ws/2"

    async with websockets.connect(uri) as websocket:
        await websocket.send(json.dumps({
            "receiver_id": 1,
            "content": "Real-time Hello"
        }))

        print("Sent!")


asyncio.run(test())