*** Settings ***
Library    Browser
Library    ../env_helper.py

*** Test Cases ***
Login envistä
    New Browser    chromium    headless=False
    New Page    http://localhost:5173/login.html

    ${username}=    Get Username
    ${password}=    Get Password

    Fill Text    input[name="username"] >> nth=1    ${username}
    Fill Text    input[type="password"] >> nth=1    ${password}
    Click    text=Login >> nth=1

    Wait For Elements State    text=Logout    visible

    Close Browser