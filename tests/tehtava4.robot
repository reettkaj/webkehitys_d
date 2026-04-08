*** Settings ***
Library    Browser

*** Variables ***
${USERNAME}    moikaikki
${PASSWORD}    12345678

*** Test Cases ***
Lisää päiväkirjamerkintä onnistuneesti
    New Browser    chromium    headless=False
    New Page    http://localhost:5173/login.html

    # LOGIN
    Fill Text    input[name="username"] >> nth=1    ${USERNAME}
    Fill Text    input[type="password"] >> nth=1    ${PASSWORD}
    Click    text=Login >> nth=1

    # Odota että päästään etusivulle (Logout näkyy)
    Wait For Elements State    text=Logout    visible

    # Mene päiväkirjaan
    Click    a[href="paivakirja.html"]

    # Odota että päiväkirjasivu näkyy
    Wait For Elements State    text=Lisää päiväkirjamerkintä    visible

    # Täytä kenttiä (käytetään placeholdereita)
    Fill Text    input[type="date"] >> nth=0    2026-04-08
    Fill Text    input[placeholder="Mood"]    Hyvä
    Fill Text    input[placeholder="Weight (kg)"]    70
    Fill Text    input[placeholder="Sleep hours"]    8
    Fill Text    input[placeholder="Energy level (1-10)"]    7
    Fill Text    input[placeholder="Water (liters)"]    2
    Fill Text    input[placeholder="Stress level (1-10)"]    3
    Fill Text    input[placeholder="Exercise"]    Juoksu
    Fill Text    input[placeholder="Meal"]    Kana
    Fill Text    input[placeholder="Symptoms"]    Ei
    Fill Text    input[placeholder="Medication"]    Ei

    Sleep    1s

    # Klikkaa nappia
    Click    css=button[type="submit"]

    # Tarkistus
    Get Text    body    contains    Hyvä

    Close Browser