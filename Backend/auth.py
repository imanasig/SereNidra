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

async def get_current_user(token: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    """
    Verifies the Firebase ID token and returns the decoded token (user info).
    Also ensures the user exists in the local database.
    """
    try:
        if not firebase_admin._apps:
             # If firebase is not initialized, we can't verify. 
             # For development purposes if no creds are present, we might want to FAIL or Mock.
             # Requirement says "Verify...". So failure is appropriate if not configured.
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
            # Update last login
            user.last_login = datetime.now()
            db.commit()
            
        # Return dict compatible with existing usage, plus db logic done
        return {"uid": uid, "email": email, "decoded_token": decoded_token}
        
    except ValueError as e:
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
