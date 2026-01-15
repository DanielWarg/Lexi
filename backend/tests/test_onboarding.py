import pytest

@pytest.mark.asyncio
async def test_root(client):
    response = await client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "Lexi Prime is Online"

@pytest.mark.asyncio
async def test_onboarding_flow(client):
    # 1. Start Interview
    res = await client.get("/api/v1/onboarding/start")
    assert res.status_code == 200
    data = res.json()
    assert "step" in data
    assert data["step"] == 0
    assert "Lexi" in data["message"]

    # 2. Answer Question 1
    answer_payload = {"step": 0, "answer": "VD, utmaningen är tidsbrist"}
    res = await client.post("/api/v1/onboarding/answer", json=answer_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["next_step"] == 1
    assert data["complete"] is False

    # 3. Check Profile Update (User Me)
    # Note: In A0 logic, we didn't implement sophisticated analysis yet, 
    # but we can check the user exists and flag is still False
    res = await client.get("/api/v1/user/me")
    assert res.status_code == 200
    user = res.json()
    assert user["is_onboarded"] is False
    assert user["role"] == "Executive"
