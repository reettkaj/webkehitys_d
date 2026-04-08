*** Settings ***
Library    Browser
Library    CryptoLibrary    variable_decryption=True

*** Variables ***
${USERNAME}    crypt:xKWi/4aZSjJ92oysHgaS0f37NRoCEqGqTd+AiqcnTBuIoR/OBQ4ci4yagaDhaLALhc21OexswjfB
${PASSWORD}    crypt:KPkz09flVOCm6ciejolx3ji7UXxKn/90WB89o6SsGyFFMOvcNr7jtGPgFyVbL4LKa+pF4kKHMYs=

*** Test Cases ***
Login kryptatuilla tunnuksilla
    New Browser    chromium    headless=False
    New Page    http://localhost:5173/login.html

    Fill Text    input[name="username"] >> nth=1    ${USERNAME}
    Fill Text    input[type="password"] >> nth=1    ${PASSWORD}
    Click    text=Login >> nth=1

    Wait For Elements State    text=Logout    visible