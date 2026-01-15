from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from backend.tools.registry import registry, ToolDefinition
# Import tools to ensure registration
import backend.tools.linkedin
import backend.tools.report_gen

router = APIRouter()

@router.get("/", response_model=List[ToolDefinition])
async def list_tools():
    return registry.list_tools()

@router.post("/{tool_id}/execute")
async def execute_tool(tool_id: str, params: Dict[str, Any]):
    try:
        result = await registry.execute(tool_id, params)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
