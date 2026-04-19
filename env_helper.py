import os
from dotenv import load_dotenv

# absoluuttinen polku kun muuten ei vaan toimi minulla + override
load_dotenv(dotenv_path=os.path.join(os.getcwd(), ".env"), override=True)

def get_username():
    value = os.getenv("USERNAME")
    print("USERNAME:", value)
    return value

def get_password():
    value = os.getenv("PASSWORD")
    print("PASSWORD:", value)
    return value