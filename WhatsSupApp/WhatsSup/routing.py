from channels.routing import route
from WhatsSup.consumers import *


channel_routing = [
    route('websocket.connect', ws_connect),
    route("websocket.receive", ws_message),
    route('websocket.disconnect', ws_disconnect),
]