import asyncio
import websockets


async def receive():
    uri = "ws://127.0.0.1:8000/ws/1"

    async with websockets.connect(uri) as websocket:
        print("User1 connected and waiting...")

        while True:
            message = await websocket.recv()
            print("Received:", message)


asyncio.run(receive())