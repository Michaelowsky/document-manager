from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from routers import dokumenty as polisy
from pathlib import Path
import signal
import os
import webbrowser
import threading
import logging


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.include_router(polisy.router)

app.mount("/static", StaticFiles(directory=Path(__file__).parent / "static"), name="static")

templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    logger.info("Root endpoint called")
    return templates.TemplateResponse("index.html", {"request": request})

# @app.get("/shutdown")
# async def shutdown():
#     logger.info("Shutdown endpoint called. Closing the server...")
#     os.kill(os.getpid(), signal.SIGINT)
#     return {"message": "Serwer został zamknięty"}

# def open_browser():
#     webbrowser.open("http://127.0.0.1:8000")

# if __name__ == "__main__":
#     threading.Timer(1, open_browser).start()
#     import uvicorn
#     uvicorn.run(app, host="127.0.0.1", port=8000)