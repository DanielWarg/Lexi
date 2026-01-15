"""
Lexi Kasa Smart Home Skill
==========================
Control TP-Link Kasa smart devices.
"""

from typing import Optional, List, Dict
from skills.base_skill import BaseSkill, SkillContext, SkillResult


class KasaSkill(BaseSkill):
    """
    Skill for controlling Kasa smart home devices.
    Supports lights, plugs, and switches.
    """
    
    name = "kasa"
    display_name = "Smart Home"
    description = "Styr smarta lampor och enheter (Kasa/TP-Link)"
    triggers = [
        "tänd lampan",
        "släck lampan",
        "tänd ljuset",
        "släck ljuset",
        "turn on light",
        "turn off light",
        "dim",
        "dimma"
    ]
    
    requires_confirmation = False
    
    def __init__(self):
        super().__init__()
        self._devices: Dict = {}
    
    async def execute(self, context: SkillContext) -> SkillResult:
        """Execute smart home command."""
        try:
            from kasa import Discover
            
            if context.on_status:
                context.on_status("Söker efter Kasa-enheter...")
            
            # Discover devices
            devices = await Discover.discover()
            
            if not devices:
                return SkillResult(
                    success=False,
                    error="Inga Kasa-enheter hittades på nätverket"
                )
            
            # Parse command
            user_input = context.user_input.lower()
            action = self._parse_action(user_input)
            
            # Find target device (or use first one)
            device_name = self._extract_device_name(user_input)
            target_device = None
            
            for ip, device in devices.items():
                await device.update()
                if device_name and device_name.lower() in device.alias.lower():
                    target_device = device
                    break
                if not target_device:
                    target_device = device
            
            if not target_device:
                return SkillResult(
                    success=False,
                    error=f"Hittade inte enhet: {device_name}"
                )
            
            # Execute action
            if context.on_status:
                context.on_status(f"{action} {target_device.alias}...")
            
            if action == "on":
                await target_device.turn_on()
                message = f"Tände {target_device.alias}"
            elif action == "off":
                await target_device.turn_off()
                message = f"Släckte {target_device.alias}"
            elif action == "toggle":
                if target_device.is_on:
                    await target_device.turn_off()
                    message = f"Släckte {target_device.alias}"
                else:
                    await target_device.turn_on()
                    message = f"Tände {target_device.alias}"
            else:
                message = f"Okänt kommando för {target_device.alias}"
            
            return SkillResult(
                success=True,
                data={
                    "device": target_device.alias,
                    "action": action,
                    "is_on": target_device.is_on
                },
                message=message
            )
            
        except ImportError:
            return SkillResult(
                success=False,
                error="python-kasa är inte installerat"
            )
        except Exception as e:
            return SkillResult(
                success=False,
                error=f"Smart Home-fel: {str(e)}"
            )
    
    def _parse_action(self, text: str) -> str:
        """Parse the desired action from text."""
        if any(w in text for w in ["tänd", "on", "sätt på"]):
            return "on"
        elif any(w in text for w in ["släck", "off", "stäng av"]):
            return "off"
        else:
            return "toggle"
    
    def _extract_device_name(self, text: str) -> Optional[str]:
        """Extract device name from input."""
        # Simple heuristic - words after "lampan" or "ljuset"
        for keyword in ["lampan", "ljuset", "light"]:
            if keyword in text:
                parts = text.split(keyword)
                if len(parts) > 1 and parts[1].strip():
                    return parts[1].strip().split()[0]
        return None
