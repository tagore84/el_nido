from fastapi import FastAPI, WebSocket, BackgroundTasks, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import asyncio
import httpx
from datetime import datetime
import json

app = FastAPI(root_path="/nido_api")

# --- In-Memory Cache ---
calendar_cache = {"data": [], "last_updated": None}

async def fetch_calendar_data():
    """Fetches calendar data from n8n and updates the cache."""
    # Calculate dates: 1 month back, 3 months forward
    now = datetime.now()
    # Simple approximation for months, or use relativedelta if available (not standard lib)
    # Using 30 days and 90 days for simplicity and robustness without extra deps
    from datetime import timedelta
    start_date = (now - timedelta(days=30)).strftime("%Y-%m-%d")
    end_date = (now + timedelta(days=90)).strftime("%Y-%m-%d")
    
    base_url = "https://synology.tail69424a.ts.net/webhook/calendar"
    url = f"{base_url}?start={start_date}&end={end_date}&analyze_critical=false"
    
    print(f"Fetching calendar data from {url}...")
    async with httpx.AsyncClient() as client:
        try:
            timeout = 30.0
            response = await client.get(url, timeout=timeout)
            response.raise_for_status()
            data = response.json()
            
            # Update cache
            calendar_cache["data"] = data
            calendar_cache["last_updated"] = datetime.now().isoformat()
            print(f"Calendar updated successfully at {calendar_cache['last_updated']}")
        except Exception as e:
            print(f"Error updating calendar: {e}")

async def calendar_refresher():
    """Background task to refresh calendar every hour."""
    while True:
        # Initial wait to let server start up
        await asyncio.sleep(10) 
        await fetch_calendar_data()
        await asyncio.sleep(3600)

@app.on_event("startup")
async def startup_event():
    # Start the background refresher
    asyncio.create_task(calendar_refresher())

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/meals")
async def get_meals():
    url = "https://synology.tail69424a.ts.net/webhook/nido/meals"
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, timeout=10.0)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {"error": str(e)}

@app.get("/calendar")
async def get_calendar(background_tasks: BackgroundTasks):
    """Returns cached calendar events. Triggers fetch if cache is empty."""
    # If cache is completely empty, fetch immediately to unblock UI
    if not calendar_cache["data"] and not calendar_cache["last_updated"]:
        print("Cache empty, performing synchronous fetch...")
        await fetch_calendar_data()
        
    return calendar_cache

@app.post("/calendar/sync")
async def sync_calendar(background_tasks: BackgroundTasks):
    """Triggers an immediate background refresh of the calendar."""
    background_tasks.add_task(fetch_calendar_data)
    return {"status": "sync_started", "message": "Calendar refresh triggered in background"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    await websocket.send_text("Connected to Nido Brain")
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received from WS: {data}")
            
            # Forward to n8n nido.api.chat
            n8n_url = "https://synology.tail69424a.ts.net/webhook/nido/chat"
            async with httpx.AsyncClient() as client:
                try:
                    # Send text to n8n
                    response = await client.post(n8n_url, json={"text": data}, timeout=60.0)
                    response.raise_for_status()
                    
                    # n8n returns { text: "...", data: {...} }
                    result = response.json()
                    
                    # Send text back to frontend (or strict JSON if frontend handles it)
                    # For MVP, send string message. Frontend logs it.
                    # Or send JSON string to be parsed.
                    
                    # Sending just the text for now as existing frontend expects text messages
                    # But we can enhance frontend to parse JSON.
                    if isinstance(result, dict) and "text" in result:
                        await websocket.send_text(result["text"])
                    else:
                        await websocket.send_text(str(result))
                        
                except Exception as e:
                    print(f"Error calling n8n: {e}")
                    await websocket.send_text(f"Error processing command: {str(e)}")
                    
    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8008)
