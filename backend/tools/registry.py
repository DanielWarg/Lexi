from typing import Dict, Any, Callable, List, Optional
from pydantic import BaseModel

class ToolDefinition(BaseModel):
    id: str
    name: str
    description: str
    input_schema: Dict[str, Any]

class ToolRegistry:
    def __init__(self):
        self._tools: Dict[str, Callable] = {}
        self._definitions: Dict[str, ToolDefinition] = {}

    def register(self, tool_id: str, name: str, description: str, input_model: type[BaseModel]):
        """
        Decorator to register a function as a tool.
        """
        def decorator(func: Callable):
            self._tools[tool_id] = func
            self._definitions[tool_id] = ToolDefinition(
                id=tool_id,
                name=name,
                description=description,
                input_schema=input_model.model_json_schema()
            )
            return func
        return decorator

    def get_tool(self, tool_id: str) -> Optional[Callable]:
        return self._tools.get(tool_id)

    def list_tools(self) -> List[ToolDefinition]:
        return list(self._definitions.values())

    async def execute(self, tool_id: str, params: Dict[str, Any]) -> Any:
        tool_func = self._tools.get(tool_id)
        if not tool_func:
            raise ValueError(f"Tool {tool_id} not found")
        
        # In a real agent system, we'd validate params against schema here
        try:
            return await tool_func(params)
        except Exception as e:
            raise RuntimeError(f"Tool execution failed: {e}")

registry = ToolRegistry()
