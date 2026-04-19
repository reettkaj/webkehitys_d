*** Settings ***
Library     Browser    auto_closing_level=SUITE

*** Variables ***
${Username}    testuser
${Password}    test123
${Message}     Hello, Robot Framework!\nHow are you today?

*** Test Cases ***
Test Web Form
    New Browser     chromium    headless=No
    New Context     viewport={'width': 800, 'height': 600}
    New Page        https://www.selenium.dev/selenium/web/web-form.html 

    Get Title       ==    Web form  

    Type Text       [name="my-text"]        ${Username}
    Type Secret     [name="my-password"]    $Password
    Type Text       [name="my-textarea"]    ${Message}

    Click           button

    Get Text        id=message    ==    Received!