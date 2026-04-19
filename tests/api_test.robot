*** Settings ***
Library    RequestsLibrary
Library    Collections

Suite Setup    Create Session    jsonplaceholder    https://jsonplaceholder.typicode.com

*** Test Cases ***

Get Post
    ${resp}=    GET On Session    jsonplaceholder    /posts/1
    Status Should Be    200    ${resp}
    Dictionary Should Contain Key    ${resp.json()}    id

Create Post
    &{data}=    Create Dictionary    title=Test    body=Test body    userId=1
    ${resp}=    POST On Session    jsonplaceholder    /posts    json=${data}
    Status Should Be    201    ${resp}

Invalid Endpoint
    ${resp}=    GET On Session    jsonplaceholder    /invalid    expected_status=anything
    Status Should Be    404    ${resp}