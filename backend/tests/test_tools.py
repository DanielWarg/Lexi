import pytest

@pytest.mark.asyncio
async def test_tools_list(client):
    res = await client.get("/api/v1/tools/")
    assert res.status_code == 200
    tools = res.json()
    assert len(tools) > 0
    assert tools[0]["id"] == "linkedin_drafter"
    
@pytest.mark.asyncio
async def test_linkedin_drafter_mock(client, mocker):
    # Mock the GenAI call to avoid hitting real API/Costs
    mock_response = mocker.Mock()
    mock_response.text = "Viral LinkedIn Post Content"
    
    # Patch the generate_content_async method
    mocker.patch("google.generativeai.GenerativeModel.generate_content_async", return_value=mock_response)

    payload = {
        "topic": "AI Agents",
        "key_points": "Future is autonomous",
        "tone": "Visionary",
        "audience": "Tech Leaders"
    }
    
    res = await client.post("/api/v1/tools/linkedin_drafter/execute", json=payload)
    if res.status_code != 200:
        print(res.text)
        
    assert res.status_code == 200
    data = res.json()
    assert data["content"] == "Viral LinkedIn Post Content"
