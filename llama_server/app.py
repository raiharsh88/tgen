from fastapi import FastAPI, HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
import base64

app = FastAPI()

class EncodeRequest(BaseModel):
    data_to_encode: str

@app.post("/encode")
async def encode_data(req: EncodeRequest):
    try:
        # Encode the data using Base64
        encoded_data = base64.b64encode(req.data_to_encode.encode()).decode()
        
        # Return the encoded data
        return {"encoded_data": encoded_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=3000)