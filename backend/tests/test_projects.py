import pytest
from httpx import AsyncClient, ASGITransport
from sqlmodel import select
from backend.main import app
from backend.core.database import engine, init_db
from backend.models.project import Project, AuditLog, ProjectStatus, AuditAction

@pytest.fixture(scope="function")
async def client():
    """Async test client with fresh DB for each test."""
    await init_db()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

@pytest.mark.asyncio
async def test_create_project(client):
    """Golden Path: Create project and verify DB + AuditLog."""
    response = await client.post("/api/v1/projects/", json={
        "name": "Test Project",
        "description": "A test project"
    })
    
    assert response.status_code == 201
    data = response.json()
    
    # Verify response
    assert data["name"] == "Test Project"
    assert data["key"].startswith("LEXI-")
    assert data["status"] == "active"
    
    # Verify AuditLog was created (TODO: Add when endpoint logs)

@pytest.mark.asyncio
async def test_list_projects(client):
    """List projects with status filter."""
    # Create two projects
    await client.post("/api/v1/projects/", json={"name": "Project A"})
    await client.post("/api/v1/projects/", json={"name": "Project B"})
    
    response = await client.get("/api/v1/projects/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2

@pytest.mark.asyncio
async def test_soft_delete_and_restore(client):
    """Golden Path: Soft delete then restore."""
    # Create
    create_resp = await client.post("/api/v1/projects/", json={"name": "To Delete"})
    project_id = create_resp.json()["id"]
    
    # Delete
    delete_resp = await client.delete(f"/api/v1/projects/{project_id}")
    assert delete_resp.status_code == 204
    
    # Verify hidden from active list
    list_resp = await client.get("/api/v1/projects/?status=active")
    ids = [p["id"] for p in list_resp.json()]
    assert project_id not in ids
    
    # Restore
    restore_resp = await client.post(f"/api/v1/projects/{project_id}/restore")
    assert restore_resp.status_code == 200
    
    # Verify visible again
    list_resp2 = await client.get("/api/v1/projects/?status=active")
    ids2 = [p["id"] for p in list_resp2.json()]
    assert project_id in ids2
