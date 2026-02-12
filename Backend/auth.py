import os
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from database import get_db
import models
from datetime import datetime
from fastapi import Request

load_dotenv()

# Initialize Firebase Admin
cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase_credentials.json")

if not firebase_admin._apps:
    try:
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            print(f"Firebase Admin initialized with credentials from {cred_path}")
        else:
            print(f"Warning: Firebase credentials not found at {cred_path}. Attempting default init.")
            firebase_admin.initialize_app()
    except Exception as e:
        print(f"Failed to initialize Firebase Admin: {e}")

security = HTTPBearer()

async def get_current_user(
    request: Request,
    token: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    Verifies the Firebase ID token and returns the decoded token (user info).
    Also ensures the user exists in the local database.
    """

    # 🔥 Allow preflight OPTIONS request (CORS fix)
    if request.method == "OPTIONS":
        return None

    try:
        if not firebase_admin._apps:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Firebase Admin not initialized. Please configure credentials."
            )

        # Verify the ID token
        decoded_token = auth.verify_id_token(token.credentials)
        uid = decoded_token.get('uid')
        email = decoded_token.get('email')

        # Sync with Database
        user = db.query(models.User).filter(models.User.uid == uid).first()

        if not user:
            user = models.User(uid=uid, email=email)
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            user.last_login = datetime.now()
            db.commit()

        return {"uid": uid, "email": email, "decoded_token": decoded_token}

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
