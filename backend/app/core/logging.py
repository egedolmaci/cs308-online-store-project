from loguru import logger
import sys

# Remove default handler
logger.remove()

# Add custom handler with nice formatting
logger.add(
    sys.stdout,
    format="<green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}:{function}</cyan> - <level>{message}</level>",
    level="DEBUG",  
    colorize=True,
)